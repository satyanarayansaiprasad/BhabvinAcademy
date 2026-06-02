import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitContactService } from "@/services";

function ContactPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    topic: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const faqs = [
    {
      q: "Do you offer refunds if I'm not satisfied?",
      a: "Yes. We offer a full refund within 7 days of purchase if you haven't completed more than 20% of the course. Just email us and we'll process it promptly — no questions asked."
    },
    {
      q: "How long do I have access to a course after purchasing?",
      a: "Lifetime access. Once you purchase a course, it's yours forever — including all future updates we make to the content. You can revisit it anytime from any device."
    },
    {
      q: "Are the courses suitable for complete beginners?",
      a: "Many of our courses are designed for beginners with no prior experience, while others require some foundational knowledge. Each course page clearly states the required skill level so you can choose the right starting point."
    },
    {
      q: "Can I access courses on mobile?",
      a: "Absolutely. BhavinAcademy is fully responsive and works smoothly on smartphones and tablets. You can learn on the go from any modern browser without needing to install an app."
    },
    {
      q: "Do you offer group or corporate pricing?",
      a: "Yes! We offer discounted plans for teams of 5 or more, with a centralised admin dashboard, progress tracking, and the option for custom training paths. Use the contact form above and select 'Team / Corporate Training' as your topic."
    },
    {
      q: "Will I receive a certificate upon completion?",
      a: "Yes. Upon completing a course, you receive a verified digital certificate from BhavinAcademy that you can share on LinkedIn or include in your resume. Certificates include your name, course title, and completion date."
    }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await submitContactService({
        name: `${formData.fname} ${formData.lname}`.trim(),
        email: formData.email,
        category: formData.topic,
        message: formData.message
      });
      if (response?.success) {
        setIsSubmitted(true);
      } else {
        setError(response?.message || "Something went wrong.");
      }
    } catch (err) {
      setError(err.message || "Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleFaq(index) {
    setOpenFaqIndex(prev => (prev === index ? -1 : index));
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
      
      {/* HERO SECTION */}
      <section className="contact-hero min-h-[44vh] bg-gradient-to-br from-black via-[#1a1a2e] to-black flex flex-col items-center justify-center text-center px-6 relative overflow-hidden text-white">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <p className="text-[13px] font-medium text-[#0071e3] tracking-[0.04em] uppercase mb-[16px]">Get in Touch</p>
        <h1 className="text-[clamp(36px,5vw,68px)] font-extrabold tracking-[-2px] leading-[1.05] mb-[18px]">
          We're here to <em className="not-italic bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">help you</em> grow.
        </h1>
        <p className="text-[clamp(15px,1.8vw,19px)] text-[#86868b] leading-[1.6] max-w-[500px] font-light">
          Have a question about a course, your account, or a partnership? We'd love to hear from you.
        </p>
      </section>

      {/* CONTACT MAIN CONTENT */}
      <section className="bg-[#f5f5f7] py-[80px] px-6">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-[40px] items-start">
          
          {/* LEFT PANEL: INFO */}
          <div className="flex flex-col gap-[16px]">
            <div>
              <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">Contact Info</p>
              <h2 className="text-[32px] font-bold tracking-[-1px] text-[#1d1d1f] leading-[1.15] mb-[8px]">Let's start a conversation.</h2>
              <p className="text-[15px] text-[#6e6e73] leading-[1.6] mb-[24px]">
                Reach out through any channel below, or fill out the form and we'll respond within one business day.
              </p>
            </div>

            {/* Email card */}
            <div className="bg-white rounded-[16px] p-[24px_28px] flex items-start gap-[16px] transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#e8f1fb] flex items-center justify-center text-[20px] shrink-0">
                📧
              </div>
              <div className="info-content">
                <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-[3px]">Email</h4>
                <a href="mailto:support@bhavinacademy.com" className="text-[13px] text-[#0071e3] font-medium hover:underline">
                  support@bhavinacademy.com
                </a>
                <p className="text-[13px] text-[#6e6e73] mt-[3px]">For general enquiries and support</p>
              </div>
            </div>

            {/* Live chat card */}
            <div className="bg-white rounded-[16px] p-[24px_28px] flex items-start gap-[16px] transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#e8f1fb] flex items-center justify-center text-[20px] shrink-0">
                💬
              </div>
              <div className="info-content">
                <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-[3px]">Live Chat</h4>
                <p className="text-[13px] text-[#6e6e73]">Available Mon–Fri, 9 AM – 6 PM IST</p>
                <button onClick={() => navigate("/")} className="text-[13px] text-[#0071e3] font-medium hover:underline text-left bg-none border-none p-0 mt-[3px]">
                  Start a chat session →
                </button>
              </div>
            </div>

            {/* Corporate card */}
            <div className="bg-white rounded-[16px] p-[24px_28px] flex items-start gap-[16px] transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#e8f1fb] flex items-center justify-center text-[20px] shrink-0">
                🤝
              </div>
              <div className="info-content">
                <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-[3px]">Corporate & Team Training</h4>
                <p className="text-[13px] text-[#6e6e73]">Looking to upskill your team?</p>
                <button onClick={() => navigate("/about")} className="text-[13px] text-[#0071e3] font-medium hover:underline text-left bg-none border-none p-0 mt-[3px]">
                  Talk to our team →
                </button>
              </div>
            </div>

            {/* Location card */}
            <div className="bg-white rounded-[16px] p-[24px_28px] flex items-start gap-[16px] transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#e8f1fb] flex items-center justify-center text-[20px] shrink-0">
                📍
              </div>
              <div className="info-content">
                <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-[3px]">Based in</h4>
                <p className="text-[13px] text-[#6e6e73]">Vadodara, Gujarat, India 🇮🇳</p>
                <p className="text-[13px] text-[#6e6e73]">Serving learners globally</p>
              </div>
            </div>

            {/* Typical response note */}
            <div className="bg-white rounded-[16px] p-[20px_24px] border-l-[3px] border-[#0071e3] mt-[8px]">
              <p className="text-[13px] text-[#6e6e73] leading-[1.6]">
                ⏱ <strong className="text-[#1d1d1f] font-semibold">Typical response time:</strong> We aim to reply to all messages within 24 hours on business days. For urgent queries, use Live Chat.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: FORM */}
          <div className="bg-white rounded-[22px] p-[48px_44px] shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
            
            {!isSubmitted ? (
              <>
                <h3 className="text-[22px] font-bold text-[#1d1d1f] tracking-[-0.5px] mb-[6px]">Send us a message</h3>
                <p className="text-[14px] text-[#6e6e73] mb-[32px]">Fill in the details below and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="space-y-[20px]">
                  
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                    <div className="flex flex-col">
                      <label className="text-[13px] font-medium text-[#1d1d1f] mb-[6px]">First Name</label>
                      <input 
                        type="text" 
                        placeholder="Ravi" 
                        required 
                        value={formData.fname}
                        onChange={(e) => setFormData({...formData, fname: e.target.value})}
                        className="w-full px-[16px] py-[12px] border border-[#d2d2d7] rounded-[12px] text-[15px] outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[13px] font-medium text-[#1d1d1f] mb-[6px]">Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Sharma" 
                        value={formData.lname}
                        onChange={(e) => setFormData({...formData, lname: e.target.value})}
                        className="w-full px-[16px] py-[12px] border border-[#d2d2d7] rounded-[12px] text-[15px] outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] transition-all"
                      />
                    </div>
                  </div>

                  {/* Email address */}
                  <div className="flex flex-col">
                    <label className="text-[13px] font-medium text-[#1d1d1f] mb-[6px]">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="ravi@example.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-[16px] py-[12px] border border-[#d2d2d7] rounded-[12px] text-[15px] outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] transition-all"
                    />
                  </div>

                  {/* Topic selection */}
                  <div className="flex flex-col relative">
                    <label className="text-[13px] font-medium text-[#1d1d1f] mb-[6px]">Topic</label>
                    <select 
                      required 
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                      className="w-full px-[16px] py-[12px] border border-[#d2d2d7] rounded-[12px] text-[15px] outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] transition-all bg-white cursor-pointer select-arrow pr-[40px]"
                    >
                      <option value="" disabled>Select a topic…</option>
                      <option value="course">Course Content Question</option>
                      <option value="enroll">Enrollment & Access</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="cert">Certification & Exams</option>
                      <option value="team">Team / Corporate Training</option>
                      <option value="partner">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message body */}
                  <div className="flex flex-col">
                    <label className="text-[13px] font-medium text-[#1d1d1f] mb-[6px]">Message</label>
                    <textarea 
                      placeholder="Tell us how we can help you…" 
                      maxLength="1000" 
                      required 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full min-h-[130px] p-[16px] border border-[#d2d2d7] rounded-[12px] text-[15px] outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] transition-all resize-y"
                    />
                    <div className="text-[11px] text-[#b0b0b5] mt-[5px] text-right">
                      {formData.message.length} / 1000
                    </div>
                  </div>

                  {error && <div className="text-red-500 text-[13px] font-medium">{error}</div>}

                  {/* Submit Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-[16px] pt-[28px] border-t border-[#f5f5f7] mt-[28px]">
                    <p className="text-[12px] text-[#86868b] max-w-[260px] leading-[1.5]">
                      By submitting, you agree to our Privacy Policy. We never share your information.
                    </p>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-[#0071e3] text-white font-semibold py-[14px] px-[32px] rounded-[980px] text-[15px] flex items-center gap-[8px] hover:bg-[#0077ed] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending…" : "Send Message"}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-[24px]">
                <div className="text-[44px] mb-[16px]">✅</div>
                <h3 className="text-[22px] font-bold text-[#1d1d1f] tracking-[-0.5px] mb-[6px]">Message received!</h3>
                <p className="text-[14px] text-[#6e6e73] max-w-[340px] mb-[24px]">
                  Thanks for reaching out. We'll reply to your email within one business day.
                </p>
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ fname: "", lname: "", email: "", topic: "", message: "" });
                  }}
                  className="text-[13px] text-[#0071e3] font-semibold hover:underline bg-none border-none p-0"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white py-[80px] px-6">
        <div className="max-w-[780px] mx-auto">
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">FAQ</p>
          <h2 className="text-[36px] font-bold tracking-[-1px] text-[#1d1d1f] mb-[8px]">Quick answers.</h2>
          <p className="text-[16px] text-[#6e6e73] mb-[40px]">The most common questions, answered upfront.</p>

          <div className="divide-y divide-[#d2d2d7] border-b border-[#d2d2d7]">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={i} className="py-[20px]">
                  <div 
                    onClick={() => toggleFaq(i)}
                    className="text-[17px] font-semibold text-[#1d1d1f] cursor-pointer flex items-center justify-between gap-[16px] select-none hover:text-[#0071e3] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-[20px] text-[#6e6e73] transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </div>
                  <div className={`text-[15px] text-[#6e6e73] leading-[1.7] transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-[200px] pt-[12px]" : "max-h-0"
                  }`}>
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[#0071e3] py-[80px] px-6 text-center text-white flex flex-col items-center">
        <h2 className="text-[clamp(28px,4vw,52px)] font-extrabold tracking-[-1.5px] mb-[16px] leading-[1.15]">
          Ready to start<br />your IT journey?
        </h2>
        <p className="text-[17px] text-[rgba(255,255,255,0.75)] mb-[36px] max-w-[480px]">
          Learn from industry experts and immerse yourself in an ocean of knowledge.
        </p>
        <button onClick={() => navigate("/courses")} className="bg-white text-[#0071e3] border-none py-[14px] px-[32px] rounded-[980px] text-[16px] font-semibold cursor-pointer hover:opacity-90 transition-opacity">
          Explore Courses
        </button>
      </section>

    </div>
  );
}

export default ContactPage;
