import { GraduationCap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-zinc-900 text-white py-12 mt-12 w-full">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Top Section - Companies */}
                <div className="flex flex-col lg:flex-row justify-between items-center pb-8 border-b border-zinc-700 gap-6">
                    <p className="font-bold text-lg text-center lg:text-left">
                        Top companies choose <span className="text-blue-400 cursor-pointer hover:underline mx-1">Bhavin Academy Business</span> to build in-demand career skills.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6 opacity-70">
                        {/* Fake Company Logos for UX aesthetics */}
                        <span className="text-2xl font-bold font-serif px-2">Nasdaq</span>
                        <span className="text-2xl font-bold font-serif px-2">Volkswagen</span>
                        <span className="text-2xl font-bold font-serif px-2">Box</span>
                        <span className="text-2xl font-bold px-2">NetApp</span>
                        <span className="text-2xl font-bold px-2">Eventbrite</span>
                    </div>
                </div>

                {/* Links Grid Section */}
                <div className="flex flex-col md:flex-row justify-between py-10 gap-8 text-sm">
                    {/* Column 1 */}
                    <div className="flex flex-col space-y-3 w-full md:w-auto">
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Bhavin Academy Business</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Teach on Bhavin Academy</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Get the app</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">About us</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Contact us</Link>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col space-y-3 w-full md:w-auto">
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Careers</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Blog</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Help and Support</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Affiliate</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Investors</Link>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col space-y-3 w-full md:w-auto">
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Terms</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Privacy policy</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Cookie settings</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Sitemap</Link>
                        <Link to="#" className="text-zinc-300 hover:text-white hover:underline transition-colors">Accessibility statement</Link>
                    </div>

                    {/* Language Selector */}
                    <div className="w-full md:w-auto flex justify-start md:justify-end">
                        <button className="border border-white hover:bg-zinc-800 transition-colors flex items-center gap-2 px-6 py-2 h-10 w-40 justify-center font-bold">
                            <Globe className="h-4 w-4" />
                            <span>English</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Section - Logo and Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <GraduationCap className="h-8 w-8 text-white" />
                        <span className="font-extrabold text-2xl font-serif">Bhavin Academy</span>
                    </div>

                    <p className="text-xs text-zinc-400">
                        © {new Date().getFullYear()} Bhavin Academy, Inc. <span className="hidden sm:inline">All rights reserved.</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
