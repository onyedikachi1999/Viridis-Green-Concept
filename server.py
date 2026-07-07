import json
import os
import random
import string
import smtplib
from datetime import datetime
from typing import Optional, List
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException, Header, Response, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Viridis Green Concept API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_DIR = os.path.join(os.path.dirname(__file__), "data")
DB_PATH = os.path.join(DB_DIR, "db.json")
ADMIN_PASSCODE = "admin123"
AUTH_TOKEN = "session_viridis_admin_token"

# SMTP configurations & Logging
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "hello@viridisgreenconcept.com")
EMAIL_LOGS_PATH = os.path.join(DB_DIR, "email_logs.txt")

def send_notification_email(to_email: str, subject: str, body: str):
    # Log email contents locally
    log_line = (
        f"============================================================\n"
        f"TIMESTAMP: {datetime.now().isoformat()}\n"
        f"TO: {to_email}\n"
        f"FROM: {SMTP_FROM}\n"
        f"SUBJECT: {subject}\n"
        f"------------------------------------------------------------\n"
        f"{body}\n"
        f"============================================================\n\n"
    )
    os.makedirs(DB_DIR, exist_ok=True)
    with open(EMAIL_LOGS_PATH, "a", encoding="utf-8") as f:
        f.write(log_line)
    
    print(f"Logged email notification locally for {to_email}")

    # SMTP transmission
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP host or credentials not set. Skipped SMTP email send.")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM, to_email, msg.as_string())
        server.quit()
        print(f"Successfully sent email notification to {to_email} via SMTP.")
        return True
    except Exception as e:
        print(f"SMTP error while sending email to {to_email}: {e}")
        return False

def trigger_inquiry_email(email: str, name: str, inquiry_type: str, action: str):
    """
    inquiry_type: 'partnership' or 'investor'
    action: 'received' (ack), 'approved', 'rejected'
    """
    subject = ""
    body = ""
    
    if action == "received":
        subject = f"Viridis Green Concept - {inquiry_type.capitalize()} Inquiry Received"
        body = (
            f"Hello {name},\n\n"
            f"Thank you for contacting Viridis Green Concept.\n\n"
            f"We have received your request for {inquiry_type} cooperation. "
            f"Our management team is currently reviewing your application, "
            f"and we will provide you with written feedback shortly.\n\n"
            f"Best regards,\n"
            f"Viridis Green Concept Operations Team"
        )
    elif action == "approved":
        subject = f"Viridis Green Concept - {inquiry_type.capitalize()} Inquiry Approved"
        body = (
            f"Hello {name},\n\n"
            f"We are pleased to inform you that your {inquiry_type} inquiry has been approved!\n\n"
            f"One of our directors will reach out to you directly at this email address "
            f"with the contract drafts and scheduled appointment details to begin our collaboration.\n\n"
            f"Best regards,\n"
            f"Viridis Green Concept Executive Board"
        )
    elif action == "rejected":
        subject = f"Viridis Green Concept - Inquiry Update"
        body = (
            f"Hello {name},\n\n"
            f"Thank you for your interest in partnering with Viridis Green Concept.\n\n"
            f"After a careful review of your submitted credentials and application, we regret "
            f"to inform you that we cannot proceed with your {inquiry_type} inquiry at this time.\n\n"
            f"We wish you success in your future endeavors.\n\n"
            f"Best regards,\n"
            f"Viridis Green Concept Compliance Team"
        )
        
    if subject and body:
        send_notification_email(email, subject, body)


# Pydantic Schemas
class PartnerInquirySchema(BaseModel):
    orgName: Optional[str] = ""
    contactName: str
    email: str
    phone: Optional[str] = ""
    interest: Optional[str] = ""
    message: Optional[str] = ""


class InvestorInquirySchema(BaseModel):
    name: str
    email: str
    firm: Optional[str] = ""
    message: Optional[str] = ""


class WaitlistInquirySchema(BaseModel):
    email: str
    product: str
    type: Optional[str] = "waitlist"


class LoginSchema(BaseModel):
    passcode: str


class StatusUpdateSchema(BaseModel):
    status: str


# Database helpers
def read_db() -> dict:
    if not os.path.exists(DB_PATH):
        return {"partnerships": [], "investors": [], "waitlists": []}
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            if "waitlists" not in data:
                data["waitlists"] = []
            return data
    except Exception:
        return {"partnerships": [], "investors": [], "waitlists": []}


def write_db(data: dict):
    os.makedirs(DB_DIR, exist_ok=True)
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def generate_id() -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=9))


def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or authorization != AUTH_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized. Admin access required."
        )
    return authorization


