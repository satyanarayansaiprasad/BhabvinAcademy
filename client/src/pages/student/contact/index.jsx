import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitContactService } from "../../../services";

function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    topic: "Editorial Review Request",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await submitContactService({
        name: `${formData.fname} ${formData.lname}`.trim(),
        email: formData.email,
        category: formData.topic,
        message: formData.message
      });
      if (data.success) {
        setIsSubmitted(true);
        setFormData({ fname: "", lname: "", email: "", topic: "Editorial Review Request", message: "" });
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError(err.message || "Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16 md:mb-24 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary font-medium text-sm mb-6 font-manrope">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Expert Concierge
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tighter text-on-surface mb-6 leading-tight">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed font-normal">
            We’d love to hear from you. Our clinical editorial team is standing by to address your inquiries regarding our review methodology or product insights.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 text-left">
          {/* Contact Form (Bento Style) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-atmospheric relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 rounded-bl-full -mr-16 -mt-16"></div>
              <h2 className="text-2xl font-bold font-headline mb-8 text-on-surface">Clinical Inquiry Form</h2>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-secondary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h3 className="text-xl font-bold font-headline text-on-surface mb-2">Message Sent</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm mb-6">Thank you for reaching out. Our clinical reviewers will sync with you within 24 hours.</p>
                  <button onClick={() => setIsSubmitted(false)} className="px-6 py-2 bg-primary text-white font-bold rounded-xl text-sm">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 font-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="fname">First Name</label>
                      <input 
                        className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant outline-none" 
                        id="fname" 
                        placeholder="Dr. Julian" 
                        type="text"
                        value={formData.fname}
                        onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="lname">Last Name</label>
                      <input 
                        className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant outline-none" 
                        id="lname" 
                        placeholder="Reed" 
                        type="text"
                        value={formData.lname}
                        onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="email">Professional Email</label>
                    <input 
                      className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant outline-none" 
                      id="email" 
                      placeholder="julian@medical-journal.org" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="subject">Subject</label>
                    <select 
                      className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 outline-none" 
                      id="subject"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option>Editorial Review Request</option>
                      <option>Product Analysis Correction</option>
                      <option>Affiliate Partnership</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="message">Your Message</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant resize-none outline-none" 
                      id="message" 
                      placeholder="Provide detailed context regarding your clinical query..." 
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  
                  {error && <p className="text-error text-xs font-semibold ml-1">{error}</p>}
                  
                  <button 
                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg scale-100 hover:scale-102 transition-transform duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </form>
              )}
            </div>
            
            {/* Support CTA Section */}
            <div className="bg-tertiary text-white p-8 md:p-12 rounded-xl relative group">
              <div className="absolute bottom-4 right-4 opacity-10 scale-150 group-hover:scale-125 transition-transform duration-700">
                <span className="material-symbols-outlined text-9xl">handshake</span>
              </div>
              <h3 className="text-3xl font-bold font-headline mb-4">Collaborate with us</h3>
              <p className="text-tertiary-fixed-dim max-w-md mb-8 leading-relaxed font-body text-slate-300">
                Are you a medical professional or product developer looking to share peer-reviewed insights? Our platform welcomes high-authority collaborations.
              </p>
              <button onClick={() => navigate("/about")} className="inline-flex items-center gap-2 font-bold text-secondary-fixed hover:text-white transition-colors">
                View Partnerships <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Contact Details & Map */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-surface-container-low p-8 rounded-xl space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface font-manrope">Clinical Support</h4>
                    <p className="text-on-surface-variant font-body">editorial@healthauthority.com</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface font-manrope">Business Hours</h4>
                    <p className="text-on-surface-variant font-body">Mon – Fri: 08:00 – 18:00 EST</p>
                    <p className="text-xs text-secondary mt-1 font-semibold uppercase tracking-wider font-headline">Expert team active</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined">share</span>
                  </div>
                  <div className="flex gap-4 items-center mt-2">
                    <a className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors" href="https://google.com" target="_blank" rel="noreferrer">
                      <span className="material-symbols-outlined text-lg">public</span>
                    </a>
                    <a className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors" href="https://youtube.com" target="_blank" rel="noreferrer">
                      <span className="material-symbols-outlined text-lg">videocam</span>
                    </a>
                    <a className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors" href="https://spotify.com" target="_blank" rel="noreferrer">
                      <span className="material-symbols-outlined text-lg">podcasts</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-surface-variant">
                <img 
                  className="w-full h-full object-cover grayscale opacity-60" 
                  alt="London District Map" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHrWn5xtifSl5kO-3_JP8j__7kf1dpYjveFH-8kJh8Zj8kSEjr-bLST576zKqNUh-88Mn18BZee29UxYijQzDtrd5Vei_N4LRp17E9d1Z5_3oXEciG3FXweJr9PREujklVvNa18OvWtzJ8u3dXsNOFC43sfABb9qt6H0vKSzii5mF2O3791t5E2Qcrfp8_x5UYn8klXTR-rsbeWuyDU-RMhxkwuCcXAWfG_oXcez6kRrJUhE8HN3oTfreyJXLWsJ5lpMfC9FVuco9E"
                />
                <div className="absolute inset-0 bg-primary/10 backdrop-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
                    <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg">
                  <p className="text-xs font-bold text-on-surface tracking-tight font-manrope">London Innovation Hub</p>
                  <p className="text-[10px] text-on-surface-variant font-body">Medical District, EC1V</p>
                </div>
              </div>
            </div>

            {/* Quick Help / FAQs */}
            <div className="p-8 border-l-4 border-primary bg-primary-fixed/10 rounded-r-xl text-left">
              <h4 className="font-bold text-on-surface mb-6 font-manrope uppercase text-xs tracking-widest">Knowledge Base</h4>
              <ul className="space-y-4 font-body text-sm">
                <li>
                  <button onClick={() => navigate("/about")} className="w-full flex items-center justify-between group">
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors font-medium">How we review products</span>
                    <span className="material-symbols-outlined text-sm text-outline group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/privacy")} className="w-full flex items-center justify-between group">
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors font-medium">Affiliate disclosure policy</span>
                    <span className="material-symbols-outlined text-sm text-outline group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/privacy")} className="w-full flex items-center justify-between group">
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors font-medium">Data privacy for patients</span>
                    <span className="material-symbols-outlined text-sm text-outline group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ContactPage;
