import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, Building2, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Signup
function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    const res = await signup(email, password, name, college, branch);
    if (res.success) {
      setSuccessMsg('Account registered successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(res.error || 'Failed to sign up.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary,#06b6d4)] to-blue-600 flex items-center justify-center shadow-lg shadow-[var(--accent-glow,rgba(6,182,212,0.25))]">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-[var(--text-primary,#fff)]">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-secondary,#94a3b8)]">
          Sign up to explore the InsightAI Analytics Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="glass-card py-8 px-4 sm:px-10 border border-[var(--border-secondary,rgba(255,255,255,0.08))]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary,#94a3b8)]">
                Full Name *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[var(--text-muted,#475569)]" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[var(--border-secondary,rgba(255,255,255,0.1))] rounded-xl leading-5 bg-[var(--bg-secondary,rgba(15,23,42,0.6))] text-[var(--text-primary,#e2e8f0)] placeholder-[var(--text-muted,#475569)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary,#06b6d4)] focus:border-[var(--accent-primary,#06b6d4)] sm:text-sm transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary,#94a3b8)]">
                Email Address *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--text-muted,#475569)]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[var(--border-secondary,rgba(255,255,255,0.1))] rounded-xl leading-5 bg-[var(--bg-secondary,rgba(15,23,42,0.6))] text-[var(--text-primary,#e2e8f0)] placeholder-[var(--text-muted,#475569)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary,#06b6d4)] focus:border-[var(--accent-primary,#06b6d4)] sm:text-sm transition-all duration-200"
                  placeholder="student@insightai.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary,#94a3b8)]">
                College / University
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-[var(--text-muted,#475569)]" />
                </div>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[var(--border-secondary,rgba(255,255,255,0.1))] rounded-xl leading-5 bg-[var(--bg-secondary,rgba(15,23,42,0.6))] text-[var(--text-primary,#e2e8f0)] placeholder-[var(--text-muted,#475569)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary,#06b6d4)] focus:border-[var(--accent-primary,#06b6d4)] sm:text-sm transition-all duration-200"
                  placeholder="XYZ Institute of Technology"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary,#94a3b8)]">
                Specialization
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-[var(--text-muted,#475569)]" />
                </div>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[var(--border-secondary,rgba(255,255,255,0.1))] rounded-xl leading-5 bg-[var(--bg-secondary,rgba(15,23,42,0.6))] text-[var(--text-primary,#e2e8f0)] placeholder-[var(--text-muted,#475569)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary,#06b6d4)] focus:border-[var(--accent-primary,#06b6d4)] sm:text-sm transition-all duration-200"
                  placeholder="Computer Science (AIML)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary,#94a3b8)]">
                Password *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--text-muted,#475569)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-[var(--border-secondary,rgba(255,255,255,0.1))] rounded-xl leading-5 bg-[var(--bg-secondary,rgba(15,23,42,0.6))] text-[var(--text-primary,#e2e8f0)] placeholder-[var(--text-muted,#475569)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary,#06b6d4)] focus:border-[var(--accent-primary,#06b6d4)] sm:text-sm transition-all duration-200"
                  placeholder="Min 6 characters"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[var(--text-muted,#475569)] hover:text-[var(--text-secondary,#94a3b8)] focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center font-medium p-2.5 rounded-xl bg-red-400/10 border border-red-400/20">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="text-emerald-400 text-sm text-center font-medium p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                {successMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white btn-primary hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing up...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--text-secondary,#94a3b8)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--accent-primary,#06b6d4)] hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
