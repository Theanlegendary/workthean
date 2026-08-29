/* ==========================================================================
   FREELANCER / VIETNAM RECRUITMENT MARKETPLACE - CENTRAL DATA STORE
   ========================================================================== */

const initialProjects = [
  {
    id: "prj-100",
    title: "Senior Backend Engineer (Java / Spring Boot)",
    hot: true,
    company: "FPT Software",
    location: "Hà Nội (Cầu Giấy)",
    timeAgo: "2 giờ trước",
    applicantsCount: 14,
    salaryDisplay: "25 – 45 triệu/tháng",
    workType: "Toàn thời gian",
    logoType: "FPT",
    category: "web-dev",
    type: "Full-Time",
    jobType: "Chính thức",
    budgetMin: 1200,
    budgetMax: 2200,
    avgBid: 1600,
    description: "FPT Software tìm kiếm Senior Backend Engineer có kinh nghiệm thiết kế kiến trúc Microservices, làm việc với Java Core, Spring Boot, Kafka, Redis và cơ sở dữ liệu PostgreSQL / Oracle. Tham gia trực tiếp dự án chuyển đổi số ngân hàng quy mô lớn.",
    skills: ["Java", "Spring Boot", "Microservices", "Kafka", "PostgreSQL", "Docker", "Redis"],
    postedDate: "Đăng 2 giờ trước",
    timeLeft: "Còn 15 ngày",
    bidsCount: 14,
    clientName: "FPT Software Recruitment",
    clientRating: 4.9,
    clientReviews: 128,
    clientCountry: "Hà Nội, Việt Nam",
    clientVerified: true,
    clientSpent: "100+ vị trí đã tuyển",
    clientMemberSince: "Năm 2018",
    clientHireRate: "96%",
    featured: true,
    milestones: [
      { desc: "Thiết kế kiến trúc Core Module & API Gateway", amount: 1500 },
      { desc: "Tích hợp Kafka Streaming & Message Queue", amount: 2500 },
      { desc: "Triển khai CI/CD Kubernetes & Performance Tuning", amount: 1200 }
    ],
    bids: [
      { freelancerName: "Nguyễn Văn Tuấn", avatarBg: "linear-gradient(135deg, #0083c9, #00b2ff)", avatarText: "NT", country: "Hà Nội", rating: 5.0, reviewsCount: 42, amount: 1500, days: 30, pitch: "6+ năm kinh nghiệm Java/Spring Boot ngân hàng số.", timeAgo: "1 giờ trước" },
      { freelancerName: "Lê Hoàng Long", avatarBg: "linear-gradient(135deg, #7c3aed, #c084fc)", avatarText: "LL", country: "Hà Nội", rating: 4.95, reviewsCount: 28, amount: 1800, days: 30, pitch: "Chuyên gia Microservices và Kafka hiệu năng cao.", timeAgo: "30 phút trước" }
    ]
  },
  {
    id: "prj-101",
    title: "Chuyên Viên Phân Tích Dữ Liệu & AI Solution Architect",
    hot: true,
    company: "Ngân Hàng Vietcombank",
    location: "Hà Nội (Hoàn Kiếm)",
    timeAgo: "4 giờ trước",
    applicantsCount: 22,
    salaryDisplay: "35 – 65 triệu/tháng",
    workType: "Toàn thời gian",
    logoType: "VCB",
    category: "ai-ml",
    type: "Full-Time",
    jobType: "Chính thức",
    budgetMin: 1800,
    budgetMax: 3000,
    avgBid: 2400,
    description: "Khối Công nghệ Thông tin Vietcombank tuyển dụng Chuyên viên Phân tích Dữ liệu lớn & AI Solution Architect chịu trách nhiệm phát triển mô hình chấm điểm tín dụng AI, phát hiện gian lận giao dịch thẻ và tối ưu hóa hệ thống Data Lakehouse.",
    skills: ["Python", "Machine Learning", "PyTorch", "Spark", "Data Lakehouse", "SQL", "FastAPI"],
    postedDate: "Đăng 4 giờ trước",
    timeLeft: "Còn 20 ngày",
    bidsCount: 22,
    clientName: "Ngân Hàng TMCP Ngoại Thương Việt Nam",
    clientRating: 5.0,
    clientReviews: 84,
    clientCountry: "Hà Nội, Việt Nam",
    clientVerified: true,
    clientSpent: "Hàng đầu ngành Ngân hàng",
    clientMemberSince: "Năm 2016",
    clientHireRate: "98%",
    featured: true,
    milestones: [
      { desc: "Phân tích Data Pipeline & Feature Engineering", amount: 1800 },
      { desc: "Phát triển mô hình AI Credit Scoring", amount: 2600 }
    ],
    bids: [
      { freelancerName: "Phạm Quốc Anh", avatarBg: "linear-gradient(135deg, #10b981, #34d399)", avatarText: "QA", country: "Hà Nội", rating: 5.0, reviewsCount: 35, amount: 2200, days: 30, pitch: "Thạc sĩ Khoa học Dữ liệu 7 năm kinh nghiệm FinTech.", timeAgo: "2 giờ trước" }
    ]
  },
  {
    id: "prj-102",
    title: "Lead Frontend React / Next.js Developer",
    hot: false,
    company: "Tập Đoàn Vingroup (VinFast Digital)",
    location: "Hà Nội / Hải Phòng",
    timeAgo: "6 giờ trước",
    applicantsCount: 18,
    salaryDisplay: "30 – 55 triệu/tháng",
    workType: "Toàn thời gian / Linh hoạt",
    logoType: "VIN",
    category: "web-dev",
    type: "Full-Time",
    jobType: "Chính thức",
    budgetMin: 1500,
    budgetMax: 2500,
    avgBid: 2000,
    description: "Phát triển hệ thống web ứng dụng quản trị xe điện thông minh (Smart EV Dashboard), tối ưu trải nghiệm khách hàng toàn cầu và xây dựng Design System đồng nhất bằng React 18, Next.js 14, TypeScript và TailwindCSS.",
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "WebSockets"],
    postedDate: "Đăng 6 giờ trước",
    timeLeft: "Còn 12 ngày",
    bidsCount: 18,
    clientName: "VinFast Trading & Service",
    clientRating: 4.95,
    clientReviews: 95,
    clientCountry: "Hà Nội, Việt Nam",
    clientVerified: true,
    clientSpent: "Doanh nghiệp toàn cầu",
    clientMemberSince: "Năm 2019",
    clientHireRate: "95%",
    featured: true,
    milestones: [
      { desc: "Xây dựng Component Library & Next.js Setup", amount: 1500 },
      { desc: "Dashboard Telemetry xe thông minh", amount: 2000 }
    ],
    bids: [
      { freelancerName: "Trần Minh Quang", avatarBg: "linear-gradient(135deg, #0083c9, #00b2ff)", avatarText: "MQ", country: "Hà Nội", rating: 4.95, reviewsCount: 52, amount: 2000, days: 30, pitch: "Senior Frontend Lead 8 năm kinh nghiệm React/Next.js.", timeAgo: "4 giờ trước" }
    ]
  },
  {
    id: "prj-103",
    title: "Senior Mobile Flutter / iOS Engineer",
    hot: true,
    company: "Tập Đoàn Viettel (Viettel Digital)",
    location: "Hà Nội & TP. Hồ Chí Minh",
    timeAgo: "1 ngày trước",
    applicantsCount: 31,
    salaryDisplay: "28 – 50 triệu/tháng",
    workType: "Toàn thời gian",
    logoType: "VTL",
    category: "mobile-apps",
    type: "Full-Time",
    jobType: "Chính thức",
    budgetMin: 1400,
    budgetMax: 2400,
    avgBid: 1900,
    description: "Tham gia phát triển hệ sinh thái ứng dụng tài chính số Viettel Money phục vụ hàng chục triệu người dùng. Yêu cầu chuyên sâu về Flutter, Swift, tối ưu hóa hiệu năng và bảo mật thanh toán chuẩn quốc tế.",
    skills: ["Flutter", "Dart", "Swift", "iOS", "Android", "CI/CD", "Security"],
    postedDate: "Đăng 1 ngày trước",
    timeLeft: "Còn 25 ngày",
    bidsCount: 31,
    clientName: "Tổng Công Ty Dịch Vụ Số Viettel",
    clientRating: 4.9,
    clientReviews: 110,
    clientCountry: "Việt Nam",
    clientVerified: true,
    clientSpent: "Tập đoàn công nghệ quốc gia",
    clientMemberSince: "Năm 2015",
    clientHireRate: "97%",
    featured: false,
    milestones: [
      { desc: "Payment Gateway Integration & Encryption", amount: 2000 },
      { desc: "Biometric KYC & Core Mobile UI", amount: 2500 }
    ],
    bids: [
      { freelancerName: "Vũ Đình Nam", avatarBg: "linear-gradient(135deg, #7c3aed, #c084fc)", avatarText: "DN", country: "TP.HCM", rating: 5.0, reviewsCount: 40, amount: 1900, days: 30, pitch: "Từng lead phát triển 3 ứng dụng Fintech top store.", timeAgo: "1 ngày trước" }
    ]
  }
];

