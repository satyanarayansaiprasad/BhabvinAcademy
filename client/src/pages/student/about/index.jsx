import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AboutUsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      {/* Hero Section: The Breathable Grid */}
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10 text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/20 text-secondary font-headline text-xs font-bold tracking-widest uppercase mb-6">
              Expert Verified Authority
            </span>
            <h1 className="font-headline font-extrabold text-5xl lg:text-7xl text-on-surface leading-[1.1] tracking-tight mb-8">
              About Our <span className="text-primary">Mission</span>
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl font-normal">
              Helping you choose safe, effective health products through rigorous clinical standards and uncompromising editorial integrity.
            </p>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 scale-105">
              <img 
                alt="Clinical Excellence" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFgtQ6-WhjQN8TAobGnapfqOKjGRnxOztFXx4pedWfubdjI-Vlx7xOYnUIufQ2fFCQeT-BlJikk3nQWQZ0aS9Yue5k0BXspGuCMeULR0O_O22yrn4LuO0OmWi2DRTEcgiBjlug7hijzlymzPh-gjv225PF5ZnHt_Qsr89ycP7ZNpqIbmftpTfLRAqvpZ0qQRNOTMIn5uyLVDzZjO24K4On1w7o0lr1s4t0Y9bzlY0-PGutLLZXWWGyEIkKPBvqY1Ja5FPHShNrRfdf"
              />
            </div>
            {/* Decorative Asymmetrical Element */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Our Story: Intentional Asymmetry */}
      <section className="bg-surface-container-low py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 text-left">
          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Our Story</h2>
            <div className="w-12 h-1 bg-primary"></div>
          </div>
          <div className="prose prose-lg text-on-surface-variant leading-relaxed font-body">
            <p className="mb-6">
              Editorial Health Authority was founded in 2018 with a singular, urgent purpose: to bring clinical-grade clarity to the increasingly cluttered health and wellness marketplace. 
            </p>
            <p className="mb-6">
              In an era of influencers and paid sponsorships, we recognized a critical deficit of transparency. Our platform was built as a sanctuary for research-backed reviews, where product efficacy is measured not by marketing budgets, but by rigorous scientific data and expert hands-on testing.
            </p>
            <p>
              Today, we stand as the "Clinical Curator" for millions of readers, bridging the gap between complex pharmaceutical research and everyday consumer decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission & Values: Icon-based Cards */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-4">Core Principles</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-body">Foundational values that dictate every clinical review we publish.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {/* Value 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-atmospheric hover:scale-102 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-3">Transparency</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">We disclose every funding source and affiliate link, maintaining absolute editorial independence.</p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-atmospheric hover:scale-102 transition-transform duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">science</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-3">Scientific Research</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">Every claim is cross-referenced with peer-reviewed journals and clinical trial data.</p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-atmospheric hover:scale-102 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">health_and_safety</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-3">User Safety</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">Patient outcomes and side-effect profiles are prioritized over aesthetic promises.</p>
            </div>
            
            {/* Value 4 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-atmospheric hover:scale-102 transition-transform duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">fact_check</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-3">Honest Reviews</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">If a product doesn't work, we say it. No exceptions, no paid positive outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Team: E-E-A-T Focus */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-12 text-center lg:text-left">The Board of Reviewers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {/* Expert 1 */}
            <div className="group">
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/5] bg-surface-container-high">
                <img 
                  alt="Dr. Elena Rossi" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd0k47zRLKzz-qlYAg0GF3uaMXjah6Q5PWczJxTTvhg9sOjZ1Ca4Z3ULTFxXGSC6Y1wOFtQ094RXEKp2Jc9z82XSyClSY3aIWqGWWuhdQem_GzIGWTXpucvu5H5ByCU1Lx1lTze4vT7eWWtoA8FtGgFkolwRC5P1nZL_57XbSZZts4pKgpaLOq6aoyTDWVRMvo5OKgN-tFP3xzXRdEiNMvjS_gVqUPDosHw9t-zZpVLVzKry0yuBYPCPK-OpG2QuIcg6vlh53u5ypc"
                />
                <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> MD, PhD
                </div>
              </div>
              <h4 class="font-headline font-bold text-xl mb-1 text-on-surface">Dr. Elena Rossi</h4>
              <p className="text-primary font-medium text-sm mb-3">Senior Medical Advisor</p>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">Board-certified physician with 15 years in internal medicine. Specializes in supplement metabolic interactions.</p>
            </div>
            
            {/* Expert 2 */}
            <div className="group">
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/5] bg-surface-container-high">
                <img 
                  alt="Marcus Thorne" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTUMSApx3qjISDh4GK_nL99lWMtGRvXx8GWv6H9VXjB9lc_-BLTVoZm72QB0nPZDchway6UDfXVCfAzUmC7zywXtz8PgAwcRLH18pLbELtBOE-f8AA6-VqfewOrg23Y6oblup9jFiIRep5sTOReORwdRhsL8O3NCrBo9v9H284fUPi5CHo8E1gCr_dlMU3LLk-OHr31q7mlDgmXQtTTssfM5H7YBtkEJg3VFHguuZK2n729Ce3EgK4Aj1B-O4iEMMHMZlu6c2j3BBE"
                />
                <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> RD, MSc
                </div>
              </div>
              <h4 class="font-headline font-bold text-xl mb-1 text-on-surface">Marcus Thorne</h4>
              <p className="text-primary font-medium text-sm mb-3">Clinical Nutritionist</p>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">Registered Dietitian focused on evidence-based dietary intervention and bio-availability analysis.</p>
            </div>
            
            {/* Expert 3 */}
            <div className="group">
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/5] bg-surface-container-high">
                <img 
                  alt="Sarah Jenkins" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3Hb4Y9HfGq6waIa7GPR2MyD4QYdKZ6CqC7ckd4JrGlMmBNcLZaeZGsAHQMMXysVyXzhWKFQkg_r0K-kgB_CRXaAHtJfi9Lww-Eidij3-zDB4khC_AKrkG7Aj6zWvrUK2gDdeVn2-IMKkpWVNy85S7wZ8IxJDhExHH37fGpgj0gUUxyl-ysfDOezTLoCF_rTCJZa5LH8xLqLYe1-mZmHoKFdbKdi_OhDmIwTbIaSHvzhP93K1ae3q-01e5R72yhHgK92ZsQunnAEKQ"
                />
                <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> CSCS
                </div>
              </div>
              <h4 class="font-headline font-bold text-xl mb-1 text-on-surface">Sarah Jenkins</h4>
              <p className="text-primary font-medium text-sm mb-3">Kinesiology Specialist</p>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">Certified Strength & Conditioning Specialist evaluating health tech and fitness performance wearables.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Review: Step-by-Step UI */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto text-left">
          <div className="mb-16">
            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-4">Our Review Protocol</h2>
            <p className="text-on-surface-variant font-body">The clinical pathway every product travels before receiving our endorsement.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-slate-200 -z-10"></div>
            
            {/* Step 1 */}
            <div className="relative bg-surface p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold mb-6 shadow-lg shadow-primary/20">1</div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">manage_search</span>
              <h4 className="font-headline font-bold text-lg mb-2">Research</h4>
              <p className="text-sm text-on-surface-variant font-body">Deep dive into clinical studies, ingredient purity, and brand history.</p>
            </div>
            
            {/* Step 2 */}
            <div className="relative bg-surface p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold mb-6 shadow-lg shadow-primary/20">2</div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">biotech</span>
              <h4 className="font-headline font-bold text-lg mb-2">Testing</h4>
              <p className="text-sm text-on-surface-variant font-body">In-house testing for usability and verification of laboratory results.</p>
            </div>
            
            {/* Step 3 */}
            <div className="relative bg-surface p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold mb-6 shadow-lg shadow-primary/20">3</div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">compare_arrows</span>
              <h4 className="font-headline font-bold text-lg mb-2">Comparison</h4>
              <p className="text-sm text-on-surface-variant font-body">Benchmarking against industry standards and leading competitors.</p>
            </div>
            
            {/* Step 4 */}
            <div className="relative bg-surface p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold mb-6 shadow-lg shadow-primary/20">4</div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">gavel</span>
              <h4 className="font-headline font-bold text-lg mb-2">Final Verdict</h4>
              <p className="text-sm text-on-surface-variant font-body">A definitive rating based on efficacy, safety, and overall value.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Disclaimer */}
      <section className="py-16 px-6 bg-surface-container-high/30 border-y border-outline-variant/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-primary/40 text-5xl mb-6">shield_with_heart</span>
          <h2 className="font-headline font-bold text-2xl mb-6 text-on-surface">Trust & Integrity</h2>
          <div className="space-y-4 text-sm text-on-surface-variant italic leading-relaxed font-body">
            <p><strong>Medical Disclaimer:</strong> The content on Editorial Health is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            <p><strong>Affiliate Disclosure:</strong> We may earn commissions from products purchased through our links. This does not influence our editorial integrity or product ratings. Our recommendations are solely based on clinical performance and expert analysis.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-12 lg:p-20 relative overflow-hidden text-center">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-primary mb-6">Ready to choose with confidence?</h2>
            <p className="text-on-primary-container text-lg mb-10 max-w-2xl mx-auto">Join 50,000+ readers who receive our clinical insights weekly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => navigate("/courses")} className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                Explore Reviews
              </button>
              
              <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto max-w-md">
                <input 
                  className="flex-grow bg-primary-container/20 border-none text-on-primary placeholder:text-on-primary-container/60 rounded-l-xl px-6 py-4 focus:ring-2 focus:ring-white/50 text-sm outline-none" 
                  placeholder="Enter your email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="bg-secondary-container text-on-secondary-container px-6 py-4 rounded-r-xl font-headline font-bold hover:bg-secondary-fixed transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
