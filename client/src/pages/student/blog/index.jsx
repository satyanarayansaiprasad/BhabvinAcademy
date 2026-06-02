import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BlogPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState("Immunity");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  const categories = ["Immunity", "Skin Care", "Sleep Aids", "Gut Health"];

  const comparisonData = {
    "Immunity": [
      { name: "Vitalis Plus", isTop: true, rating: "4.9", benefit: "Rapid Absorption Formula", price: "$34.99", icon: "medication" },
      { name: "Defense360", isTop: false, rating: "4.6", benefit: "Time-Release Technology", price: "$29.50", icon: "pill" },
      { name: "PureShield Zinc", isTop: false, rating: "4.5", benefit: "100% Organic Sourcing", price: "$18.99", icon: "medical_services" }
    ],
    "Skin Care": [
      { name: "Lumina Night Serum", isTop: true, rating: "4.8", benefit: "Active Retinol-H Delivery", price: "$59.00", icon: "science" },
      { name: "DermaGlow Cream", isTop: false, rating: "4.5", benefit: "Deep Epidermal Hydration", price: "$42.50", icon: "clean_hands" }
    ],
    "Sleep Aids": [
      { name: "Somnus Drops", isTop: true, rating: "4.7", benefit: "Melatonin-Free Calming", price: "$24.99", icon: "water_drop" },
      { name: "NiteRest Complex", isTop: false, rating: "4.4", benefit: "Herbal Sleep Induction", price: "$19.90", icon: "bedtime" }
    ],
    "Gut Health": [
      { name: "GutGuard Probiotic", isTop: true, rating: "4.9", benefit: "50 Billion Active CFU", price: "$38.00", icon: "microbiology" },
      { name: "BioFlora Prebiotic", isTop: false, rating: "4.6", benefit: "Organic Chicory Inulin", price: "$22.00", icon: "psychiatry" }
    ]
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-container/20 text-secondary text-xs font-bold rounded-full border border-secondary/10">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Verified
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold rounded-full">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                Expert Approved
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline text-on-surface leading-[1.1] tracking-tight">
              Find the Best Health Products Backed by Research
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed font-normal">
              Clinical precision in every review. We dismantle the hype to deliver science-based insights on the supplements and tools that actually work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate("/courses")} className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold scale-102 transition-all shadow-atmospheric">
                Explore Reviews
              </button>
              <a href="#comparison" className="px-8 py-4 bg-surface-container-highest text-on-primary-fixed-variant rounded-xl font-bold scale-102 transition-all text-center no-underline">
                Top Rated Products
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-atmospheric">
              <img 
                alt="Clinical research hero" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC20tyKzIQKO1ftnWT_EsjbNHOGi49ULddstfXTFkyhwqh96ik7-l_HYqYP4BuGRv_q73UX8HRiQ_JVPm1-rlTIjDxDcAK3k3y-DBc9vT86WW_MuenZcOsjAFicFinz5VOxwyYirle75pt3nGyBgFB36ziCxcGVbIImpl3rW7D-ULoDv-dUk_GBhwh-RJyGtwDwx_nxokofuvkFmaE8tylXhUrgPyrsDsPfUNuvD2ZZfPoG_8wkOb7Zo6R6T3Cfb7ANgmgsr1_SWZhi"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            {/* Overlapping Expert Badge */}
            <div className="absolute -bottom-6 -left-6 md:-left-12 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-atmospheric max-w-xs border border-white/20 text-left">
              <div className="flex items-center gap-4">
                <img 
                  alt="Expert Dr. Miller" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGYXaavrwB3LJaKnvEAvtwuyVDn-rgLY_Gtf1JC-r0B3cdLL5UHQltWx56hsPb4MkLurdYxLb1y2roPGq9zPVRBq9eori26UHD0HMJGJNz2i778yHz85-vOQmWZ2rWge3oIZjZSTL9JUIOSOkSnHtSYEJMSAuoJ5LIe8ysZHDcNdHbeOtOQuZlhBxA9qtey03J80TR4BhUyf_VyPLO789_xWLXdVzM6zW5LKCKWrN3LUT7wpB3JhLzUcdDCxo0Ibs57AwQBhSZ8gC0"
                />
                <div>
                  <p className="text-sm font-bold font-headline">Dr. Sarah Miller</p>
                  <p className="text-xs text-on-surface-variant">Chief Clinical Editor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product Reviews (Bento Style) */}
      <section className="bg-surface-container-low py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 text-left">
            <div>
              <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">Featured Reviews</h2>
              <p className="text-on-surface-variant mt-2">The latest insights from our clinical team.</p>
            </div>
            <button onClick={() => navigate("/courses")} className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline">
              View All Reviews
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
            {/* Large Feature Card */}
            <div 
              className="md:col-span-8 group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-atmospheric transition-all hover:translate-y-[-4px] cursor-pointer"
              onClick={() => navigate("/course/details/vitalis-immunity")}
            >
              <div className="grid md:grid-cols-2 h-full">
                <div className="relative overflow-hidden min-h-[240px] md:min-h-full bg-surface-container-high">
                  <img 
                    alt="Immunity Booster" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrGOeuapnzMsDvPH-_fRgEi6XsFSFNUbOIo-sWL3ahZkeSYuhBe0kUBoUEDqk7RFDMJ3oxvP33Wh_gJwF2xwnjV_drgucfGJGbyYgKTWETGy74roIUuLpZvOaYNPPvKUb9pCKHvNG4CGa4xFH_hE2rx2GrwYIb-5hCTD1SJPv5dZYYazJqaUgDUhfAN0KKyg6Cr5hxQ261F0Wf2aBodlBA-RAaJ7F4elijgEjdIGeS-1tJ13uFkxnXp-KUw8TrSrC0hnHAIWSs7bJz"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Editor's Choice</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-secondary mb-4">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                      <span className="text-xs font-bold ml-2 text-on-surface">4.8 / 5.0</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline mb-4 group-hover:text-primary transition-colors text-on-surface">Vitalis Immunity Complex</h3>
                    <p className="text-on-surface-variant line-clamp-3 leading-relaxed mb-6 font-body">
                      An in-depth look at the bioavailability of Vitalis' latest formula. Our lab tests confirm higher-than-average absorption rates for Vitamin C and Zinc.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xs font-headline">SM</div>
                      <span className="text-xs font-semibold text-on-surface-variant font-body">Dr. Sarah Miller, Nutritionist</span>
                    </div>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Small Side Card */}
            <div 
              className="md:col-span-4 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-atmospheric p-6 flex flex-col group transition-all hover:translate-y-[-4px] cursor-pointer"
              onClick={() => navigate("/course/details/lumina-night-serum")}
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3] bg-surface-container-high shrink-0">
                <img 
                  alt="Skin Care" 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChhC0kLBljMAMLPfIB3BI3qnya0rH_fNDRatrbheqRKtUKa-501RwMNExVxsek2dJ6RIzE8qwqC0NNvRBwK4snCjQ4sCzJ0tCUHhXw_OfKCc7K_q-r8h7B--crgrUDLSlz4XqmrCU66ueTYyugX4XC3kgFnqdTV_m23HCayuOzdipOILrXtJDVCQDDVTt-KD08bg5yaPTuUHSu607kNSqxjbwnpa8kJ3Mpr7VTUSwkPAXYCdvNhrGYpmhA7Z-GqCaw4TvrmuD_daIe"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold font-headline mb-3 text-on-surface group-hover:text-primary transition-colors">Lumina Night Serum</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4 font-body line-clamp-3">
                  Is Retinol-H the breakthrough we've been waiting for? We review the clinical data behind Lumina's proprietary peptide blend.
                </p>
              </div>
              <div className="flex items-center gap-2 text-secondary text-xs font-bold mb-4 font-headline">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Expert Reviewed
              </div>
              <button className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl text-sm hover:bg-primary-fixed transition-colors">
                Read Review
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Products Comparison Table */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="comparison">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black font-headline tracking-tight mb-4 text-on-surface">The Best of 2024</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto font-body">Data-driven comparisons of top-performing products across primary health categories.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                  activeCategory === cat 
                    ? "bg-primary text-white" 
                    : "bg-surface-container-high text-on-surface-variant hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-hidden rounded-3xl shadow-atmospheric bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-fixed">
                  <th className="px-8 py-5 text-on-primary-fixed text-sm font-bold font-headline">Product</th>
                  <th className="px-8 py-5 text-on-primary-fixed text-sm font-bold font-headline">Rating</th>
                  <th className="px-8 py-5 text-on-primary-fixed text-sm font-bold font-headline">Key Benefit</th>
                  <th className="px-8 py-5 text-on-primary-fixed text-sm font-bold font-headline">Price</th>
                  <th className="px-8 py-5 text-on-primary-fixed text-sm font-bold font-headline text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-body">
                {comparisonData[activeCategory].map((prod) => (
                  <tr 
                    key={prod.name} 
                    className={`hover:bg-surface-container-low transition-colors ${
                      prod.isTop ? "border-l-4 border-primary" : ""
                    }`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-primary shadow-sm">
                          <span className="material-symbols-outlined">{prod.icon}</span>
                        </div>
                        <div className="text-left">
                          <span className="block font-bold text-on-surface">{prod.name}</span>
                          {prod.isTop && (
                            <span className="text-[10px] uppercase font-black text-secondary tracking-widest font-headline">Top Pick</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-on-surface">{prod.rating}</span>
                        <span className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant text-left">{prod.benefit}</td>
                    <td className="px-8 py-6 text-sm font-semibold text-on-surface text-left">{prod.price}</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => navigate("/courses")} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all">Buy Now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Newsletter Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-primary-container rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-atmospheric">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black font-headline mb-6">Get weekly health product insights</h2>
            <p className="text-primary-fixed/80 text-lg mb-10 max-w-2xl mx-auto">Join 45,000+ subscribers who receive our expert-vetted analysis and exclusive discounts on top-rated products.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input 
                className="flex-grow px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 text-white placeholder:text-white/60 focus:outline-none backdrop-blur-sm text-sm" 
                placeholder="Enter your email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors" type="submit">Join Now</button>
            </form>
            <p className="mt-6 text-sm text-white/50">Science-first content. No spam, ever.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