const initialFreelancers = [
  {
    id: "fl-1",
    name: "Elena Rostova",
    title: "Senior Full-Stack Software Architect",
    avatarBg: "linear-gradient(135deg, #0083c9, #00b2ff)",
    avatarText: "ER",
    photoUrl: "images/elena.jpg",
    hourlyRate: 65,
    rating: 5.0,
    reviewsCount: 142,
    successRate: 100,
    completedJobs: 84,
    country: "Tallinn, Estonia",
    tagline: "Building resilient Web architectures & high-scale Next.js systems.",
    bio: "Full-stack software architect with 9+ years of experience specializing in React, Next.js, Node.js, and cloud backend microservices. I deliver clean, production-ready code with complete milestone transparency.",
    skills: ["Next.js", "React.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"]
  },
  {
    id: "fl-2",
    name: "Marcus Vance",
    title: "Lead Mobile & IoT Software Engineer",
    avatarBg: "linear-gradient(135deg, #7c3aed, #c084fc)",
    avatarText: "MV",
    photoUrl: "images/marcus.jpg",
    hourlyRate: 75,
    rating: 4.95,
    reviewsCount: 98,
    successRate: 99,
    completedJobs: 62,
    country: "Berlin, Germany",
    tagline: "Cross-platform mobile apps with native performance & Bluetooth sync.",
    bio: "Mobile systems specialist with expertise in Flutter, React Native, Swift, and Kotlin. Shipped over 25 commercial apps to global app stores.",
    skills: ["Flutter", "Dart", "iOS", "Android", "React Native", "Bluetooth LE"]
  },
  {
    id: "fl-3",
    name: "Sophie Dupont",
    title: "AI Research & RAG Systems Architect",
    avatarBg: "linear-gradient(135deg, #10b981, #34d399)",
    avatarText: "SD",
    photoUrl: "images/sophie.jpg",
    hourlyRate: 85,
    rating: 5.0,
    reviewsCount: 76,
    successRate: 100,
    completedJobs: 45,
    country: "Paris, France",
    tagline: "Custom Enterprise AI models, LLM Fine-Tuning & Vector Pipelines.",
    bio: "AI Engineer specializing in Large Language Models, Pinecone vector stores, LangChain frameworks, and Python microservices.",
    skills: ["Python", "OpenAI API", "PyTorch", "LangChain", "FastAPI", "Pinecone"]
  }
];

const initialCategories = [
  { id: "web-dev", name: "Websites, IT & Software", count: 4820 },
  { id: "mobile-apps", name: "Mobile Apps & Devices", count: 2940 },
  { id: "ai-ml", name: "AI, Machine Learning & Data", count: 1850 },
  { id: "recruitment", name: "Direct Recruitment Roles", count: 1240 },
  { id: "design", name: "Design, Media & UI/UX", count: 3100 },
  { id: "writing", name: "Technical Writing & Specs", count: 950 }
];

const initialNotifications = [
  { id: "n-1", text: "Elena Rostova submitted a proposal bid on your Next.js E-Commerce project.", time: "10m ago", unread: true },
  { id: "n-2", text: "Escrow Deposit Confirmed: $3,500 locked in Milestone Vault.", time: "1h ago", unread: true }
];

const initialChatThreads = [
  {
    id: "chat-1",
    freelancerId: "fl-1",
    freelancerName: "Elena Rostova",
    avatarText: "ER",
    messages: [
      { sender: "them", text: "Hello! I reviewed your project specification and I am ready to start immediately.", time: "10:14 AM" },
      { sender: "me", text: "Hi Elena! Great to hear. All milestone funds are secured in escrow.", time: "10:16 AM" }
    ]
  }
];
