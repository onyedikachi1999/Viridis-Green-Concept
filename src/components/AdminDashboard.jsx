import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onClose }) {
  const [token, setToken] = useState(localStorage.getItem('viridis_admin_token') || '');
  const [passcode, setPasscode] = useState('');
  const [inquiries, setInquiries] = useState({ partnerships: [], investors: [], waitlists: [] });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('partnerships'); // partnerships, investors, waitlists
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);

  // Fetch inquiries when token changes
  useEffect(() => {
    if (token) {
      fetchInquiries();
      logActivity("Administrator console unlocked.");
    }
  }, [token]);

  // Auto Refresh Interval
  useEffect(() => {
    if (!token || !autoRefresh) return;
    const interval = setInterval(() => {
      fetchInquiries(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [token, autoRefresh]);

  const logActivity = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLogs(prev => [
      { id: Date.now() + Math.random().toString(), time: timestamp, text: msg },
      ...prev.slice(0, 49) // Keep last 50 entries
    ]);
  };

  const fetchInquiries = async (isAuto = false) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: {
          'Authorization': token
        }
      });
      if (res.status === 401) {
        handleLogout();
        setError('Session expired. Please log in again.');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch inquiries.');
      const data = await res.json();
      setInquiries(data);
      setError('');
      if (isAuto) {
        logActivity("Auto-refreshed database records.");
      } else {
        logActivity("Fetched database updates.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      localStorage.setItem('viridis_admin_token', data.token);
      setToken(data.token);
      setPasscode('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('viridis_admin_token');
    setToken('');
    setInquiries({ partnerships: [], investors: [], waitlists: [] });
    setActivityLogs([]);
  };

  const handleStatusUpdate = async (type, id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${type}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status.');
      logActivity(`Updated ${type} inquiry ID ${id.slice(0, 5)}... status to: ${newStatus.toUpperCase()}`);
      fetchInquiries(); // Reload
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (type, id) => {
    const recordLabel = type === 'waitlists' ? 'waitlist entry' : 'inquiry record';
    if (!window.confirm(`Are you sure you want to delete this ${recordLabel} permanently?`)) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });
      if (!res.ok) throw new Error('Failed to delete record.');
      logActivity(`Deleted ${type} record ID ${id.slice(0, 5)}... permanently.`);
      fetchInquiries(); // Reload
    } catch (err) {
      alert(err.message);
    }
  };

  // CSV Data Exporter
  const handleExportCSV = () => {
    const list = inquiries[activeTab] || [];
    if (list.length === 0) {
      alert('No records to export.');
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'waitlists') {
      csvContent += "ID,Email,Product,Type,Date\n";
      list.forEach(item => {
        csvContent += `"${item.id}","${item.email}","${item.product}","${item.type}","${item.createdAt}"\n`;
      });
    } else if (activeTab === 'partnerships') {
      csvContent += "ID,OrgName,ContactName,Email,Phone,Interest,Message,Status,Date\n";
      list.forEach(item => {
        csvContent += `"${item.id}","${item.orgName || ''}","${item.contactName}","${item.email}","${item.phone || ''}","${item.interest || ''}","${(item.message || '').replace(/"/g, '""')}","${item.status}","${item.createdAt}"\n`;
      });
    } else {
      csvContent += "ID,Name,Email,Firm,Message,Status,Date\n";
      list.forEach(item => {
        csvContent += `"${item.id}","${item.name}","${item.email}","${item.firm || ''}","${(item.message || '').replace(/"/g, '""')}","${item.status}","${item.createdAt}"\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `viridis_${activeTab}_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity(`Exported ${activeTab} data to CSV.`);
  };

  // Download local email logs file
  const handleDownloadLogs = async () => {
    try {
      const res = await fetch('/api/admin/email-logs', {
        headers: {
          'Authorization': token
        }
      });
      if (res.status === 401) {
        handleLogout();
        alert('Session expired. Please log in again.');
        return;
      }
      if (!res.ok) throw new Error('Failed to download logs.');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "email_logs.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      logActivity("Downloaded SMTP email notification logs file.");
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter items based on activeTab, statusFilter, and searchTerm
  const getFilteredItems = () => {
    const list = inquiries[activeTab] || [];
    
    // Status Filter
    const filteredByStatus = activeTab === 'waitlists' 
      ? list 
      : (statusFilter === 'all' ? list : list.filter(item => item.status === statusFilter));
    
    // Search Term Filter
    if (!searchTerm) return filteredByStatus;
    
    const term = searchTerm.toLowerCase();
    return filteredByStatus.filter(item => {
      if (activeTab === 'waitlists') {
        return (item.email || '').toLowerCase().includes(term) || 
               (item.product || '').toLowerCase().includes(term) || 
               (item.type || '').toLowerCase().includes(term);
      } else if (activeTab === 'partnerships') {
        return (item.orgName || '').toLowerCase().includes(term) || 
               (item.contactName || '').toLowerCase().includes(term) || 
               (item.email || '').toLowerCase().includes(term) || 
               (item.interest || '').toLowerCase().includes(term) ||
               (item.message || '').toLowerCase().includes(term);
      } else {
        return (item.name || '').toLowerCase().includes(term) || 
               (item.firm || '').toLowerCase().includes(term) || 
               (item.email || '').toLowerCase().includes(term) || 
               (item.message || '').toLowerCase().includes(term);
      }
    });
  };

  // Calculate statistics
  const getStats = () => {
    const pList = inquiries.partnerships || [];
    const iList = inquiries.investors || [];
    const wList = inquiries.waitlists || [];
    const totalInquiriesCount = pList.length + iList.length;
    const totalAllCount = totalInquiriesCount + wList.length;

    const approvedCount = pList.filter(i => i.status === 'approved').length + iList.filter(i => i.status === 'approved').length;
    const pendingCount = pList.filter(i => i.status === 'pending').length + iList.filter(i => i.status === 'pending').length;
    const rejectedCount = pList.filter(i => i.status === 'rejected').length + iList.filter(i => i.status === 'rejected').length;

    // Calculate percentage ratios
    const pRatio = totalAllCount > 0 ? (pList.length / totalAllCount) * 100 : 0;
    const iRatio = totalAllCount > 0 ? (iList.length / totalAllCount) * 100 : 0;
    const wRatio = totalAllCount > 0 ? (wList.length / totalAllCount) * 100 : 0;

    return {
      totalInquiries: totalInquiriesCount,
      totalAll: totalAllCount,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      waitlists: wList.length,
      pRatio,
      iRatio,
      wRatio,
      approvalRate: totalInquiriesCount > 0 ? Math.round((approvedCount / totalInquiriesCount) * 100) : 0
    };
  };

  const stats = getStats();
  const filteredList = getFilteredItems();

  // Clicking statistics tiles updates filters
  const handleStatTileClick = (type) => {
    if (type === 'waitlist') {
      setActiveTab('waitlists');
      setStatusFilter('all');
      logActivity("Filtered dashboard by waitlists.");
    } else if (type === 'total') {
      setStatusFilter('all');
      if (activeTab === 'waitlists') setActiveTab('partnerships');
      logActivity("Viewing all inquiries.");
    } else {
      setStatusFilter(type);
      if (activeTab === 'waitlists') setActiveTab('partnerships');
      logActivity(`Filtered inquiries by status: ${type.toUpperCase()}`);
    }
  };

  if (!token) {
    // LOGIN SCREEN
    return (
      <div className="modal-overlay" style={{ background: 'rgba(3, 20, 15, 0.95)' }}>
        <div className="modal-container admin-dashboard-dark" style={{ maxWidth: '420px', border: '1px solid rgba(126, 217, 87, 0.15)', background: 'rgba(8, 42, 32, 0.45)' }}>
          <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="Viridis Logo" style={{ height: '32px', filter: 'drop-shadow(0 0 8px rgba(126,217,87,0.4))' }} />
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800' }}>Viridis Console</h3>
            </div>
            <button className="modal-close" onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)' }}>✕</button>
          </div>
          <div className="modal-content" style={{ padding: '24px 0 0' }}>
            <p style={{ textAlign: 'center', marginBottom: '24px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Enter administration passcode to unlock dashboard</p>
            {error && <p style={{ color: '#eb5757', fontSize: '13px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</p>}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label style={{ color: 'var(--leaf-2)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Admin Passcode</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '0.25em', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '12px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', height: '46px', boxShadow: '0 8px 20px -5px rgba(31, 168, 102, 0.4)' }}>
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // REDESIGNED EXECUTIVE DARK DASHBOARD
  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '40px', background: 'rgba(3, 20, 15, 0.96)' }}>
      <div className="modal-container admin-dashboard-dark" style={{ maxWidth: '1020px', maxHeight: '90vh', background: 'rgba(8, 42, 32, 0.35)', border: '1px solid rgba(126, 217, 87, 0.12)', boxShadow: '0 24px 64px -16px rgba(0,0,0,0.8)' }}>
        
        {/* HEADER ROW */}
        <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src="/logo.png" alt="Viridis Logo" style={{ height: '48px', filter: 'drop-shadow(0 0 10px rgba(126,217,87,0.35))' }} />
            <div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' }}>Viridis Operations Hub</h3>
              <span style={{ fontSize: '11px', color: 'var(--leaf-2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Executive Management Console</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: '12px', color: '#fff', borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.02)' }} onMouseOver={(e) => e.target.style.background = 'rgba(235,87,87,0.15)'} onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.02)'}>
              Logout
            </button>
            <button className="modal-close" onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)' }}>✕</button>
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="modal-content" style={{ padding: '28px 32px 32px', background: 'transparent' }}>
          
          {/* STATS TILES (INTERACTIVE CLICK FILTERS) */}
          <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {/* Total */}
            <div onClick={() => handleStatTileClick('total')} className="stat-card" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Total Inquiries</span>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: '800', color: '#fff' }}>{stats.totalInquiries}</h2>
            </div>
            {/* Pending */}
            <div onClick={() => handleStatTileClick('pending')} className="stat-card" style={{ cursor: 'pointer', background: 'rgba(242, 153, 74, 0.03)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(242, 153, 74, 0.15)', borderLeft: '4px solid #f2994a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(242, 153, 74, 0.8)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Pending Review</span>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: '800', color: '#f2994a' }}>{stats.pending}</h2>
            </div>
            {/* Approved */}
            <div onClick={() => handleStatTileClick('approved')} className="stat-card" style={{ cursor: 'pointer', background: 'rgba(31, 168, 102, 0.03)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(31, 168, 102, 0.15)', borderLeft: '4px solid var(--leaf-1)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--leaf-1)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Approved</span>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: '800', color: 'var(--leaf-1)' }}>{stats.approved}</h2>
            </div>
            {/* Rejected */}
            <div onClick={() => handleStatTileClick('rejected')} className="stat-card" style={{ cursor: 'pointer', background: 'rgba(235, 87, 87, 0.03)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(235, 87, 87, 0.15)', borderLeft: '4px solid #eb5757', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: '#eb5757', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Archived</span>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: '800', color: '#eb5757' }}>{stats.rejected}</h2>
            </div>
            {/* Waitlists */}
            <div onClick={() => handleStatTileClick('waitlist')} className="stat-card" style={{ cursor: 'pointer', background: 'rgba(86, 204, 242, 0.03)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(86, 204, 242, 0.15)', borderLeft: '4px solid #56ccf2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: '#56ccf2', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Waitlist Signups</span>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: '800', color: '#56ccf2' }}>{stats.waitlists}</h2>
            </div>
          </div>

          {/* VISUAL ANALYTICS & INTERACTIVE CHART PANEL */}
          <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Database Volume Metrics & Trends</span>
                <h4 style={{ margin: '4px 0 0', color: '#fff', fontSize: '16px', fontWeight: '800' }}>Activity Scale Chart</h4>
              </div>
              <div style={{ display: 'flex', gap: '18px', fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'var(--leaf-1)' }} /> Partnerships ({inquiries.partnerships?.length || 0})</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#f2994a' }} /> Investors ({inquiries.investors?.length || 0})</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#56ccf2' }} /> Waitlists ({inquiries.waitlists?.length || 0})</span>
              </div>
            </div>

            {/* Dynamic SVG Area Chart */}
            <svg viewBox="0 0 500 100" style={{ width: '100%', height: '80px', overflow: 'visible', margin: '14px 0 6px' }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--leaf-1)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--leaf-1)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              
              {/* SVG Area Paths calculated dynamically */}
              <path
                d={`M 0,95 Q 120,${95 - (inquiries.partnerships?.length || 0) * 12} 250,${95 - (inquiries.investors?.length || 0) * 15} T 500,${95 - (inquiries.waitlists?.length || 0) * 8} L 500,100 L 0,100 Z`}
                fill="url(#chartGrad)"
              />
              <path
                d={`M 0,95 Q 120,${95 - (inquiries.partnerships?.length || 0) * 12} 250,${95 - (inquiries.investors?.length || 0) * 15} T 500,${95 - (inquiries.waitlists?.length || 0) * 8}`}
                fill="none"
                stroke="var(--leaf-1)"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 5px rgba(126,217,87,0.35))' }}
              />
              {/* Glowing anchor dots */}
              <circle cx="120" cy={95 - (inquiries.partnerships?.length || 0) * 12} r="5" fill="var(--leaf-2)" style={{ filter: 'drop-shadow(0 0 4px var(--leaf-2))' }} />
              <circle cx="250" cy={95 - (inquiries.investors?.length || 0) * 15} r="5" fill="#f2994a" style={{ filter: 'drop-shadow(0 0 4px #f2994a)' }} />
              <circle cx="500" cy={95 - (inquiries.waitlists?.length || 0) * 8} r="5" fill="#56ccf2" style={{ filter: 'drop-shadow(0 0 4px #56ccf2)' }} />
            </svg>
          </div>

          {/* CONTROL TABS & TOOLS ROW */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button 
                onClick={() => { setActiveTab('partnerships'); setStatusFilter('all'); setSearchTerm(''); }} 
                className={`tab-btn ${activeTab === 'partnerships' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', font: 'inherit', fontWeight: '700', fontSize: '15px', color: activeTab === 'partnerships' ? 'var(--leaf-2)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', borderBottom: activeTab === 'partnerships' ? '3px solid var(--leaf-1)' : 'none', paddingBottom: '12px', marginBottom: '-16px' }}
              >
                Partnerships ({inquiries.partnerships?.length || 0})
              </button>
              <button 
                onClick={() => { setActiveTab('investors'); setStatusFilter('all'); setSearchTerm(''); }} 
                className={`tab-btn ${activeTab === 'investors' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', font: 'inherit', fontWeight: '700', fontSize: '15px', color: activeTab === 'investors' ? 'var(--leaf-2)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', borderBottom: activeTab === 'investors' ? '3px solid var(--leaf-1)' : 'none', paddingBottom: '12px', marginBottom: '-16px' }}
              >
                Investors ({inquiries.investors?.length || 0})
              </button>
              <button 
                onClick={() => { setActiveTab('waitlists'); setStatusFilter('all'); setSearchTerm(''); }} 
                className={`tab-btn ${activeTab === 'waitlists' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', font: 'inherit', fontWeight: '700', fontSize: '15px', color: activeTab === 'waitlists' ? 'var(--leaf-2)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', borderBottom: activeTab === 'waitlists' ? '3px solid var(--leaf-1)' : 'none', paddingBottom: '12px', marginBottom: '-16px' }}
              >
                Waitlists ({inquiries.waitlists?.length || 0})
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* AUTO REFRESH TOGGLE */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginRight: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={autoRefresh} 
                  onChange={(e) => {
                    setAutoRefresh(e.target.checked);
                    logActivity(`Auto-refresh status toggled: ${e.target.checked ? "ON" : "OFF"}`);
                  }}
                  style={{ display: 'none' }}
                />
                <span style={{ 
                  height: '10px', 
                  width: '10px', 
                  borderRadius: '50%', 
                  background: autoRefresh ? 'var(--leaf-1)' : 'rgba(255,255,255,0.2)',
                  boxShadow: autoRefresh ? '0 0 10px var(--leaf-1)' : 'none',
                  display: 'inline-block',
                  animation: autoRefresh ? 'pendingPulse 1.5s infinite alternate' : 'none'
                }} />
                <span>Auto Refresh</span>
              </label>

              {/* DOWNLOAD LOGS */}
              <button 
                onClick={handleDownloadLogs} 
                className="btn btn-ghost" 
                style={{ padding: '6px 14px', fontSize: '12px', height: '34px', color: 'var(--leaf-2)', borderColor: 'rgba(126, 217, 87, 0.3)', background: 'rgba(126, 217, 87, 0.05)' }}
              >
                📋 Download Logs
              </button>

              {/* EXPORT ACTION */}
              <button 
                onClick={handleExportCSV} 
                className="btn btn-ghost" 
                style={{ padding: '6px 14px', fontSize: '12px', height: '34px', color: '#fff', borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}
              >
                📥 Export CSV
              </button>

              {/* FILTER PILLS */}
              {activeTab !== 'waitlists' && (
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {['all', 'pending', 'approved', 'rejected'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: 'none',
                        background: statusFilter === filter ? 'rgba(126, 217, 87, 0.15)' : 'transparent',
                        color: statusFilter === filter ? 'var(--leaf-2)' : 'rgba(255,255,255,0.6)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEARCH BAR SWEEP */}
          <div style={{ position: 'relative', marginBottom: '18px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '12px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 44px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0,0,0,0.2)',
                color: '#fff',
                fontSize: '13.5px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(126,217,87,0.3)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
            />
          </div>

          {/* DUAL WORKSPACE LAYOUT (LIST + LIVE OPERATIONS AUDIT TRAIL SIDEBAR) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'stretch' }}>
            
            {/* DATA GRID */}
            <div className="inquiry-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredList.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '50px 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                  No database records found matching current query.
                </p>
              ) : (
                filteredList.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="admin-inquiry-card"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      position: 'relative',
                      '--idx': index // For staggered CSS entrance transitions
                    }}
                  >
                    {activeTab === 'waitlists' ? (
                      /* WAITLISTS CUSTOM COMPONENT */
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ color: 'rgba(86, 204, 242, 0.7)' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                  <polyline points="22,6 12,13 2,6" />
                                </svg>
                              </span>
                              <h4 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: '700' }}>{item.email}</h4>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12.5px', color: 'rgba(255,255,255,0.5)' }}>
                              <span>Product: <strong style={{ textTransform: 'capitalize', color: '#fff' }}>{item.product}</strong></span>
                              <span>·</span>
                              <span>Type: <strong style={{ textTransform: 'capitalize', color: 'var(--leaf-2)' }}>{item.type}</strong></span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                              📅 Signed up: {new Date(item.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            background: 'rgba(86,204,242,0.1)',
                            color: '#56ccf2',
                          }}>
                            Waitlist Active
                          </span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button 
                            onClick={() => handleDelete('waitlists', item.id)}
                            className="btn btn-ghost" 
                            style={{ padding: '4px 12px', fontSize: '11px', borderColor: 'rgba(235,87,87,0.4)', color: '#eb5757', background: 'none' }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(235,87,87,0.1)'}
                            onMouseOut={(e) => e.target.style.background = 'none'}
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      /* PARTNERSHIPS OR INVESTORS CUSTOM COMPONENT */
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            {activeTab === 'partnerships' ? (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ color: 'var(--leaf-2)' }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                                      <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                      <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                    </svg>
                                  </span>
                                  <h4 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: '700' }}>{item.orgName || 'Independent Organization'}</h4>
                                </div>
                                <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '4px' }}>
                                  Contact: <strong style={{ color: '#fff' }}>{item.contactName}</strong> · Email: <strong style={{ color: '#fff' }}>{item.email}</strong> {item.phone && `· Phone: ${item.phone}`}
                                </span>
                              </>
                            ) : (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ color: '#f2994a' }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="9" cy="7" r="4"></circle>
                                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                  </span>
                                  <h4 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: '700' }}>{item.name}</h4>
                                </div>
                                <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '4px' }}>
                                  Firm: <strong style={{ color: '#fff' }}>{item.firm || 'Individual'}</strong> · Email: <strong style={{ color: '#fff' }}>{item.email}</strong>
                                </span>
                              </>
                            )}
                            
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                              📅 Submitted: {new Date(item.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`status-pill ${item.status}`} style={{
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              background: item.status === 'approved' ? 'rgba(31,168,102,0.1)' : item.status === 'rejected' ? 'rgba(235,87,87,0.15)' : 'rgba(242,153,74,0.1)',
                              color: item.status === 'approved' ? 'var(--leaf-1)' : item.status === 'rejected' ? '#eb5757' : '#f2994a',
                              border: item.status === 'pending' ? '1px solid rgba(242,153,74,0.3)' : 'none'
                            }}>
                              {item.status}
                            </span>
                          </div>
                        </div>

                        {activeTab === 'partnerships' && item.interest && (
                          <div style={{ fontSize: '12.5px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '6px', color: 'var(--leaf-2)', fontWeight: '600', width: 'fit-content' }}>
                            🔑 Interest: {item.interest}
                          </div>
                        )}

                        <p style={{ margin: 0, fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
                          "{item.message}"
                        </p>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          {item.status !== 'approved' && (
                            <button 
                              onClick={() => handleStatusUpdate(activeTab, item.id, 'approved')}
                              className="btn btn-ghost" 
                              style={{ padding: '4px 12px', fontSize: '11px', borderColor: 'var(--leaf-1)', color: 'var(--leaf-1)', background: 'none' }}
                              onMouseOver={(e) => e.target.style.background = 'rgba(31,168,102,0.1)'}
                              onMouseOut={(e) => e.target.style.background = 'none'}
                            >
                              ✓ Approve
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusUpdate(activeTab, item.id, 'rejected')}
                              className="btn btn-ghost" 
                              style={{ padding: '4px 12px', fontSize: '11px', borderColor: '#f2994a', color: '#f2994a', background: 'none' }}
                              onMouseOver={(e) => e.target.style.background = 'rgba(242,153,74,0.1)'}
                              onMouseOut={(e) => e.target.style.background = 'none'}
                            >
                              ✕ Reject
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(activeTab, item.id)}
                            className="btn btn-ghost" 
                            style={{ padding: '4px 12px', fontSize: '11px', borderColor: 'rgba(235,87,87,0.4)', color: '#eb5757', background: 'none' }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(235,87,87,0.1)'}
                            onMouseOut={(e) => e.target.style.background = 'none'}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* LIVE OPERATIONS AUDIT TRAIL SIDEBAR */}
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.22)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '12px', 
              padding: '18px 20px', 
              display: 'flex', 
              flexDirection: 'column', 
              maxHeight: '380px',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--leaf-2)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ height: '6px', width: '6px', background: '#56ccf2', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #56ccf2' }} />
                  System Logs
                </span>
                <button 
                  onClick={() => setActivityLogs([])} 
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}
                  onMouseOver={(e) => e.target.style.color = '#fff'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.3)'}
                >
                  Clear
                </button>
              </div>
              <div className="inquiry-list-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', fontFamily: 'monospace', paddingRight: '4px' }}>
                {activityLogs.length === 0 ? (
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', display: 'block', padding: '20px 0', textAlign: 'center' }}>
                    Listening for dashboard operations...
                  </span>
                ) : (
                  activityLogs.map(log => (
                    <div key={log.id} style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.4', wordBreak: 'break-word', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--leaf-2)' }}>[{log.time}]</span> {log.text}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