# Public: Submit Partnership Inquiry
@app.post("/api/inquiries/partner", status_code=status.HTTP_201_CREATED)
def submit_partner_inquiry(inquiry: PartnerInquirySchema):
    if not inquiry.contactName or not inquiry.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact person and Email are required."
        )
    
    db = read_db()
    new_inquiry = {
        "id": generate_id(),
        "orgName": inquiry.orgName or "",
        "contactName": inquiry.contactName,
        "email": inquiry.email,
        "phone": inquiry.phone or "",
        "interest": inquiry.interest or "",
        "message": inquiry.message or "",
        "status": "pending",
        "createdAt": datetime.now().isoformat()
    }
    
    db.setdefault("partnerships", []).append(new_inquiry)
    write_db(db)
    
    # Trigger confirmation email
    trigger_inquiry_email(inquiry.email, inquiry.contactName, "partnership", "received")
    
    return {"success": True, "message": "Partnership inquiry received."}


# Public: Submit Investor Inquiry
@app.post("/api/inquiries/investor", status_code=status.HTTP_201_CREATED)
def submit_investor_inquiry(inquiry: InvestorInquirySchema):
    if not inquiry.name or not inquiry.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name and Email are required."
        )

    db = read_db()
    new_inquiry = {
        "id": generate_id(),
        "name": inquiry.name,
        "email": inquiry.email,
        "firm": inquiry.firm or "",
        "message": inquiry.message or "",
        "status": "pending",
        "createdAt": datetime.now().isoformat()
    }

    db.setdefault("investors", []).append(new_inquiry)
    write_db(db)
    
    # Trigger confirmation email
    trigger_inquiry_email(inquiry.email, inquiry.name, "investor", "received")
    
    return {"success": True, "message": "Investor inquiry received."}


# Public: Submit Waitlist Inquiry
@app.post("/api/inquiries/waitlist", status_code=status.HTTP_201_CREATED)
def submit_waitlist_inquiry(inquiry: WaitlistInquirySchema):
    if not inquiry.email or not inquiry.product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and Product name are required."
        )

    db = read_db()
    new_item = {
        "id": generate_id(),
        "email": inquiry.email,
        "product": inquiry.product,
        "type": inquiry.type or "waitlist",
        "createdAt": datetime.now().isoformat()
    }

    db.setdefault("waitlists", []).append(new_item)
    write_db(db)
    return {"success": True, "message": "Waitlist sign-up received."}


# Admin Login
@app.post("/api/admin/login")
def admin_login(payload: LoginSchema):
    if payload.passcode == ADMIN_PASSCODE:
        return {"success": True, "token": AUTH_TOKEN}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid passcode."
        )


# Admin: Get all inquiries
@app.get("/api/admin/inquiries")
def get_all_inquiries(token: str = Header(None, alias="authorization")):
    verify_token(token)
    return read_db()


# Admin: Download Email Logs File
@app.get("/api/admin/email-logs")
def download_email_logs(token: str = Header(None, alias="authorization")):
    verify_token(token)
    if not os.path.exists(EMAIL_LOGS_PATH):
        os.makedirs(DB_DIR, exist_ok=True)
        with open(EMAIL_LOGS_PATH, "w", encoding="utf-8") as f:
            f.write("=== VIRIDIS SMTP EMAIL NOTIFICATION LOGS ===\n\n")
            
    return FileResponse(
        path=EMAIL_LOGS_PATH,
        filename="email_logs.txt",
        media_type="text/plain"
    )


# Admin: Update inquiry status
@app.patch("/api/admin/inquiries/{type_name}/{inquiry_id}")
def update_inquiry_status(
    type_name: str, 
    inquiry_id: str, 
    payload: StatusUpdateSchema,
    token: str = Header(None, alias="authorization")
):
    verify_token(token)
    
    if payload.status not in ["pending", "approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status value."
        )

    db = read_db()
    if type_name not in db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid inquiry type."
        )

    # Find and update
    item = next((i for i in db[type_name] if i["id"] == inquiry_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found."
        )

    old_status = item.get("status", "pending")
    item["status"] = payload.status
    write_db(db)
    
    # Trigger status change email notifications
    if old_status != payload.status and payload.status in ["approved", "rejected"]:
        email = item.get("email")
        name = item.get("contactName") if type_name == "partnerships" else item.get("name", "Applicant")
        inquiry_type = "partnership" if type_name == "partnerships" else "investor"
        trigger_inquiry_email(email, name, inquiry_type, payload.status)

    return {"success": True, "item": item}


# Admin: Delete inquiry
@app.delete("/api/admin/inquiries/{type_name}/{inquiry_id}")
def delete_inquiry(
    type_name: str, 
    inquiry_id: str,
    token: str = Header(None, alias="authorization")
):
    verify_token(token)
    
    db = read_db()
    if type_name not in db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid inquiry type."
        )

    index = next((idx for idx, i in enumerate(db[type_name]) if i["id"] == inquiry_id), -1)
    if index == -1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found."
        )

    db[type_name].pop(index)
    write_db(db)
    return {"success": True, "message": "Inquiry deleted successfully."}


# Serve React static build files (only if the dist folder exists)
if os.path.exists("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="static")
