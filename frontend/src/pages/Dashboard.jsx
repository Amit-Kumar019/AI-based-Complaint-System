import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { user } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      let url = `${import.meta.env.VITE_API_URL}/api/complaints`;
      if (searchTerm) {
        url = `${import.meta.env.VITE_API_URL}/api/complaints/search?location=${searchTerm}`;
      } else if (categoryFilter) {
        url = `${import.meta.env.VITE_API_URL}/api/complaints?category=${categoryFilter}`;
      }

      const { data } = await axios.get(url, config);
      setComplaints(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [searchTerm, categoryFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/complaints/${id}`, { status: newStatus }, config);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return <span className="badge badge-pending"><Clock size={12} style={{display:'inline', marginRight:'4px'}}/>Pending</span>;
      case 'In Progress': return <span className="badge badge-progress"><AlertCircle size={12} style={{display:'inline', marginRight:'4px'}}/>In Progress</span>;
      case 'Resolved': return <span className="badge badge-resolved"><CheckCircle size={12} style={{display:'inline', marginRight:'4px'}}/>Resolved</span>;
      default: return null;
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}</span>
        </div>
      </div>

      <div className="search-container glass-card fade-in" style={{ padding: '1rem' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search by location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Filter size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
          >
            <option value="" style={{ color: 'black' }}>All Categories</option>
            <option value="Water Supply" style={{ color: 'black' }}>Water Supply</option>
            <option value="Electricity" style={{ color: 'black' }}>Electricity</option>
            <option value="Sanitation" style={{ color: 'black' }}>Sanitation</option>
            <option value="Roads" style={{ color: 'black' }}>Roads</option>
            <option value="Other" style={{ color: 'black' }}>Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No complaints found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 grid-cols-2">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{complaint.title}</h3>
                {getStatusBadge(complaint.status)}
              </div>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{complaint.description}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{complaint.category}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>📍 {complaint.location}</span>
              </div>

              {complaint.aiAnalysis && (
                <div className="ai-card" style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>✨ AI Insights</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Priority: <strong>{complaint.aiAnalysis.priority}</strong></span>
                    <span>Dept: <strong>{complaint.aiAnalysis.department}</strong></span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>{complaint.aiAnalysis.summary}</p>
                </div>
              )}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  By: {complaint.name}
                </span>
                
                <select 
                  value={complaint.status} 
                  onChange={(e) => updateStatus(complaint._id, e.target.value)}
                  style={{ background: 'var(--surface-light)', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
