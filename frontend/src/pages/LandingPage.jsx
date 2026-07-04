import Navbar from '../components/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default LandingPage;