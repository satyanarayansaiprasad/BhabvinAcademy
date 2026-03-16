import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        explore: [
            { label: "Technology", path: "/courses?category=technology" },
            { label: "Well-being", path: "/courses?category=well-being" },
            { label: "Personal Mastery", path: "/courses?category=personal-mastery" },
            { label: "Creative Arts", path: "/courses?category=creative-arts" },
        ],
        platform: [
            { label: "All Courses", path: "/courses" },
            { label: "Instructor Portal", path: "/instructor" },
            { label: "Student Dashboard", path: "/student-courses" },
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
        <footer className="bg-white border-t border-[#e6e6e6] text-black pt-16 pb-12 w-full">
            <div className="container mx-auto px-4 xs:px-6">
                {/* CTA Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 p-10 bg-[#f2f2f2] rounded-sm border border-[#e6e6e6] relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                            Ready to transform your career trajectory?
                        </h2>
                        <p className="text-[#616161] font-normal text-sm xs:text-base">
                            Join thousands of students mastering the skills of the future with Bhavin Academy.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full md:w-auto bg-[#0067b8] text-white hover:bg-[#005a9e] h-12 px-10 rounded-sm font-semibold text-base transition-none"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6">
                        <Link to={"/"} className="flex items-center gap-2 text-black group">
          <div className="bg-[#0067b8] p-1 rounded-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Bhavin Academy</span>
        </Link>
                        <p className="text-[#616161] font-normal leading-relaxed text-sm">
                            The world's most immersive learning platform, designed for the next generation of industry leaders.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <Link
                                    key={i}
                                    to="#"
                                    className="text-[#616161] hover:text-[#0067b8] transition-colors"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-sm text-black">Top Categories</h4>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.explore.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-[#616161] hover:text-[#0067b8] font-normal transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Platform */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-sm text-black">Platform</h4>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.platform.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-[#616161] hover:text-[#0067b8] font-normal transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-sm text-black">Contact</h4>
                        <ul className="flex flex-col gap-4 text-[#616161]">
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0" />
                                <a href="mailto:info@bhavinacademy.com" className="hover:text-[#0067b8] transition-colors text-sm break-all">info@bhavinacademy.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#e6e6e6] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="flex gap-8 text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                        <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                        © {currentYear} Bhavin Academy. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
