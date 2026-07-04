import { useState, useRef, useEffect } from 'react';
import {
  Building, Calendar, Award, Edit3, Camera, Save, X, GraduationCap, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const skills = ['Data Analytics', 'Machine Learning', 'ReactJS', 'Python', 'Tailwind CSS', 'Vite', 'Data Visualization'];

// Profile
function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [photo, setPhoto] = useState(user?.photo || null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    accountCreated: '',
    lastLogin: '',
    datasetsUploaded: 0,
    reportsGenerated: 0
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get('/api/profile/stats');
        if (response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile stats:', err);
      }
    }
    fetchStats();
  }, [user]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image.*/)) {
      alert('Please upload an image file (png/jpg/jpeg).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    if (!name || !email) {
      setError('Name and Email are required.');
      setIsSaving(false);
      return;
    }

    const res = await updateProfile({ name, email, college, branch, photo });
    if (res.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setError(res.error || 'Failed to update profile.');
    }
    setIsSaving(false);
  };

  const statItems = [
    { title: 'Account Created', value: stats.accountCreated ? new Date(stats.accountCreated).toLocaleDateString() : 'N/A', period: 'Registration', color: 'emerald' },
    { title: 'Last Login', value: stats.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() + ' ' + new Date(stats.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A', period: 'Session Tracker', color: 'cyan' },
    { title: 'Datasets Uploaded', value: stats.datasetsUploaded, period: 'SQLite Cache', color: 'blue' },
    { title: 'Reports Generated', value: stats.reportsGenerated, period: 'Logs', color: 'purple' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1))' }} />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-5 text-center sm:text-left">
            
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[var(--accent-glow,rgba(6,182,212,0.2))] overflow-hidden border-2 border-white/20">
                {photo ? (
                  <img src={photo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5 text-slate-300" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider w-fit mx-auto sm:mx-0">
                  User Profile
                </span>
              </div>
              <p className="text-slate-400 text-sm">{user?.branch || 'Specialization'}</p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 text-slate-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {user?.college || 'College / University Not Specified'}
                </span>
              </div>
            </div>

            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="glass-card p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-secondary)]">
            <h3 className="text-sm font-bold text-white">Edit Profile Details</h3>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                  setCollege(user?.college || '');
                  setBranch(user?.branch || '');
                  setPhoto(user?.photo || null);
                  setError('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-semibold">Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-[var(--border-secondary)] px-3 py-2.5 rounded-xl text-slate-200 outline-none focus:border-[var(--accent-primary)] transition-colors"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-semibold">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-[var(--border-secondary)] px-3 py-2.5 rounded-xl text-slate-200 outline-none focus:border-[var(--accent-primary)] transition-colors"
                placeholder="Email Address"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-semibold">College / University *</label>
              <input
                type="text"
                required
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full bg-slate-900 border border-[var(--border-secondary)] px-3 py-2.5 rounded-xl text-slate-200 outline-none focus:border-[var(--accent-primary)] transition-colors"
                placeholder="College / University Name"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-semibold">Specialization *</label>
              <input
                type="text"
                required
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full bg-slate-900 border border-[var(--border-secondary)] px-3 py-2.5 rounded-xl text-slate-200 outline-none focus:border-[var(--accent-primary)] transition-colors"
                placeholder="Specialization Name"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-xs font-semibold p-2.5 rounded-xl bg-red-400/10 border border-red-400/20">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(user?.name || '');
                setEmail(user?.email || '');
                setCollege(user?.college || '');
                setBranch(user?.branch || '');
                setPhoto(user?.photo || null);
                setError('');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs rounded-xl border border-white/10 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary px-5 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {success && (
        <div className="text-emerald-400 text-xs font-semibold p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-center animate-fade-in">
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map(a => (
          <div key={a.title} className="glass-card p-5 card-hover relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[var(--accent-primary,#06b6d4)]" />
              <span className="text-[var(--text-muted,#64748b)] text-[10px] font-semibold uppercase tracking-wider">{a.period}</span>
            </div>
            <p className="text-lg md:text-xl font-black text-white mb-1 truncate" title={a.value}>{a.value}</p>
            <p className="text-[var(--text-secondary,#94a3b8)] text-xs font-medium">{a.title}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5 text-[var(--accent-primary,#06b6d4)]" />
            Skills & Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--accent-glow,rgba(6,182,212,0.1))] text-[var(--accent-primary,#06b6d4)] border border-[var(--accent-primary,#06b6d4)]/20 hover:bg-cyan-500/20 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-[var(--accent-primary,#06b6d4)]" />
            About
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            InsightAI is an AI-powered analytical data platform designed to process files in browser client environments
            and log records via standard SQLite database node streams. It models statistical deviations,
            bins distributions, and generates 6 charts to ensure rapid model engineering assessment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
