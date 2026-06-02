import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerGroups = [
    {
      title: "Courses",
      links: [
        { label: "Microsoft Courses", path: "#" },
        { label: "Linux Courses", path: "#" },
        { label: "Networking", path: "#" },
        { label: "Cloud & Azure", path: "#" },
        { label: "Cybersecurity", path: "#" },
      ]
    },
    {
      title: "Learning Paths",
      links: [
        { label: "Microsoft Engineer", path: "#" },
        { label: "Linux Administrator", path: "#" },
        { label: "Network Engineer", path: "#" },
        { label: "Cloud Architect", path: "#" },
      ]
    },
    {
      title: "Platform",
      links: [
        { label: "Virtual Labs", path: "#" },
        { label: "Practice Exams", path: "#" },
        { label: "Certifications", path: "#" },
        { label: "Community", path: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Blog", path: "/blog" },
        { label: "Contact", path: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7] pt-[40px] pb-[24px] px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px] pb-[32px] border-b border-[#d2d2d7] mb-[24px]">
          {footerGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col">
              <h4 className="text-[13px] font-semibold text-[#1d1d1f] mb-[12px]">{group.title}</h4>
              <ul className="list-none flex flex-col gap-[8px]">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link to={link.path} className="text-[13px] text-[#6e6e73] no-underline hover:text-[#0071e3] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-[16px] font-bold text-[#1d1d1f] no-underline">
            Bhavin<span className="text-[#0071e3]">Academy</span>
          </Link>
          <div className="text-[13px] text-[#86868b]">
            © {currentYear} Bhavin Academy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

