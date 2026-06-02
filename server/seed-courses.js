require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Course = require("./models/Course");

const courses = [
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Windows Server Administration",
    category: "microsoft",
    level: "Intermediate",
    primaryLanguage: "English",
    subtitle: "Deploy, manage and troubleshoot Windows Server environments end-to-end.",
    description: "Master Windows Server installation, Domain Services, DNS, DHCP, IIS, Active Directory and Group Policies.",
    image: "",
    welcomeMessage: "Welcome to the Windows Server Administration course!",
    pricing: 29.99,
    objectives: "Install and configure Windows Server, manage AD, configure networks, automate tasks.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Introduction to Windows Server",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "ws_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Introductory notes for Windows Server Administration."
      },
      {
        title: "Installing Active Directory Domain Services",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "ws_2",
        freePreview: false,
        videoSource: "youtube",
        notes: "Guide to promoting Windows Server to AD DS."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Linux System Administration",
    category: "linux",
    level: "All Levels",
    primaryLanguage: "English",
    subtitle: "From CLI basics to system services, users and advanced configurations.",
    description: "Learn Linux terminal command line, shell scripting, package managers, network configurations, and security audits.",
    image: "",
    welcomeMessage: "Welcome to Linux System Administration!",
    pricing: 39.99,
    objectives: "Master command line interface, edit configurations, manage users, audit system services.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Introduction to Linux & CLI",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "lx_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Welcome to the world of open source."
      },
      {
        title: "Linux Permissions & User Control",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "lx_2",
        freePreview: false,
        videoSource: "youtube",
        notes: "How to use chmod, chown, sudo settings."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Cisco CCNA Bootcamp",
    category: "networking",
    level: "Beginner",
    primaryLanguage: "English",
    subtitle: "Routing, switching, subnetting and full CCNA 200-301 exam prep.",
    description: "Pass the Cisco CCNA 200-301 certification exam. Gain fundamental skills in subnetting, switching, routing, firewalls and wireless connections.",
    image: "",
    welcomeMessage: "Ready to become a networking wizard? Welcome!",
    pricing: 49.99,
    objectives: "Understand IP subnetting, configure Cisco switches and routers, troubleshoot routing, prepare for CCNA.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Networking Basics & OSI Model",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "cc_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Explanation of the OSI 7 layer model."
      },
      {
        title: "Understanding IP Addresses & Subnetting",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "cc_2",
        freePreview: false,
        videoSource: "youtube",
        notes: "Subnetting calculations made simple."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Azure Fundamentals AZ-900",
    category: "cloud",
    level: "Beginner",
    primaryLanguage: "English",
    subtitle: "Get cloud-certified with Microsoft Azure's entry-level exam prep.",
    description: "Understand core cloud concepts, Azure resource managers, virtual networks, virtual machines, active directories and cost management.",
    image: "",
    welcomeMessage: "Welcome to cloud computing with Microsoft Azure!",
    pricing: 19.99,
    objectives: "Describe cloud concepts, Azure architectural components, core resources, and governance plans.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Introduction to Azure AZ-900",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "az_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Overview of AZ-900 syllabus and cloud basics."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "CompTIA Security+ Prep",
    category: "security",
    level: "Advanced",
    primaryLanguage: "English",
    subtitle: "Threat analysis, cryptography, identity management and SY0-701 exam mastery.",
    description: "Prepare for your Security+ exam. Learn incident responses, firewalls, network monitoring, security architectures, and security risks.",
    image: "",
    welcomeMessage: "Welcome to the cybersecurity frontline!",
    pricing: 44.99,
    objectives: "Analyze security threats, configure firewalls, explain cryptographic standards, pass Security+.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Threats, Attacks & Vulnerabilities",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "sec_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Introductory module for Security+."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Active Directory Mastery",
    category: "microsoft",
    level: "Intermediate",
    primaryLanguage: "English",
    subtitle: "Users, groups, GPOs, DNS integration and enterprise AD management.",
    description: "Learn how to build, audit, and configure a secure Active Directory domain structure, trusts, group policy objects, and Entra ID synchronization.",
    image: "",
    welcomeMessage: "Let's master Active Directory together!",
    pricing: 24.99,
    objectives: "Build forests and domains, manage GPOs, integrate DNS, synchronize with Azure Entra ID.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "AD Architecture Overview",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "ad_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Introduction to objects, schemas, domains and forests."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Bash Scripting & Automation",
    category: "linux",
    level: "Intermediate",
    primaryLanguage: "English",
    subtitle: "Write powerful shell scripts to automate tasks, manage files and schedule jobs.",
    description: "Automate system administrations tasks. Learn shell syntax, loops, conditions, script structures, parameters and Cron scheduling.",
    image: "",
    welcomeMessage: "Welcome! Stop repeating yourself, write a Bash script.",
    pricing: 29.99,
    objectives: "Write shell scripts, handle variables and inputs, build custom cron jobs.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Writing your first Bash Script",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "bash_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Using shebang, echo and chmod +x."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "AWS Solutions Architect",
    category: "cloud",
    level: "Advanced",
    primaryLanguage: "English",
    subtitle: "Design resilient, cost-efficient AWS architectures for the SAA-C03 exam.",
    description: "Master AWS services including EC2, S3, RDS, Lambda, IAM, VPC, and Route 53 to pass the Solutions Architect Associate exam.",
    image: "",
    welcomeMessage: "Welcome to AWS Solutions Architect exam prep!",
    pricing: 49.99,
    objectives: "Design high-availability AWS systems, architect securing networks, optimize cloud costs.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "AWS Global Infrastructure & IAM",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "aws_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Regions, AZs, users and policy rules."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "CompTIA Network+ N10-009",
    category: "networking",
    level: "Beginner",
    primaryLanguage: "English",
    subtitle: "Network architecture, protocols, troubleshooting and full N+ exam prep.",
    description: "Prepare for CompTIA Network+ certification. Covers network technologies, operations, security, troubleshooting, and cabling.",
    image: "",
    welcomeMessage: "Welcome to Network+ preparation course!",
    pricing: 34.99,
    objectives: "Understand ethernet standards, configure routing, implement basic firewalls.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Ethernet Cabling & Topologies",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "nw_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "RJ45, fiber-optic, ring vs star layouts."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Microsoft 365 Administration",
    category: "microsoft",
    level: "Beginner",
    primaryLanguage: "English",
    subtitle: "Manage Exchange Online, Teams, SharePoint and MS-102 certification prep.",
    description: "Configure Microsoft 365 services, manage licenses, create mailboxes, configure SharePoint sites, and administer Entra ID tenant.",
    image: "",
    welcomeMessage: "Welcome to Microsoft 365 Administration!",
    pricing: 24.99,
    objectives: "Administer user mailboxes, manage collaborative Teams channels, audit SharePoint security.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "M365 Tenant Initial Setup",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "m365_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Buying licenses, configuring domain names."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Ethical Hacking & Penetration Testing",
    category: "security",
    level: "Intermediate",
    primaryLanguage: "English",
    subtitle: "Reconnaissance, exploitation, post-exploitation and CEH exam alignment.",
    description: "Learn how hackers think and target systems. Master Kali Linux tools, network scanning with Nmap, metasploit framework, and SQL injection.",
    image: "",
    welcomeMessage: "Welcome to Ethical Hacking and Security Testing!",
    pricing: 44.99,
    objectives: "Execute passive scanning, exploit software vulnerabilities, compile security reports.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Introduction to Ethical Hacking",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "hack_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Rules of engagement, legal permissions."
      }
    ]
  },
  {
    instructorId: "admin_123",
    instructorName: "Bhavin Patel",
    date: new Date(),
    title: "Hyper-V & Virtualization",
    category: "microsoft",
    level: "All Levels",
    primaryLanguage: "English",
    subtitle: "Build, manage and snapshot virtual machines with Microsoft Hyper-V.",
    description: "Master hypervisors, virtualization hardware, virtual switches, storage SANs, checkpoints, replicas, and clustering.",
    image: "",
    welcomeMessage: "Welcome to Hyper-V and Virtualization training!",
    pricing: 24.99,
    objectives: "Create virtual networks, configure nested virtualization, manage checkpoints.",
    students: [],
    isPublished: true,
    curriculum: [
      {
        title: "Hyper-V Role Installation",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        public_id: "hyp_1",
        freePreview: true,
        videoSource: "youtube",
        notes: "Enabling virtualization in BIOS and installing roles."
      }
    ]
  }
];

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully!");

    console.log("Clearing existing courses...");
    await Course.deleteMany({});

    console.log(`Seeding ${courses.length} courses...`);
    await Course.insertMany(courses);
    console.log("✅ Courses seeded successfully!");

  } catch (error) {
    console.error("❌ Seed Error:", error.message);
  } finally {
    try { await mongoose.disconnect(); } catch (e) { }
    process.exit(0);
  }
};

run();
