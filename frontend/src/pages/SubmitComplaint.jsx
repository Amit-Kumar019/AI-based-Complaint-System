import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Zap, RefreshCw } from 'lucide-react';

const SubmitComplaint = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  });
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      setError('Please fill in title, description, and category before AI analysis.');
      return;
    }
    setError('');
    setIsAnalyzing(true);
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/analyze`, {
        title: formData.title,
        description: formData.description,
        category: formData.category
      }, config);
      
      setAiAnalysis(data);
    } catch (err) {
      console.error(err);
      setError('AI Analysis failed. You can still submit the complaint.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.category || !formData.description) {
      setError('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/complaints`, {
        name: user.name,
        email: user.email,
        ...formData,
        aiAnalysis: aiAnalysis
      }, config);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        <div className="glass-card fade-in">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send color="var(--primary)" /> Register Complaint
          </h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">Complaint submitted successfully! Redirecting...</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text" 
                name="title" 
                className="form-control" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="Brief title of your issue"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                name="category" 
                className="form-control" 
                value={formData.category} 
                onChange={handleChange} 
                required
              >
                <option value="" disabled style={{ color: 'black' }}>Select Category</option>
                <option value="Water Supply" style={{ color: 'black' }}>Water Supply</option>
                <option value="Electricity" style={{ color: 'black' }}>Electricity</option>
                <option value="Sanitation" style={{ color: 'black' }}>Sanitation</option>
                <option value="Roads" style={{ color: 'black' }}>Roads</option>
                <option value="Other" style={{ color: 'black' }}>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input 
                type="text" 
                name="location" 
                className="form-control" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                placeholder="E.g. Ghaziabad, Sector 62"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                placeholder="Detailed description of the problem..."
              ></textarea>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                style={{ flex: 1, border: '1px solid var(--primary)', color: 'var(--primary)' }}
              >
                {isAnalyzing ? <RefreshCw className="spinner" size={18} /> : <Zap size={18} />} 
                {isAnalyzing ? 'Analyzing...' : 'AI Analyze First'}
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="ai-card glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <Zap /> AI Analysis Results
            </h2>
            
            {!aiAnalysis && !isAnalyzing && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)', textAlign: 'center' }}>
                <Zap size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>Fill out the complaint details and click "AI Analyze First" to see insights.</p>
              </div>
            )}

            {isAnalyzing && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', borderColor: 'var(--primary)', borderTopColor: 'transparent', marginBottom: '1rem' }}></div>
                <p style={{ color: 'var(--primary)' }}>Analyzing complaint context...</p>
              </div>
            )}

            {aiAnalysis && !isAnalyzing && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${aiAnalysis.priority === 'High' ? 'var(--danger)' : aiAnalysis.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'}` }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Priority Level</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{aiAnalysis.priority}</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Suggested Department</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{aiAnalysis.department}</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>AI Summary</div>
                  <p style={{ margin: 0 }}>{aiAnalysis.summary}</p>
                </div>

                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Auto Response Preview</div>
                  <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-main)' }}>"{aiAnalysis.autoResponse}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
