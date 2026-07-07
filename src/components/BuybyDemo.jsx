import React, { useState, useEffect, useRef } from 'react';

export default function BuybyDemo() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'buyby', text: 'Welcome to Buyby. Send "MENU" or select a quick option below to begin.' }
  ]);
  const [logs, setLogs] = useState([
    'System initialized. Waiting for incoming SMS payloads...'
  ]);
  const [geminiJson, setGeminiJson] = useState(null);
  const [leg1, setLeg1] = useState('idle'); // idle, processing, success, failed
  const [leg2, setLeg2] = useState('idle'); // idle, processing, success, failed
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const chatEndRef = useRef(null);
  const logEndRef = useRef(null);

  // Auto-scroll scrollbars
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handlePromptClick = (promptText) => {
    if (isProcessing) return;
    simulateSMSFlow(promptText);
  };

  const simulateSMSFlow = async (text) => {
    setIsProcessing(true);
    setGeminiJson(null);
    setLeg1('idle');
    setLeg2('idle');

    // Add user SMS to chat
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    
    addLog(`[Africa's Talking] Webhook received for incoming SMS from +2348039988223`);
    
    if (isLocked) {
      await sleep(800);
      addLog(`[Security] Rejection: Account is locked (is_locked=True).`);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'buyby',
        text: 'CRITICAL: Your Buyby account is locked due to multiple invalid PIN attempts. Contact support@viridisgreenconcept.com to unlock.'
      }]);
      setIsProcessing(false);
      return;
    }

    await sleep(800);
    addLog(`[NLP Engine] Routing message to Google Gemini (gemini-2.5-flash)...`);
    
    // Parse simulated intents
    if (text.toLowerCase().includes('register')) {
      // REGISTRATION SIMULATION
      const mockJson = {
        intent: "REGISTER_USER",
        entities: {
          bank_name: "GTB",
          bank_account: "0022334455",
          phone_number: "+2348039988223"
        }
      };
      setGeminiJson(mockJson);
      addLog(`[Gemini] Intent REGISTER_USER parsed.`);
      await sleep(1000);
      addLog(`[Flutterwave] Resolving bank account... Verified: "JOHN DOE OLUSEGUN"`);
      await sleep(800);
      addLog(`[Africa's Talking] Dispatched authorization link SMS.`);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: 'buyby',
        text: 'Account verified: JOHN DOE OLUSEGUN. To authorize direct bank linking, click checkout link: https://flutterwave.com/pay/buyby-auth-50 (₦50 auth charge, OTP required).'
      }]);
    } else if (text.toLowerCase().includes('pin 1234')) {
      // SUCCESSFUL TRANSFER PIPELINE
      const mockJson = {
        intent: "SEND_MONEY",
        entities: {
          amount: 5000,
          bank_name: "Access Bank",
          bank_account: "0123456789",
          pin: "1234"
        }
      };
      setGeminiJson(mockJson);
      addLog(`[Gemini] Intent SEND_MONEY parsed.`);
      await sleep(800);
      addLog(`[Security] Checking PIN... Matches hashed transaction_pin.`);
      addLog(`[Security] Checking boundaries: Limit check passed. Risk score: 2/10 (Low).`);
      
      // Start Leg 1 (Debit)
      await sleep(800);
      setLeg1('processing');
      addLog(`[Flutterwave] Charging tokenized card account (Leg 1 debit) for ₦5,000 + ₦10 fee...`);
      
      await sleep(1200);
      setLeg1('success');
      addLog(`[Flutterwave] Leg 1 Debit succeeded. Reference: FLW-DB-882193.`);
      
      // Start Leg 2 (Payout)
      await sleep(600);
      setLeg2('processing');
      addLog(`[Flutterwave] Initiating outward payout transfer (Leg 2) of ₦5,000 to Access Bank account 0123456789...`);
      
      await sleep(1200);
      setLeg2('success');
      addLog(`[Flutterwave] Leg 2 Payout transfer completed.`);
      
      await sleep(600);
      addLog(`[Database] Transaction record status updated to COMPLETED.`);
      addLog(`[Africa's Talking] Sending receipt alert SMS...`);
      setMessages(prev => [...prev, {
        id: Date.now() + 3,
        sender: 'buyby',
        text: 'Success! ₦5,000 debited from linked bank account. ₦5,000 paid out to Access Bank 0123456789. Ref: BB-982183.'
      }]);
    } else if (text.toLowerCase().includes('bulk')) {
      // BULK TRANSFER SIMULATION
      const mockJson = {
        intent: "BULK_TRANSFER",
        entities: {
          total_receivers: 2,
          amount_per_receiver: 7500,
          total_lump_sum: 15000,
          pin: "1234"
        }
      };
      setGeminiJson(mockJson);
      addLog(`[Gemini] Intent BULK_TRANSFER parsed.`);
      await sleep(800);
      addLog(`[Security] PIN verified. Risk score: 4/10.`);
      
      // Consolidated Leg 1
      await sleep(800);
      setLeg1('processing');
      addLog(`[Flutterwave] Charging consolidated lump-sum (Leg 1) for ₦15,000 + ₦15 bulk fee...`);
      
      await sleep(1200);
      setLeg1('success');
      addLog(`[Flutterwave] Consolidated Leg 1 Debit succeeded. Ref: FLW-BULK-3812.`);
      
      // Leg 2 - Distributing payouts (Simulating Celery worker)
      await sleep(600);
      setLeg2('processing');
      addLog(`[Celery Workers] Spawning payout workers...`);
      addLog(`[Celery Job 1] Payout ₦7,500 to +2348021112223 (GTB)... Completed.`);
      addLog(`[Celery Job 2] Payout ₦7,500 to +2348094445556 (Zenith)... Completed.`);
      
      await sleep(1200);
      setLeg2('success');
      addLog(`[Database] BulkTransfer status updated to COMPLETED.`);
      addLog(`[Africa's Talking] Sending bulk success SMS notification.`);
      setMessages(prev => [...prev, {
        id: Date.now() + 3,
        sender: 'buyby',
        text: 'Consolidated Bulk Success! ₦15,000 debited. Outward transfers to 2 recipients completed. Ref: BB-BULK-9921.'
      }]);
    } else if (text.toLowerCase().includes('scheduled')) {
      // SCHEDULED PAYMENT SIMULATION
      const mockJson = {
        intent: "SCHEDULE_PAYMENT",
        entities: {
          amount: 10000,
          recipient: "Access Bank 0123456789",
          schedule_time: "Tomorrow at 9:00 AM"
        }
      };
      setGeminiJson(mockJson);
      addLog(`[Gemini] Intent SCHEDULE_PAYMENT parsed.`);
      await sleep(1000);
      addLog(`[Celery/Redis] Queueing ScheduledTransaction row with ETA: 2026-07-08T09:00:00.`);
      addLog(`[Africa's Talking] Sending scheduled confirmation alert.`);
      setMessages(prev => [...prev, {
        id: Date.now() + 3,
        sender: 'buyby',
        text: 'Scheduled Payment Confirmed! ₦10,000 will be debited and sent to Access Bank 0123456789 tomorrow at 9:00 AM. Ref: BB-SCH-1123.'
      }]);
    } else if (text.toLowerCase().includes('pin 9999')) {
      // PIN LOCKOUT SIMULATION
      const mockJson = {
        intent: "SEND_MONEY",
        entities: {
          amount: 5000,
          bank_name: "GTB",
          bank_account: "0123456789",
          pin: "9999"
        }
      };
      setGeminiJson(mockJson);
      addLog(`[Gemini] Intent SEND_MONEY parsed.`);
      await sleep(800);
      addLog(`[Security] Checking PIN... Mismatch!`);
      
      const newAttempts = pinAttempts + 1;
      setPinAttempts(newAttempts);
      addLog(`[Security] PIN Mismatch attempt ${newAttempts} of 5.`);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        addLog(`[Security] 5 consecutive failures. Setting is_locked=True.`);
        setMessages(prev => [...prev, {
          id: Date.now() + 4,
          sender: 'buyby',
          text: 'CRITICAL: PIN attempts limit exceeded. Your Buyby account has been locked. Contact support to unlock.'
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 4,
          sender: 'buyby',
          text: `Error: The PIN entered is incorrect. Attempt ${newAttempts} of 5. Please try again.`
        }]);
      }
    } else {
      // MENU FALLBACK
      await sleep(1000);
      addLog(`[Gemini] Intent fallback. Routing to SMS interactive menu.`);
      setMessages(prev => [...prev, {
        id: Date.now() + 5,
        sender: 'buyby',
        text: 'Buyby Main Menu:\n1. Link Bank Account\n2. Send Money\n3. Check Settings\nReply with option number or send text commands.'
      }]);
    }

    setIsProcessing(false);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1.2fr', 
      gap: '20px', 
      alignItems: 'stretch', 
      color: '#fff', 
      fontSize: '13px',
      background: '#04130f',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid rgba(126, 217, 87, 0.15)',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.85)'
    }}>
      
      {/* PHONE WRAPPER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--leaf-2)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          📱 SMS Interface Mockup
        </div>
        
        {/* Phone Case */}
        <div style={{ 
          background: '#080c0a', 
          border: '8px solid rgba(255,255,255,0.06)', 
          borderRadius: '24px', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '420px',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)'
        }}>
          {/* Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.3)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '10px' }}>
            <span>VIRIDIS GSM</span>
            <span>+234 809 123 4567</span>
            <span>100% [🔋]</span>
          </div>

          {/* Chat scrolling viewport */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{ 
                  maxWidth: '85%', 
                  padding: '10px 14px', 
                  borderRadius: '12px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line',
                  fontSize: '12px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? 'var(--forest)' : 'rgba(255,255,255,0.04)',
                  color: msg.sender === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Quick prompts block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>Select command to test flow:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button 
              disabled={isProcessing}
              onClick={() => handlePromptClick('Register bank GTB account 0022334455')}
              style={{ padding: '8px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.04)'}
            >
              🔑 1. User Registration Link
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => handlePromptClick('Send 5000 to Access Bank 0123456789 PIN 1234')}
              style={{ padding: '8px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.04)'}
            >
              💸 2. Send ₦5,000 (Successful)
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => handlePromptClick('Send 15000 in bulk to GTB and Zenith PIN 1234')}
              style={{ padding: '8px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.04)'}
            >
              📦 3. Consolidated Bulk Transfer
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => handlePromptClick('Set scheduled payment 10000 for Access Bank')}
              style={{ padding: '8px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.04)'}
            >
              📅 4. Schedule Payment
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => handlePromptClick('Send 5000 to GTB account 0123456789 PIN 9999')}
              style={{ padding: '8px 12px', fontSize: '11px', background: 'rgba(235, 87, 87, 0.05)', border: '1px solid rgba(235, 87, 87, 0.18)', borderRadius: '6px', color: '#eb5757', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(235, 87, 87, 0.15)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(235, 87, 87, 0.05)'}
            >
              ⚠️ 5. Invalid PIN (Lock: {pinAttempts}/5)
            </button>
          </div>
        </div>
      </div>

      {/* CLOUD TERMINAL VIEW */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--leaf-2)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ⚙️ Buyby Cloud Router Settlement
        </div>

        {/* Double-Leg flow viz */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>DOUBLE-LEG ROUTER STAGE</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
            <span style={{ color: leg1 === 'success' ? 'var(--leaf-2)' : leg1 === 'processing' ? '#f2994a' : 'rgba(255,255,255,0.3)' }}>
              {leg1 === 'processing' ? '⚡ ' : leg1 === 'success' ? '✓ ' : '○ '}
              Leg 1: DEBIT SENDER
            </span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>━━━━➔</span>
            <span style={{ color: leg2 === 'success' ? 'var(--leaf-2)' : leg2 === 'processing' ? '#f2994a' : 'rgba(255,255,255,0.3)' }}>
              {leg2 === 'processing' ? '⚡ ' : leg2 === 'success' ? '✓ ' : '○ '}
              Leg 2: PAYOUT RECEIVER
            </span>
          </div>
        </div>

        {/* Gemini intent JSON block */}
        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: 'var(--leaf-2)', fontWeight: '800', letterSpacing: '0.5px' }}>
            🤖 GOOGLE GEMINI NLP INTENT PARSER OUTPUT
          </span>
          <pre style={{ margin: 0, padding: 0, fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.85)', overflowX: 'auto', maxHeight: '72px' }}>
            {geminiJson ? JSON.stringify(geminiJson, null, 2) : '// Waiting for natural language input...'}
          </pre>
        </div>

        {/* Console Logs */}
        <div style={{ 
          flex: 1,
          background: 'rgba(0,0,0,0.3)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '12px', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          maxHeight: '220px',
          overflow: 'hidden'
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
            Celery Workers & Redis logs
          </span>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.7)', paddingRight: '4px' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ lineHeight: '1.4' }}>{log}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

    </div>
  );
}
