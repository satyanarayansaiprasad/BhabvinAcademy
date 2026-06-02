import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 w-full mt-20 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          <Link to="/" className="font-manrope font-black text-slate-900 dark:text-white text-xl no-underline block">
            Editorial Health
          </Link>
          <p className="text-slate-500 font-inter text-xs leading-relaxed max-w-xs">
            © {currentYear} Editorial Health Authority. Clinical precision in every review. Science-backed methodologies for modern wellness.
          </p>
        </div>

        {/* Center Navigation Columns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <h5 className="text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 font-headline">
              Authority
            </h5>
            <Link to="/privacy" className="text-slate-500 hover:text-blue-600 font-inter text-xs transition-colors no-underline">
              Medical Disclaimer
            </Link>
            <Link to="/privacy" className="text-slate-500 hover:text-blue-600 font-inter text-xs transition-colors no-underline">
              Privacy Policy
            </Link>
            <Link to="/about" className="text-slate-500 hover:text-blue-600 font-inter text-xs transition-colors underline decoration-secondary no-underline">
              Editorial Process
            </Link>
          </div>
          <div className="space-y-2 flex flex-col">
            <h5 className="text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 font-headline">
              Connect
            </h5>
            <Link to="/home" className="text-slate-500 hover:text-blue-600 font-inter text-xs transition-colors no-underline">
              Newsletter
            </Link>
            <Link to="/contact" className="text-slate-500 hover:text-blue-600 font-inter text-xs transition-colors no-underline">
              Contact
            </Link>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 font-inter text-xs transition-colors no-underline">
              Twitter
            </a>
          </div>
        </div>

        {/* Right Column (Mission Statement box) */}
        <div className="bg-surface-container-low p-6 rounded-2xl">
          <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed italic font-body">
            "Our mission is to provide the highest level of health product transparency. Each review is double-blind peer reviewed by our clinical board before publication."
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

