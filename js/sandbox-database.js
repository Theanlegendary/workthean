/* ==========================================================================
   SANDBOX LOGISTICS FULL DATABASE & HYDRATION ROUTINES
   Directly derived from thesandbox-logistics-platform/web-prototype
   ========================================================================== */

// 1. COMPANIES DATABASE & HYDRATION

  const companiesData = {
    'gemadept': {
      name: 'Gemadept Corporation',
      shortName: 'Gemadept',
      tier: 'ACCREDITED CONGLOMERATE',
      hq: '6 Le Thanh Ton, District 1, Ho Chi Minh City',
      size: '3,500+ Total Employees',
      founded: '1990',
      industry: 'Port Operations & Integrated Logistics',
      jobs: 12,
      website: 'https://gemadept.com.vn',
      heroImg: 'images/hero_1.jpg',
      logoImg: 'images/brands/gemadept.svg',
      desc: 'Gemadept Corporation is a pioneer in Vietnam\'s maritime and port logistics sector. Operating world-class deep-sea ports including Gemalink (Cai Mep) and Nam Dinh Vu (Hai Phong), alongside specialized cold-chain logistics, river-sea barging, and air freight cargo terminal operations.',
      stat1Label: 'Port Capacity', stat1Val: '3.5M+ TEUs',
      stat2Label: 'Cold Storage DC', stat2Val: '65,000 Pallets',
      stat3Label: 'Barge & Liner Fleet', stat3Val: '45+ Vessels',
      quoteText: 'Pioneering integrated seaport ecosystems and zero-emission multimodal logistics to anchor Vietnam as Southeast Asia\'s leading trade hub.',
      quoteAuthor: 'Executive Board  Port & Terminal Directorate',
      photos: ['images/report_1.jpg','images/occ_1.jpg','images/today_3.jpg','images/occ_3.jpg','images/report_2.jpg'],
      email: 'recruitment@gemadept.com.vn',
      phone: '(+84) 28 3823 8888',
      offices: [
        { type: 'Headquarters', name: 'Gemadept Tower', loc: 'District 1, Ho Chi Minh City' },
        { type: 'Deep-Sea Terminal', name: 'Gemalink Port', loc: 'Cai Mep - Thi Vai, Ba Ria - Vung Tau' },
        { type: 'Northern Gateway', name: 'Nam Dinh Vu Port', loc: 'Dinh Vu Economic Zone, Hai Phong' }
      ],
      awards: [
        { badge: 'Top 50', title: 'Top 50 Best Listed Companies in Vietnam', org: 'Forbes Vietnam' },
        { badge: 'Tier 1', title: 'Vietnam National Brand  Logistics & Ports', org: 'Ministry of Industry and Trade' }
      ]
    },

    'viconship': {
      name: 'Viconship Container Corporation',
      shortName: 'Viconship',
      tier: 'ACCREDITED TIER 1',
      hq: 'Hai Phong Port Cluster, Vietnam',
      size: '2,500+ Total Employees',
      founded: '1985',
      industry: 'Maritime & Port Logistics',
      jobs: 7,
      website: 'https://viconship.com',
      heroImg: 'images/hero_3.jpg',
      logoImg: 'images/brands/viconship.svg',
      desc: 'Viconship (Vietnam Container Shipping JSC) operates premier deep-water container terminal facilities in Northern Vietnam, including VIP Green Port, Green Port, and VIMC Dinh Vu, in addition to ICD intermodal nodes in Hai Phong and Cai Mep. With over 39 years of operational excellence, Viconship processes over 1.8 million TEUs annually and leads the adoption of green terminal port automation.',
      stat1Label: 'Annual Throughput', stat1Val: '1.8M+ TEUs',
      stat2Label: 'Berth Frontage', stat2Val: '1,200 Meters',
      stat3Label: 'ICD Storage Yard', stat3Val: '450,000 m',
      quoteText: 'Integrating deep-water quayside efficiency with nationwide bonded ICD nodes to accelerate Vietnam\'s cross-border maritime supply chains.',
      quoteAuthor: 'Operations Directorate &middot; Logistics Executive Board',
      photos: ['images/report_1.jpg','images/occ_1.jpg','images/today_3.jpg','images/occ_3.jpg','images/report_2.jpg','images/topic_real_1.jpg'],
      email: 'careers@viconship.com',
      phone: '(+84) 225 3836 705',
      address: '11 Vo Thi Sau, Ngo Quyen, Hai Phong',
      certs: ['AEO Authorized Economic Operator Tier-1','ISO 9001:2015 Quality Management','Vietnam Seaports Association (VPA) Member','HOSE Listed: VSC'],
      hiringCategories: [
        { name: 'Quayside & Terminal Operations', count: 3 },
        { name: 'Ocean Freight Forwarding & Logistics', count: 2 },
        { name: 'Port IT, Automation & TOS', count: 1 },
        { name: 'Reefer Maintenance & Cold Chain', count: 1 }
      ],
      techStack: [
        { name: 'Navis N4', category: 'TERMINAL OPS (TOS)', icon: 'fa-solid fa-ship' },
        { name: 'CargoWise ONE', category: 'FREIGHT ERP', icon: 'fa-solid fa-boxes-stacked' },
        { name: 'IoT Reefer Telematics', category: 'COLD CHAIN MONITORING', icon: 'fa-solid fa-temperature-arrow-down' },
        { name: 'VNACCS / VCIS', category: 'CUSTOMS EDI GATEWAY', icon: 'fa-solid fa-file-invoice' },
        { name: 'Oracle SCM Cloud', category: 'ENTERPRISE RESOURCE', icon: 'fa-solid fa-database' },
        { name: 'Python Dispatch Engines', category: 'BERTH AUTOMATION & AI', icon: 'fa-brands fa-python' },
        { name: 'EDIFACT / ANSI X12', category: 'CARRIER MESSAGING', icon: 'fa-solid fa-network-wired' },
        { name: 'RFID Truck Gate Access', category: 'SMART GATEWAY', icon: 'fa-solid fa-id-card' }
      ],
      cultureValues: [
        { title: 'Zero-Incident Safety Standard', desc: 'Operating deep-water terminals 24/7 demands unyielding safety protocols and designated automated buffer zones.' },
        { title: 'Green Maritime Stewardship', desc: 'Electrifying quay cranes and eliminating diesel emissions by 42% under Vietnam Green Port initiatives.' },
        { title: 'Vocational Mastery Tracks', desc: 'Continuous vocational training and certified STS quay crane operator credentials recognized across ASEAN.' }
      ],
      offices: [
        { name: 'VIP Green Port Terminal', location: 'Dinh Vu Economic Zone, Hai Phong', type: 'Deep-Water Berth', spec: '2 Berths &bull; 400m Quayside &bull; 80,000 DWT Vessels' },
        { name: 'Green Port Terminal', location: 'Chua Ve Port Area, Hai Phong', type: 'Container Terminal', spec: '2 Berths &bull; 320m Quayside &bull; Navis N4 Integrated' },
        { name: 'Southern Intermodal ICD', location: 'Phu My, Cai Mep - Thi Vai, Ba Ria-Vung Tau', type: 'Bonded Logistics Hub', spec: '150,000 m Yard &bull; 600 Reefer Plugs' }
      ],
      awards: [
        { title: 'Top 10 Maritime Port Operators Vietnam', org: 'Vietnam Logistics Association (VLA) &bull; 2025', badge: 'GOLD SEAL' },
        { title: 'Authorized Economic Operator (AEO) Seal', org: 'General Department of Vietnam Customs &bull; 2026', badge: 'COMPLIANCE' },
        { title: 'Best Workplaces in Logistics 2026', org: 'Great Place to Work Institute Vietnam', badge: 'TOP EMPLOYER' },
        { title: 'ISO 14001:2015 Environmental Excellence', org: 'Bureau Veritas Certification', badge: 'GREEN PORT' }
      ],
      openJobs: [
        { id: 'job-vsc-1', title: 'Senior Ocean Freight Operations Specialist', location: 'Ho Chi Minh City', salary: '35M-50M VND', badge: 'URGENT', accent: 'accent-coral', dept: 'Ocean Freight' },
        { id: 'job-vsc-2', title: 'Container Terminal Berth Coordinator', location: 'Hai Phong Port', salary: '25M-38M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Terminal Ops' },
        { id: 'job-vsc-3', title: 'Reefer Container Technical Supervisor', location: 'Cai Mep Port', salary: '22M-30M VND', badge: 'VERIFIED', accent: 'accent-blue', dept: 'Cold Chain' },
        { id: 'job-vsc-4', title: 'Customs Clearance & Documentation Officer', location: 'Hai Phong Office', salary: '18M-25M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Customs Clearance' },
        { id: 'job-vsc-5', title: 'Port Gate Automation & TOS Analyst', location: 'Hai Phong Port', salary: '28M-40M VND', badge: 'HOT', accent: 'accent-coral', dept: 'Logistics IT' },
        { id: 'job-vsc-6', title: 'Heavy Gantry Crane (STS) Operator', location: 'VIP Green Port', salary: '20M-32M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Quayside Equipment' },
        { id: 'job-vsc-7', title: 'Inland Container Depot (ICD) Yard Planner', location: 'Hai Phong ICD', salary: '20M-28M VND', badge: 'VERIFIED', accent: 'accent-blue', dept: 'Yard Planning' }
      ]
    },
    'dhl-global-forwarding': {
      name: 'DHL Global Forwarding Vietnam',
      shortName: 'DHL Vietnam',
      tier: 'GLOBAL ENTERPRISE',
      hq: 'District 1, Ho Chi Minh City & Hanoi',
      size: '1,800+ Total Employees',
      founded: '1969',
      industry: 'Air & Ocean Freight Forwarding',
      jobs: 3,
      website: 'https://dhl.com/vn-en',
      heroImg: 'images/hero_1.jpg',
      logoImg: 'images/brands/dhl.svg',
      desc: 'DHL Global Forwarding is the undisputed international market leader in air and ocean freight services. In Vietnam, DHL connects factories in Bac Ninh, Hai Phong, and Binh Duong directly with key trade lanes in North America, Europe, and intra-Asia through bonded consolidation centers.',
      stat1Label: 'Air Freight Volume', stat1Val: '140,000+ Tons',
      stat2Label: 'Ocean TEUs Handled', stat2Val: '280,000+ TEUs',
      stat3Label: 'Bonded Footprint', stat3Val: '120,000 m',
      quoteText: 'Connecting Vietnam\'s high-tech manufacturing corridors with over 220 global markets with carbon-neutral logistics solutions.',
      quoteAuthor: 'Country Management Board &middot; DHL Global Forwarding Vietnam',
      photos: ['images/news_1.jpg','images/yt_thumb_1.jpg','images/today_1.jpg','images/report_3.jpg','images/occ_2.jpg','images/topic_real_2.jpg'],
      email: 'recruitment.vn@dhl.com',
      phone: '(+84) 28 3910 8888',
      address: 'Bitexco Financial Tower, 2 Hai Trieu, Ben Nghe, District 1, HCMC',
      certs: ['IATA Cargo Agent Accredited','AEO Tier-1 Customs Certification','ISO 9001:2015 & ISO 14001:2015','GoGreen Neutral Logistics Certified'],
      hiringCategories: [
        { name: 'Air Freight Commercial & Ops', count: 1 },
        { name: 'Cold Chain Pharma Operations', count: 1 },
        { name: 'Cross-Border Customs Advisory', count: 1 }
      ],
      techStack: [
        { name: 'myDHLi Freight Portal', category: 'CUSTOMER TRACKING', icon: 'fa-solid fa-globe' },
        { name: 'CargoWise ONE Enterprise', category: 'GLOBAL FORWARDING ERP', icon: 'fa-solid fa-boxes-stacked' },
        { name: 'DHL Thermonet', category: 'LIFE SCIENCES COLD CHAIN', icon: 'fa-solid fa-temperature-arrow-down' },
        { name: 'EDI Cargo-IMP / XML', category: 'AIRLINES EDI GATEWAY', icon: 'fa-solid fa-plane' },
        { name: 'SAP S/4HANA', category: 'FINANCIAL INFRASTRUCTURE', icon: 'fa-solid fa-database' },
        { name: 'PowerBI Logistics Analytics', category: 'SUPPLY CHAIN BI', icon: 'fa-solid fa-chart-line' }
      ],
      cultureValues: [
        { title: 'Excellence. Simply Delivered.', desc: 'Standardized operational rigor delivering consistent service levels across all 220 countries.' },
        { title: 'Diversity, Equity & Belonging', desc: 'Certified Top Employer in Vietnam for 5 consecutive years with proactive gender balance programs.' },
        { title: 'Mission 2050 Zero Emissions', desc: 'Pioneering sustainable aviation fuel (SAF) and green carrier bookings on Vietnam routes.' }
      ],
      offices: [
        { name: 'Vietnam Country Head Office', location: 'District 1, Ho Chi Minh City', type: 'Executive HQ', spec: 'Commercial, Pricing & Global Forwarding Strategy' },
        { name: 'Noi Bai Airfreight Logistics Center', location: 'Soc Son District, Hanoi', type: 'Air Cargo Hub', spec: 'Temperature Controlled &bull; IATA CEIV Pharma Certified' },
        { name: 'Binh Duong Multi-Client Logistics Park', location: 'VSIP 1, Thuan An, Binh Duong', type: 'Bonded Warehouse', spec: '45,000 m High-Bay Storage' }
      ],
      awards: [
        { title: 'Top Employer Vietnam 2026', org: 'Top Employers Institute Global &bull; Certified', badge: 'TOP EMPLOYER' },
        { title: 'Best Green Freight Forwarder', org: 'Asian Freight & Supply Chain Awards (AFSCA)', badge: 'GOGREEN' },
        { title: 'IATA CEIV Pharma Accreditation', org: 'International Air Transport Association', badge: 'PHARMA SEAL' }
      ],
      openJobs: [
        { id: 'job-dhl-1', title: 'Key Account Manager - High-Tech & Electronics', location: 'Ho Chi Minh City', salary: '45M-65M VND', badge: 'HOT', accent: 'accent-coral', dept: 'Commercial Sales' },
        { id: 'job-dhl-2', title: 'Air Freight Pricing & Route Specialist', location: 'Hanoi (Noi Bai Airport)', salary: '30M-42M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Air Freight' },
        { id: 'job-dhl-3', title: 'Pharma Cold Chain Compliance Officer', location: 'Ho Chi Minh City', salary: '28M-40M VND', badge: 'VERIFIED', accent: 'accent-blue', dept: 'Cold Chain' }
      ]
    },
    'saigon-newport': {
      name: 'Saigon Newport Corporation (TCSG)',
      shortName: 'Saigon Newport',
      tier: 'STATE CORPORATION',
      hq: 'Cat Lai Port, District 2, Thu Duc City, HCMC',
      size: '8,000+ Total Employees',
      founded: '1989',
      industry: 'Terminal Operations & Multi-modal Logistics',
      jobs: 3,
      website: 'https://saigonnewport.com.vn',
      heroImg: 'images/hero_2.jpg',
      logoImg: 'images/brands/saigon-newport.svg',
      desc: 'Saigon Newport Corporation (SNP) is Vietnam\'s largest container port operator, accounting for over 50% of the country\'s nationwide import-export container market share. Key facilities include Tan Cang - Cat Lai Port, Tan Cang - Cai Mep Deep-Sea Terminal, and an interconnected ICD network spanning Hai Phong, Da Nang, and the Mekong Delta.',
      stat1Label: 'National Market Share', stat1Val: '52% Total',
      stat2Label: 'Annual Volume', stat2Val: '9.2M+ TEUs',
      stat3Label: 'Quayside Frontage', stat3Val: '5,800 Meters',
      quoteText: 'Connecting trade lanes, elevating national competitiveness, and driving green terminal logistics across Vietnam\'s maritime economy.',
      quoteAuthor: 'Executive Leadership Board &middot; Saigon Newport Corporation',
      photos: ['images/today_2.jpg','images/news_4.jpg','images/course_1.jpg','images/occ_1.jpg','images/report_1.jpg','images/topic_real_1.jpg'],
      email: 'tuyendung@saigonnewport.com.vn',
      phone: '(+84) 28 3742 2234',
      address: '722 Dien Bien Phu, Binh Thanh District, Ho Chi Minh City',
      certs: ['Vietnam National Brand (Thuong Hieu Quoc Gia)','AEO Authorized Economic Operator','ISO 9001:2015 / ISO 14001:2015','Green Port Award System (GPAS) Certified'],
      hiringCategories: [
        { name: 'Quayside & Terminal Operations', count: 1 },
        { name: 'Port IT & Digital Systems', count: 1 },
        { name: 'Intermodal Barge Coordination', count: 1 }
      ],
      techStack: [
        { name: 'TOPX & TOPS Expert', category: 'TERMINAL MANAGEMENT (TOS)', icon: 'fa-solid fa-ship' },
        { name: 'ePort Smart Portal', category: 'DIGITAL CLIENT INTERACTION', icon: 'fa-solid fa-desktop' },
        { name: 'Automated Gate RFID', category: 'SMART GATEWAY', icon: 'fa-solid fa-id-card' },
        { name: 'Navis N4 Cai Mep', category: 'DEEP-SEA TERMINAL TOS', icon: 'fa-solid fa-anchor' },
        { name: 'Oracle Port Financials', category: 'CORPORATE ERP', icon: 'fa-solid fa-database' },
        { name: 'Barge Real-Time GPS Tracking', category: 'TELEMATICS & FLEET', icon: 'fa-solid fa-satellite' }
      ],
      cultureValues: [
        { title: 'Military Discipline & Rigor', desc: 'Rooted in proud Navy traditions, SNP operations pride themselves on precision, reliability, and 24/7 readiness.' },
        { title: 'National Strategic Commitment', desc: 'Safeguarding maritime logistics sovereignty and keeping supply chains unbroken through all market cycles.' },
        { title: 'Pioneering Green Seaports', desc: 'Vietnam\'s first terminal operator to receive the prestigious APEC Green Port Award System certification.' }
      ],
      offices: [
        { name: 'Tan Cang - Cat Lai Port', location: 'Thu Duc City, Ho Chi Minh City', type: 'Flagship Container Port', spec: '10 Berths &bull; 2,040m Quayside &bull; 6.5M TEU Capacity' },
        { name: 'Tan Cang - Cai Mep (TCIT / TCTT)', location: 'Phu My, Ba Ria-Vung Tau', type: 'Deep-Sea Super Terminal', spec: 'Accommodating 20,000+ TEU Mega Vessels' },
        { name: 'Tan Cang - Hai Phong ICD', location: 'Hai An District, Hai Phong', type: 'Northern Intermodal Node', spec: '250,000 m Yard with Direct Rail & Inland Waterway' }
      ],
      awards: [
        { title: 'Vietnam National Brand (Thuong Hieu Quoc Gia)', org: 'Ministry of Industry & Trade Vietnam', badge: 'NATIONAL SEAL' },
        { title: 'APEC Green Port Award System (GPAS)', org: 'APEC Port Services Network (APSN)', badge: 'GREEN PORT' },
        { title: 'Top 20 Container Terminal Operators Worldwide', org: 'Lloyd\'s List Maritime Intelligence', badge: 'GLOBAL 20' }
      ],
      openJobs: [
        { id: 'job-snp-1', title: 'Port Operations Shift Superintendent', location: 'Cat Lai Port, Thu Duc City', salary: '28M-45M VND', badge: 'URGENT', accent: 'accent-coral', dept: 'Quayside Ops' },
        { id: 'job-snp-2', title: 'ePort Digital Systems Application Specialist', location: 'Ho Chi Minh City', salary: '30M-48M VND', badge: 'HOT', accent: 'accent-coral', dept: 'Port IT' },
        { id: 'job-snp-3', title: 'Deep-Water Berth Planner (Cai Mep Hub)', location: 'Ba Ria - Vung Tau', salary: '24M-35M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Vessel Planning' }
      ]
    },
    'logivan': {
      name: 'LOGIVAN Logistics Technology',
      shortName: 'Logivan',
      tier: 'TECH DISRUPTOR',
      hq: 'Cau Giay, Hanoi & District 1, HCMC',
      size: '350+ Total Employees',
      founded: '2017',
      industry: 'Freight Tech & Truck Matching Platform',
      jobs: 2,
      website: 'https://logivan.com',
      heroImg: 'images/hero_3.jpg',
      logoImg: 'images/brands/logivan.svg',
      desc: 'LOGIVAN is Vietnam\'s premier logistics technology unicorn-track platform. Often recognized as the "Uber for Trucks" in Southeast Asia, LOGIVAN connects 60,000+ verified fleet drivers with enterprise cargo owners using AI dispatch algorithms, dynamic freight rate pricing, and automated telemetry.',
      stat1Label: 'Trucking Network', stat1Val: '65,000+ Trucks',
      stat2Label: 'Enterprise Clients', stat2Val: '2,400+ B2B Brands',
      stat3Label: 'Empty Run Reduction', stat3Val: '28% Saved',
      quoteText: 'Leveraging AI dispatching and telemetry to digitize Vietnam\'s fragmented 100-billion dollar trucking economy.',
      quoteAuthor: 'Executive Product Leadership &middot; LOGIVAN Vietnam',
      photos: ['images/news_5.jpg','images/yt_thumb_2.jpg','images/course_3.jpg','images/occ_3.jpg','images/today_3.jpg','images/report_2.jpg'],
      email: 'careers@logivan.com',
      phone: '(+84) 24 7300 0033',
      address: '7th Floor, Leadvisors Tower, 643 Pham Van Dong, Bac Tu Liem, Hanoi',
      certs: ['FinTech & LogTech Innovation Award','Google for Startups Accelerator Alumni','ISO 27001 Data Security Certified','VLA Tech Member'],
      hiringCategories: [
        { name: 'AI Engineering & Data Science', count: 1 },
        { name: 'B2B Enterprise Carrier Sales', count: 1 }
      ],
      techStack: [
        { name: 'Python / PyTorch AI', category: 'ALGORITHMIC DISPATCH', icon: 'fa-brands fa-python' },
        { name: 'Golang Microservices', category: 'BACKEND HIGH-THROUGHPUT', icon: 'fa-solid fa-server' },
        { name: 'PostgreSQL & Redis', category: 'HIGH CONCURRENCY DATA', icon: 'fa-solid fa-database' },
        { name: 'React Native & Flutter', category: 'DRIVER TELEMATICS APPS', icon: 'fa-solid fa-mobile-screen' },
        { name: 'AWS Cloud & Kubernetes', category: 'SCALABLE INFRASTRUCTURE', icon: 'fa-brands fa-aws' },
        { name: 'IoT GPS Tracking Sensors', category: 'HARDWARE TELEMETRY', icon: 'fa-solid fa-satellite-dish' }
      ],
      cultureValues: [
        { title: 'Data-Driven & Experimental', desc: 'Every product feature, pricing algorithm, and workflow is rigorously A/B tested against field operational data.' },
        { title: 'Extreme Empathy for Truck Drivers', desc: 'Building software that dignifies heavy-duty truck drivers with fair earnings, immediate payouts, and route safety.' },
        { title: 'Speed & Autonomy', desc: 'High-ownership engineering squads shipping production releases weekly across Vietnam.' }
      ],
      offices: [
        { name: 'Hanoi Engineering & AI Labs', location: 'Leadvisors Tower, Bac Tu Liem, Hanoi', type: 'Technology HQ', spec: 'Engineering, Data Science & Product Design Squads' },
        { name: 'Ho Chi Minh City Commercial Center', location: 'District 1, Ho Chi Minh City', type: 'Commercial Hub', spec: 'Enterprise 3PL Sales & Southern Fleet Operations' }
      ],
      awards: [
        { title: 'Winner: ASEAN Tech Startup of the Year', org: 'Tech in Asia Singapore &bull; 2024', badge: 'INNOVATION' },
        { title: 'Forbes Asia 100 to Watch', org: 'Forbes International', badge: 'FORBES 100' },
        { title: 'ISO/IEC 27001 Information Security', org: 'Global BSI Group', badge: 'SECURITY' }
      ],
      openJobs: [
        { id: 'job-lgv-1', title: 'Senior AI / Optimization Engineer - Route Dispatching', location: 'Hanoi (Cau Giay)', salary: '55M-80M VND', badge: 'HOT', accent: 'accent-coral', dept: 'AI & Data Science' },
        { id: 'job-lgv-2', title: 'Enterprise Enterprise Account Executive - FMCG Freight', location: 'Ho Chi Minh City', salary: '35M-60M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Enterprise Sales' }
      ]
    },
    'vinfast-logistics': {
      name: 'VinFast Automotive Global Logistics',
      shortName: 'VinFast Logistics',
      tier: 'CONGLOMERATE ENTERPRISE',
      hq: 'Dinh Vu Industrial Park, Hai Phong',
      size: '3,200+ Total Employees',
      founded: '2017',
      industry: 'Automotive & EV Global Supply Chain',
      jobs: 3,
      website: 'https://vinfastauto.com',
      heroImg: 'images/hero_1.jpg',
      logoImg: 'images/brands/vinfast.svg',
      desc: 'VinFast Automotive Global Logistics manages one of the most technologically advanced automotive supply chains in the world. Operating from the 335-hectare Dinh Vu complex in Hai Phong, the enterprise orchestrates specialized Ro-Ro automotive ocean charters, EV battery cold-chain shipping, and global assembly lines.',
      stat1Label: 'EV Annual Capacity', stat1Val: '250,000 EVs',
      stat2Label: 'Global Ro-Ro Lanes', stat2Val: '18 Ports',
      stat3Label: 'Complex Footprint', stat3Val: '335 Hectares',
      quoteText: 'Powering Vietnam\'s historic transition into an electric mobility powerhouse through resilient global supply chain operations.',
      quoteAuthor: 'Global Supply Chain Directorate &middot; VinFast Auto Ltd.',
      photos: ['images/news_6.jpg','images/yt_thumb_3.jpg','images/today_1.jpg','images/occ_4.jpg','images/report_3.jpg','images/topic_real_3.jpg'],
      email: 'recruitment@vinfastauto.com',
      phone: '(+84) 225 396 9999',
      address: 'Dinh Vu - Cat Hai Economic Zone, Cat Hai Island, Hai Phong',
      certs: ['Nasdaq Listed: VFS','ISO 9001:2015 & IATF 16949 Automotive Quality','AEO Customs Tier-1','UN ECE Global Automotive Regulatory Compliant'],
      hiringCategories: [
        { name: 'Global Ro-Ro Maritime Charters', count: 1 },
        { name: 'Lithium Battery Hazmat Logistics', count: 1 },
        { name: 'Inbound SAP SCM Synchronization', count: 1 }
      ],
      techStack: [
        { name: 'SAP S/4HANA Auto SCM', category: 'ENTERPRISE AUTO ERP', icon: 'fa-solid fa-car' },
        { name: 'Siemens Teamcenter PLM', category: 'LOGISTICS CAD / BOM', icon: 'fa-solid fa-cubes' },
        { name: 'Hazmat IoT Temperature Telemetry', category: 'LITHIUM BATTERY SENSORS', icon: 'fa-solid fa-battery-full' },
        { name: 'Ocean IQ Charter Tracker', category: 'RO-RO FLEET RADAR', icon: 'fa-solid fa-ship' },
        { name: 'JDA / Blue Yonder WMS', category: 'AUTOMATED WAREHOUSE', icon: 'fa-solid fa-warehouse' },
        { name: 'Tableau Global Supply Chain', category: 'EXECUTIVE INTELLIGENCE', icon: 'fa-solid fa-chart-pie' }
      ],
      cultureValues: [
        { title: 'Breakneck Speed & Execution', desc: 'Transforming an ambitious EV automotive dream into Nasdaq reality in record-setting timeframes.' },
        { title: 'Global Quality Without Compromise', desc: 'IATF 16949 automotive certification demanded across 1,000 tier-1 global component suppliers.' },
        { title: 'National Pride on the Global Stage', desc: 'Flying Vietnam\'s manufacturing banner proudly across North American, European, and Asian highways.' }
      ],
      offices: [
        { name: 'Hai Phong Megafactory Complex', location: 'Cat Hai Island, Hai Phong', type: 'Global Manufacturing & Logistics HQ', spec: '335-Hectare Complex with Dedicated Deep-Sea Berthing' },
        { name: 'VinFast North America Logistics', location: 'Los Angeles, California, USA', type: 'Regional Distribution Center', spec: 'Port of Long Beach Inbound Intermodal Hub' },
        { name: 'Hanoi Corporate Headquarters', location: 'Symphony Tower, Vinhomes Riverside, Hanoi', type: 'Executive Global Supply Chain Office', spec: 'Procurement & Logistics Strategy' }
      ],
      awards: [
        { title: 'Nasdaq Listed Global EV Manufacturer', org: 'Nasdaq Global Select Market &bull; VFS', badge: 'LISTED' },
        { title: 'IATF 16949 Automotive Supply Chain Seal', org: 'International Automotive Task Force', badge: 'AUTOMOTIVE' },
        { title: 'Vietnam National Excellence Award', org: 'Prime Minister of Vietnam &bull; 2025', badge: 'NATIONAL SEAL' }
      ],
      openJobs: [
        { id: 'job-vfs-1', title: 'Global Ro-Ro Vessel Chartering Specialist', location: 'Hai Phong Port Complex', salary: '45M-70M VND', badge: 'HOT', accent: 'accent-coral', dept: 'Maritime Chartering' },
        { id: 'job-vfs-2', title: 'Lithium Battery Hazmat Logistics Lead', location: 'Hai Phong / Hanoi', salary: '40M-60M VND', badge: 'URGENT', accent: 'accent-coral', dept: 'Dangerous Goods' },
        { id: 'job-vfs-3', title: 'SAP Supply Chain Integration Architect', location: 'Hanoi HQ', salary: '50M-75M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'SCM Architecture' }
      ]
    },
    'tikinow': {
      name: 'TikiNOW Smart Logistics (TNSL)',
      shortName: 'TikiNow',
      tier: 'E-COMMERCE ENTERPRISE',
      hq: 'Tan Binh District, Ho Chi Minh City',
      size: '2,200+ Total Employees',
      founded: '2010',
      industry: 'E-Commerce Fulfillment & 2-Hour Delivery',
      jobs: 2,
      website: 'https://tiki.vn',
      heroImg: 'images/hero_2.jpg',
      logoImg: 'images/brands/tikinow.svg',
      desc: 'TikiNOW Smart Logistics is the end-to-end fulfillment and rapid delivery backbone powering Tiki, Vietnam\'s premier domestic e-commerce platform. TNSL operates automated fulfillment mega-centers across Hanoi, HCMC, Da Nang, and Can Tho, famously pioneering 2-hour delivery nationwide.',
      stat1Label: 'Daily Parcels', stat1Val: '350,000+ Orders',
      stat2Label: 'Fulfillment Centers', stat2Val: '14 Hubs',
      stat3Label: 'On-Time Fulfillment', stat3Val: '99.4% Rate',
      quoteText: 'Delivering delight in 2 hours with automated multi-tier pick-pack sorting robotics and AI routing across 63 provinces.',
      quoteAuthor: 'Supply Chain Operations &middot; TikiNOW Smart Logistics',
      photos: ['images/news_7.jpg','images/yt_thumb_4.jpg','images/course_2.jpg','images/occ_4.jpg','images/report_3.jpg','images/topic_real_3.jpg'],
      email: 'recruitment@tiki.vn',
      phone: '(+84) 28 7300 1234',
      address: '52 Ut Tich, Ward 4, Tan Binh District, Ho Chi Minh City',
      certs: ['Vietnam Best Logistics E-Commerce Award','ISO 9001:2015 Certified Fulfillment','VALOMA Member','ASEAN Retail Excellence 2025'],
      hiringCategories: [
        { name: 'Automated Fulfillment Ops', count: 1 },
        { name: 'Last-Mile Route Optimization', count: 1 }
      ],
      techStack: [
        { name: 'Automated Sorting Robotics', category: 'WAREHOUSE ROBOTICS', icon: 'fa-solid fa-robot' },
        { name: 'Java Spring Microservices', category: 'ORDER FULFILLMENT BACKEND', icon: 'fa-brands fa-java' },
        { name: 'Python Genetic Routing AI', category: 'LAST-MILE ALGORITHMS', icon: 'fa-brands fa-python' },
        { name: 'Elasticsearch / Kafka', category: 'EVENT STREAMING & SEARCH', icon: 'fa-solid fa-bolt' },
        { name: 'Kubernetes on GCP', category: 'CLOUD PLATFORM', icon: 'fa-brands fa-google' }
      ],
      cultureValues: [
        { title: 'Customer-Centric Obsession', desc: 'Every logistics decision is measured by whether it shaves minutes off the customer delivery window.' },
        { title: 'Continuous Automation', desc: 'Replacing tedious manual warehouse sorting with high-speed automated conveyors and optical barcode scanners.' },
        { title: 'One Team, One Heart', desc: 'Field couriers and software engineers collaborating side-by-side to solve real-world last-mile challenges.' }
      ],
      offices: [
        { name: 'TikiNOW South Mega Fulfillment', location: 'Tan Binh Industrial Park, HCMC', type: 'Mega Distribution Center', spec: '60,000 m Automated High-Speed Sorter Hub' },
        { name: 'TikiNOW North Logistics Center', location: 'Long Bien District, Hanoi', type: 'Regional Sorting Center', spec: '40,000 m with Cold Storage for Fresh Groceries' }
      ],
      awards: [
        { title: 'Best E-Commerce Logistics Provider Vietnam', org: 'Vietnam E-Commerce Association (VECOM)', badge: 'TOP 1' },
        { title: 'Customer Service Excellence in Last-Mile', org: 'ASEAN Retail Awards Singapore', badge: 'EXCELLENCE' }
      ],
      openJobs: [
        { id: 'job-tki-1', title: 'Fulfillment Center Operations Director', location: 'Tan Binh, Ho Chi Minh City', salary: '60M-90M VND', badge: 'HOT', accent: 'accent-coral', dept: 'Warehouse Ops' },
        { id: 'job-tki-2', title: 'Last-Mile Fleet Optimization Lead', location: 'Hanoi / HCMC', salary: '35M-50M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Fleet Dispatch' }
      ]
    },
    'viettel-post': {
      name: 'Viettel Post Joint Stock Corporation',
      shortName: 'Viettel Post',
      tier: 'NATIONAL MILITARY ENTERPRISE',
      hq: 'My Dinh, Nam Tu Liem, Hanoi',
      size: '22,000+ Total Employees',
      founded: '1997',
      industry: 'Express Postal & Nationwide Distribution',
      jobs: 3,
      website: 'https://viettelpost.com.vn',
      heroImg: 'images/hero_3.jpg',
      logoImg: 'images/brands/viettel-post.svg',
      desc: 'Viettel Post is Vietnam\'s premier state-owned postal and parcel network with unmatched 100% coverage spanning all 63 provinces, island districts, and border gates. With over 2,200 post offices and high-capacity automated sorting centers, Viettel Post guarantees delivery anywhere in Vietnam.',
      stat1Label: 'Nationwide Points', stat1Val: '2,200+ Post Offices',
      stat2Label: 'Fleet Trucks', stat2Val: '10,000+ Vehicles',
      stat3Label: 'Coverage Rate', stat3Val: '100% Wards & Communes',
      quoteText: 'Bringing express logistics to every commune, border post, and island community across the nation.',
      quoteAuthor: 'Executive Board &middot; Viettel Post Corporation',
      photos: ['images/topic_real_1.jpg','images/report_2.jpg','images/news_1.jpg','images/course_1.jpg','images/occ_1.jpg','images/today_2.jpg'],
      email: 'tuyendung@viettelpost.com.vn',
      phone: '1900 8095',
      address: 'Viettel Building, 1 Tran Huu Duc, My Dinh 2, Nam Tu Liem, Hanoi',
      certs: ['Vietnam National Brand (Thuong Hieu Quoc Gia)','Universal Postal Union (UPU) Member','ISO 9001:2015 Quality System','HOSE Listed: VTP'],
      hiringCategories: [
        { name: 'Smart Sorting Automation Hubs', count: 1 },
        { name: 'Cross-Border China-Vietnam Rail', count: 1 },
        { name: 'Enterprise Corporate 3PL Sales', count: 1 }
      ],
      techStack: [
        { name: 'Smart Automated Sorter AGVs', category: 'SORTING AUTOMATION', icon: 'fa-solid fa-robot' },
        { name: 'Viettel Post Enterprise App', category: 'MOBILE ECOSYSTEM', icon: 'fa-solid fa-mobile-screen-button' },
        { name: 'Real-Time Truck Telematics', category: 'GPS FLEET TELEMATICS', icon: 'fa-solid fa-truck-moving' },
        { name: 'Cross-Border Rail Booking System', category: 'RAIL FREIGHT EDI', icon: 'fa-solid fa-train' },
        { name: 'Oracle Financial & SCM ERP', category: 'ENTERPRISE ERP', icon: 'fa-solid fa-database' }
      ],
      cultureValues: [
        { title: 'The Soldier\'s Spirit', desc: 'Upholding relentless discipline, overcoming logistical hardships to deliver packages through typhoons and terrain.' },
        { title: 'National Infrastructure Service', desc: 'Treating logistics as vital state artery connecting rural farmers and urban manufacturers alike.' },
        { title: 'Technological Self-Reliance', desc: 'Engineers designing our own proprietary smart automated sorting machines within Vietnam.' }
      ],
      offices: [
        { name: 'Viettel Post Corporate Tower', location: 'My Dinh 2, Nam Tu Liem, Hanoi', type: 'National Headquarters', spec: 'Executive, IT & Corporate Operations' },
        { name: 'Quang Minh Smart Sorting Megahub', location: 'Me Linh, Hanoi', type: 'Northern Mega Sorting Complex', spec: 'High-speed Cross-belt Sorting Hub processing 1M parcels/day' },
        { name: 'Song Than Intermodal Rail Logistics Hub', location: 'Di An, Binh Duong', type: 'Cross-Border Intermodal Rail Hub', spec: 'Connecting directly to China-Europe Rail Express' }
      ],
      awards: [
        { title: 'Vietnam National Brand (Thuong Hieu Quoc Gia)', org: 'Ministry of Industry and Trade Vietnam', badge: 'NATIONAL SEAL' },
        { title: 'Top 5 Reputable Logistics Companies in Vietnam', org: 'Vietnam Report & VietnamNet', badge: 'TOP 5' },
        { title: 'Golden Star of Vietnam (Sao Vang Dat Viet)', org: 'Vietnam Young Entrepreneurs Association', badge: 'GOLDEN STAR' }
      ],
      openJobs: [
        { id: 'job-vtp-1', title: 'Automated Sorting Hub Operations Manager', location: 'Quang Minh Megahub, Hanoi', salary: '35M-50M VND', badge: 'URGENT', accent: 'accent-coral', dept: 'Megahub Ops' },
        { id: 'job-vtp-2', title: 'Vietnam-China Intermodal Rail Freight Lead', location: 'Hanoi / Lang Son', salary: '30M-45M VND', badge: 'HOT', accent: 'accent-coral', dept: 'Rail Logistics' },
        { id: 'job-vtp-3', title: 'Regional Fleet Safety & Compliance Lead', location: 'Ho Chi Minh City', salary: '25M-35M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Fleet Safety' }
      ]
    },
    'grab-express': {
      name: 'GrabExpress Logistics Vietnam',
      shortName: 'Grab Express',
      tier: 'TECH ECOSYSTEM',
      hq: 'Ben Nghe, District 1, Ho Chi Minh City',
      size: '1,500+ Total Employees',
      founded: '2012',
      industry: 'On-Demand Urban Delivery & B2B Fulfillment',
      jobs: 2,
      website: 'https://grab.com/vn',
      heroImg: 'images/hero_1.jpg',
      logoImg: 'images/brands/grab.svg',
      desc: 'GrabExpress is Southeast Asia\'s largest on-demand hyper-local logistics network. In Vietnam, GrabExpress serves hundreds of thousands of small businesses, restaurants, and retail enterprises with instant point-to-point courier dispatches, cold-chain grocery fulfillment, and same-day citywide logistics.',
      stat1Label: 'Active Driver Partners', stat1Val: '200,000+ Drivers',
      stat2Label: 'Average Pickup Time', stat2Val: '< 7 Minutes',
      stat3Label: 'Completed Deliveries', stat3Val: '50M+ Parcels',
      quoteText: 'Powering local commerce and empowering hundreds of thousands of independent transport entrepreneurs across Southeast Asia.',
      quoteAuthor: 'Logistics Directorate &middot; Grab Vietnam',
      photos: ['images/news_7.jpg','images/yt_thumb_4.jpg','images/course_2.jpg','images/occ_4.jpg','images/report_3.jpg','images/topic_real_3.jpg'],
      email: 'vn-careers@grab.com',
      phone: '(+84) 28 7107 5888',
      address: '111 Pasteur, Ben Nghe, District 1, Ho Chi Minh City',
      certs: ['ASEAN Super-App Platform of the Year','ISO 27001 Data Security Certified','VLA Associate Member','SEA Tech Award 2025'],
      hiringCategories: [
        { name: 'B2B Enterprise Merchant Logistics', count: 1 },
        { name: 'Last-Mile Regional Route Operations', count: 1 }
      ],
      techStack: [
        { name: 'Golang Real-Time Microservices', category: 'HIGH CONCURRENCY DISPATCH', icon: 'fa-solid fa-server' },
        { name: 'Apache Kafka Event Streams', category: 'MASSIVE EVENT MESSAGING', icon: 'fa-solid fa-bolt' },
        { name: 'Terraform on AWS / Azure', category: 'CLOUD INFRASTRUCTURE', icon: 'fa-brands fa-aws' },
        { name: 'Kotlin / Swift Mobile SDKs', category: 'DRIVER & CLIENT APPS', icon: 'fa-brands fa-android' },
        { name: 'Machine Learning Eta Estimators', category: 'PREDICTIVE TRANSIT AI', icon: 'fa-solid fa-brain' }
      ],
      cultureValues: [
        { title: 'Heart, Hunger, Honour, Humility (4Hs)', desc: 'Grab\'s cultural compass driving every decision, customer interaction, and product breakthrough.' },
        { title: 'Drive Economic Mobility', desc: 'Creating flexible earning opportunities for everyday couriers across Vietnam\'s urban centers.' },
        { title: 'Customer Obsession & Safety First', desc: 'Uncompromised safety standards for every rider, parcel, and merchant transaction.' }
      ],
      offices: [
        { name: 'Grab Vietnam Headquarters', location: '111 Pasteur, District 1, HCMC', type: 'Vietnam Country HQ', spec: 'Executive, Commercial & Strategic Partnerships' },
        { name: 'Hanoi Regional Office', location: 'Duy Tan, Cau Giay District, Hanoi', type: 'Northern Operations Center', spec: 'Merchant Onboarding & Rider Support Hub' }
      ],
      awards: [
        { title: 'ASEAN Best On-Demand Delivery Platform', org: 'Southeast Asia Tech & Logistics Summit', badge: 'ASEAN BEST' },
        { title: 'Great Place to Work Certified', org: 'Great Place to Work Institute Vietnam', badge: 'TOP WORKPLACE' }
      ],
      openJobs: [
        { id: 'job-grb-1', title: 'B2B Logistics Business Development Manager', location: 'Ho Chi Minh City', salary: '40M-70M VND', badge: 'HOT', accent: 'accent-coral', dept: 'Enterprise BD' },
        { id: 'job-grb-2', title: 'Last-Mile Operations Regional Lead', location: 'Hanoi / HCMC', salary: '30M-50M VND', badge: 'FULL-TIME', accent: 'accent-green', dept: 'Operations' }
      ]
    }
  };

  let currentPhotoIndex = 0;

  function switchBuiltInTab(tabKey) {
    document.querySelectorAll('.builtin-tab-btn').forEach(function(btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    const activeBtn = document.getElementById('tab-nav-' + tabKey);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');
    }

    document.querySelectorAll('.builtin-pane').forEach(function(pane) {
      pane.style.display = 'none';
    });
    const activePane = document.getElementById('pane-' + tabKey);
    if (activePane) {
      activePane.style.display = 'block';
    }
  }

  function toggleSaveCompany() {
    const icon = document.getElementById('save-icon');
    const text = document.getElementById('save-text');
    const btn = document.getElementById('btn-save-company');
    if (!icon || !text || !btn) return;
    const isSaved = btn.classList.contains('saved');
    if (isSaved) {
      btn.classList.remove('saved');
      icon.className = 'fa-regular fa-heart';
      text.textContent = 'Save Company';
      if (typeof showToast === 'function') showToast('Company removed from saved list.');
    } else {
      btn.classList.add('saved');
      icon.className = 'fa-solid fa-heart';
      text.textContent = 'Saved Company';
      if (typeof showToast === 'function') showToast('Company saved to your bookmarked list!');
    }
  }

  function openGalleryLightbox(idx) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || params.get('id') || 'viconship';
    const co = companiesData[slug] || companiesData['viconship'];
    if (!co || !co.photos || !co.photos.length) return;
    currentPhotoIndex = idx;
    updateLightbox(co);
    const lb = document.getElementById('co-photo-lightbox');
    if (lb) lb.classList.add('active');
  }

  function closeGalleryLightbox() {
    const lb = document.getElementById('co-photo-lightbox');
    if (lb) lb.classList.remove('active');
  }

  function changeLightboxPhoto(step) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || params.get('id') || 'viconship';
    const co = companiesData[slug] || companiesData['viconship'];
    if (!co || !co.photos || !co.photos.length) return;
    currentPhotoIndex = (currentPhotoIndex + step + co.photos.length) % co.photos.length;
    updateLightbox(co);
  }

  function updateLightbox(co) {
    const imgEl = document.getElementById('lightbox-img');
    const capEl = document.getElementById('lightbox-caption');
    if (imgEl && co.photos[currentPhotoIndex]) {
      imgEl.src = co.photos[currentPhotoIndex];
    }
    if (capEl) {
      capEl.textContent = co.shortName + ' &middot; Terminal Photo ' + (currentPhotoIndex + 1) + ' of ' + co.photos.length;
    }
  }

  document.addEventListener('keydown', function(e) {
    const lb = document.getElementById('co-photo-lightbox');
    if (lb && lb.classList.contains('active')) {
      if (e.key === 'Escape') closeGalleryLightbox();
      if (e.key === 'ArrowRight') changeLightboxPhoto(1);
      if (e.key === 'ArrowLeft') changeLightboxPhoto(-1);
    }
  });

  function renderBuiltInJobCard(job, company) {
    const accentClass = job.accent || 'accent-blue';
    const dept = job.dept || 'Logistics Operations';
    const jobDetailUrl = 'job-detail.html?id=' + encodeURIComponent(job.id || 'job-verified-1');
    const logoSrc = company.logoImg || 'images/brands/viconship.svg';
    const coName = company.shortName || company.name || 'Logistics Partner';
    return '<div class="job-card ' + accentClass + '">' +
      '<div class="job-logo-box">' +
        '<img src="' + logoSrc + '" alt="' + coName + '" loading="lazy">' +
      '</div>' +
      '<div class="job-main-col">' +
        '<div class="job-company-tag">' + coName + '</div>' +
        '<a href="' + jobDetailUrl + '" style="text-decoration:none; color:inherit;">' +
          '<div class="job-title-text">' + job.title + '</div>' +
        '</a>' +
      '</div>' +
      '<div class="job-separator-line"></div>' +
      '<div class="job-meta-col">' +
        '<div class="job-meta-row"><i class="fa-solid fa-location-dot" style="color:var(--builtin-blue, #005B94); font-size:12px;"></i> <span>' + job.location + '</span></div>' +
        '<div class="job-meta-row"><i class="fa-solid fa-briefcase" style="color:var(--builtin-muted, #64748B); font-size:12px;"></i> <span>' + dept + '</span></div>' +
      '</div>' +
      '<div class="job-extra-col">' +
        '<div class="job-salary-chip">' + job.salary + '</div>' +
        '<span class="job-badge-chip">' + job.badge + '</span>' +
      '</div>' +
      '<div class="job-action-col">' +
        '<button type="button" class="btn-apply-direct" onclick="handleJobCardApply(\'' + job.id + '\', \'' + job.title.replace(/'/g, "\\'") + '\', \'' + coName.replace(/'/g, "\\'") + '\');">' +
          'Apply Now' +
        '</button>' +
      '</div>' +
    '</div>';
  }

  function handleJobCardApply(jobId, jobTitle, companyName) {
    if (typeof openJobApplyModal === 'function') {
      openJobApplyModal(jobId, jobTitle, companyName);
    } else {
      window.location.href = 'jobs.html';
    }
  }

  function hydrateCompanyPage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || params.get('id');
    const activeSlug = (slug && companiesData[slug]) ? slug : 'viconship';
    const company = companiesData[activeSlug];

    // Document Title & Breadcrumbs
    document.title = company.name + ' - Accredited Enterprise Profile | The SandBox';
    const bcEl = document.getElementById('breadcrumb-company-name');
    if (bcEl) bcEl.textContent = company.name;

    // Left Column Sticky Card
    const logoImgEl = document.getElementById('company-logo-img');
    if (logoImgEl) {
      logoImgEl.src = company.logoImg;
      logoImgEl.alt = company.shortName;
    }

    const nameEl = document.getElementById('company-name-heading');
    if (nameEl) nameEl.textContent = company.name;

    const tierEl = document.getElementById('company-tier-chip');
    if (tierEl) tierEl.textContent = company.tier;

    const hqEl = document.getElementById('company-hq');
    if (hqEl) hqEl.textContent = company.hq;

    const sizeEl = document.getElementById('company-size');
    if (sizeEl) sizeEl.textContent = company.size;

    const foundedEl = document.getElementById('company-founded');
    if (foundedEl) foundedEl.textContent = company.founded || '1995';

    const webLink = document.getElementById('company-website-link');
    if (webLink) {
      webLink.href = company.website;
      webLink.textContent = 'View Official Website';
    }

    const phoneEl = document.getElementById('company-phone');
    if (phoneEl) phoneEl.textContent = company.phone;

    const emailEl = document.getElementById('company-email');
    if (emailEl) emailEl.textContent = company.email;

    const addrEl = document.getElementById('company-address');
    if (addrEl) addrEl.textContent = company.address;

    // We\'re Hiring Categories Card
    const totalJobs = company.openJobs ? company.openJobs.length : (company.jobs || 0);
    const hiringTotalBadge = document.getElementById('hiring-total-badge');
    if (hiringTotalBadge) hiringTotalBadge.textContent = totalJobs + ' Roles';

    const tabBadgeJobs = document.getElementById('tab-badge-jobs');
    if (tabBadgeJobs) tabBadgeJobs.textContent = totalJobs;

    const jobsPaneTotal = document.getElementById('jobs-pane-total');
    if (jobsPaneTotal) jobsPaneTotal.textContent = totalJobs;

    const categoriesContainer = document.getElementById('company-hiring-categories');
    if (categoriesContainer && company.hiringCategories) {
      categoriesContainer.innerHTML = company.hiringCategories.map(function(cat) {
        return '<a href="#tab-jobs" class="builtin-hiring-row" onclick="switchBuiltInTab(\'jobs\'); return false;">' +
          '<span>' + cat.name + '</span>' +
          '<div class="builtin-hiring-count">' +
            '<b>' + cat.count + '</b>' +
            '<i class="fa-solid fa-angle-right" style="font-size:11px; color:#9598a9;"></i>' +
          '</div>' +
        '</a>';
      }).join('');
    }

    // Similar Companies
    const similarEl = document.getElementById('company-similar-list');
    if (similarEl) {
      const keys = Object.keys(companiesData).filter(function(k) { return k !== activeSlug; }).slice(0, 3);
      similarEl.innerHTML = keys.map(function(k) {
        const co = companiesData[k];
        return '<a href="company-detail.html?slug=' + k + '" style="display:flex; align-items:center; gap:12px; padding:10px 12px; border:1px solid var(--builtin-border); border-radius:8px; text-decoration:none; transition:all 0.15s; background:#fff;">' +
          '<div style="width:36px; height:36px; background:#f8fafc; border:1px solid var(--builtin-border); border-radius:6px; padding:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">' +
            '<img src="' + co.logoImg + '" alt="' + co.shortName + '" style="max-width:100%; max-height:100%; object-fit:contain;">' +
          '</div>' +
          '<div style="flex:1; min-width:0;">' +
            '<div style="font-family:var(--font-montserrat); font-size:13px; font-weight:700; color:var(--builtin-midnight); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + co.shortName + '</div>' +
            '<div style="font-family:var(--font-barlow); font-size:12px; font-weight:600; color:var(--builtin-muted);">' + (co.openJobs ? co.openJobs.length : co.jobs) + ' positions &middot; ' + co.hq.split(',')[0].trim() + '</div>' +
          '</div>' +
          '<i class="fa-solid fa-chevron-right" style="font-size:11px; color:#94a3b8;"></i>' +
        '</a>';
      }).join('');
    }

    // Right Column Banner
    const heroImgEl = document.getElementById('company-hero-img');
    if (heroImgEl) heroImgEl.src = company.heroImg;

    const bannerTitleEl = document.getElementById('banner-company-title');
    if (bannerTitleEl) bannerTitleEl.textContent = company.name;

    // Overview Tab
    const aboutNameEl = document.getElementById('company-about-name');
    if (aboutNameEl) aboutNameEl.textContent = company.shortName;

    const aboutDescEl = document.getElementById('company-about-desc');
    if (aboutDescEl) aboutDescEl.textContent = company.desc;

    const stat1L = document.getElementById('company-stat1-label');
    const stat1V = document.getElementById('company-stat1-val');
    if (stat1L) stat1L.textContent = company.stat1Label;
    if (stat1V) stat1V.textContent = company.stat1Val;

    const stat2L = document.getElementById('company-stat2-label');
    const stat2V = document.getElementById('company-stat2-val');
    if (stat2L) stat2L.textContent = company.stat2Label;
    if (stat2V) stat2V.textContent = company.stat2Val;

    const stat3L = document.getElementById('company-stat3-label');
    const stat3V = document.getElementById('company-stat3-val');
    if (stat3L) stat3L.textContent = company.stat3Label;
    if (stat3V) stat3V.textContent = company.stat3Val;

    const quoteTextEl = document.getElementById('company-quote-text');
    if (quoteTextEl && company.quoteText) quoteTextEl.textContent = '"' + company.quoteText + '"';

    const quoteAuthEl = document.getElementById('company-quote-author');
    if (quoteAuthEl && company.quoteAuthor) quoteAuthEl.innerHTML = company.quoteAuthor;

    // Overview Featured Jobs (Top 3)
    const ovJobsList = document.getElementById('overview-jobs-list');
    if (ovJobsList) {
      if (company.openJobs && company.openJobs.length > 0) {
        ovJobsList.innerHTML = company.openJobs.slice(0, 3).map(function(job) {
          return renderBuiltInJobCard(job, company);
        }).join('');
      } else {
        ovJobsList.innerHTML = '<div style="padding:28px 20px; text-align:center; color:#64748B; font-size:13.5px; background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:8px;"><i class="fa-solid fa-briefcase" style="font-size:22px; color:#94A3B8; margin-bottom:8px; display:block;"></i>No active openings currently listed for this company.</div>';
      }
    }

    // Jobs Tab
    document.querySelectorAll('.co-name-span').forEach(function(el) {
      el.textContent = company.shortName || company.name;
    });
    const fullJobsList = document.getElementById('company-jobs-list');
    if (fullJobsList) {
      if (company.openJobs && company.openJobs.length > 0) {
        fullJobsList.innerHTML = company.openJobs.map(function(job) {
          return renderBuiltInJobCard(job, company);
        }).join('');
      } else {
        fullJobsList.innerHTML = '<div style="padding:40px 20px; text-align:center; color:#64748B; font-size:14px; background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:8px;"><i class="fa-solid fa-briefcase" style="font-size:28px; color:#94A3B8; margin-bottom:10px; display:block;"></i>No current vacancies open. Check back soon for new opportunities.</div>';
      }
    }

    // Technology Tab
    const techGrid = document.getElementById('company-tech-grid');
    if (techGrid && company.techStack) {
      techGrid.innerHTML = company.techStack.map(function(tech) {
        return '<div class="tech-stack-card">' +
          '<div class="tech-icon-box"><i class="' + tech.icon + '"></i></div>' +
          '<div class="tech-info-box">' +
            '<div class="tech-name">' + tech.name + '</div>' +
            '<div class="tech-category">' + tech.category + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // Life & Photo Gallery Tab
    const galNameEl = document.getElementById('gallery-company-name');
    if (galNameEl) galNameEl.textContent = company.shortName;

    const galleryEl = document.getElementById('company-photo-gallery');
    if (galleryEl && company.photos) {
      galleryEl.innerHTML = company.photos.map(function(src, idx) {
        return '<div class="co-gallery-img" onclick="openGalleryLightbox(' + idx + ');">' +
          '<img src="' + src + '" alt="' + company.shortName + ' terminal photo ' + (idx + 1) + '" loading="lazy">' +
        '</div>';
      }).join('');
    }

    // Culture Pillars
    const cultureContainer = document.getElementById('company-culture-pillars');
    if (cultureContainer && company.cultureValues) {
      cultureContainer.innerHTML = company.cultureValues.map(function(v) {
        return '<div class="culture-pillar-card">' +
          '<div class="culture-pillar-title"><i class="fa-solid fa-compass" style="color:var(--builtin-blue); margin-right:6px;"></i> ' + v.title + '</div>' +
          '<p class="culture-pillar-desc">' + v.desc + '</p>' +
        '</div>';
      }).join('');
    }

    // Offices & Terminals Tab
    const officesContainer = document.getElementById('company-offices-grid');
    if (officesContainer && company.offices) {
      officesContainer.innerHTML = company.offices.map(function(off) {
        return '<div class="office-terminal-card">' +
          '<div class="office-terminal-type">' + off.type + '</div>' +
          '<div class="office-terminal-name">' + off.name + '</div>' +
          '<div class="office-terminal-loc"><i class="fa-solid fa-location-dot" style="color:var(--builtin-blue);"></i> ' + off.location + '</div>' +
          '<div class="office-terminal-spec">' + off.spec + '</div>' +
        '</div>';
      }).join('');
    }

    // Awards Tab
    const awardsContainer = document.getElementById('company-awards-grid');
    if (awardsContainer && company.awards) {
      awardsContainer.innerHTML = company.awards.map(function(aw) {
        return '<div class="office-terminal-card">' +
          '<div class="office-terminal-type" style="background:#fef3c7; color:#b45309;"><i class="fa-solid fa-award" style="margin-right:4px;"></i> ' + aw.badge + '</div>' +
          '<div class="office-terminal-name">' + aw.title + '</div>' +
          '<div class="office-terminal-loc" style="font-size:12.5px; color:#64748b;">' + aw.org + '</div>' +
        '</div>';
      }).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateCompanyPage);
  } else {
    hydrateCompanyPage();
  }
  

// Global SPA Router Hook for Company Detail
window.showCompanyDetail = function(slug) {
  if (!slug) slug = 'viconship';
  if (typeof hydrateCompanyPage === 'function') {
    hydrateCompanyPage(slug);
  }
  if (typeof switchView === 'function') {
    switchView('company-detail', false);
  }
  window.location.hash = `company?id=${encodeURIComponent(slug)}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 2. COURSES DATABASE & HYDRATION

    const COURSES_DATA = {
      'fiata-diploma': {
        id: 'fiata-diploma',
        title: 'FIATA Higher International Diploma in Supply Chain Management',
        shortTitle: 'FIATA Higher International Diploma',
        badge: 'FIATA VALIDATED DIPLOMA',
        badgeIcon: 'fa-certificate',
        badgeBg: '#EAF1F7',
        badgeColor: '#123B5D',
        provider: 'Delivered in Vietnam by the <strong>Vietnam Logistics Research and Development Institute (VLI)</strong>',
        lead: 'An advanced professional qualification for freight forwarders, logistics operations managers, and supply chain specialists seeking international leadership competencies. Delivered through VLI under the global accreditation framework of the International Federation of Freight Forwarders Associations (FIATA, Geneva).',
        duration: '16 Weeks &bull; 160 Hours',
        format: 'Hybrid (Weekend &bull; Online)',
        location: 'VLI Center, HCMC &amp; Online',
        language: 'Bilingual (VN &bull; EN Materials)',
        intake: '14 November 2026',
        tuition: '18,500,000 VND',
        discount: '15,700,000 VND for VLA Association Members',
        overviewHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Programme Overview</h2>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 14px;">
            The FIATA Higher International Diploma is designed for practitioners aiming to advance from operational logistics tasks to strategic supply chain decision-making. The curriculum addresses contemporary challenges in multimodal transportation, contract administration, customs clearance procedures, and supply chain financial control across Southeast Asian and global freight networks.
          </p>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
            Participants develop practical case analysis skills to optimize end-to-end cargo movements, mitigate carrier liabilities, and design resilient supply chains aligned with international maritime and air conventions.
          </p>
        `,
        modules: [
          { num: 'Module 01', hours: '20 Guided Hours', title: 'Global Purchasing & International Procurement', desc: 'Strategic supplier selection, purchasing contracts, vendor evaluation frameworks, and international procurement negotiation strategies.' },
          { num: 'Module 02', hours: '20 Guided Hours', title: 'Contract Management & Maritime Law', desc: 'ICC Incoterms 2020 rules, passing of risk, letters of credit (UCP 600), international sales conventions (CISG), and standard logistics contract clauses.' },
          { num: 'Module 03', hours: '20 Guided Hours', title: 'Multimodal Transport Economics & Corridor Planning', desc: 'Rail-sea-road network optimization, container repositioning heuristics, cross-border transit regulations, and transport carbon footprint accounting.' },
          { num: 'Module 04', hours: '20 Guided Hours', title: 'Customs Law & International Compliance', desc: 'Harmonized System (HS) classification, origin rules under EVFTA/CPTPP, post-clearance audit mitigation, and Authorized Economic Operator (AEO) protocols.' },
          { num: 'Module 05', hours: '20 Guided Hours', title: 'Financial Management in Freight Forwarding', desc: 'Cash-to-cash cycles, freight rate volatility hedging, demurrage/detention arbitration, and working capital optimization for 3PL providers.' },
          { num: 'Module 06', hours: '20 Guided Hours', title: 'Supply Chain Information Systems & EDI', desc: 'CargoWise ONE, TMS-WMS enterprise integration, electronic bills of lading (e-B/L), and blockchain consignment verification.' },
          { num: 'Module 07', hours: '20 Guided Hours', title: 'Dangerous Goods & Special Cargo Logistics', desc: 'IMO IMDG Code, temperature-controlled cold chain validation, out-of-gauge heavy lift drayage, and emergency response management.' },
          { num: 'Module 08', hours: '20 Guided Hours', title: 'Strategic Supply Chain Management & Capstone Project', desc: 'Applied supply chain simulation addressing port delays, carrier disruptions, and logistics network re-engineering. Evaluated by an academic and industry panel.' }
        ],
        certHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Certification &amp; Institutional Validation</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 12px;">
            Successful candidates are awarded the <strong>FIATA Higher International Diploma in Supply Chain Management</strong>. The certificate is issued under the authority of the International Federation of Freight Forwarders Associations (FIATA, Geneva) through its validated national association member, the Vietnam Logistics Research and Development Institute (VLI).
          </p>
          <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0;">
            Graduates receive an individual verification registry number registered with FIATA's headquarters and are recognized across international freight associations worldwide.
          </p>
        `
      },

      'customs-brokerage': {
        id: 'customs-brokerage',
        title: 'Customs Brokerage Official Licensing & VNACCS/VCIS Mastery',
        shortTitle: 'Customs Brokerage Official Licensing',
        badge: 'GOVERNMENT EXAM PREP',
        badgeIcon: 'fa-stamp',
        badgeBg: '#F1F5F9',
        badgeColor: '#0F172A',
        provider: 'Delivered in partnership with <strong>General Department of Vietnam Customs (Tong cuc Hai quan) Accredited Lecturers</strong>',
        lead: 'Official preparatory curriculum for the national customs broker license exam. Master VNACCS/VCIS electronic declaration, HS Code classification rulings, customs valuation dispute defense, and post-clearance regulatory compliance.',
        duration: '8 Weeks &bull; 80 Hours',
        format: 'Classroom &bull; Electronic Declaration Lab',
        location: 'Cat Lai Port Logistics Hub, HCMC &amp; Hanoi',
        language: 'Vietnamese (Technical Standards)',
        intake: '05 November 2026',
        tuition: '9,800,000 VND',
        discount: '8,500,000 VND for VLA & Port Enterprise Members',
        overviewHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Programme Overview</h2>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 14px;">
            Passing the national customs broker examination is statutory under Law on Customs No. 54/2014/QH13 for enterprises acting on behalf of cargo owners at border gates and deepwater ports. This intensive curriculum is curated by former customs directors and legal arbiters.
          </p>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
            Students engage in simulated electronic customs declarations on actual VNACCS/VCIS software, review hundreds of past exam questions, and master post-clearance audit defense strategies.
          </p>
        `,
        modules: [
          { num: 'Module 01', hours: '20 Guided Hours', title: 'Vietnam Customs Law, Treaties & Circular 38/39', desc: 'Statutory compliance under Circular 38/2015/TT-BTC, Circular 39/2018/TT-BTC, Decree 163/2017/ND-CP, and rules of origin under EVFTA, CPTPP, and RCEP.' },
          { num: 'Module 02', hours: '20 Guided Hours', title: 'HS Code Classification & Technical Advance Rulings', desc: 'General Rules for Interpretation (GRI 1-6), WCO Explanatory Notes, chemical/machinery chapter classification, and advance ruling request preparation.' },
          { num: 'Module 03', hours: '20 Guided Hours', title: 'Customs Valuation, Origin Certification (C/O) & Audits', desc: 'Transaction value method, deductibles, royalty payments, Form D, E, EUR.1 origin certification criteria, and back-to-back C/O issuance.' },
          { num: 'Module 04', hours: '20 Guided Hours', title: 'VNACCS/VCIS Electronic Declaration Practicum Lab', desc: 'Hands-on data entry on IDA/IDC forms, electronic manifests, container seal inspection protocols, and red/yellow channel physical inspection workflows.' }
        ],
        certHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Official Credential Standing</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 12px;">
            Prepares participants directly for the annual <strong>Customs Broker Practice Certificate (Chung chi Nghiep vu Khai hai quan)</strong> examination administered by the General Department of Vietnam Customs.
          </p>
          <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0;">
            Graduates receive official course completion certificates recognized for exam eligibility and customs agency authorization registration.
          </p>
        `
      },

      'iata-dgr': {
        id: 'iata-dgr',
        title: 'IATA Dangerous Goods Regulations (DGR Category 6) Certification',
        shortTitle: 'IATA DGR Category 6 Certification',
        badge: 'IATA AVIATION CERTIFIED',
        badgeIcon: 'fa-plane-departure',
        badgeBg: '#EAF1F7',
        badgeColor: '#123B5D',
        provider: 'Conducted under official <strong>International Air Transport Association (IATA) Training Accreditation</strong>',
        lead: 'Mandatory international statutory certification for air cargo forwarders, airline cargo operations, and hazardous goods packers. Direct certification from the International Air Transport Association (IATA, Montreal/Geneva).',
        duration: '5 Days Intensive &bull; 40 Hours',
        format: 'Classroom &bull; Cargo Terminal Practicum',
        location: 'Tan Son Nhat (SGN) &amp; Noi Bai (HAN) Airport Hubs',
        language: 'English &amp; Vietnamese Instruction',
        intake: '22 November 2026',
        tuition: '14,200,000 VND',
        discount: '12,800,000 VND for Aviation Fleet Enrollees',
        overviewHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Programme Overview</h2>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 14px;">
            Under ICAO Technical Instructions and IATA resolutions, personnel responsible for accepting, packaging, and documenting hazardous cargo must hold a valid Category 6 certificate renewed every 24 months.
          </p>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
            This training covers the complete 9 hazard classes, UN packaging specifications, shipper's declaration verification, lithium battery air transport protocols, and emergency response procedures.
          </p>
        `,
        modules: [
          { num: 'Module 01', hours: '10 Guided Hours', title: 'Classification & Identification of 9 Hazard Classes', desc: 'Explosives, compressed gases, flammable liquids, toxic/infectious substances, radioactive materials, and corrosive cargo identification criteria.' },
          { num: 'Module 02', hours: '10 Guided Hours', title: 'UN Packaging Specifications & Performance Drop Tests', desc: 'Packaging groups (X, Y, Z), internal pressure limits, overpacks, salvage packaging, and dry ice sublimation compliance.' },
          { num: 'Module 03', hours: '10 Guided Hours', title: 'Marking, Labeling & Operator Acceptance Checklists', desc: 'Primary and subsidiary hazard labels, orientation arrows, cryogenic cargo labeling, and IATA acceptance checklist verification.' },
          { num: 'Module 04', hours: '10 Guided Hours', title: "Shipper's Declaration (DGD) & Incident Handling", desc: 'Air waybill endorsements, NOTOC (Notification to Captain), lithium battery Section IA/IB/II rules, and CAAV accident reporting protocols.' }
        ],
        certHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">IATA Global Accreditation</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 12px;">
            Participants who pass the proctored examination (minimum 80% passing grade) receive the official <strong>IATA Dangerous Goods Regulations Initial/Recurrent Certificate (Category 6)</strong>.
          </p>
          <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0;">
            Registered directly in the IATA Global Training Database, recognized by commercial airlines and civil aviation authorities worldwide.
          </p>
        `
      },

      'smart-warehousing': {
        id: 'smart-warehousing',
        title: 'Autonomous Mobile Robots (AMR), AGV & WMS Systems Architecture',
        shortTitle: 'Smart Warehousing & AMR Robotics',
        badge: 'INDUSTRY 4.0 LOGISTICS',
        badgeIcon: 'fa-robot',
        badgeBg: '#F1F5F9',
        badgeColor: '#0F172A',
        provider: 'Curated by <strong>The SandBox Logistics Academy &amp; Industrial Automation Partners</strong>',
        lead: 'Hands-on engineering and operations training in automated storage and retrieval systems (AS/RS), fleet manager integration, barcode/RFID tracking, and warehouse layout optimization for modern fulfillment centers.',
        duration: '6 Weeks &bull; 60 Hours',
        format: 'Hybrid (Virtual Simulation &amp; Automated DC Lab)',
        location: 'Song Than Logistics DC &amp; Online',
        language: 'Bilingual (VN &bull; EN)',
        intake: '18 November 2026',
        tuition: '11,500,000 VND',
        discount: '9,900,000 VND for Warehousing Council Partners',
        overviewHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Programme Overview</h2>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 14px;">
            E-commerce and omnichannel fulfillment demand automated robotics and digital warehouse control systems. This course bridges the gap between software architecture and logistics physical operations.
          </p>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
            Participants master warehouse layout planning, throughput calculation, AMR/AGV traffic scheduling, API integration between ERP and WMS, and dynamic slotting heuristics.
          </p>
        `,
        modules: [
          { num: 'Module 01', hours: '15 Guided Hours', title: 'Automated Storage Systems & AS/RS Design', desc: 'High-bay racking, stacker cranes, shuttle systems, order-picking mezzanines, and cube storage density calculations.' },
          { num: 'Module 02', hours: '15 Guided Hours', title: 'AMR/AGV Fleet Management & Robotic Pathfinding', desc: 'SLAM navigation, QR-grid guidance, collision avoidance, charging dock allocation, and goods-to-person (G2P) throughput.' },
          { num: 'Module 03', hours: '15 Guided Hours', title: 'WMS/WCS Architecture & Real-Time Telematics', desc: 'Inbound receiving, dynamic wave picking, batch picking, conveyor sorting systems, and REST API integration with SAP/Oracle.' },
          { num: 'Module 04', hours: '15 Guided Hours', title: 'Fulfillment Center Lean Optimization & Capstone', desc: 'Slotting analysis, pick-path minimization, cross-docking schedules, inventory cycle counting via drone/RFID, and project defense.' }
        ],
        certHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Industry Certification</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 12px;">
            Graduates earn the <strong>Certified Smart Warehousing Systems Architect (CSWSA)</strong> credential issued jointly by The SandBox Academy and leading robotic hardware partners.
          </p>
        `
      },

      'port-maritime': {
        id: 'port-maritime',
        title: 'Container Port Operations & Berth Allocation Planning',
        shortTitle: 'Container Port Operations & Planning',
        badge: 'MARITIME ACADEMY',
        badgeIcon: 'fa-anchor',
        badgeBg: '#EAF1F7',
        badgeColor: '#123B5D',
        provider: 'Endorsed by <strong>Vietnam Seaports Association (VPA) &amp; Maritime Academy</strong>',
        lead: 'Comprehensive curriculum on Terminal Operating Systems (TOS), vessel stowage planning, quay crane allocation productivity, and intermodal container yard drayage across Vietnam deepwater gateways.',
        duration: '10 Weeks &bull; 100 Hours',
        format: 'Weekend Classroom &bull; Terminal Practicum',
        location: 'Cai Mep Deepwater Hub &amp; Lach Huyen Port',
        language: 'Bilingual (VN &bull; EN)',
        intake: '28 November 2026',
        tuition: '16,000,000 VND',
        discount: '13,900,000 VND for VPA Member Terminals',
        overviewHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Programme Overview</h2>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 14px;">
            As Vietnam's gateway container ports at Cai Mep and Lach Huyen welcome mega-vessels exceeding 24,000 TEU, terminal operating complexity demands advanced planning expertise.
          </p>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
            Learn berth scheduling, quay crane split productivity, yard block optimization, gate automation via OCR and RFID, and green port environmental standards.
          </p>
        `,
        modules: [
          { num: 'Module 01', hours: '25 Guided Hours', title: 'Port Economics & Deepwater Terminal Master Planning', desc: 'Maritime cargo flows, vessel size evolution, channel draft management, quay wall geotechnical standards, and concession agreements.' },
          { num: 'Module 02', hours: '25 Guided Hours', title: 'Berth Allocation Planning & Quay Crane Scheduling', desc: 'Continuous berth planning, quay crane split productivity (GMPH), tidal navigation constraints, and vessel arrival buffer heuristics.' },
          { num: 'Module 03', hours: '25 Guided Hours', title: 'Container Yard Management & Drayage Operations', desc: 'Yard block stacking strategies, rubber-tyred gantry (RTG) and rail-mounted gantry (RMG) cycles, reefer monitoring, and gate OCR queues.' },
          { num: 'Module 04', hours: '25 Guided Hours', title: 'TOS Systems & Digital Smart Port Practicum', desc: 'Navis N4 / COSMOS software operation, vessel stowage planning (BAPLIE), EDI bayplan exchange, and 2-day on-site terminal shifts.' }
        ],
        certHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Seaport Professional Certification</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 12px;">
            Graduates are awarded the <strong>Executive Diploma in Container Terminal Operations (ED-CTO)</strong> co-certified by the Vietnam Seaports Association (VPA).
          </p>
        `
      },

      'cold-chain': {
        id: 'cold-chain',
        title: 'Cold Chain Management & Good Distribution Practices (GDP)',
        shortTitle: 'Cold Chain & GDP Management',
        badge: 'PHARMA & HEALTHCARE',
        badgeIcon: 'fa-snowflake',
        badgeBg: '#F1F5F9',
        badgeColor: '#0F172A',
        provider: 'Curated by <strong>Cold Chain Alliance &amp; VLI Healthcare Logistics Desk</strong>',
        lead: 'Certified professional qualification on temperature-controlled transport, vaccine cold storage validation, reefer container telematics, WHO Good Distribution Practices (GDP), and perishables export protocols.',
        duration: '4 Weeks &bull; 40 Hours',
        format: 'Intensive Weekend &bull; Cold Storage Field Lab',
        location: 'Gemadept Cold Storage DC, Song Than &amp; Online',
        language: 'Vietnamese &amp; English Instruction',
        intake: '10 November 2026',
        tuition: '8,500,000 VND',
        discount: '7,200,000 VND for VLA & Agro-Export Partners',
        overviewHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Programme Overview</h2>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 14px;">
            Preserving cargo integrity across -80C deep freeze, -20C frozen, and +2C to +8C pharmaceutical ranges is vital for Vietnam's seafood exports and pharmaceutical distribution.
          </p>
          <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
            This course equips professionals with temperature monitoring validation, data logger SOPs, thermal packaging design, reefer pre-trip inspections (PTI), and regulatory audit defense.
          </p>
        `,
        modules: [
          { num: 'Module 01', hours: '10 Guided Hours', title: 'Thermodynamic Principles & Cold Chain Packaging', desc: 'Heat transfer, phase change materials (PCM), vacuum insulated panels (VIP), dry ice sublimation rates, and refrigerated truck body specs.' },
          { num: 'Module 02', hours: '10 Guided Hours', title: 'Reefer Container Operations & Maritime Telematics', desc: 'Pre-trip inspections (PTI), controlled atmosphere (CA) cargo, humidity regulation, Genset logistics, and cold treatment (CT) quarantine protocols.' },
          { num: 'Module 03', hours: '10 Guided Hours', title: 'WHO GDP & Ministry of Health Compliance', desc: 'GDP guidelines (Circular 36/2018/TT-BYT), temperature mapping of warehouses, temperature excursion CAPA, and cold chain risk assessment.' },
          { num: 'Module 04', hours: '10 Guided Hours', title: 'Cold Storage Facility Audits & Sensor Networks', desc: 'IoT wireless temperature sensor placement, blast freezer operations, automated high-bay cold storage, and emergency power backup protocols.' }
        ],
        certHtml: `
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 14px;">Healthcare Logistics Certification</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 12px;">
            Graduates receive the <strong>Certified Cold Chain Logistics Specialist (CCLS)</strong> credential compliant with WHO GDP and Ministry of Health standards.
          </p>
        `
      }
    };

    let activeCourse = COURSES_DATA['fiata-diploma'];

    function hydrateCourseDetail() {
      const params = new URLSearchParams(window.location.search);
      const courseId = params.get('id') || 'fiata-diploma';
      if (COURSES_DATA[courseId]) {
        activeCourse = COURSES_DATA[courseId];
      } else {
        activeCourse = COURSES_DATA['fiata-diploma'];
      }

      // Update Document Title
      document.title = activeCourse.title + ' - The SandBox Academy';

      // Update Breadcrumb & Header
      const breadcrumbEl = document.getElementById('course-breadcrumb-current');
      if (breadcrumbEl) breadcrumbEl.textContent = activeCourse.shortTitle;

      const badgeEl = document.getElementById('course-badge');
      if (badgeEl) {
        badgeEl.style.background = activeCourse.badgeBg;
        badgeEl.style.color = activeCourse.badgeColor;
        badgeEl.innerHTML = `<i class="fa-solid ${activeCourse.badgeIcon}"></i> ${activeCourse.badge}`;
      }

      const providerEl = document.getElementById('course-provider-line');
      if (providerEl) providerEl.innerHTML = activeCourse.provider;

      const titleEl = document.getElementById('course-main-title');
      if (titleEl) titleEl.textContent = activeCourse.title;

      const descEl = document.getElementById('course-main-desc');
      if (descEl) descEl.textContent = activeCourse.lead;

      // Update Fact Cells
      const durationEl = document.getElementById('fact-duration');
      if (durationEl) durationEl.innerHTML = activeCourse.duration;

      const formatEl = document.getElementById('fact-format');
      if (formatEl) formatEl.innerHTML = activeCourse.format;

      const locEl = document.getElementById('fact-location');
      if (locEl) locEl.innerHTML = activeCourse.location;

      const langEl = document.getElementById('fact-language');
      if (langEl) langEl.innerHTML = activeCourse.language;

      const intakeEl = document.getElementById('fact-intake');
      if (intakeEl) intakeEl.innerHTML = activeCourse.intake;

      // Update Overview
      const overviewEl = document.getElementById('course-overview-card');
      if (overviewEl && activeCourse.overviewHtml) {
        overviewEl.innerHTML = activeCourse.overviewHtml;
      }

      // Update Curriculum Modules
      const currContainer = document.getElementById('course-curriculum-container');
      if (currContainer && activeCourse.modules) {
        currContainer.innerHTML = activeCourse.modules.map(m => `
          <div style="background: #F8FAFC; border-radius: 8px; padding: 16px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="module-badge-num">${m.num}</span>
              <span class="module-hours-text"><i class="fa-regular fa-clock"></i> ${m.hours}</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; color: #0F172A; margin: 0 0 4px;">${m.title}</h3>
            <p style="font-size: 13.5px; color: #475569; margin: 0; line-height: 1.5;">${m.desc}</p>
          </div>
        `).join('');
      }

      // Update Certification card
      const certCard = document.getElementById('course-cert-card');
      if (certCard && activeCourse.certHtml) {
        certCard.innerHTML = activeCourse.certHtml;
      }

      // Update Sidebar
      const tuitionEl = document.getElementById('sidebar-tuition-val');
      if (tuitionEl) tuitionEl.textContent = activeCourse.tuition;

      const discountEl = document.getElementById('sidebar-discount-label');
      if (discountEl) discountEl.textContent = activeCourse.discount;

      const sideIntakeEl = document.getElementById('sidebar-next-intake');
      if (sideIntakeEl) sideIntakeEl.textContent = activeCourse.intake;

      // Update Modals
      const enrollTitle = document.getElementById('modal-enroll-course-title');
      if (enrollTitle) enrollTitle.textContent = 'Admission Application - ' + activeCourse.shortTitle;

      const consultTitle = document.getElementById('modal-consult-course-title');
      if (consultTitle) consultTitle.textContent = 'Academic Consultation - ' + activeCourse.shortTitle;
    }

    document.addEventListener('DOMContentLoaded', hydrateCourseDetail);

    function openEnrollModal() {
      const modal = document.getElementById('modal-enrollment');
      if (modal) modal.style.display = 'flex';
    }

    function closeEnrollModal() {
      const modal = document.getElementById('modal-enrollment');
      if (modal) modal.style.display = 'none';
    }

    function openConsultModal() {
      const modal = document.getElementById('modal-consultation');
      if (modal) modal.style.display = 'flex';
    }

    function closeConsultModal() {
      const modal = document.getElementById('modal-consultation');
      if (modal) modal.style.display = 'none';
    }

    function closeReceiptModal() {
      const modal = document.getElementById('modal-receipt');
      if (modal) modal.style.display = 'none';
    }

    function trackSyllabusDownload() {
      showToast('Downloading ' + (activeCourse ? activeCourse.shortTitle : 'Course') + ' Syllabus (PDF)...');
    }

    function handleEnrollSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('enroll-name').value.trim();
      const email = document.getElementById('enroll-email').value.trim();
      const phone = document.getElementById('enroll-phone').value.trim();
      const role = document.getElementById('enroll-role').value.trim();
      const sponsor = document.getElementById('enroll-sponsor').value;

      const ref = 'ENR-2026-' + (activeCourse ? activeCourse.id.toUpperCase().slice(0, 5) : 'CRSE') + '-' + Math.floor(1000 + Math.random() * 9000);

      // Persist to localStorage for verified persistence
      const applicationData = {
        ref: ref,
        name: name,
        email: email,
        phone: phone,
        role: role,
        sponsor: sponsor,
        courseId: activeCourse ? activeCourse.id : 'fiata-diploma',
        course: activeCourse ? activeCourse.title : 'FIATA Higher International Diploma in Supply Chain Management',
        submittedAt: new Date().toISOString(),
        status: 'Under Academic Review'
      };

      try {
        const stored = JSON.parse(localStorage.getItem('sandbox_course_enrollments') || '[]');
        stored.push(applicationData);
        localStorage.setItem('sandbox_course_enrollments', JSON.stringify(stored));
      } catch (err) {
        console.error('Storage write error:', err);
      }

      closeEnrollModal();

      // Show receipt modal with real details
      document.getElementById('receipt-ref').innerText = ref;
      document.getElementById('receipt-name').innerText = name;
      document.getElementById('modal-receipt').style.display = 'flex';

      showToast('Enrolment dossier submitted. Ref: ' + ref);
      document.getElementById('course-enroll-form').reset();
    }

    function handleConsultSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('consult-name').value.trim();
      const contact = document.getElementById('consult-contact').value.trim();
      const topic = document.getElementById('consult-topic').value;

      const ref = 'CON-2026-' + (activeCourse ? activeCourse.id.toUpperCase().slice(0, 5) : 'CRSE') + '-' + Math.floor(1000 + Math.random() * 9000);

      const consultData = {
        ref: ref,
        name: name,
        contact: contact,
        topic: topic,
        courseId: activeCourse ? activeCourse.id : 'fiata-diploma',
        course: activeCourse ? activeCourse.title : 'FIATA Higher International Diploma in Supply Chain Management',
        submittedAt: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('sandbox_course_consultations') || '[]');
        stored.push(consultData);
        localStorage.setItem('sandbox_course_consultations', JSON.stringify(stored));
      } catch (err) {
        console.error('Consult storage write error:', err);
      }

      closeConsultModal();
      showToast('Consultation request ' + ref + ' received. An advisor will contact ' + name + ' within 1 business day.');
      document.getElementById('course-consult-form').reset();
    }
  

