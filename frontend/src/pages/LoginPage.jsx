import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Login
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid Credentials');
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
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-secondary,#94a3b8)]">
          Sign in to InsightAI
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="glass-card py-8 px-4 sm:px-10 border border-[var(--border-secondary,rgba(255,255,255,0.08))]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary,#94a3b8)]">
                Email address
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
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--border-secondary,rgba(255,255,255,0.1))] rounded-xl leading-5 bg-[var(--bg-secondary,rgba(15,23,42,0.6))] text-[var(--text-primary,#e2e8f0)] placeholder-[var(--text-muted,#475569)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary,#06b6d4)] focus:border-[var(--accent-primary,#06b6d4)] sm:text-sm transition-all duration-200"
                  placeholder="student@insightai.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary,#94a3b8)]">
                Password
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
                  className="block w-full pl-10 pr-10 py-2 border border-[var(--border-secondary,rgba(255,255,255,0.1))] rounded-xl leading-5 bg-[var(--bg-secondary,rgba(15,23,42,0.6))] text-[var(--text-primary,#e2e8f0)] placeholder-[var(--text-muted,#475569)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary,#06b6d4)] focus:border-[var(--accent-primary,#06b6d4)] sm:text-sm transition-all duration-200"
                  placeholder="123456"
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
              <div className="text-red-400 text-sm text-center font-medium p-2 rounded-lg bg-red-400/10 border border-red-400/20">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white btn-primary hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-xs text-[var(--text-secondary,#94a3b8)]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[var(--accent-primary,#06b6d4)] hover:underline font-semibold font-mono">
                Create Account
              </Link>
            </p>
            <p className="text-[10px] text-[var(--text-muted,#64748b)]">
              Demo Credentials:<br/>
              <span className="font-mono text-[var(--text-secondary,#94a3b8)] mt-1 inline-block">
                student@insightai.com / 123456
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
