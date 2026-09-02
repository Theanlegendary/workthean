const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data_store.json');

// Initial Data Seed
const defaultData = {
  "projects": [
    {
      "id": "prj-100",
      "title": "Senior Backend Engineer (Java / Spring Boot)",
      "hot": true,
      "company": "FPT Software",
      "location": "Hà Nội (Cầu Giấy)",
      "timeAgo": "2 giờ trước",
      "applicantsCount": 14,
      "salaryDisplay": "25 – 45 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "FPT",
      "logoUrl": "images/brands/fpt.svg",
      "category": "web-dev",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 1200,
      "budgetMax": 2200,
      "avgBid": 1600,
      "description": "FPT Software tìm kiếm Senior Backend Engineer có kinh nghiệm thiết kế kiến trúc Microservices, làm việc với Java Core, Spring Boot, Kafka, Redis và cơ sở dữ liệu PostgreSQL / Oracle. Tham gia trực tiếp dự án chuyển đổi số ngân hàng quy mô lớn.",
      "skills": [
        "Java",
        "Spring Boot",
        "Microservices",
        "Kafka",
        "PostgreSQL",
        "Docker",
        "Redis"
      ],
      "postedDate": "Đăng 2 giờ trước",
      "timeLeft": "Còn 15 ngày",
      "bidsCount": 14,
      "clientName": "FPT Software Recruitment",
      "clientRating": 4.9,
      "clientReviews": 128,
      "clientCountry": "Hà Nội, Việt Nam",
      "clientVerified": true,
      "clientSpent": "100+ vị trí đã tuyển",
      "clientMemberSince": "Năm 2018",
      "clientHireRate": "96%",
      "featured": true,
      "milestones": [
        {
          "desc": "Thiết kế kiến trúc Core Module & API Gateway",
          "amount": 1500
        },
        {
          "desc": "Tích hợp Kafka Streaming & Message Queue",
          "amount": 2500
        },
        {
          "desc": "Triển khai CI/CD Kubernetes & Performance Tuning",
          "amount": 1200
        }
      ],
      "bids": [
        {
          "freelancerName": "Nguyễn Văn Tuấn",
          "avatarBg": "linear-gradient(135deg, #0083c9, #00b2ff)",
          "avatarText": "NT",
          "country": "Hà Nội",
          "rating": 5,
          "reviewsCount": 42,
          "amount": 1500,
          "days": 30,
          "pitch": "6+ năm kinh nghiệm Java/Spring Boot ngân hàng số.",
          "timeAgo": "1 giờ trước"
        },
        {
          "freelancerName": "Lê Hoàng Long",
          "avatarBg": "linear-gradient(135deg, #7c3aed, #c084fc)",
          "avatarText": "LL",
          "country": "Hà Nội",
          "rating": 4.95,
          "reviewsCount": 28,
          "amount": 1800,
          "days": 30,
          "pitch": "Chuyên gia Microservices và Kafka hiệu năng cao.",
          "timeAgo": "30 phút trước"
        }
      ]
    },
    {
      "id": "prj-101",
      "title": "Chuyên Viên Phân Tích Dữ Liệu & AI Solution Architect",
      "hot": true,
      "company": "Ngân Hàng Vietcombank",
      "location": "Hà Nội (Hoàn Kiếm)",
      "timeAgo": "4 giờ trước",
      "applicantsCount": 22,
      "salaryDisplay": "35 – 65 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "VCB",
      "logoUrl": "images/brands/vcb.svg",
      "category": "ai-ml",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 1800,
      "budgetMax": 3000,
      "avgBid": 2400,
      "description": "Khối Công nghệ Thông tin Vietcombank tuyển dụng Chuyên viên Phân tích Dữ liệu lớn & AI Solution Architect chịu trách nhiệm phát triển mô hình chấm điểm tín dụng AI, phát hiện gian lận giao dịch thẻ và tối ưu hóa hệ thống Data Lakehouse.",
      "skills": [
        "Python",
        "Machine Learning",
        "PyTorch",
        "Spark",
        "Data Lakehouse",
        "SQL",
        "FastAPI"
      ],
      "postedDate": "Đăng 4 giờ trước",
      "timeLeft": "Còn 20 ngày",
      "bidsCount": 22,
      "clientName": "Ngân Hàng TMCP Ngoại Thương Việt Nam",
      "clientRating": 5,
      "clientReviews": 84,
      "clientCountry": "Hà Nội, Việt Nam",
      "clientVerified": true,
      "clientSpent": "Hàng đầu ngành Ngân hàng",
      "clientMemberSince": "Năm 2016",
      "clientHireRate": "98%",
      "featured": true,
      "milestones": [
        {
          "desc": "Phân tích Data Pipeline & Feature Engineering",
          "amount": 1800
        },
        {
          "desc": "Phát triển mô hình AI Credit Scoring",
          "amount": 2600
        }
      ],
      "bids": [
        {
          "freelancerName": "Phạm Quốc Anh",
          "avatarBg": "linear-gradient(135deg, #10b981, #34d399)",
          "avatarText": "QA",
          "country": "Hà Nội",
          "rating": 5,
          "reviewsCount": 35,
          "amount": 2200,
          "days": 30,
          "pitch": "Thạc sĩ Khoa học Dữ liệu 7 năm kinh nghiệm FinTech.",
          "timeAgo": "2 giờ trước"
        }
      ]
    },
    {
      "id": "prj-102",
      "title": "Lead Frontend React / Next.js Developer",
      "hot": false,
      "company": "Tập Đoàn Vingroup (VinFast Digital)",
      "location": "Hà Nội / Hải Phòng",
      "timeAgo": "6 giờ trước",
      "applicantsCount": 18,
      "salaryDisplay": "30 – 55 triệu/tháng",
      "workType": "Toàn thời gian / Linh hoạt",
      "logoType": "VIN",
      "logoUrl": "images/brands/vinfast.svg",
      "category": "web-dev",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 1500,
      "budgetMax": 2500,
      "avgBid": 2000,
      "description": "Phát triển hệ thống web ứng dụng quản trị xe điện thông minh (Smart EV Dashboard), tối ưu trải nghiệm khách hàng toàn cầu và xây dựng Design System đồng nhất bằng React 18, Next.js 14, TypeScript và TailwindCSS.",
      "skills": [
        "React.js",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Redux Toolkit",
        "WebSockets"
      ],
      "postedDate": "Đăng 6 giờ trước",
      "timeLeft": "Còn 12 ngày",
      "bidsCount": 18,
      "clientName": "VinFast Trading & Service",
      "clientRating": 4.95,
      "clientReviews": 95,
      "clientCountry": "Hà Nội, Việt Nam",
      "clientVerified": true,
      "clientSpent": "Doanh nghiệp toàn cầu",
      "clientMemberSince": "Năm 2019",
      "clientHireRate": "95%",
      "featured": true,
      "milestones": [
        {
          "desc": "Xây dựng Component Library & Next.js Setup",
          "amount": 1500
        },
        {
          "desc": "Dashboard Telemetry xe thông minh",
          "amount": 2000
        }
      ],
      "bids": [
        {
          "freelancerName": "Trần Minh Quang",
          "avatarBg": "linear-gradient(135deg, #0083c9, #00b2ff)",
          "avatarText": "MQ",
          "country": "Hà Nội",
          "rating": 4.95,
          "reviewsCount": 52,
          "amount": 2000,
          "days": 30,
          "pitch": "Senior Frontend Lead 8 năm kinh nghiệm React/Next.js.",
          "timeAgo": "4 giờ trước"
        }
      ]
    },
    {
      "id": "prj-103",
      "title": "Senior Mobile Flutter / iOS Engineer",
      "hot": true,
      "company": "Tập Đoàn Viettel (Viettel Digital)",
      "location": "Hà Nội & TP. Hồ Chí Minh",
      "timeAgo": "1 ngày trước",
      "applicantsCount": 31,
      "salaryDisplay": "28 – 50 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "VTL",
      "logoUrl": "images/brands/viettel.svg",
      "category": "mobile-apps",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 1400,
      "budgetMax": 2400,
      "avgBid": 1900,
      "description": "Tham gia phát triển hệ sinh thái ứng dụng tài chính số Viettel Money phục vụ hàng chục triệu người dùng. Yêu cầu chuyên sâu về Flutter, Swift, tối ưu hóa hiệu năng và bảo mật thanh toán chuẩn quốc tế.",
      "skills": [
        "Flutter",
        "Dart",
        "Swift",
        "iOS",
        "Android",
        "CI/CD",
        "Security"
      ],
      "postedDate": "Đăng 1 ngày trước",
      "timeLeft": "Còn 25 ngày",
      "bidsCount": 31,
      "clientName": "Tổng Công Ty Dịch Vụ Số Viettel",
      "clientRating": 4.9,
      "clientReviews": 110,
      "clientCountry": "Việt Nam",
      "clientVerified": true,
      "clientSpent": "Tập đoàn công nghệ quốc gia",
      "clientMemberSince": "Năm 2015",
      "clientHireRate": "97%",
      "featured": false,
      "milestones": [
        {
          "desc": "Payment Gateway Integration & Encryption",
          "amount": 2000
        },
        {
          "desc": "Biometric KYC & Core Mobile UI",
          "amount": 2500
        }
      ],
      "bids": [
        {
          "freelancerName": "Vũ Đình Nam",
          "avatarBg": "linear-gradient(135deg, #7c3aed, #c084fc)",
          "avatarText": "DN",
          "country": "TP.HCM",
          "rating": 5,
          "reviewsCount": 40,
          "amount": 1900,
          "days": 30,
          "pitch": "Từng lead phát triển 3 ứng dụng Fintech top store.",
          "timeAgo": "1 ngày trước"
        }
      ]
    },
    {
      "id": "prj-104",
      "title": "Digital Marketing Manager",
      "hot": true,
      "company": "Shopee Vietnam",
      "location": "TP.HCM",
      "timeAgo": "1 giờ trước",
      "applicantsCount": 45,
      "salaryDisplay": "25 – 40 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "SHP",
      "category": "recruitment",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 25,
      "budgetMax": 40,
      "description": "Quản lý và thực thi các chiến dịch Digital Marketing trên nền tảng Shopee.",
      "skills": [
        "Google Ads",
        "Facebook Ads",
        "SEO",
        "Analytics",
        "Content Strategy"
      ],
      "postedDate": "Đăng 1 giờ trước",
      "timeLeft": "Còn 15 ngày",
      "clientName": "Shopee Vietnam",
      "clientRating": 4.8,
      "clientReviews": 120,
      "clientVerified": true,
      "clientHireRate": "90%",
      "clientMemberSince": "Năm 2015",
      "featured": true
    },
    {
      "id": "prj-105",
      "title": "Senior UI/UX Designer",
      "hot": false,
      "company": "MoMo Fintech",
      "location": "Remote",
      "timeAgo": "2 giờ trước",
      "applicantsCount": 30,
      "salaryDisplay": "30 – 50 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "MOMO",
      "category": "design",
      "type": "Remote",
      "jobType": "Chính thức",
      "budgetMin": 30,
      "budgetMax": 50,
      "description": "Thiết kế trải nghiệm người dùng cho hệ sinh thái siêu ứng dụng MoMo.",
      "skills": [
        "Figma",
        "UX Research",
        "Prototyping",
        "Design System",
        "Adobe XD"
      ],
      "postedDate": "Đăng 2 giờ trước",
      "timeLeft": "Còn 10 ngày",
      "clientName": "MoMo Fintech",
      "clientRating": 4.9,
      "clientReviews": 200,
      "clientVerified": true,
      "clientHireRate": "95%",
      "clientMemberSince": "Năm 2014",
      "featured": false
    },
    {
      "id": "prj-106",
      "title": "DevOps & Cloud Engineer",
      "hot": true,
      "company": "Tiki Corporation",
      "location": "TP.HCM",
      "timeAgo": "3 giờ trước",
      "applicantsCount": 20,
      "salaryDisplay": "35 – 60 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "TIKI",
      "category": "web-dev",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 35,
      "budgetMax": 60,
      "description": "Vận hành và tối ưu hệ thống Cloud, đảm bảo tính sẵn sàng cao cho e-commerce.",
      "skills": [
        "AWS",
        "Kubernetes",
        "Terraform",
        "CI/CD",
        "Linux"
      ],
      "postedDate": "Đăng 3 giờ trước",
      "timeLeft": "Còn 12 ngày",
      "clientName": "Tiki Corporation",
      "clientRating": 4.7,
      "clientReviews": 150,
      "clientVerified": true,
      "clientHireRate": "92%",
      "clientMemberSince": "Năm 2012",
      "featured": true
    },
    {
      "id": "prj-107",
      "title": "HR Business Partner",
      "hot": false,
      "company": "VinFast",
      "location": "Hà Nội",
      "timeAgo": "4 giờ trước",
      "applicantsCount": 15,
      "salaryDisplay": "20 – 35 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "VF",
      "category": "recruitment",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 20,
      "budgetMax": 35,
      "description": "Đối tác nhân sự chiến lược cho các khối phòng ban tại VinFast.",
      "skills": [
        "Tuyển dụng",
        "HRBP",
        "Luật Lao Động",
        "Talent Acquisition"
      ],
      "postedDate": "Đăng 4 giờ trước",
      "timeLeft": "Còn 20 ngày",
      "clientName": "VinFast",
      "clientRating": 4.6,
      "clientReviews": 80,
      "clientVerified": true,
      "clientHireRate": "88%",
      "clientMemberSince": "Năm 2017",
      "featured": false
    },
    {
      "id": "prj-108",
      "title": "Fullstack Node.js Developer",
      "hot": true,
      "company": "KiotViet",
      "location": "Đà Nẵng / Remote",
      "timeAgo": "5 giờ trước",
      "applicantsCount": 50,
      "salaryDisplay": "20 – 40 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "KIOT",
      "category": "web-dev",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 20,
      "budgetMax": 40,
      "description": "Phát triển tính năng mới cho nền tảng quản lý bán hàng KiotViet.",
      "skills": [
        "Node.js",
        "React",
        "MongoDB",
        "REST API",
        "TypeScript"
      ],
      "postedDate": "Đăng 5 giờ trước",
      "timeLeft": "Còn 14 ngày",
      "clientName": "KiotViet",
      "clientRating": 4.8,
      "clientReviews": 110,
      "clientVerified": true,
      "clientHireRate": "94%",
      "clientMemberSince": "Năm 2014",
      "featured": true
    },
    {
      "id": "prj-109",
      "title": "Data Engineer",
      "hot": false,
      "company": "VNPay",
      "location": "Hà Nội",
      "timeAgo": "6 giờ trước",
      "applicantsCount": 25,
      "salaryDisplay": "30 – 55 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "VNPAY",
      "category": "ai-ml",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 30,
      "budgetMax": 55,
      "description": "Xây dựng và tối ưu hóa hệ thống Data Pipeline cho hàng triệu giao dịch.",
      "skills": [
        "Apache Spark",
        "Airflow",
        "BigQuery",
        "Python",
        "dbt"
      ],
      "postedDate": "Đăng 6 giờ trước",
      "timeLeft": "Còn 18 ngày",
      "clientName": "VNPay",
      "clientRating": 4.9,
      "clientReviews": 190,
      "clientVerified": true,
      "clientHireRate": "96%",
      "clientMemberSince": "Năm 2011",
      "featured": false
    },
    {
      "id": "prj-110",
      "title": "Content Creator & Brand Manager",
      "hot": false,
      "company": "Grab Vietnam",
      "location": "TP.HCM",
      "timeAgo": "7 giờ trước",
      "applicantsCount": 60,
      "salaryDisplay": "18 – 30 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "GRAB",
      "category": "design",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 18,
      "budgetMax": 30,
      "description": "Sáng tạo nội dung và quản lý thương hiệu Grab trên các kênh mạng xã hội.",
      "skills": [
        "Content Marketing",
        "Copywriting",
        "Social Media",
        "Brand Strategy"
      ],
      "postedDate": "Đăng 7 giờ trước",
      "timeLeft": "Còn 10 ngày",
      "clientName": "Grab Vietnam",
      "clientRating": 4.7,
      "clientReviews": 300,
      "clientVerified": true,
      "clientHireRate": "93%",
      "clientMemberSince": "Năm 2014",
      "featured": false
    },
    {
      "id": "prj-111",
      "title": "Supply Chain Manager",
      "hot": true,
      "company": "Samsung Vietnam",
      "location": "Bắc Ninh",
      "timeAgo": "8 giờ trước",
      "applicantsCount": 18,
      "salaryDisplay": "35 – 65 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "SS",
      "category": "recruitment",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 35,
      "budgetMax": 65,
      "description": "Quản lý chuỗi cung ứng toàn cầu, tối ưu hóa quy trình sản xuất và vận chuyển.",
      "skills": [
        "Quản lý chuỗi cung ứng",
        "ERP SAP",
        "Lean Six Sigma",
        "Procurement"
      ],
      "postedDate": "Đăng 8 giờ trước",
      "timeLeft": "Còn 25 ngày",
      "clientName": "Samsung Vietnam",
      "clientRating": 4.8,
      "clientReviews": 500,
      "clientVerified": true,
      "clientHireRate": "98%",
      "clientMemberSince": "Năm 2008",
      "featured": true
    },
    {
      "id": "prj-112",
      "title": "QA Engineer (Automation)",
      "hot": false,
      "company": "Axon Active Vietnam",
      "location": "Đà Nẵng",
      "timeAgo": "9 giờ trước",
      "applicantsCount": 22,
      "salaryDisplay": "18 – 35 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "AXON",
      "category": "web-dev",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 18,
      "budgetMax": 35,
      "description": "Phát triển và duy trì framework kiểm thử tự động cho các dự án phần mềm.",
      "skills": [
        "Selenium",
        "Cypress",
        "Python",
        "Postman",
        "JIRA"
      ],
      "postedDate": "Đăng 9 giờ trước",
      "timeLeft": "Còn 15 ngày",
      "clientName": "Axon Active Vietnam",
      "clientRating": 4.6,
      "clientReviews": 70,
      "clientVerified": true,
      "clientHireRate": "91%",
      "clientMemberSince": "Năm 2008",
      "featured": false
    },
    {
      "id": "prj-113",
      "title": "Financial Analyst",
      "hot": true,
      "company": "VPBank Securities",
      "location": "Hà Nội",
      "timeAgo": "10 giờ trước",
      "applicantsCount": 35,
      "salaryDisplay": "25 – 45 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "VPBS",
      "category": "recruitment",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 25,
      "budgetMax": 45,
      "description": "Phân tích tài chính, đánh giá rủi ro và tư vấn đầu tư chiến lược.",
      "skills": [
        "Excel",
        "Python",
        "Financial Modeling",
        "Báo Cáo Tài Chính",
        "CFA"
      ],
      "postedDate": "Đăng 10 giờ trước",
      "timeLeft": "Còn 14 ngày",
      "clientName": "VPBank Securities",
      "clientRating": 4.7,
      "clientReviews": 95,
      "clientVerified": true,
      "clientHireRate": "92%",
      "clientMemberSince": "Năm 2010",
      "featured": true
    },
    {
      "id": "prj-114",
      "title": "Game Developer (Unity)",
      "hot": false,
      "company": "VNG Corporation",
      "location": "TP.HCM",
      "timeAgo": "11 giờ trước",
      "applicantsCount": 40,
      "salaryDisplay": "28 – 50 triệu/tháng",
      "workType": "Toàn thời gian",
      "logoType": "VNG",
      "logoUrl": "images/brands/vng.svg",
      "category": "mobile-apps",
      "type": "Full-Time",
      "jobType": "Chính thức",
      "budgetMin": 28,
      "budgetMax": 50,
      "description": "Phát triển game mobile trên nền tảng Unity 3D, tối ưu hóa hiệu năng.",
      "skills": [
        "Unity3D",
        "C#",
        "Game Design",
        "Shader",
        "Firebase"
      ],
      "postedDate": "Đăng 11 giờ trước",
      "timeLeft": "Còn 12 ngày",
      "clientName": "VNG Corporation",
      "clientRating": 4.8,
      "clientReviews": 250,
      "clientVerified": true,
      "clientHireRate": "96%",
      "clientMemberSince": "Năm 2004",
      "featured": false
    }
  ],
  "freelancers": [
    {
      "id": "fl-1",
      "name": "Trần Minh Quang",
      "title": "Principal Cloud & Solution Architect",
      "avatarBg": "linear-gradient(135deg, #0083c9, #00b2ff)",
      "avatarText": "MQ",
      "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      "hourlyRate": 45,
      "rating": 5,
      "reviewsCount": 88,
      "successRate": 100,
      "completedJobs": 54,
      "country": "Hà Nội, Việt Nam",
      "tagline": "Kiến trúc hệ thống Microservices & Điện toán đám mây quy mô triệu CCU.",
      "bio": "Chuyên gia kiến trúc phần mềm với 10+ năm kinh nghiệm. Từng chủ trì các dự án Core Banking và E-commerce lớn tại Đông Nam Á.",
      "skills": [
        "Java",
        "Spring Boot",
        "AWS",
        "Kubernetes",
        "PostgreSQL",
        "Kafka"
      ]
    },
    {
      "id": "fl-2",
      "name": "Nguyễn Hà My",
      "title": "Senior Product Designer & UX Lead",
      "avatarBg": "linear-gradient(135deg, #ec4899, #f43f5e)",
      "avatarText": "HM",
      "photoUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      "hourlyRate": 40,
      "rating": 4.98,
      "reviewsCount": 65,
      "successRate": 99,
      "completedJobs": 42,
      "country": "TP. Hồ Chí Minh, Việt Nam",
      "tagline": "Thiết kế trải nghiệm người dùng tinh tế, thúc đẩy tăng trưởng sản phẩm.",
      "bio": "Lead Designer từng xây dựng Design System cho các siêu ứng dụng FinTech và Logistics đạt hơn 5 triệu lượt tải.",
      "skills": [
        "Figma",
        "Design System",
        "UX Research",
        "Prototyping",
        "Mobile UI"
      ]
    },
    {
      "id": "fl-3",
      "name": "Lê Hoàng Long",
      "title": "AI & Machine Learning Research Engineer",
      "avatarBg": "linear-gradient(135deg, #10b981, #34d399)",
      "avatarText": "HL",
      "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      "hourlyRate": 55,
      "rating": 5,
      "reviewsCount": 76,
      "successRate": 100,
      "completedJobs": 38,
      "country": "Đà Nẵng, Việt Nam",
      "tagline": "Phát triển giải pháp Generative AI, RAG Pipeline & Mô hình phân tích dữ liệu lớn.",
      "bio": "Thạc sĩ Khoa học Máy tính. Chuyên sâu về LLM fine-tuning, vector database, thị giác máy tính và các giải pháp NLP thực chiến.",
      "skills": [
        "Python",
        "PyTorch",
        "LangChain",
        "OpenAI API",
        "FastAPI",
        "Pinecone"
      ]
    },
    {
      "id": "fl-4",
      "name": "Phạm Quốc Hùng",
      "title": "Lead Mobile Flutter & iOS Engineer",
      "avatarBg": "linear-gradient(135deg, #8b5cf6, #d946ef)",
      "avatarText": "QH",
      "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      "hourlyRate": 38,
      "rating": 4.95,
      "reviewsCount": 92,
      "successRate": 98,
      "completedJobs": 60,
      "country": "Hà Nội, Việt Nam",
      "tagline": "Phát triển ứng dụng di động đa nền tảng tối ưu hiệu năng và bảo mật.",
      "bio": "8 năm phát triển ứng dụng di động. Phát hành hơn 30 ứng dụng trên App Store và Google Play.",
      "skills": [
        "Flutter",
        "Dart",
        "Swift",
        "iOS",
        "Android",
        "CI/CD Mobile"
      ]
    },
    {
      "id": "fl-5",
      "name": "Vũ Đình Nam",
      "title": "Senior Full-Stack Next.js & Node.js Developer",
      "avatarBg": "linear-gradient(135deg, #0ea5e9, #6366f1)",
      "avatarText": "DN",
      "photoUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
      "hourlyRate": 35,
      "rating": 4.92,
      "reviewsCount": 50,
      "successRate": 100,
      "completedJobs": 35,
      "country": "TP. Hồ Chí Minh, Việt Nam",
      "tagline": "Xây dựng Web App hiện đại, tốc độ cao với Next.js và Serverless.",
      "bio": "Chuyên gia phát triển frontend và full-stack hiện đại, am hiểu SEO, Web Vitals và kiến trúc Serverless.",
      "skills": [
        "Next.js",
        "React.js",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "MongoDB"
      ]
    },
    {
      "id": "fl-6",
      "name": "Đỗ Mai Anh",
      "title": "Talent Acquisition & HRBP Advisor",
      "avatarBg": "linear-gradient(135deg, #f59e0b, #ef4444)",
      "avatarText": "MA",
      "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      "hourlyRate": 30,
      "rating": 5,
      "reviewsCount": 44,
      "successRate": 100,
      "completedJobs": 70,
      "country": "Hà Nội, Việt Nam",
      "tagline": "Tư vấn tuyển dụng nhân sự cấp cao và xây dựng văn hóa doanh nghiệp.",
      "bio": "Cố vấn nhân sự cho hơn 20 startup và doanh nghiệp công nghệ tại Việt Nam.",
      "skills": [
        "Headhunting",
        "HRBP",
        "Tech Recruitment",
        "Talent Mapping",
        "Interviewing"
      ]
    }
  ],
  "notifications": [
    {
      "id": "n-1",
      "text": "Elena Rostova submitted a proposal bid on your Next.js E-Commerce project.",
      "time": "10m ago",
      "unread": true
    },
    {
      "id": "n-2",
      "text": "Escrow Deposit Confirmed: $3,500 locked in Milestone Vault.",
      "time": "1h ago",
      "unread": true
    }
  ],
  "chats": {
    "chat-1": [
      {
        "sender": "them",
        "text": "Hi! I saw your post regarding the Next.js e-commerce project. I can start immediately.",
        "time": "10:30 AM"
      },
      {
        "sender": "me",
        "text": "Great! Do you have experience with Stripe Connect multi-vendor payouts?",
        "time": "10:32 AM"
      }
    ]
  },
  "users": [
    {
      "id": "usr-1784780601374",
      "name": "Alex Founder",
      "email": "alex@startup.io",
      "password": "securePassword123",
      "role": "Client",
      "title": "Startup Founder & Entrepreneur",
      "hourlyRate": 75,
      "avatarText": "AF",
      "bio": "Verified platform user registered on Freelancer NextGen.",
      "skills": [
        "React",
        "Node.js",
        "WebSockets",
        "Stripe"
      ],
      "createdAt": "2026-07-23T04:23:21.374Z"
    }
  ],
  "categories": [
    {
      "id": "web-dev",
      "name": "Websites, IT & Software",
      "count": 6840
    },
    {
      "id": "mobile-apps",
      "name": "Mobile Apps & Devices",
      "count": 3240
    },
    {
      "id": "ai-ml",
      "name": "AI, Machine Learning & Data",
      "count": 2450
    },
    {
      "id": "recruitment",
      "name": "Direct Recruitment Roles",
      "count": 4120
    },
    {
      "id": "design",
      "name": "Design, Media & UI/UX",
      "count": 3800
    },
    {
      "id": "writing",
      "name": "Technical Writing & Specs",
      "count": 1250
    }
  ]
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(defaultData);
      return defaultData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, falling back to default:', err);
    return defaultData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to DB:', err);
    return false;
  }
}

module.exports = { readDB, writeDB };
