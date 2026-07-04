import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch } from 'lucide-react';

function CTASection() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-cyan-900/20" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl font-black text-white mb-6">
          Ready to try the Dashboard?
        </h2>
        <p className="text-xl text-cyan-100/80 mb-10 max-w-2xl mx-auto">
          Log in with student credentials, upload your dataset, and instantly analyze it locally.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="btn-primary inline-flex items-center gap-2.5 text-white font-semibold px-8 py-4 rounded-xl text-base shadow-xl"
          >
            <span>Login</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/signup"
            className="px-8 py-4 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center gap-2 group"
          >
            <GitBranch className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
