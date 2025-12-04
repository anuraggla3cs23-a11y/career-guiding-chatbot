const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const restartButton = document.getElementById("restartButton");
const downloadReportButton = document.getElementById("downloadReportButton");
const voiceButton = document.getElementById("voiceButton");

const messageTemplate = document.getElementById("messageTemplate");
const typingTemplate = document.getElementById("typingTemplate");

const STORAGE_KEY = "careerGuideBotSession_v1";

const defaultState = () => ({
    step: "education",
    userData: {
        educationLabel: "",
        educationKey: "",
        interestLabel: "",
        interestKey: "",
        goal: "",
    },
    lastRecommendation: null,
    summary: null,
    history: [],
    completed: false,
});

let conversationState = defaultState();
let typingTimeout = null;
let messageQueue = Promise.resolve();
let recognition = null;
let recognizing = false;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener("start", () => {
        recognizing = true;
        voiceButton.classList.add("voice-active");
    });

    recognition.addEventListener("end", () => {
        recognizing = false;
        voiceButton.classList.remove("voice-active");
    });

    recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript.trim();
        userInput.value = transcript;
        handleSend();
    });
}

const careerMatrix = {
    after10th: {
        science: {
            headline: "Diploma Programs & Science Stream Foundation",
            overview: "Your science interest after 10th keeps doors open for engineering, healthcare, and technology paths.",
            quickPath: "After 10th → Science Stream (PCM/PCB) or Diploma → Specialize → Internships",
            badge: "STEM Explorer",
            careers: [
                {
                    title: "Diploma in Engineering",
                    description: "Hands-on technical education in fields like Mechanical, Electrical, Civil, or Computer Engineering.",
                    qualification: "10th with Science and Mathematics",
                    salary: "₹2.4L – ₹5.5L (entry level)",
                    growth: "High demand in infrastructure, manufacturing, and automation",
                    companies: "L&T, Siemens, Tata Motors, Indian Railways",
                },
                {
                    title: "Science Stream (11th & 12th)",
                    description: "Choose PCB for medical (NEET) or PCM for engineering (JEE) with strong conceptual focus.",
                    qualification: "10th with good Maths/Science foundation",
                    salary: "₹6L – ₹12L (graduate level roles)",
                    growth: "Very High (2025–2035) with AI & Green Tech",
                    companies: "ISRO, DRDO, Infosys, AIIMS",
                },
            ],
            entrySteps: [
                "Select school or polytechnic aligned with your specialization.",
                "Join foundational coaching for JEE/NEET or skills-based diploma workshops.",
                "Build mini-projects or science fair prototypes to showcase ability.",
            ],
            skills: ["Mathematical reasoning", "Physics fundamentals", "Problem-solving", "CAD/Design basics"],
            resources: {
                websites: [
                    { label: "Khan Academy – Science", url: "https://www.khanacademy.org/science" },
                    { label: "BYJU'S Free PCM Lessons", url: "https://byjus.com/free-ias-prep/free-study-material/" },
                    { label: "NPTEL Basics", url: "https://nptel.ac.in/course.html" },
                ],
                youtube: [
                    { label: "Apna College", url: "https://www.youtube.com/c/ApnaCollegeOfficial" },
                    { label: "Vedantu 9&10", url: "https://www.youtube.com/c/Vedantu9and10" },
                ],
                github: [
                    { label: "STEM Project Ideas", url: "https://github.com/academic/awesome-engineering" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        commerce: {
            headline: "Foundation for Finance and Business Careers",
            overview: "Commerce after 10th lets you progress toward accounting, business, finance, or entrepreneurship.",
            quickPath: "After 10th → Commerce Stream or Diploma → Professional Courses",
            badge: "Biz Trailblazer",
            careers: [
                {
                    title: "Diploma in Financial Accounting",
                    description: "Learn bookkeeping, GST, and taxation basics to work in entry-level finance roles.",
                    qualification: "10th with basic math skills",
                    salary: "₹1.8L – ₹3.5L",
                    growth: "Consistent demand in SMEs & startups",
                    companies: "Tally Solutions, H&R Block, Local CA firms",
                },
                {
                    title: "Commerce Stream (11th & 12th)",
                    description: "Build foundations for B.Com, CA, CS, or BBA degrees with business-focused subjects.",
                    qualification: "10th pass",
                    salary: "₹5L – ₹10L (after graduation/professional cert)",
                    growth: "High (FinTech & Digital Business)",
                    companies: "Big4 (EY, Deloitte, PwC, KPMG), Startups",
                },
            ],
            entrySteps: [
                "Choose a school/college with strong commerce faculty.",
                "Start accounting practice with Tally or Zoho Books.",
                "Explore entrepreneurship clubs or junior CEO programs.",
            ],
            skills: ["Bookkeeping", "Business communication", "Analytical thinking", "Spreadsheet proficiency"],
            resources: {
                websites: [
                    { label: "Coursera – Business Foundations", url: "https://www.coursera.org/specializations/wharton-business" },
                    { label: "Investopedia", url: "https://www.investopedia.com/" },
                ],
                youtube: [
                    { label: "CA Rachana Ranade", url: "https://www.youtube.com/c/CARachanaPhadkeRanade" },
                    { label: "Unacademy Commerce", url: "https://www.youtube.com/c/CommerceUnacademy" },
                ],
                github: [
                    { label: "OSSU Business", url: "https://github.com/ossu/business" },
                    { label: "Public Data APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        arts: {
            headline: "Creative & Humanities Launchpad",
            overview: "A love for arts opens opportunities in journalism, design, social sciences, and civil services.",
            quickPath: "After 10th → Arts Stream/Diploma → Skill Projects → Degree",
            badge: "Creative Visionary",
            careers: [
                {
                    title: "Diploma in Graphic/Fashion Design",
                    description: "Develop creative portfolio-ready work for fashion houses or studios.",
                    qualification: "10th pass with portfolio drive",
                    salary: "₹2L – ₹4.5L",
                    growth: "High demand in digital media & apparel",
                    companies: "Fabindia, Myntra, Design studios",
                },
                {
                    title: "Arts Stream (11th & 12th)",
                    description: "Perfect for humanities degrees leading to UPSC, Journalism, Psychology, Social Work.",
                    qualification: "10th pass",
                    salary: "₹6L – ₹12L (post graduation)",
                    growth: "High with EdTech, Social Impact",
                    companies: "BBC, Hindustan Times, UNICEF, Govt. agencies",
                },
            ],
            entrySteps: [
                "Build a creative portfolio (blogs, photography, artwork).",
                "Join debate clubs, Model UN, or art collectives.",
                "Explore internships with local media/design outlets.",
            ],
            skills: ["Storytelling", "Visual design", "Research", "Public speaking"],
            resources: {
                websites: [
                    { label: "Skillshare – Creative Classes", url: "https://www.skillshare.com/" },
                    { label: "Coursera – Arts & Humanities", url: "https://www.coursera.org/browse/arts-and-humanities" },
                ],
                youtube: [
                    { label: "Nas Daily", url: "https://www.youtube.com/c/NasDaily" },
                    { label: "Film Companion", url: "https://www.youtube.com/c/FilmCompanion" },
                ],
                github: [
                    { label: "Creative Coding", url: "https://github.com/terkelg/awesome-creative-coding" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        computer: {
            headline: "Coding & IT Foundations",
            overview: "Start early with computers to get ahead in software, AI, and tech entrepreneurship.",
            quickPath: "After 10th → Diploma/Science with CS → Coding Practice → Projects",
            badge: "Tech Early Bird",
            careers: [
                {
                    title: "Diploma in Computer Science / IT",
                    description: "Gain core software development, networking, and hardware troubleshooting skills.",
                    qualification: "10th with Mathematics",
                    salary: "₹2.8L – ₹6L",
                    growth: "Very High (2025–2035)",
                    companies: "Infosys, Wipro, TCS, Tech startups",
                },
                {
                    title: "Science Stream with Computer Science",
                    description: "Build foundation for B.Tech/BCA with algorithms, programming, and electronics.",
                    qualification: "10th with PCM",
                    salary: "₹7L – ₹14L (post graduation)",
                    growth: "Explosive demand in AI & Cybersecurity",
                    companies: "Google, Microsoft, Zoho, Freshworks",
                },
            ],
            entrySteps: [
                "Learn HTML, CSS, JavaScript basics and publish mini projects.",
                "Participate in coding challenges (HackerRank, Code.org).",
                "Shadow seniors or join local tech clubs.",
            ],
            skills: ["Logical thinking", "Programming fundamentals", "Problem decomposition", "Collaboration"],
            resources: {
                websites: [
                    { label: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
                    { label: "W3Schools", url: "https://www.w3schools.com/" },
                ],
                youtube: [
                    { label: "Apna College", url: "https://www.youtube.com/c/ApnaCollegeOfficial" },
                    { label: "CodeWithHarry", url: "https://www.youtube.com/c/CodeWithHarry" },
                ],
                github: [
                    { label: "OSSU Computer Science", url: "https://github.com/ossu/computer-science" },
                    { label: "Coding Interview University", url: "https://github.com/jwasham/coding-interview-university" },
                ],
            },
        },
        design: {
            headline: "Design Thinking Path",
            overview: "Blend creativity and tech to build a design career in UI/UX, animation, or product design.",
            quickPath: "After 10th → Diploma in Design or Arts → Portfolio → Degree",
            badge: "Design Starter",
            careers: [
                {
                    title: "Diploma in Graphic/UI Design",
                    description: "Learn visual communication, typography, and user experience fundamentals.",
                    qualification: "10th with art/design interest",
                    salary: "₹2.5L – ₹5.5L",
                    growth: "High in product & media companies",
                    companies: "Adobe, Swiggy, Zoho, Digital agencies",
                },
                {
                    title: "Fine Arts & Design Stream",
                    description: "Build portfolio for NID/NIFT or Bachelor of Design degrees.",
                    qualification: "10th pass",
                    salary: "₹6L – ₹12L (post degree)",
                    growth: "High (UX/UI demand)",
                    companies: "UX Studios, BYJU'S, IDEO",
                },
            ],
            entrySteps: [
                "Practice sketching, UI mockups, and design software (Figma).",
                "Participate in Behance/Dribbble challenges.",
                "Attend design bootcamps or workshops.",
            ],
            skills: ["Visual storytelling", "User empathy", "Prototyping", "Software familiarity"],
            resources: {
                websites: [
                    { label: "Interaction Design Foundation", url: "https://www.interaction-design.org/" },
                    { label: "Coursera UI/UX", url: "https://www.coursera.org/specializations/ui-ux-design" },
                ],
                youtube: [
                    { label: "Flux Academy", url: "https://www.youtube.com/c/FluxAcademy" },
                    { label: "CharliMarieTV", url: "https://www.youtube.com/c/CharliMarieTV" },
                ],
                github: [
                    { label: "Awesome Design Systems", url: "https://github.com/alexpate/awesome-design-systems" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        other: {
            headline: "Explore Vocational & Hybrid Paths",
            overview: "Combine your interests with vocational courses for hospitality, sports, agriculture, or entrepreneurship.",
            quickPath: "After 10th → Vocational/Diploma → Certifications → Apprenticeships",
            badge: "Skill Explorer",
            careers: [
                {
                    title: "ITI / Vocational Training",
                    description: "Skill-focused programs in electrical, automotive, culinary, or tourism domains.",
                    qualification: "10th pass",
                    salary: "₹1.8L – ₹4L",
                    growth: "Stable with steady demand",
                    companies: "Marriott, Tata Steel, Local enterprises",
                },
                {
                    title: "Entrepreneurial Start",
                    description: "Start a small venture or service combining passion with business basics.",
                    qualification: "10th pass + mentorship",
                    salary: "Depends on business scale",
                    growth: "Flexible — scale as you grow",
                    companies: "Self-driven",
                },
            ],
            entrySteps: [
                "Identify local training centers or online certifications.",
                "Seek internships/apprenticeships for hands-on exposure.",
                "Build a mentor network via LinkedIn or local events",
            ],
            skills: ["Adaptability", "Customer service", "Financial basics", "Networking"],
            resources: {
                websites: [
                    { label: "Skill India", url: "https://skillindia.nsdcindia.org/" },
                    { label: "Udemy Vocational", url: "https://www.udemy.com/topic/vocational/" },
                ],
                youtube: [
                    { label: "Unacademy", url: "https://www.youtube.com/c/unacademy" },
                    { label: "Khan Academy", url: "https://www.youtube.com/c/khanacademy" },
                ],
                github: [
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
    },
    after12th: {
        science: {
            headline: "Engineering & Medical Gateways",
            overview: "With science after 12th, you can dive into engineering, medicine, research, or emerging tech.",
            quickPath: "After 12th Science → B.Tech/MBBS/BSc → Projects → Internships",
            badge: "STEM Specialist",
            careers: [
                {
                    title: "B.Tech (Computer/AI/Mechanical/Electronics)",
                    description: "Four-year engineering degrees leading to product, research, or innovation roles.",
                    qualification: "12th with PCM, JEE or state entrance",
                    salary: "₹7L – ₹16L",
                    growth: "Very High (AI, Robotics, EVs)",
                    companies: "Google, Tesla, Tata Elxsi, ISRO",
                },
                {
                    title: "MBBS / BDS / B.Pharm",
                    description: "Healthcare roles providing patient care, research, or pharma innovation.",
                    qualification: "12th with PCB, NEET/other exams",
                    salary: "₹8L – ₹20L",
                    growth: "High demand in 2025–2035",
                    companies: "Apollo Hospitals, AIIMS, Fortis, Cipla",
                },
            ],
            entrySteps: [
                "Choose entrance prep (JEE/NEET) with structured schedule.",
                "Join robotics/coding/biology clubs for practical exposure.",
                "Build a project portfolio or research internships early.",
            ],
            skills: ["Analytical thinking", "Lab research", "Coding", "Team collaboration"],
            resources: {
                websites: [
                    { label: "NPTEL Courses", url: "https://nptel.ac.in/course.html" },
                    { label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
                ],
                youtube: [
                    { label: "Physics Wallah", url: "https://www.youtube.com/c/PhysicsWallah" },
                    { label: "Khan Academy", url: "https://www.youtube.com/c/khanacademy" },
                ],
                github: [
                    { label: "OSSU Computer Science", url: "https://github.com/ossu/computer-science" },
                    { label: "Public Health Data", url: "https://github.com/CSSEGISandData/COVID-19" },
                ],
            },
        },
        commerce: {
            headline: "Finance, Management & Analytics",
            overview: "Commerce after 12th sets you up for corporate finance, auditing, startups, or analytics.",
            quickPath: "After 12th Commerce → B.Com/BBA → CA/CS/CMA → Internships",
            badge: "Business Strategist",
            careers: [
                {
                    title: "B.Com / BBA / BMS",
                    description: "Undergraduate programs building strong finance, management, and marketing fundamentals.",
                    qualification: "12th Commerce/Any stream",
                    salary: "₹5L – ₹11L",
                    growth: "High with Digital Business",
                    companies: "Big4, HDFC, Zomato, Startups",
                },
                {
                    title: "CA / CS / CFA",
                    description: "Professional certifications for taxation, company law, and investment roles.",
                    qualification: "12th with strong accounting",
                    salary: "₹8L – ₹18L",
                    growth: "High (Consulting & FinTech)",
                    companies: "JP Morgan, Goldman Sachs, Deloitte",
                },
            ],
            entrySteps: [
                "Pick a degree college with internships and case competitions.",
                "Start learning Excel, Power BI, and financial modelling.",
                "Prepare for CA/CS/Banking exams alongside graduation.",
            ],
            skills: ["Data analysis", "Accounting", "Presentation", "Entrepreneurship"],
            resources: {
                websites: [
                    { label: "Coursera – Financial Markets", url: "https://www.coursera.org/learn/financial-markets-global" },
                    { label: "Harvard Online – Entrepreneurship", url: "https://online.hbs.edu/courses/entrepreneurship-essentials/" },
                ],
                youtube: [
                    { label: "Anushka Rathod", url: "https://www.youtube.com/c/AnushkaRathod" },
                    { label: "CA Study Circle", url: "https://www.youtube.com/c/CAstudy" },
                ],
                github: [
                    { label: "Awesome Finance", url: "https://github.com/antonioaltamura/awesome-finance" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        arts: {
            headline: "Humanities, Media & Public Service",
            overview: "Arts after 12th leads to rich careers in media, psychology, law, civil services, and design thinking.",
            quickPath: "After 12th Arts → BA (Journalism/Psychology/Political Science) → Upskilling → UPSC or Industry",
            badge: "Culture Curator",
            careers: [
                {
                    title: "BA Journalism / Mass Comm",
                    description: "Report, write, produce media content across digital and traditional channels.",
                    qualification: "12th any stream",
                    salary: "₹4L – ₹8L",
                    growth: "High with digital media platforms",
                    companies: "Times of India, NDTV, OTT Startups",
                },
                {
                    title: "BA Psychology / Sociology / Political Science",
                    description: "Foundation for counseling, HR, research, law, or civil services.",
                    qualification: "12th arts preferred",
                    salary: "₹5L – ₹9L",
                    growth: "High in policy, HR, NGOs",
                    companies: "UNICEF, Teach for India, Govt Services, NGOs",
                },
            ],
            entrySteps: [
                "Build a blog or podcast to showcase storytelling.",
                "Join internships with NGOs, media houses, or research labs.",
                "Prepare early for UPSC/competitive exams if interested.",
            ],
            skills: ["Critical thinking", "Empathy", "Public speaking", "Research"],
            resources: {
                websites: [
                    { label: "edX – Journalism", url: "https://www.edx.org/learn/journalism" },
                    { label: "UN Online Courses", url: "https://www.un.org/en/academic-impact/online-education" },
                ],
                youtube: [
                    { label: "Study IQ", url: "https://www.youtube.com/c/StudyIQeducation" },
                    { label: "The Print", url: "https://www.youtube.com/c/theprintindia" },
                ],
                github: [
                    { label: "Civic Tech Resources", url: "https://github.com/codeforamerica" },
                ],
            },
        },
        computer: {
            headline: "Coding, AI & Product Innovation",
            overview: "Tech interest after 12th can lead to software development, data science, AI, or product design.",
            quickPath: "After 12th (CS) → BCA/B.Tech → Projects → Internships → Product roles",
            badge: "Future Technologist",
            careers: [
                {
                    title: "B.Tech / BCA / BSc Computer Science",
                    description: "Deep dive into algorithms, systems, and software engineering.",
                    qualification: "12th with Maths",
                    salary: "₹8L – ₹18L",
                    growth: "Very High (AI, Web3, Cybersecurity)",
                    companies: "Microsoft, Meta, Infosys, Startups",
                },
                {
                    title: "Bachelors + Bootcamps in AI/Data",
                    description: "Blend academia with industry bootcamps to accelerate machine learning skills.",
                    qualification: "12th PCM/CS",
                    salary: "₹9L – ₹22L",
                    growth: "Explosive demand (2025–2035)",
                    companies: "OpenAI partners, Razorpay, Flipkart",
                },
            ],
            entrySteps: [
                "Master DSA via practice (LeetCode, HackerRank).",
                "Build real-world projects and publish on GitHub.",
                "Apply for internships or hackathons every semester.",
            ],
            skills: ["Programming", "Data structures", "System design", "Product thinking"],
            resources: {
                websites: [
                    { label: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
                    { label: "CS50", url: "https://cs50.harvard.edu/x/" },
                ],
                youtube: [
                    { label: "Love Babbar DSA", url: "https://www.youtube.com/c/LoveBabbar" },
                    { label: "Apna College", url: "https://www.youtube.com/c/ApnaCollegeOfficial" },
                ],
                github: [
                    { label: "OSSU Computer Science", url: "https://github.com/ossu/computer-science" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        design: {
            headline: "UI/UX, Animation & Product Styling",
            overview: "Combine creativity and tech to build stunning user experiences and digital products.",
            quickPath: "After 12th → B.Des/NID/NIFT → Live Projects → Design Career",
            badge: "Experience Designer",
            careers: [
                {
                    title: "Bachelor of Design (UI/UX/Product)",
                    description: "Design user-centric digital interfaces for apps, websites, and products.",
                    qualification: "NID/NIFT/UCEED entrance",
                    salary: "₹7L – ₹14L",
                    growth: "High demand across SaaS",
                    companies: "Adobe, Swiggy, Zoho, ServiceNow",
                },
                {
                    title: "Animation & Motion Graphics",
                    description: "Create storytelling visuals for entertainment, education, and marketing.",
                    qualification: "12th any stream + design aptitude",
                    salary: "₹5L – ₹12L",
                    growth: "High (OTT & Gaming)",
                    companies: "Disney, DreamWorks, BYJU'S, Gaming studios",
                },
            ],
            entrySteps: [
                "Develop a design portfolio on Behance/Dribbble.",
                "Master tools: Figma, Adobe XD, Blender.",
                "Collaborate with developers for live projects.",
            ],
            skills: ["User research", "Visual hierarchy", "Motion", "Design systems"],
            resources: {
                websites: [
                    { label: "Interaction Design Foundation", url: "https://www.interaction-design.org/" },
                    { label: "Springboard UX", url: "https://www.springboard.com/" },
                ],
                youtube: [
                    { label: "AJ&Smart", url: "https://www.youtube.com/c/AJSmart" },
                    { label: "DesignCourse", url: "https://www.youtube.com/c/DesignCourse" },
                ],
                github: [
                    { label: "Awesome UX", url: "https://github.com/madhavthaker/awesome-ux" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        other: {
            headline: "Liberal Arts & Cross-Disciplinary Opportunities",
            overview: "Blend streams for hospitality, sports management, event planning, or entrepreneurship.",
            quickPath: "After 12th → Diploma or BA/BBA → Certifications → Internship",
            badge: "Impact Maker",
            careers: [
                {
                    title: "Hotel & Travel Management",
                    description: "Create experiences in tourism, hospitality, and event planning.",
                    qualification: "12th any stream",
                    salary: "₹4L – ₹9L",
                    growth: "High with tourism recovery",
                    companies: "Taj, Marriott, MakeMyTrip, Event agencies",
                },
                {
                    title: "Sports & Fitness Management",
                    description: "Manage teams, academies, or fitness startups.",
                    qualification: "12th with sports interest",
                    salary: "₹5L – ₹10L",
                    growth: "High with wellness boom",
                    companies: "Decathlon, ISL teams, Cult.fit",
                },
            ],
            entrySteps: [
                "Pick a specialization (events, sports, hospitality).",
                "Get certifications (IATA, Sports science).",
                "Network via LinkedIn & professional communities.",
            ],
            skills: ["People skills", "Operations", "Branding", "Problem-solving"],
            resources: {
                websites: [
                    { label: "Udemy Hospitality", url: "https://www.udemy.com/topic/hospitality/" },
                    { label: "Coursera Sports", url: "https://www.coursera.org/courses?query=sports%20management" },
                ],
                youtube: [
                    { label: "Unacademy", url: "https://www.youtube.com/c/unacademy" },
                    { label: "Josh Talks", url: "https://www.youtube.com/c/JoshTalks" },
                ],
                github: [
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
    },
    college: {
        science: {
            headline: "Specialize for Research, Data & Tech",
            overview: "Build domain expertise with postgraduate studies, research labs, or product R&D roles.",
            quickPath: "College Science → Masters/MS → Research/Industry Roles",
            badge: "Innovation Architect",
            careers: [
                {
                    title: "Data Scientist / Analyst",
                    description: "Translate data into insights for business and research decisions.",
                    qualification: "BSc/B.Tech + Python/ML upskilling",
                    salary: "₹10L – ₹24L",
                    growth: "Very High (AI era)",
                    companies: "Google, Fractal, Razorpay",
                },
                {
                    title: "Research Scientist / R&D",
                    description: "Contribute to labs in biotech, physics, or material sciences.",
                    qualification: "Masters/PhD",
                    salary: "₹9L – ₹20L",
                    growth: "High in DeepTech",
                    companies: "DRDO, ISRO, Biocon",
                },
            ],
            entrySteps: [
                "Publish projects/papers from college.",
                "Pursue internships in labs or analytics firms.",
                "Attempt GATE/GRE for higher studies if needed.",
            ],
            skills: ["Statistical modeling", "Programming", "Lab techniques", "Communication"],
            resources: {
                websites: [
                    { label: "Kaggle", url: "https://www.kaggle.com/" },
                    { label: "Coursera – Data Science", url: "https://www.coursera.org/specializations/jhu-data-science" },
                ],
                youtube: [
                    { label: "StatQuest", url: "https://www.youtube.com/c/joshstarmer" },
                    { label: "TensorFlow", url: "https://www.youtube.com/c/tensorflow" },
                ],
                github: [
                    { label: "OSSU Data Science", url: "https://github.com/ossu/data-science" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        commerce: {
            headline: "Professional Certifications & Leadership",
            overview: "Accelerate toward leadership with MBAs, finance certifications, or business analytics.",
            quickPath: "College Commerce → MBA/Professional Cert → Leadership Roles",
            badge: "Growth Leader",
            careers: [
                {
                    title: "Finance & Investment Banking",
                    description: "Manage portfolios, analyze markets, and support high-stakes deals.",
                    qualification: "B.Com/BBA + CFA/FRM",
                    salary: "₹12L – ₹28L",
                    growth: "High with global capital markets",
                    companies: "Goldman Sachs, BlackRock, Kotak",
                },
                {
                    title: "Business Analytics Manager",
                    description: "Use data to guide strategic business decisions.",
                    qualification: "MBA/PGDM + Analytics",
                    salary: "₹10L – ₹24L",
                    growth: "High (every sector needs analytics)",
                    companies: "Amazon, McKinsey, Paytm",
                },
            ],
            entrySteps: [
                "Attempt CAT/GMAT or CFA Level 1.",
                "Join internships in consulting or finance.",
                "Build data projects with Excel, SQL, Tableau.",
            ],
            skills: ["Financial modelling", "Leadership", "Data visualization", "Negotiation"],
            resources: {
                websites: [
                    { label: "Coursera – Business Analytics", url: "https://www.coursera.org/specializations/business-analytics" },
                    { label: "CFA Institute", url: "https://www.cfainstitute.org/" },
                ],
                youtube: [
                    { label: "Ankur Warikoo", url: "https://www.youtube.com/c/warikoo" },
                    { label: "Valuation MasterClass", url: "https://www.youtube.com/c/ValuationMasterClass" },
                ],
                github: [
                    { label: "Awesome Finance", url: "https://github.com/antonioaltamura/awesome-finance" },
                ],
            },
        },
        arts: {
            headline: "Advanced Humanities & Policy",
            overview: "Channel your arts background into policy, UX research, counseling, or creative leadership.",
            quickPath: "College Arts → Masters/Certifications → Impact Roles",
            badge: "Social Innovator",
            careers: [
                {
                    title: "Policy Analyst / Development Sector",
                    description: "Shape public policy and social programs using research and advocacy.",
                    qualification: "BA + Masters in Public Policy/Development",
                    salary: "₹8L – ₹18L",
                    growth: "High with ESG & Govt initiatives",
                    companies: "UNDP, NITI Aayog, PRS Legislative",
                },
                {
                    title: "UX Researcher / Behavioral Scientist",
                    description: "Combine human behavior insights with product development.",
                    qualification: "BA Psychology/Sociology + UX courses",
                    salary: "₹9L – ₹20L",
                    growth: "High (user-centric businesses)",
                    companies: "Google, Swiggy, Deloitte Digital",
                },
            ],
            entrySteps: [
                "Publish research, blogs, or thought pieces.",
                "Volunteer/intern with NGOs or policy think tanks.",
                "Learn UX research tools (Hotjar, Maze).",
            ],
            skills: ["User research", "Data synthesis", "Communication", "Empathy"],
            resources: {
                websites: [
                    { label: "edX Public Policy", url: "https://www.edx.org/learn/public-policy" },
                    { label: "Coursera UX Research", url: "https://www.coursera.org/specializations/ux-research" },
                ],
                youtube: [
                    { label: "BBC Stories", url: "https://www.youtube.com/c/bbcstories" },
                    { label: "Interaction Design", url: "https://www.youtube.com/c/InteractionDesignOrg" },
                ],
                github: [
                    { label: "Civic Tech Projects", url: "https://github.com/codeforamerica" },
                ],
            },
        },
        computer: {
            headline: "Product Engineering & Emerging Tech",
            overview: "Turn your college computer background into high-impact engineering or tech leadership roles.",
            quickPath: "College CS/IT → Projects/Internships → Specialization (AI/Cloud/Product)",
            badge: "Product Engineer",
            careers: [
                {
                    title: "Full Stack Developer / Software Engineer",
                    description: "Build and ship scalable applications across frontend and backend.",
                    qualification: "B.Tech/BCA + portfolio",
                    salary: "₹10L – ₹24L",
                    growth: "Very High (SaaS & AI)",
                    companies: "Amazon, Atlassian, Freshworks",
                },
                {
                    title: "AI/ML Engineer",
                    description: "Design intelligent systems using data, ML models, and APIs.",
                    qualification: "Bachelors + ML specialization",
                    salary: "₹12L – ₹28L",
                    growth: "Explosive (2025–2035)",
                    companies: "NVIDIA, OpenAI partners, Razorpay",
                },
            ],
            entrySteps: [
                "Contribute to open-source and publish GitHub portfolio.",
                "Complete internships or freelancing gigs.",
                "Master cloud platforms (AWS/Azure) and DevOps.",
            ],
            skills: ["DSA", "System design", "Cloud & DevOps", "Product mindset"],
            resources: {
                websites: [
                    { label: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
                    { label: "Frontend Mentor", url: "https://www.frontendmentor.io/" },
                ],
                youtube: [
                    { label: "Tech With Tim", url: "https://www.youtube.com/c/TechWithTim" },
                    { label: "Traversy Media", url: "https://www.youtube.com/c/TraversyMedia" },
                ],
                github: [
                    { label: "Awesome Software Engineering", url: "https://github.com/onceupon/Bash-Oneliner" },
                    { label: "OSSU Computer Science", url: "https://github.com/ossu/computer-science" },
                ],
            },
        },
        design: {
            headline: "Design Leadership & Specialized Tracks",
            overview: "Scale your design career into leadership, research, or entrepreneurship.",
            quickPath: "College Design → Portfolio Refresh → Advanced UX/Product Roles",
            badge: "Design Leader",
            careers: [
                {
                    title: "UX Lead / Product Designer",
                    description: "Own end-to-end design strategy, research, and execution for products.",
                    qualification: "B.Des + experience",
                    salary: "₹12L – ₹28L",
                    growth: "High across tech and startups",
                    companies: "Flipkart, Swiggy, Zoho, Figma",
                },
                {
                    title: "Design Entrepreneur / Consultant",
                    description: "Build your studio or consult with global clients on branding and product.",
                    qualification: "Design degree + business acumen",
                    salary: "Varies (₹10L+ potential)",
                    growth: "High (global demand)",
                    companies: "Self-driven, Freelance",
                },
            ],
            entrySteps: [
                "Refresh portfolio with case study storytelling.",
                "Mentor juniors and lead design sprints.",
                "Learn product analytics & accessibility.",
            ],
            skills: ["Design leadership", "Strategy", "Accessibility", "Business collaboration"],
            resources: {
                websites: [
                    { label: "Design Better", url: "https://www.designbetter.co/" },
                    { label: "UX Mastery", url: "https://uxmastery.com/" },
                ],
                youtube: [
                    { label: "Figma", url: "https://www.youtube.com/c/Figmadesign" },
                    { label: "CharliMarieTV", url: "https://www.youtube.com/c/CharliMarieTV" },
                ],
                github: [
                    { label: "Awesome Design", url: "https://github.com/gztchan/awesome-design" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
        other: {
            headline: "Interdisciplinary & Startup Opportunities",
            overview: "Blend skills across domains to create unique startup or consulting pathways.",
            quickPath: "College Mixed Major → Certifications → Venture/Consulting",
            badge: "Hybrid Maverick",
            careers: [
                {
                    title: "Product Manager",
                    description: "Bridge tech, design, and business to ship impactful products.",
                    qualification: "Any degree + product education",
                    salary: "₹12L – ₹28L",
                    growth: "Very High (Digital economy)",
                    companies: "Google, Razorpay, Zoho, SaaS startups",
                },
                {
                    title: "Startup Founder / Consultant",
                    description: "Build or advise ventures in your passion sector.",
                    qualification: "Any domain expertise + network",
                    salary: "Variable (high upside)",
                    growth: "High — depends on execution",
                    companies: "Self-driven",
                },
            ],
            entrySteps: [
                "Join startup accelerators or entrepreneurship cells.",
                "Build MVPs and validate ideas.",
                "Network with mentors and investors.",
            ],
            skills: ["Product sense", "Networking", "Growth hacking", "Financial modelling"],
            resources: {
                websites: [
                    { label: "Y Combinator Startup School", url: "https://www.startupschool.org/" },
                    { label: "Product School", url: "https://productschool.com/" },
                ],
                youtube: [
                    { label: "a16z", url: "https://www.youtube.com/c/a16z" },
                    { label: "The Futur", url: "https://www.youtube.com/c/thefuturishere" },
                ],
                github: [
                    { label: "Awesome Product Management", url: "https://github.com/dendronhq/awesome-product-management" },
                    { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
                ],
            },
        },
    },
    graduate: {},
};

careerMatrix.graduate = careerMatrix.college;

const fallbackRecommendation = {
    headline: "Discover Diverse Career Directions",
    overview: "Let’s explore hybrid career options based on your strengths and curiosity.",
    quickPath: "Self-assessment → Short Courses → Internships/Projects → Advanced Degree",
    badge: "Path Finder",
    careers: [
        {
            title: "Skill-Focused Diploma or Certification",
            description: "Jump-start your career with focused training in tech, business, or design.",
            qualification: "Flexible entry requirements",
            salary: "₹3L – ₹8L",
            growth: "High when combined with projects",
            companies: "Startups, SMEs, Freelance",
        },
        {
            title: "Project-Based Learning & Internships",
            description: "Build a portfolio demonstrating skills while discovering interests.",
            qualification: "Learn-by-doing",
            salary: "Up to ₹6L (entry)",
            growth: "High with consistent learning",
            companies: "Remote gigs, NGOs, Product teams",
        },
    ],
    entrySteps: [
        "List strengths, passions, and values.",
        "Take short MOOCs and join communities.",
        "Work on cross-disciplinary projects and gather feedback.",
    ],
    skills: ["Curiosity", "Growth mindset", "Networking", "Execution"],
    resources: {
        websites: [
            { label: "Coursera Career Skills", url: "https://www.coursera.org/search?query=career%20development" },
            { label: "All Top Learning", url: "https://alltop.com/learning" },
        ],
        youtube: [
            { label: "Khan Academy", url: "https://www.youtube.com/c/khanacademy" },
            { label: "Josh Talks", url: "https://www.youtube.com/c/JoshTalks" },
        ],
        github: [
            { label: "Public APIs", url: "https://github.com/public-apis/public-apis" },
            { label: "OSSU Computer Science", url: "https://github.com/ossu/computer-science" },
        ],
    },
};

const normalizeEducation = (input) => {
    const text = input.toLowerCase();
    if (/(after|post).*10/.test(text) || /10th|10\s*standard|ssc/.test(text)) {
        return { key: "after10th", label: "After 10th" };
    }
    if (/(after|post).*12/.test(text) || /12th|12\s*standard|hsc/.test(text)) {
        return { key: "after12th", label: "After 12th" };
    }
    if (/college|undergrad|degree|b\.?[a-z]/.test(text)) {
        return { key: "college", label: "College" };
    }
    if (/graduate|postgrad|masters|working/.test(text)) {
        return { key: "graduate", label: "Graduate" };
    }
    return null;
};

const normalizeInterest = (input) => {
    const text = input.toLowerCase();
    if (/science|biology|physics|chemistry|medical|doctor|engineering/.test(text)) {
        return { key: "science", label: "Science" };
    }
    if (/commerce|finance|business|account|economics|management/.test(text)) {
        return { key: "commerce", label: "Commerce" };
    }
    if (/arts|humanities|history|psychology|journalism|civil/.test(text)) {
        return { key: "arts", label: "Arts" };
    }
    if (/computer|coding|programming|software|it|technology/.test(text)) {
        return { key: "computer", label: "Computer Science" };
    }
    if (/design|ui|ux|fashion|graphic|animation/.test(text)) {
        return { key: "design", label: "Design" };
    }
    if (/sports|hospitality|other|undecided|not sure|general/.test(text)) {
        return { key: "other", label: "Other/Hybrid" };
    }
    return null;
};

const formatTime = (date = new Date()) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const scrollToBottom = () => {
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
};

const saveConversation = () => {
    const payload = JSON.stringify(conversationState);
    localStorage.setItem(STORAGE_KEY, payload);
};

const clearConversationStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
};

const createMessageElement = (sender, content, isHTML = false, timestamp = new Date()) => {
    const clone = messageTemplate.content.firstElementChild.cloneNode(true);
    const bubble = clone.querySelector(".bubble");
    const timeEl = clone.querySelector(".timestamp");

    clone.classList.add(sender === "bot" ? "bot-message" : "user-message");

    if (isHTML) {
        bubble.innerHTML = content;
    } else {
        bubble.textContent = content;
    }
    timeEl.textContent = formatTime(timestamp);

    return clone;
};

const addMessageToHistory = (sender, content, isHTML = false) => {
    conversationState.history.push({ sender, content, isHTML, timestamp: new Date().toISOString() });
    saveConversation();
};

const addMessage = (sender, content, options = {}) => {
    const { isHTML = false, save = true, timestamp = new Date() } = options;
    const messageEl = createMessageElement(sender, content, isHTML, new Date(timestamp));
    chatWindow.appendChild(messageEl);
    scrollToBottom();

    if (save) {
        addMessageToHistory(sender, content, isHTML);
    }
};

const showTypingIndicator = (duration = 800) => {
    const indicator = typingTemplate.content.firstElementChild.cloneNode(true);
    chatWindow.appendChild(indicator);
    scrollToBottom();

    return new Promise((resolve) => {
        typingTimeout = setTimeout(() => {
            indicator.remove();
            resolve();
        }, duration);
    });
};

const queueBotMessage = (content, options = {}) => {
    const { delay = 900, isHTML = false } = options;
    messageQueue = messageQueue.then(() => showTypingIndicator(delay)).then(() => {
        addMessage("bot", content, { isHTML });
    });
    return messageQueue;
};

const restoreConversation = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return false;
    }
    try {
        const parsed = JSON.parse(saved);
        conversationState = {
            ...defaultState(),
            ...parsed,
            history: parsed.history || [],
        };

        chatWindow.innerHTML = "";
        conversationState.history.forEach((msg) => {
            addMessage(msg.sender, msg.content, {
                isHTML: msg.isHTML,
                save: false,
                timestamp: msg.timestamp,
            });
        });
        scrollToBottom();
        return true;
    } catch (error) {
        console.error("Failed to restore conversation", error);
        conversationState = defaultState();
        clearConversationStorage();
        return false;
    }
};

const greetUser = async () => {
    await queueBotMessage("👋 Hi there! I’m your Career Guide Bot. Let’s find your perfect career path!");
    await queueBotMessage("What is your current education level? (After 10th / After 12th / College / Graduate)");
    conversationState.step = "education";
    saveConversation();
};

const askInterest = async () => {
    await queueBotMessage("Which subject or area do you enjoy the most? (Science / Commerce / Arts / Computer / Design / Other)");
    conversationState.step = "interest";
    saveConversation();
};

const askGoal = async () => {
    await queueBotMessage("Awesome! What future goal or dream role are you aiming for? (Eg. Doctor, Startup founder, Designer)");
    conversationState.step = "goal";
    saveConversation();
};

const askMoreInfo = async () => {
    await queueBotMessage("Would you like to know how to enter this field or what skills you need? (yes/no)");
    conversationState.step = "moreInfoPrompt";
    saveConversation();
};

const shareResources = async (data) => {
    const sections = [];

    const createList = (items) =>
        items
            .map((item) => `<li><a href="${item.url}" target="_blank" rel="noopener">${item.label}</a></li>`)
            .join("");

    if (data.resources?.websites?.length) {
        sections.push(`
            <div class="resource-section">
                <h4>📚 Websites</h4>
                <ul>${createList(data.resources.websites)}</ul>
            </div>
        `);
    }
    if (data.resources?.youtube?.length) {
        sections.push(`
            <div class="resource-section">
                <h4>🎥 YouTube Channels</h4>
                <ul>${createList(data.resources.youtube)}</ul>
            </div>
        `);
    }
    if (data.resources?.github?.length) {
        sections.push(`
            <div class="resource-section">
                <h4>💻 GitHub Repositories</h4>
                <ul>${createList(data.resources.github)}</ul>
            </div>
        `);
    }

    await queueBotMessage(
        `<strong>📚 Study Materials & Practice Links for you:</strong>${sections.join("")}`,
        { isHTML: true }
    );

    conversationState.step = "summary";
    saveConversation();
};

const buildCareerHTML = (data) => {
    const cards = data.careers
        .map(
            (career) => `
            <div class="summary-card">
                <h3>${career.title}</h3>
                <div>${career.description}</div>
                <ul>
                    <li><strong>Qualification:</strong> ${career.qualification}</li>
                    <li><strong>Average Salary:</strong> ${career.salary}</li>
                    <li><strong>Growth:</strong> ${career.growth}</li>
                    <li><strong>Companies:</strong> ${career.companies}</li>
                </ul>
            </div>
        `
        )
        .join("");

    return `
        <strong>🚀 Career Directions for you:</strong>
        <div class="badge"><i class="fas fa-compass"></i> ${data.badge}</div>
        <p><strong>${data.headline}</strong></p>
        <p>${data.overview}</p>
        <p><span class="status-pill"><i class="fas fa-route"></i> Path:</span> ${data.quickPath}</p>
        ${cards}
    `;
};

const buildEntryHTML = (data) => {
    const steps = data.entrySteps.map((step) => `<li>${step}</li>`).join("");
    const skills = data.skills.map((skill) => `<li>${skill}</li>`).join("");

    return `
        <strong>🛠️ How to get started & Skills checklist:</strong>
        <div class="summary-card">
            <div>
                <h3>Entry Roadmap</h3>
                <ul>${steps}</ul>
            </div>
            <div>
                <h3>Skill Focus</h3>
                <ul>${skills}</ul>
            </div>
        </div>
    `;
};

const buildSummaryHTML = (data, userData) => {
    const focusCareer = data.careers[0];
    const bulletPoints = [
        `🎓 Path: ${data.quickPath}`,
        `💼 Job Opportunities: ${focusCareer.companies}`,
        `📈 Growth: ${focusCareer.growth}`,
        `🎯 Your Goal: ${userData.goal || "Keep exploring!"}`,
        `📚 Learn: ${data.resources.websites?.[0]?.label || "Key e-learning platforms"}`,
        `💻 Practice: ${data.resources.github?.[0]?.url || "Build small projects"}`,
    ];

    const list = bulletPoints.map((item) => `<li>${item}</li>`).join("");

    return `
        <strong>✨ Career Blueprint Summary:</strong>
        <div class="summary-card">
            <h3>${focusCareer.title}</h3>
            <ul>${list}</ul>
        </div>
    `;
};

const getCareerRecommendation = (educationKey, interestKey) => {
    const group = careerMatrix[educationKey] || {};
    return group[interestKey] || fallbackRecommendation;
};

const presentRecommendation = async () => {
    const { educationKey, interestKey } = conversationState.userData;
    const recommendation = getCareerRecommendation(educationKey, interestKey);

    conversationState.lastRecommendation = recommendation;
    saveConversation();

    await queueBotMessage(buildCareerHTML(recommendation), { isHTML: true, delay: 1000 });
    await askMoreInfo();
};

const finalizeSummary = async () => {
    const data = conversationState.lastRecommendation || fallbackRecommendation;
    const summaryHtml = buildSummaryHTML(data, conversationState.userData);
    conversationState.summary = summaryHtml;
    conversationState.completed = true;
    conversationState.step = "complete";
    saveConversation();
    await queueBotMessage(summaryHtml, { isHTML: true, delay: 800 });
    await queueBotMessage("Need another plan? Hit restart to explore a new combination anytime!", { delay: 700 });
};

const handleEducationStep = async (text) => {
    const normalized = normalizeEducation(text);
    if (!normalized) {
        await queueBotMessage("I didn’t catch that. Please choose: After 10th, After 12th, College, or Graduate.");
        return;
    }
    conversationState.userData.educationKey = normalized.key;
    conversationState.userData.educationLabel = normalized.label;
    conversationState.step = "interest";
    saveConversation();
    await queueBotMessage(`Great! ${normalized.label} it is.`);
    await askInterest();
};

const handleInterestStep = async (text) => {
    const normalized = normalizeInterest(text);
    if (!normalized) {
        await queueBotMessage(
            "Could you tell me which subject inspires you? Choose from Science, Commerce, Arts, Computer, Design, or Other."
        );
        return;
    }
    conversationState.userData.interestKey = normalized.key;
    conversationState.userData.interestLabel = normalized.label;
    conversationState.step = "goal";
    saveConversation();
    await queueBotMessage(`Love it! ${normalized.label} has amazing opportunities.`);
    await askGoal();
};

const handleGoalStep = async (text) => {
    conversationState.userData.goal = text.trim();
    conversationState.step = "recommendation";
    saveConversation();
    await queueBotMessage("Got it! Let me match a career path for you...", { delay: 900 });
    await presentRecommendation();
};

const handleMoreInfoStep = async (text) => {
    const answer = text.toLowerCase();
    const wantsMore = /(yes|sure|ok|please|yea|yeah)/.test(answer);
    if (wantsMore) {
        const data = conversationState.lastRecommendation || fallbackRecommendation;
        await queueBotMessage(buildEntryHTML(data), { isHTML: true, delay: 900 });
    } else {
        await queueBotMessage("No worries! Here are some curated resources to keep you moving.");
    }
    conversationState.step = "resources";
    saveConversation();

    const data = conversationState.lastRecommendation || fallbackRecommendation;
    await shareResources(data);
    await finalizeSummary();
};

const handleSummaryStep = async (text) => {
    await queueBotMessage("If you want to explore another path, tap restart. I’m always here!");
};

const handleUserInput = async (text) => {
    addMessage("user", text);

    switch (conversationState.step) {
        case "education":
            await handleEducationStep(text);
            break;
        case "interest":
            await handleInterestStep(text);
            break;
        case "goal":
            await handleGoalStep(text);
            break;
        case "recommendation":
        case "moreInfoPrompt":
            await handleMoreInfoStep(text);
            break;
        case "resources":
        case "summary":
        case "complete":
        default:
            await handleSummaryStep(text);
            break;
    }
};

const handleSend = () => {
    const value = userInput.value.trim();
    if (!value) {
        return;
    }
    userInput.value = "";
    handleUserInput(value);
};

sendButton.addEventListener("click", handleSend);
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
});

restartButton.addEventListener("click", () => {
    clearConversationStorage();
    conversationState = defaultState();
    chatWindow.innerHTML = "";
    greetUser();
});

downloadReportButton.addEventListener("click", () => {
    if (!conversationState?.lastRecommendation) {
        queueBotMessage("Let’s finish your plan first, then I’ll prepare the report!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const { userData, lastRecommendation } = conversationState;

    const lines = [
        "Smart Career Guidance Report",
        "",
        `Education Level: ${userData.educationLabel || "Not specified"}`,
        `Interest Area: ${userData.interestLabel || "Not specified"}`,
        `Goal: ${userData.goal || "Not specified"}`,
        "",
        `Headline: ${lastRecommendation.headline}`,
        `Overview: ${lastRecommendation.overview}`,
        `Path: ${lastRecommendation.quickPath}`,
        "",
        "Suggested Careers:",
    ];

    lastRecommendation.careers.forEach((career, index) => {
        lines.push(` ${index + 1}. ${career.title}`);
        lines.push(`    Description: ${career.description}`);
        lines.push(`    Qualification: ${career.qualification}`);
        lines.push(`    Salary: ${career.salary}`);
        lines.push(`    Growth: ${career.growth}`);
        lines.push(`    Companies: ${career.companies}`);
        lines.push("");
    });

    lines.push("Entry Steps:");
    lastRecommendation.entrySteps.forEach((step, index) => {
        lines.push(` ${index + 1}. ${step}`);
    });

    lines.push("");
    lines.push("Key Skills:");
    lastRecommendation.skills.forEach((skill) => lines.push(` - ${skill}`));

    lines.push("");
    lines.push("Resources:");
    const res = lastRecommendation.resources;
    if (res.websites?.length) {
        lines.push(" Websites:");
        res.websites.forEach((item) => lines.push(`  - ${item.label}: ${item.url}`));
    }
    if (res.youtube?.length) {
        lines.push(" YouTube:");
        res.youtube.forEach((item) => lines.push(`  - ${item.label}: ${item.url}`));
    }
    if (res.github?.length) {
        lines.push(" GitHub:");
        res.github.forEach((item) => lines.push(`  - ${item.label}: ${item.url}`));
    }

    let offsetY = 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Smart Career Guidance Report", 10, offsetY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    offsetY += 8;

    const wrapped = doc.splitTextToSize(lines.slice(2).join("\n"), 185);
    doc.text(wrapped, 10, offsetY);

    doc.save("career-guidance-report.pdf");
});

if (recognition) {
    voiceButton.addEventListener("click", () => {
        if (recognizing) {
            recognition.stop();
            return;
        }
        try {
            recognition.start();
        } catch (err) {
            console.error("Voice recognition error", err);
        }
    });
} else {
    voiceButton.disabled = true;
    voiceButton.title = "Voice input is not supported in this browser.";
}

window.addEventListener("load", () => {
    const restored = restoreConversation();
    if (!restored || conversationState.history.length === 0) {
        greetUser();
    } else if (!conversationState.completed) {
        const pendingStep = conversationState.step;
        switch (pendingStep) {
            case "education":
                queueBotMessage("Let’s continue! What is your current education level? (After 10th / After 12th / College / Graduate)");
                break;
            case "interest":
                queueBotMessage("Which subject or area excites you most right now?");
                break;
            case "goal":
                queueBotMessage("Share your dream role so I can fine-tune the plan.");
                break;
            case "moreInfoPrompt":
                queueBotMessage("Would you like more details on entering this field? (yes/no)");
                break;
            default:
                queueBotMessage("I’m here if you’d like to keep exploring or ask new questions!");
                break;
        }
    }
});
