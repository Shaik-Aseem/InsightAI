import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Zap } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="relative mb-6">
          <h1 className="text-[120px] font-black leading-none gradient-text opacity-20 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2">Page Not Found</p>
              <p className="text-slate-400 text-sm">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <Link
            to="/"
            className="flex items-center gap-2 btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-slate-600 text-xs">
          <span>Error code: 404</span>
          <span>·</span>
          <span>InsightAI Platform</span>
        </div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
    </div>
  );
}

export default NotFoundPage;
