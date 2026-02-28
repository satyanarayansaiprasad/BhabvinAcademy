import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        explore: [
            { label: "Web Development", path: "/courses?category=web-development" },
            { label: "Data Science", path: "/courses?category=data-science" },
            { label: "Machine Learning", path: "/courses?category=machine-learning" },
            { label: "Cloud Computing", path: "/courses?category=cloud-computing" },
            { label: "UI/UX Design", path: "/courses?category=ui-ux-design" },
        ],
        platform: [
            { label: "All Courses", path: "/courses" },
            { label: "Instructor Portal", path: "/instructor" },
            { label: "Student Dashboard", path: "/student-courses" },
            { label: "Success Stories", path: "#" },
            { label: "Learning Path", path: "#" },
        ],
        support: [
            { label: "Help Center", path: "#" },
            { label: "Terms of Service", path: "/terms" },
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Community", path: "#" },
            { label: "Contact Us", path: "#" },
        ]
    };

    return (
        <footer className="bg-zinc-900 border-t border-zinc-800 text-white pt-12 xs:pt-16 md:pt-24 pb-8 xs:pb-12 w-full font-sans overflow-hidden">
            <div className="container mx-auto px-4 xs:px-5 lg:px-8">
                {/* CTA Section */}
                <div className="flex flex-col items-center gap-6 xs:gap-8 mb-12 xs:mb-16 md:mb-24 p-6 xs:p-8 md:p-12 bg-zinc-800/50 rounded-[24px] xs:rounded-[32px] md:rounded-[40px] border border-zinc-700/50 backdrop-blur-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-700" />

                    <div className="relative z-10 text-center">
                        <h2 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter mb-3 xs:mb-4">
                            Ready to transform your <br className="hidden xs:block" />
                            <span className="text-blue-400 italic">career trajectory?</span>
                        </h2>
                        <p className="text-zinc-400 font-medium text-sm xs:text-base max-w-md mx-auto">
                            Join thousands of students mastering the skills of the future with Bhavin Academy.
                        </p>
                    </div>

                    <div className="relative z-10 w-full xs:w-auto">
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full xs:w-auto bg-white text-black hover:bg-zinc-200 h-12 xs:h-14 md:h-16 px-6 xs:px-8 md:px-10 rounded-xl xs:rounded-2xl font-black text-base xs:text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 min-w-[44px] min-h-[44px]"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 xs:gap-10 md:gap-12 md:gap-16 mb-12 xs:mb-16 md:mb-24">
                    {/* Brand Column */}
                    <div className="col-span-2 xs:col-span-2 md:col-span-2 lg:col-span-1 flex flex-col gap-5 xs:gap-8">
                        <Link to="/" className="flex items-center gap-2 xs:gap-3 group">
                            <div className="bg-white p-1.5 xs:p-2 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform duration-500">
                                <GraduationCap className="h-5 w-5 xs:h-7 xs:w-7 text-black" />
                            </div>
                            <span className="font-black text-lg xs:text-2xl tracking-tighter">Bhavin Academy.</span>
                        </Link>
                        <p className="text-zinc-400 font-medium leading-relaxed text-sm xs:text-base">
                            The world's most immersive learning platform, designed for the next generation of industry leaders.
                        </p>
                        <div className="flex items-center gap-3 xs:gap-4 flex-wrap">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <Link
                                    key={i}
                                    to="#"
                                    className="h-9 w-9 xs:h-10 xs:w-10 rounded-lg xs:rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all hover:-translate-y-1"
                                >
                                    <Icon className="h-4 w-4 xs:h-5 xs:w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="flex flex-col gap-4 xs:gap-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-400">Top Categories</h4>
                        <ul className="flex flex-col gap-3 xs:gap-4">
                            {footerLinks.explore.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-zinc-400 hover:text-white font-bold transition-all flex items-center group gap-2 text-sm xs:text-base">
                                        <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-3 transition-all shrink-0" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Platform */}
                    <div className="flex flex-col gap-4 xs:gap-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-400">Platform</h4>
                        <ul className="flex flex-col gap-3 xs:gap-4">
                            {footerLinks.platform.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-zinc-400 hover:text-white font-bold transition-all flex items-center group gap-2 text-sm xs:text-base">
                                        <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-emerald-400 group-hover:w-3 transition-all shrink-0" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2 xs:col-span-2 md:col-span-1 flex flex-col gap-4 xs:gap-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-purple-400">Contact</h4>
                        <ul className="flex flex-col gap-4 xs:gap-6 font-medium text-zinc-400">
                            <li className="flex items-start gap-3 xs:gap-4">
                                <MapPin className="h-4 w-4 xs:h-5 xs:w-5 text-zinc-600 shrink-0 mt-1" />
                                <span className="text-sm xs:text-base">123 Innovation Drive, <br />Tech City, TC 10101</span>
                            </li>
                            <li className="flex items-center gap-3 xs:gap-4 group">
                                <Mail className="h-4 w-4 xs:h-5 xs:w-5 text-zinc-600 group-hover:text-purple-400 transition-colors shrink-0" />
                                <a href="mailto:hello@bhavinacademy.com" className="hover:text-white transition-colors text-sm xs:text-base break-all">hello@bhavinacademy.com</a>
                            </li>
                            <li className="flex items-center gap-3 xs:gap-4 group">
                                <Phone className="h-4 w-4 xs:h-5 xs:w-5 text-zinc-600 group-hover:text-purple-400 transition-colors shrink-0" />
                                <a href="tel:+1234567890" className="hover:text-white transition-colors text-sm xs:text-base">+1 (234) 567-890</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 xs:pt-12 border-t border-zinc-800 flex flex-col items-center gap-4 xs:gap-6 md:gap-8 text-center">
                    <div className="flex flex-wrap justify-center gap-4 xs:gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        © {currentYear} Bhavin Academy. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">System Online</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