// Global SPA Router Hook for Course Detail
window.showCourseDetail = function(courseId) {
  if (!courseId) courseId = 'fiata-diploma';
  if (typeof hydrateCourseDetail === 'function') {
    hydrateCourseDetail(courseId);
  }
  if (typeof switchView === 'function') {
    switchView('course-detail', false);
  }
  window.location.hash = `course?id=${encodeURIComponent(courseId)}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 3. COMPANIES CATALOG FILTERING

    window.currentCompanyFilter = 'all';

    function setCompanyFilter(cat, btn) {
      document.querySelectorAll('.co-filter-chip').forEach(function(c) { c.classList.remove('active'); });
      if (btn) btn.classList.add('active');
      window.currentCompanyFilter = cat;
      filterCompanies();
    }

    function filterCompanies() {
      var query = (document.getElementById('companies-search-input').value || '').trim().toLowerCase();
      var cat = window.currentCompanyFilter || 'all';
      var clearBtn = document.getElementById('btn-clear-search');
      if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

      var cards = document.querySelectorAll('.co-card');
      var visibleCount = 0;
      cards.forEach(function(card) {
        var cardCat = card.getAttribute('data-category') || '';
        var cardName = card.getAttribute('data-name') || '';
        var matchesCat = (cat === 'all') || cardCat.indexOf(cat) !== -1;
        var matchesQuery = !query || cardName.indexOf(query) !== -1 || card.textContent.toLowerCase().indexOf(query) !== -1;
        if (matchesCat && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      var countEl = document.getElementById('co-visible-count');
      if (countEl) countEl.textContent = visibleCount;
      var emptyEl = document.getElementById('co-empty-state');
      if (emptyEl) emptyEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    function clearCompanySearch() {
      var input = document.getElementById('companies-search-input');
      if (input) input.value = '';
      filterCompanies();
    }

    function resetCompanyFilters() {
      clearCompanySearch();
      var allBtn = document.querySelector('.co-filter-chip[data-filter="all"]');
      if (allBtn) setCompanyFilter('all', allBtn);
    }
  

// 4. COURSES CATALOG FILTERING

    function filterCoursesByPill(btn, category) {
      document.querySelectorAll('.course-filter-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = '#F1F5F9';
        b.style.color = '#475569';
        b.style.border = 'none';
      });
      btn.classList.add('active');
      btn.style.background = '#123B5D';
      btn.style.color = '#FFFFFF';
      btn.style.border = 'none';

      const cards = document.querySelectorAll('.course-card');
      let visible = 0;
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (category === 'all' || cat === category) {
          card.style.display = 'flex';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
      document.getElementById('course-count-label').textContent = 'Showing ' + visible + ' verified programs';
    }

    function filterCourseCards() {
      const q = (document.getElementById('course-search-input').value || '').toLowerCase().trim();
      const cards = document.querySelectorAll('.course-card');
      let visible = 0;
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = 'flex';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
      document.getElementById('course-count-label').textContent = 'Showing ' + visible + ' verified programs';
    }
  
