// === COURSES PAGE CONTROLLER ================================
// ============================================================
(function () {
  'use strict';

  // ── COURSES DATABASE ────────────────────────────────────────
  const COURSES_DB = [
    {
      id: 1,
      title: 'FIATA Higher International Diploma in Supply Chain Management',
      instructor: 'TS. Nguyễn Thành Long',
      org: 'VALOMA Institute',
      category: 'fiata',
      categoryLabel: 'FIATA & Maritime',
      duration: '16 weeks',
      hours: 160,
      modules: 12,
      level: 'Advanced',
      price: 24900000,
      priceFormatted: '24,900,000 ₫',
      rating: 4.9,
      reviews: 847,
      enrolled: 2847,
      image: 'images/course_1.jpg',
      badge: 'bestseller',
      tags: ['fiata', 'supply chain', 'international trade'],
      description: 'The world\'s most recognized logistics qualification. Master end-to-end supply chain operations, FIATA documentation, and international trade compliance.',
      updated: 'Oct 2026',
      language: 'Vietnamese / English',
      curriculum: [
        { title: 'Module 1: Foundations of International Logistics', lessons: 6, duration: '14h', content: ['Introduction to global supply chains', 'Key players and stakeholders', 'Trade flows and Vietnam\'s logistics landscape', 'Industry certifications overview', 'Case study: Maersk Vietnam operations', 'Module assessment'] },
        { title: 'Module 2: FIATA Documentation & Trade Finance', lessons: 5, duration: '12h', content: ['FIATA Bill of Lading (FBL)', 'Multimodal Transport Documents', 'Letters of Credit and trade finance instruments', 'Documentary collections', 'Practice: Document preparation workshop'] },
        { title: 'Module 3: Customs Compliance & Tariff Classification', lessons: 6, duration: '14h', content: ['HS Code classification methodology', 'Vietnam Customs procedures (VNACCS/VCIS)', 'Rules of Origin and FTA implications', 'Customs valuation methods', 'AEO certification benefits', 'Compliance audit simulation'] },
        { title: 'Module 4: Ocean Freight & Port Operations', lessons: 5, duration: '13h', content: ['Container shipping fundamentals', 'Port of Ho Chi Minh City operations', 'Vessel booking and space allocation', 'Bill of Lading types and legal implications', 'Port agency and stevedoring'] },
        { title: 'Module 5: Air Freight & Multimodal Transport', lessons: 4, duration: '10h', content: ['Air cargo booking and AWB preparation', 'IATA regulations overview', 'Intermodal and multimodal solutions', 'Transport cost optimization'] },
        { title: 'Module 6: Supply Chain Strategy & Design', lessons: 6, duration: '15h', content: ['Supply chain network design', 'Make-or-buy decisions', 'Supplier selection and evaluation', 'Risk mitigation frameworks', 'Digital transformation in SC', 'Strategic case studies'] },
        { title: 'Module 7: Warehousing & Inventory Management', lessons: 5, duration: '12h', content: ['Warehouse design and layout optimization', 'WMS implementation fundamentals', 'Inventory control methods (EOQ, JIT)', 'ABC analysis and cycle counting', 'Cold chain storage requirements'] },
        { title: 'Module 8: Procurement & Strategic Sourcing', lessons: 4, duration: '10h', content: ['Category management approach', 'Supplier negotiation techniques', 'Procurement contracts and terms', 'E-procurement platforms'] },
      ],
      requirements: [
        'Basic understanding of import/export operations',
        'At least 1 year of experience in logistics or related field',
        'Proficiency in Vietnamese; English reading ability is advantageous',
        'Access to a computer with internet connection for online modules',
      ],
      outcomes: [
        'Master FIATA documentation and international trade compliance',
        'Design end-to-end supply chain strategies for Vietnamese markets',
        'Apply lean and Six Sigma methodologies to logistics operations',
        'Manage multimodal transport and customs clearance processes',
      ],
    },
    {
      id: 2,
      title: 'IATA Dangerous Goods Regulations Cat.6 Certification',
      instructor: 'Capt. Trần Văn Minh',
      org: 'Vietnam Airlines Training Center',
      category: 'aviation',
      categoryLabel: 'Air Cargo IATA',
      duration: '5 days',
      hours: 40,
      modules: 6,
      level: 'Intermediate',
      price: 12500000,
      priceFormatted: '12,500,000 ₫',
      rating: 4.8,
      reviews: 412,
      enrolled: 1203,
      image: 'images/course_2.jpg',
      badge: 'hot',
      tags: ['iata', 'dangerous goods', 'aviation', 'DGR'],
      description: 'IATA-accredited Cat.6 DGR certification for freight forwarders and cargo handlers. Covers identification, classification, packaging, marking, and documentation of dangerous goods for air transport.',
      updated: 'Sep 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Day 1: DGR Foundations & Classifications', lessons: 4, duration: '8h', content: ['9 Classes of Dangerous Goods', 'Packing groups and hazard labels', 'Forbidden vs. permitted shipments', 'State and operator variations'] },
        { title: 'Day 2: Packing, Marking & Labelling', lessons: 4, duration: '8h', content: ['UN specification packaging requirements', 'Marking standards and label placement', 'Combination packaging rules', 'Overpacks and unit load devices'] },
        { title: 'Day 3: Documentation & Acceptance', lessons: 3, duration: '8h', content: ['Shipper\'s Declaration completion', 'Acceptance checklist procedures', 'Cargo Aircraft Only (CAO) restrictions', 'Quantity limits per package/aircraft'] },
        { title: 'Day 4: Specific Commodity Groups', lessons: 4, duration: '8h', content: ['Lithium batteries (Section II)', 'Dry Ice (Class 9)', 'Infectious substances (Class 6.2)', 'Radioactive materials handling'] },
        { title: 'Day 5: Emergencies, Exam Prep & Assessment', lessons: 3, duration: '8h', content: ['Emergency response procedures', 'Pilot Notification requirements', 'Mock IATA examination', 'Certification assessment'] },
      ],
      requirements: ['Current employment in freight forwarding or air cargo handling', 'Valid company ID or employment letter'],
      outcomes: ['Classify and document dangerous goods per IATA DGR 65th Edition', 'Apply acceptance procedures at cargo facilities', 'Respond correctly to DG incidents', 'Renew certification every 2 years per IATA standards'],
    },
    {
      id: 3,
      title: 'Vietnam Customs Clearance Specialist (VCCS)',
      instructor: 'ThS. Lê Thị Hoa',
      org: 'Vietnam Customs Training Institute',
      category: 'customs',
      categoryLabel: 'Customs & Tariffs',
      duration: '8 weeks',
      hours: 80,
      modules: 8,
      level: 'Intermediate',
      price: 8900000,
      priceFormatted: '8,900,000 ₫',
      rating: 4.7,
      reviews: 623,
      enrolled: 2156,
      image: 'images/course_3.jpg',
      badge: null,
      tags: ['customs', 'clearance', 'vietnam', 'VNACCS'],
      description: 'Comprehensive training in Vietnam customs procedures. Master the VNACCS/VCIS electronic declaration system, HS classification, and regulatory compliance for import/export.',
      updated: 'Oct 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Vietnam Customs Legal Framework', lessons: 5, duration: '10h', content: ['Customs Law 2014 and amendments', 'Circular 38/2015 implementation', 'Customs agency roles and jurisdiction', 'Post-clearance audit framework', 'AEO (Authorized Economic Operator) certification'] },
        { title: 'Module 2: HS Code Classification', lessons: 6, duration: '12h', content: ['General Rules of Interpretation (GRI)', 'Vietnam Schedule of Import Duties', 'ASEAN Harmonized Tariff Nomenclature', 'Classification disputes and appeals', 'Binding ruling applications', 'Practice: 50-item classification exercise'] },
        { title: 'Module 3: VNACCS/VCIS Electronic System', lessons: 5, duration: '10h', content: ['System registration and login', 'Declaration form types (A, B, C1-C3)', 'Electronic manifest submission', 'C1/C2/C3 channel assignment factors', 'Error correction procedures'] },
        { title: 'Module 4: Import Procedures & Duties', lessons: 4, duration: '8h', content: ['Import duty calculation methods', 'VAT and excise tax on imports', 'Anti-dumping and safeguard measures', 'Import licensing requirements'] },
      ],
      requirements: ['Basic knowledge of international trade', 'Familiarity with Vietnamese import/export documentation'],
      outcomes: ['File accurate customs declarations in VNACCS/VCIS', 'Classify goods using Vietnam Tariff Schedule', 'Calculate import duties and taxes correctly', 'Manage customs audits and compliance reviews'],
    },
    {
      id: 4,
      title: 'Certified Supply Chain Professional (CSCP) — APICS',
      instructor: 'TS. Phạm Hữu Đức',
      org: 'APICS Vietnam Chapter',
      category: 'fiata',
      categoryLabel: 'FIATA & Maritime',
      duration: '12 weeks',
      hours: 120,
      modules: 10,
      level: 'Advanced',
      price: 32000000,
      priceFormatted: '32,000,000 ₫',
      rating: 4.9,
      reviews: 289,
      enrolled: 876,
      image: 'images/course_4.jpg',
      badge: 'bestseller',
      tags: ['apics', 'cscp', 'supply chain', 'professional'],
      description: 'The globally recognized CSCP designation from APICS. Covers integrated supply chain management from supplier to customer, including digital transformation and sustainability.',
      updated: 'Sep 2026',
      language: 'Vietnamese / English',
      curriculum: [
        { title: 'Module 1: Supply Chain Design', lessons: 6, duration: '15h', content: ['Global supply chain strategy', 'Make-or-buy analysis', 'Network optimization models', 'Sustainability in SC design', 'Risk management frameworks', 'Digital twin applications'] },
        { title: 'Module 2: Planning & Forecasting', lessons: 5, duration: '12h', content: ['Demand planning techniques', 'Sales & Operations Planning (S&OP)', 'Collaborative Planning (CPFR)', 'Forecasting accuracy metrics', 'AI-driven demand sensing'] },
        { title: 'Module 3: Sourcing & Procurement', lessons: 4, duration: '10h', content: ['Strategic sourcing methodology', 'Supplier relationship management', 'Contract types and negotiations', 'Total Cost of Ownership (TCO)'] },
        { title: 'Module 4: Logistics & Transportation', lessons: 5, duration: '13h', content: ['Mode selection optimization', 'Carrier contracts and negotiations', 'Last-mile delivery solutions', 'Freight audit and payment', 'Cross-border logistics'] },
      ],
      requirements: ['Minimum 3 years supply chain experience', 'APICS membership recommended', 'Basic statistics knowledge'],
      outcomes: ['Earn globally recognized CSCP designation', 'Design integrated supply chain strategies', 'Implement S&OP processes', 'Apply digital transformation tools to supply chain'],
    },
    {
      id: 5,
      title: 'Cold Chain Management & GDP Compliance',
      instructor: 'DS. Nguyễn Thị Thanh Thảo',
      org: 'Vietnam Pharma Logistics Institute',
      category: 'coldchain',
      categoryLabel: 'Cold Chain',
      duration: '4 weeks',
      hours: 40,
      modules: 5,
      level: 'Intermediate',
      price: 8500000,
      priceFormatted: '8,500,000 ₫',
      rating: 4.8,
      reviews: 334,
      enrolled: 1456,
      image: 'images/course_1.jpg',
      badge: null,
      tags: ['cold chain', 'GDP', 'pharma', 'temperature'],
      description: 'Master WHO Good Distribution Practice (GDP) guidelines and cold chain logistics for pharmaceutical, food, and chemical products.',
      updated: 'Aug 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Cold Chain Fundamentals', lessons: 4, duration: '8h', content: ['Temperature-sensitive product categories', 'Cold chain infrastructure overview', 'Regulatory requirements (GDP, GWP)', 'Risk assessment and mapping'] },
        { title: 'Module 2: GDP Guidelines Implementation', lessons: 5, duration: '10h', content: ['WHO Technical Report Series 961', 'Quality management in cold chain', 'Qualified Person responsibilities', 'Deviation management procedures', 'Self-inspection protocols'] },
        { title: 'Module 3: Equipment & Monitoring', lessons: 4, duration: '8h', content: ['Refrigeration equipment types and validation', 'Temperature monitoring devices (data loggers)', 'Calibration and qualification protocols', 'Alarm response procedures'] },
        { title: 'Module 4: Transportation & Distribution', lessons: 3, duration: '8h', content: ['Refrigerated vehicle requirements', 'Route planning for cold chain', 'Packaging and insulation solutions', 'Last-mile cold delivery challenges'] },
        { title: 'Module 5: Audit Preparation & Compliance', lessons: 2, duration: '6h', content: ['WHO audit checklist walkthrough', 'Documentation requirements', 'CAPA (Corrective and Preventive Actions)'] },
      ],
      requirements: ['Background in pharmacy, food science, or logistics', 'Basic understanding of regulatory environments'],
      outcomes: ['Implement GDP-compliant cold chain operations', 'Design temperature monitoring protocols', 'Prepare for WHO and MOLISA audits', 'Manage cold chain incidents and deviations'],
    },
    {
      id: 6,
      title: 'WMS Implementation & SAP EWM',
      instructor: 'Mr. Trần Minh Khoa',
      org: 'SAP Vietnam Partner Academy',
      category: 'warehouse',
      categoryLabel: 'Smart Warehousing',
      duration: '6 weeks',
      hours: 60,
      modules: 7,
      level: 'Intermediate',
      price: 15800000,
      priceFormatted: '15,800,000 ₫',
      rating: 4.7,
      reviews: 198,
      enrolled: 743,
      image: 'images/course_2.jpg',
      badge: 'new',
      tags: ['SAP', 'EWM', 'WMS', 'warehouse management'],
      description: 'Hands-on SAP Extended Warehouse Management (EWM) training covering system configuration, process setup, and integration with MM and SD modules.',
      updated: 'Oct 2026',
      language: 'Vietnamese / English',
      curriculum: [
        { title: 'Module 1: WMS Fundamentals & SAP EWM Overview', lessons: 4, duration: '8h', content: ['WMS market landscape', 'SAP EWM architecture', 'Master data management', 'Integration points with SAP S/4HANA'] },
        { title: 'Module 2: Warehouse Structure & Configuration', lessons: 5, duration: '10h', content: ['Warehouse number and type setup', 'Storage type and bin management', 'Work center configuration', 'Resource management setup', 'Activity area definition'] },
        { title: 'Module 3: Inbound & Outbound Processes', lessons: 5, duration: '12h', content: ['Goods receipt and putaway strategies', 'Transfer order creation and confirmation', 'Pick, pack, and ship processes', 'Cross-docking configuration', 'Returns processing'] },
        { title: 'Module 4: Inventory Management in EWM', lessons: 3, duration: '8h', content: ['Physical inventory procedures', 'Cycle counting configuration', 'Stock overview and reporting'] },
      ],
      requirements: ['Basic SAP navigation knowledge recommended', 'Understanding of warehouse operations'],
      outcomes: ['Configure SAP EWM for warehouse operations', 'Implement inbound and outbound processes', 'Manage inventory in SAP EWM', 'Integrate EWM with other SAP modules'],
    },
    {
      id: 7,
      title: 'Navis N4 Terminal Operating System (TOS)',
      instructor: 'Mr. Lê Văn Hải',
      org: 'Cảng Sài Gòn Training Center',
      category: 'warehouse',
      categoryLabel: 'Smart Warehousing',
      duration: '3 weeks',
      hours: 30,
      modules: 4,
      level: 'Beginner',
      price: 7500000,
      priceFormatted: '7,500,000 ₫',
      rating: 4.6,
      reviews: 156,
      enrolled: 892,
      image: 'images/course_3.jpg',
      badge: null,
      tags: ['navis', 'TOS', 'terminal', 'port operations'],
      description: 'Comprehensive training on Navis N4 Terminal Operating System used in major Vietnamese container terminals including Cat Lai, Tan Cang, and Vung Tau.',
      updated: 'Jul 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: N4 System Overview', lessons: 3, duration: '7h', content: ['N4 architecture and modules', 'User interface navigation', 'Master data setup (vessels, berths, blocks)'] },
        { title: 'Module 2: Vessel Planning & Berthing', lessons: 3, duration: '8h', content: ['Pre-arrival vessel processing', 'Bay plan management', 'Load list and discharge list processing', 'Berth assignment and scheduling'] },
        { title: 'Module 3: Yard Management', lessons: 2, duration: '8h', content: ['Container positioning and stacking', 'Yard crane work queue management', 'Reefer monitoring and power management'] },
        { title: 'Module 4: Gate Operations', lessons: 2, duration: '7h', content: ['Truck appointment system', 'Gate-in and gate-out processes', 'OCR integration and exception handling'] },
      ],
      requirements: ['Employment at a container terminal or port', 'Basic computer literacy'],
      outcomes: ['Navigate and operate Navis N4 TOS', 'Manage vessel operations and yard planning', 'Process gate transactions efficiently', 'Generate operational reports'],
    },
    {
      id: 8,
      title: 'IATA Air Cargo Introductory Course',
      instructor: 'Ms. Phạm Thanh Huyền',
      org: 'Vietnam Air Cargo Training Center',
      category: 'aviation',
      categoryLabel: 'Air Cargo IATA',
      duration: '2 weeks',
      hours: 20,
      modules: 4,
      level: 'Beginner',
      price: 5900000,
      priceFormatted: '5,900,000 ₫',
      rating: 4.6,
      reviews: 445,
      enrolled: 2341,
      image: 'images/course_4.jpg',
      badge: null,
      tags: ['iata', 'air cargo', 'aviation', 'AWB'],
      description: 'IATA-approved introductory program for professionals entering the air cargo industry. Covers AWB preparation, cargo handling, and aviation security basics.',
      updated: 'Aug 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Air Cargo Industry Fundamentals', lessons: 3, duration: '5h', content: ['Global air freight market overview', 'Key players: airlines, forwarders, handlers', 'Vietnam air cargo landscape', 'Regulatory framework (ICAO, IATA)'] },
        { title: 'Module 2: Air Waybill (AWB) & Documentation', lessons: 3, duration: '5h', content: ['AWB structure and completion', 'Master AWB vs. House AWB', 'Electronic AWB (e-AWB) initiative', 'Cargo manifest requirements'] },
        { title: 'Module 3: Cargo Handling & Special Cargo', lessons: 3, duration: '5h', content: ['Unit Load Device (ULD) types', 'Dangerous goods overview (Cat 6)', 'Live animals and perishables handling', 'Vulnerable cargo security'] },
        { title: 'Module 4: Security & Compliance', lessons: 2, duration: '5h', content: ['Known Consignor program', 'Regulated Agent requirements', 'Cargo screening procedures', 'ISAGO audit standards'] },
      ],
      requirements: ['Interest in air cargo or freight forwarding career', 'No prior experience required'],
      outcomes: ['Understand air cargo operations from booking to delivery', 'Complete Air Waybills accurately', 'Handle special cargo categories safely', 'Apply basic aviation security principles'],
    },
    {
      id: 9,
      title: 'Incoterms 2020 Masterclass',
      instructor: 'LS. Nguyễn Hồng Hà',
      org: 'Vietnam Chamber of Commerce (VCCI)',
      category: 'customs',
      categoryLabel: 'Customs & Tariffs',
      duration: '3 days',
      hours: 24,
      modules: 3,
      level: 'All Levels',
      price: 3500000,
      priceFormatted: '3,500,000 ₫',
      rating: 4.9,
      reviews: 1203,
      enrolled: 5892,
      image: 'images/course_1.jpg',
      badge: 'bestseller',
      tags: ['incoterms', 'trade terms', 'contracts', 'ICC'],
      description: 'Master all 11 Incoterms 2020 rules published by ICC. Learn risk transfer points, cost allocation, and optimal term selection for different trade scenarios.',
      updated: 'Oct 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Day 1: Incoterms 2020 Framework', lessons: 4, duration: '8h', content: ['ICC Incoterms 2020 official rules', 'Changes from Incoterms 2010', 'Risk vs. cost allocation principles', 'Choosing the right Incoterm'] },
        { title: 'Day 2: Rules for Any Mode of Transport', lessons: 4, duration: '8h', content: ['EXW, FCA, CPT, CIP analysis', 'DAP, DPU, DDP obligations', 'Insurance requirements (CIP upgrade)', 'FCA on-board bill of lading option'] },
        { title: 'Day 3: Sea & Inland Waterway Rules + Practice', lessons: 3, duration: '8h', content: ['FAS, FOB, CFR, CIF in depth', 'Vietnamese practice: FOB vs CIF preference', 'Case studies and dispute resolution', 'Certification assessment'] },
      ],
      requirements: ['Basic knowledge of international trade contracts', 'No prior Incoterms experience required'],
      outcomes: ['Apply all 11 Incoterms 2020 rules correctly', 'Negotiate optimal trade terms with counterparts', 'Avoid common Incoterms misinterpretation errors', 'Draft compliant sales contracts'],
    },
    {
      id: 10,
      title: 'Vietnam Maritime Code & Port Regulations',
      instructor: 'TS. Hồ Minh Trí',
      org: 'Vietnam Maritime University (VMU)',
      category: 'fiata',
      categoryLabel: 'FIATA & Maritime',
      duration: '6 weeks',
      hours: 60,
      modules: 7,
      level: 'Intermediate',
      price: 9200000,
      priceFormatted: '9,200,000 ₫',
      rating: 4.7,
      reviews: 267,
      enrolled: 1123,
      image: 'images/course_2.jpg',
      badge: null,
      tags: ['maritime', 'port', 'shipping law', 'Vietnam'],
      description: 'Comprehensive study of Vietnam Maritime Code 2015, port state control, vessel registration, and shipping law. Essential for maritime professionals and freight forwarders.',
      updated: 'Jul 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Vietnam Maritime Code 2015', lessons: 4, duration: '9h', content: ['Scope and application of VMC 2015', 'Vessel nationality and registration', 'Manning requirements and seafarer certification', 'Liability of shipowners'] },
        { title: 'Module 2: Port State Control (PSC)', lessons: 3, duration: '8h', content: ['PSC inspection procedures', 'Deficiency categories and detention criteria', 'Tokyo MOU and Paris MOU frameworks', 'Port State Control database management'] },
        { title: 'Module 3: Cargo Liability & Marine Insurance', lessons: 4, duration: '10h', content: ['Bill of Lading as title document', 'Hague-Visby Rules', 'Hamburg Rules comparison', 'P&I Club coverage and claims'] },
        { title: 'Module 4: Port Operations & Regulations', lessons: 3, duration: '8h', content: ['Port authority jurisdiction', 'Dangerous cargo in ports', 'Environmental regulations (MARPOL)', 'Port charges and demurrage'] },
      ],
      requirements: ['Basic knowledge of shipping operations', 'Legal background is advantageous'],
      outcomes: ['Navigate Vietnam Maritime Code requirements', 'Manage PSC inspections effectively', 'Understand cargo liability regimes', 'Apply marine insurance principles'],
    },
    {
      id: 11,
      title: 'Cross-Border E-Commerce Logistics (Shopee/Lazada)',
      instructor: 'Mr. Vũ Quang Huy',
      org: 'Vietnam E-Commerce Association (VECOM)',
      category: 'customs',
      categoryLabel: 'Customs & Tariffs',
      duration: '4 weeks',
      hours: 40,
      modules: 5,
      level: 'Beginner',
      price: 6800000,
      priceFormatted: '6,800,000 ₫',
      rating: 4.8,
      reviews: 892,
      enrolled: 3421,
      image: 'images/course_3.jpg',
      badge: 'new',
      tags: ['e-commerce', 'shopee', 'lazada', 'cross-border'],
      description: 'Navigate cross-border e-commerce logistics on Shopee, Lazada, and TikTok Shop. Covers customs clearance for small parcels, returns management, and last-mile delivery.',
      updated: 'Oct 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Cross-Border E-Commerce Ecosystem', lessons: 3, duration: '8h', content: ['Platform comparison: Shopee vs Lazada vs TikTok', 'Logistics network structure', 'Customs de minimis thresholds', 'Courier vs. postal channels'] },
        { title: 'Module 2: Customs Clearance for Small Parcels', lessons: 4, duration: '10h', content: ['Simplified customs declaration for B2C', 'HS code for common e-commerce products', 'VAT and import duty on small packages', 'Anti-fraud and counterfeit prevention'] },
        { title: 'Module 3: Fulfillment & Warehousing Strategy', lessons: 3, duration: '8h', content: ['Shopee Fulfillment by Shopee (FBS)', 'Lazada Fulfillment by Lazada (FBL)', 'Third-party logistics (3PL) for e-commerce', 'Returns and reverse logistics'] },
        { title: 'Module 4: Last-Mile Delivery in Vietnam', lessons: 2, duration: '8h', content: ['Giao Hàng Nhanh (GHN) vs GHTK vs J&T', 'COD management and reconciliation', 'Delivery SLA management'] },
        { title: 'Module 5: Growth & Optimization', lessons: 2, duration: '6h', content: ['Logistics cost optimization strategies', 'Technology tools for order management', 'Building a cross-border logistics brand'] },
      ],
      requirements: ['Interest in e-commerce or logistics', 'Basic understanding of online selling platforms'],
      outcomes: ['Set up cross-border logistics operations on major platforms', 'Navigate customs procedures for e-commerce shipments', 'Optimize fulfillment and last-mile delivery costs', 'Manage returns efficiently'],
    },
    {
      id: 12,
      title: 'Supply Chain Analytics & Power BI',
      instructor: 'Mr. Đặng Quốc Tuấn',
      org: 'Digital Supply Chain Academy',
      category: 'warehouse',
      categoryLabel: 'Smart Warehousing',
      duration: '6 weeks',
      hours: 60,
      modules: 7,
      level: 'Intermediate',
      price: 11500000,
      priceFormatted: '11,500,000 ₫',
      rating: 4.8,
      reviews: 445,
      enrolled: 1876,
      image: 'images/course_4.jpg',
      badge: 'hot',
      tags: ['analytics', 'powerbi', 'data', 'supply chain'],
      description: 'Transform supply chain data into actionable insights using Microsoft Power BI. Build dashboards for inventory, transportation KPIs, and demand forecasting.',
      updated: 'Sep 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Data Foundations for Supply Chain', lessons: 4, duration: '8h', content: ['Supply chain KPI framework', 'Data sources in logistics (ERP, WMS, TMS)', 'ETL processes and data cleaning', 'Power BI Desktop introduction'] },
        { title: 'Module 2: Power BI for Logistics', lessons: 5, duration: '12h', content: ['Connecting to SAP/Oracle data sources', 'DAX formulas for logistics calculations', 'Time intelligence functions', 'Supply chain specific visuals', 'Drill-through reports'] },
        { title: 'Module 3: Inventory Analytics Dashboard', lessons: 4, duration: '10h', content: ['Inventory turnover and DOH metrics', 'ABC-XYZ segmentation visualization', 'Stockout and overstock alerts', 'Safety stock optimization models'] },
        { title: 'Module 4: Transportation & Delivery Analytics', lessons: 3, duration: '8h', content: ['On-time delivery performance tracking', 'Route efficiency analysis', 'Freight cost per unit metrics', 'Carrier scorecards'] },
      ],
      requirements: ['Basic Excel skills required', 'Free Power BI Desktop installation needed', 'Basic supply chain knowledge helpful'],
      outcomes: ['Build professional supply chain dashboards in Power BI', 'Create automated KPI reports', 'Perform inventory analytics and optimization', 'Present data insights to supply chain leadership'],
    },
    {
      id: 13,
      title: 'Logistics Fleet Management & GPS Telematics',
      instructor: 'Mr. Phan Thanh Sơn',
      org: 'Vietnam Trucking Association (VTA)',
      category: 'warehouse',
      categoryLabel: 'Smart Warehousing',
      duration: '4 weeks',
      hours: 40,
      modules: 5,
      level: 'Intermediate',
      price: 7200000,
      priceFormatted: '7,200,000 ₫',
      rating: 4.6,
      reviews: 234,
      enrolled: 967,
      image: 'images/course_1.jpg',
      badge: null,
      tags: ['fleet', 'GPS', 'telematics', 'transport management'],
      description: 'Master fleet management practices and GPS telematics systems for logistics trucking operations in Vietnam. Covers route optimization, driver management, and compliance.',
      updated: 'Jun 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Fleet Management Fundamentals', lessons: 3, duration: '8h', content: ['Fleet lifecycle management', 'Vehicle selection and specification', 'Total Cost of Ownership (TCO) for trucks', 'Maintenance scheduling and tracking'] },
        { title: 'Module 2: GPS & Telematics Systems', lessons: 3, duration: '8h', content: ['GPS tracking system setup', 'Real-time vehicle monitoring', 'Driver behavior analytics', 'Fuel consumption reporting'] },
        { title: 'Module 3: Route Optimization', lessons: 2, duration: '8h', content: ['Vehicle Routing Problem (VRP) basics', 'Route planning software (Google Maps API, HERE)', 'Dynamic re-routing capabilities', 'Multi-drop delivery sequencing'] },
        { title: 'Module 4: Vietnam Road Transport Compliance', lessons: 2, duration: '8h', content: ['Decree 10/2020 transport conditions', 'Driver working hours regulations', 'Dangerous goods road transport permits', 'Vehicle inspection requirements'] },
        { title: 'Module 5: Fleet Performance Analytics', lessons: 2, duration: '8h', content: ['KPI dashboards for fleet managers', 'Benchmarking fleet performance', 'Cost reduction strategies', 'Electrification transition planning'] },
      ],
      requirements: ['Experience in transport or logistics operations', 'Basic computer and smartphone skills'],
      outcomes: ['Implement GPS telematics for fleet monitoring', 'Optimize delivery routes and driver assignments', 'Ensure regulatory compliance for Vietnam road transport', 'Reduce fleet operating costs by 15-20%'],
    },
    {
      id: 14,
      title: 'IATA Live Animals Regulations (LAR)',
      instructor: 'Dr. Nguyễn Bích Liên',
      org: 'IATA Training Center — Hanoi',
      category: 'aviation',
      categoryLabel: 'Air Cargo IATA',
      duration: '2 days',
      hours: 16,
      modules: 3,
      level: 'Intermediate',
      price: 4500000,
      priceFormatted: '4,500,000 ₫',
      rating: 4.7,
      reviews: 134,
      enrolled: 487,
      image: 'images/course_2.jpg',
      badge: null,
      tags: ['IATA', 'live animals', 'LAR', 'cargo'],
      description: 'IATA-approved training for handling live animals in air cargo. Covers IATA LAR container requirements, documentation, and welfare obligations.',
      updated: 'May 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Day 1: LAR Framework & Animal Welfare', lessons: 3, duration: '8h', content: ['IATA Live Animals Regulations structure', 'CITES requirements for protected species', 'Animal welfare obligations (IATA, ICAO Annex 18)', 'Species-specific requirements overview'] },
        { title: 'Day 2: Container Certification & Documentation', lessons: 3, duration: '8h', content: ['IATA-approved container specifications', 'Shipper\'s Certification for Live Animals', 'Health certificate and permits', 'Emergency procedures for live cargo'] },
        { title: 'Module 3: Practical Assessment', lessons: 1, duration: '0h', content: ['Mock documentation preparation', 'Container inspection walkthrough', 'Certification exam'] },
      ],
      requirements: ['Employment with an airline, forwarder, or cargo handler', 'Completion of IATA Air Cargo Introductory Course recommended'],
      outcomes: ['Apply IATA LAR to live animal shipments', 'Prepare correct documentation for animal air transport', 'Ensure animal welfare compliance', 'Handle CITES-listed species correctly'],
    },
    {
      id: 15,
      title: 'ESG & Green Logistics Carbon Accounting',
      instructor: 'TS. Trần Thị Phương Lan',
      org: 'Sustainable Supply Chain Institute Vietnam',
      category: 'esg',
      categoryLabel: 'ESG & Green',
      duration: '4 weeks',
      hours: 40,
      modules: 5,
      level: 'Intermediate',
      price: 9800000,
      priceFormatted: '9,800,000 ₫',
      rating: 4.8,
      reviews: 312,
      enrolled: 1234,
      image: 'images/course_3.jpg',
      badge: 'new',
      tags: ['ESG', 'green logistics', 'carbon', 'sustainability'],
      description: 'Calculate and reduce carbon emissions in logistics operations. Master GHG Protocol, Scope 1-3 emissions reporting, and green logistics certifications.',
      updated: 'Oct 2026',
      language: 'Vietnamese / English',
      curriculum: [
        { title: 'Module 1: ESG Foundations for Logistics', lessons: 3, duration: '8h', content: ['ESG reporting frameworks (GRI, TCFD, CDP)', 'Vietnam ESG regulatory landscape 2024-2025', 'Supply chain ESG materiality assessment', 'Stakeholder expectations and investor pressure'] },
        { title: 'Module 2: Carbon Accounting in Logistics', lessons: 4, duration: '10h', content: ['GHG Protocol Scope 1, 2, 3 definitions', 'Logistics emission factors (transport modes)', 'Carbon footprint calculation tools', 'GLEC Framework for logistics emissions'] },
        { title: 'Module 3: Decarbonization Strategies', lessons: 3, duration: '10h', content: ['Modal shift opportunities in Vietnam', 'Alternative fuels (LNG, hydrogen, electric)', 'Eco-driving programs and fleet electrification', 'Carbon offsetting and neutrality claims'] },
        { title: 'Module 4: Green Certifications', lessons: 2, duration: '6h', content: ['ISO 14001 Environmental Management', 'SmartWay Transport Partnership', 'Vietnam Green Logistics certification'] },
        { title: 'Module 5: ESG Reporting & Communication', lessons: 2, duration: '6h', content: ['Writing a logistics sustainability report', 'Science-Based Targets (SBTi) initiative', 'Green procurement and supplier engagement'] },
      ],
      requirements: ['Basic knowledge of logistics operations', 'Interest in sustainability and environmental management'],
      outcomes: ['Calculate Scope 1, 2, and 3 emissions for logistics operations', 'Develop a logistics decarbonization roadmap', 'Prepare ESG reports for logistics companies', 'Implement green logistics certifications'],
    },
    {
      id: 16,
      title: 'Last-Mile Delivery Optimization',
      instructor: 'Mr. Lý Đức Thành',
      org: 'Vietnam Logistics Research Institute',
      category: 'warehouse',
      categoryLabel: 'Smart Warehousing',
      duration: '3 weeks',
      hours: 30,
      modules: 4,
      level: 'Intermediate',
      price: 5500000,
      priceFormatted: '5,500,000 ₫',
      rating: 4.7,
      reviews: 523,
      enrolled: 2187,
      image: 'images/course_4.jpg',
      badge: null,
      tags: ['last-mile', 'delivery', 'urban logistics', 'optimization'],
      description: 'Optimize last-mile delivery operations in Vietnamese cities. Apply route optimization, parcel locker networks, and crowdsourced delivery models.',
      updated: 'Sep 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Last-Mile Challenges in Vietnam', lessons: 3, duration: '8h', content: ['Urban density and traffic congestion analysis', 'Consumer expectations: speed vs. cost', 'Vietnam last-mile market players', 'Failed delivery cost analysis'] },
        { title: 'Module 2: Route Optimization Technologies', lessons: 3, duration: '8h', content: ['Vehicle Routing Problem algorithms', 'Route optimization software comparison', 'Dynamic delivery slot management', 'Proof of Delivery (POD) systems'] },
        { title: 'Module 3: Alternative Delivery Models', lessons: 2, duration: '7h', content: ['Parcel locker networks (Locker Alliance)', 'Crowdsourced and gig delivery platforms', 'Cargo bike and electric vehicle integration', 'Pick-up point network design'] },
        { title: 'Module 4: Performance Measurement', lessons: 2, duration: '7h', content: ['Last-mile KPI dashboard design', 'Cost-per-delivery benchmarking', 'Customer satisfaction measurement', 'Continuous improvement framework'] },
      ],
      requirements: ['Experience in logistics or e-commerce operations', 'Basic data analysis skills helpful'],
      outcomes: ['Reduce last-mile delivery costs by 20-30%', 'Improve on-time delivery rates', 'Implement route optimization technology', 'Design alternative delivery networks'],
    },
    {
      id: 17,
      title: 'Procurement & Strategic Sourcing',
      instructor: 'TS. Phạm Thị Minh Châu',
      org: 'Vietnam Procurement Institute',
      category: 'fiata',
      categoryLabel: 'FIATA & Maritime',
      duration: '8 weeks',
      hours: 80,
      modules: 8,
      level: 'Intermediate',
      price: 13500000,
      priceFormatted: '13,500,000 ₫',
      rating: 4.7,
      reviews: 345,
      enrolled: 1456,
      image: 'images/course_1.jpg',
      badge: null,
      tags: ['procurement', 'sourcing', 'supply chain', 'contracts'],
      description: 'Master strategic sourcing and procurement management. Build supplier networks, negotiate contracts, and implement category management for logistics companies.',
      updated: 'Aug 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Procurement Strategy Framework', lessons: 4, duration: '10h', content: ['Procurement maturity model', 'Category management approach', 'Make vs. buy analysis', 'Total Cost of Ownership (TCO)'] },
        { title: 'Module 2: Supplier Market Analysis', lessons: 4, duration: '10h', content: ['Porter\'s Five Forces for supply markets', 'Supplier research methodologies', 'Vietnam supplier landscape by category', 'RFI/RFP/RFQ process design'] },
        { title: 'Module 3: Supplier Evaluation & Selection', lessons: 3, duration: '10h', content: ['Weighted scoring models', 'Factory audit procedures', 'Financial stability assessment', 'ESG criteria in supplier selection'] },
        { title: 'Module 4: Negotiation Techniques', lessons: 3, duration: '10h', content: ['BATNA and negotiation strategy', 'Price negotiation tactics', 'Contract terms negotiation', 'Cross-cultural negotiation in Vietnam'] },
      ],
      requirements: ['Minimum 2 years in procurement, supply chain, or related field', 'Basic Excel knowledge'],
      outcomes: ['Develop category management strategies', 'Conduct structured supplier evaluation', 'Negotiate favorable procurement contracts', 'Implement supplier performance management programs'],
    },
    {
      id: 18,
      title: 'VNACCS/VCIS Electronic Customs EDI',
      instructor: 'Mr. Hoàng Văn Thắng',
      org: 'Vietnam Customs IT Center',
      category: 'customs',
      categoryLabel: 'Customs & Tariffs',
      duration: '2 weeks',
      hours: 16,
      modules: 3,
      level: 'Beginner',
      price: 4200000,
      priceFormatted: '4,200,000 ₫',
      rating: 4.5,
      reviews: 678,
      enrolled: 3456,
      image: 'images/course_2.jpg',
      badge: null,
      tags: ['VNACCS', 'VCIS', 'EDI', 'customs IT'],
      description: 'Practical training on Vietnam\'s VNACCS/VCIS automated customs system. Learn to submit electronic declarations, track shipment status, and resolve system errors.',
      updated: 'Sep 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: VNACCS System Registration & Navigation', lessons: 3, duration: '5h', content: ['Digital certificate installation and setup', 'VNACCS user account management', 'Dashboard navigation and menu structure', 'Common error codes and solutions'] },
        { title: 'Module 2: Declaration Submission', lessons: 4, duration: '6h', content: ['Declaration types: import/export/transit', 'Field-by-field declaration completion', 'Document attachment requirements', 'Declaration amendment procedures'] },
        { title: 'Module 3: Post-Declaration & Monitoring', lessons: 2, duration: '5h', content: ['Channel assignment monitoring (C1/C2/C3)', 'Tax calculation verification', 'Customs receipt and release', 'Post-clearance declaration management'] },
      ],
      requirements: ['Digital signature certificate (USB Token) required', 'Basic computer skills'],
      outcomes: ['Submit accurate electronic customs declarations', 'Navigate VNACCS/VCIS interface confidently', 'Resolve common system errors independently', 'Manage the full electronic clearance process'],
    },
    {
      id: 19,
      title: 'Cold Storage & Refrigeration Engineering',
      instructor: 'KS. Nguyễn Thanh Bình',
      org: 'Ho Chi Minh City University of Technology',
      category: 'coldchain',
      categoryLabel: 'Cold Chain',
      duration: '5 weeks',
      hours: 50,
      modules: 6,
      level: 'Intermediate',
      price: 10500000,
      priceFormatted: '10,500,000 ₫',
      rating: 4.6,
      reviews: 189,
      enrolled: 712,
      image: 'images/course_3.jpg',
      badge: null,
      tags: ['cold storage', 'refrigeration', 'engineering', 'temperature control'],
      description: 'Technical training on cold storage facility design, refrigeration system maintenance, and energy optimization for logistics and food industry professionals.',
      updated: 'Jul 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Refrigeration Principles', lessons: 4, duration: '8h', content: ['Vapour compression cycle', 'Refrigerants: R-404A, R-134a, natural alternatives', 'Heat load calculation methods', 'Energy efficiency ratings'] },
        { title: 'Module 2: Cold Storage Facility Design', lessons: 4, duration: '10h', content: ['Insulation panel systems (PU sandwich)', 'Refrigeration equipment sizing', 'Anti-condensation and vapour barrier design', 'Blast freezer vs. storage room design'] },
        { title: 'Module 3: Temperature Monitoring Systems', lessons: 3, duration: '8h', content: ['Data logger installation and calibration', 'IoT sensor networks for cold stores', 'Alarm threshold configuration', 'Continuous monitoring compliance'] },
        { title: 'Module 4: Maintenance & Troubleshooting', lessons: 3, duration: '10h', content: ['Preventive maintenance schedules', 'Compressor overhaul procedures', 'Common breakdown diagnostics', 'Energy audit procedures'] },
        { title: 'Module 5: Regulatory Compliance', lessons: 2, duration: '7h', content: ['HACCP requirements for cold storage', 'Vietnam Food Safety Law compliance', 'Cold chain audit preparation', 'SOP development'] },
        { title: 'Module 6: Practical Workshop', lessons: 1, duration: '7h', content: ['Refrigeration lab hands-on session', 'System calibration exercise', 'Final practical assessment'] },
      ],
      requirements: ['Technical background in engineering, physics, or related field preferred', 'Basic math and thermodynamics knowledge'],
      outcomes: ['Design cold storage facilities to specified temperature requirements', 'Maintain refrigeration systems to industry standards', 'Implement temperature monitoring and alarm systems', 'Optimize cold store energy consumption'],
    },
    {
      id: 20,
      title: 'Supply Chain Risk Management',
      instructor: 'TS. Vũ Thị Thu Hương',
      org: 'RMIT Vietnam',
      category: 'fiata',
      categoryLabel: 'FIATA & Maritime',
      duration: '4 weeks',
      hours: 40,
      modules: 5,
      level: 'Advanced',
      price: 8000000,
      priceFormatted: '8,000,000 ₫',
      rating: 4.8,
      reviews: 278,
      enrolled: 1089,
      image: 'images/course_4.jpg',
      badge: null,
      tags: ['risk management', 'supply chain', 'business continuity', 'resilience'],
      description: 'Identify, assess, and mitigate supply chain risks. Build resilient supply chains that withstand disruptions from geopolitics, pandemics, and climate events.',
      updated: 'Aug 2026',
      language: 'Vietnamese / English',
      curriculum: [
        { title: 'Module 1: Risk Identification Framework', lessons: 3, duration: '8h', content: ['Supply chain risk taxonomy', 'Risk mapping and heat maps', 'Supplier concentration risk analysis', 'Geopolitical risk assessment'] },
        { title: 'Module 2: Quantitative Risk Analysis', lessons: 3, duration: '8h', content: ['Probability-impact matrices', 'Monte Carlo simulation basics', 'Business Impact Analysis (BIA)', 'Risk-adjusted cost modelling'] },
        { title: 'Module 3: Mitigation Strategies', lessons: 3, duration: '10h', content: ['Dual/multi-sourcing strategies', 'Safety stock buffers vs. agility', 'Supply chain finance instruments', 'Nearshoring and China+1 strategies'] },
        { title: 'Module 4: Business Continuity Planning', lessons: 2, duration: '8h', content: ['BCP framework development', 'Crisis communication protocols', 'Tabletop exercise design', 'Recovery time objectives'] },
        { title: 'Module 5: Digital Risk Management', lessons: 2, duration: '6h', content: ['Cybersecurity in supply chain (SolarWinds case)', 'AI-powered risk monitoring platforms', 'Real-time supply chain visibility tools'] },
      ],
      requirements: ['Minimum 2 years in supply chain management', 'Basic statistics knowledge helpful'],
      outcomes: ['Build a comprehensive supply chain risk register', 'Develop and test business continuity plans', 'Implement dual-sourcing and resilience strategies', 'Use digital tools for real-time risk monitoring'],
    },
    {
      id: 21,
      title: 'AMR & Warehouse Robotics Integration',
      instructor: 'Mr. Trần Công Minh',
      org: 'Robotics in Logistics Vietnam (RLV)',
      category: 'warehouse',
      categoryLabel: 'Smart Warehousing',
      duration: '5 weeks',
      hours: 50,
      modules: 6,
      level: 'Advanced',
      price: 14500000,
      priceFormatted: '14,500,000 ₫',
      rating: 4.9,
      reviews: 203,
      enrolled: 678,
      image: 'images/course_1.jpg',
      badge: 'hot',
      tags: ['AMR', 'robotics', 'automation', 'warehouse'],
      description: 'Implement Autonomous Mobile Robots (AMR) and warehouse automation technologies. Covers robot fleet management, WMS integration, and ROI calculation.',
      updated: 'Oct 2026',
      language: 'Vietnamese / English',
      curriculum: [
        { title: 'Module 1: Warehouse Automation Landscape', lessons: 3, duration: '8h', content: ['AMR vs. AGV vs. fixed automation', 'Major AMR vendors comparison (Geek+, MiR, 6 River)', 'Vietnam automation adoption trends', 'ROI framework for robotics investment'] },
        { title: 'Module 2: AMR Technology Deep Dive', lessons: 4, duration: '10h', content: ['SLAM navigation technology', 'Sensor fusion (LiDAR, camera, ultrasound)', 'Fleet management software (FMS)', 'Safety standards (ISO 3691-4)'] },
        { title: 'Module 3: WMS-Robotics Integration', lessons: 3, duration: '10h', content: ['API integration architecture', 'Task allocation algorithms', 'Exception handling workflows', 'Performance monitoring dashboards'] },
        { title: 'Module 4: Implementation Planning', lessons: 3, duration: '10h', content: ['Site assessment and pilot design', 'Change management for automation', 'Staff reskilling programs', 'Go-live and hypercare planning'] },
        { title: 'Module 5: Goods-to-Person Systems', lessons: 2, duration: '7h', content: ['ASRS (Automated Storage & Retrieval)', 'Goods-to-Person picking stations', 'Conveyor and sortation systems'] },
        { title: 'Module 6: Future Trends', lessons: 1, duration: '5h', content: ['AI-powered warehouse orchestration', 'Humanoid robots in logistics', 'Vietnam government Industry 4.0 roadmap'] },
      ],
      requirements: ['Engineering, IT, or logistics management background', 'Basic programming knowledge is a plus', 'Minimum 2 years warehouse operations experience'],
      outcomes: ['Design and plan AMR implementation projects', 'Integrate robotics with WMS and ERP systems', 'Calculate ROI and business case for automation', 'Manage vendor selection and system go-live'],
    },
    {
      id: 22,
      title: 'IATA Security Awareness Training',
      instructor: 'Mr. Đỗ Việt Hùng',
      org: 'IATA Training Center — HCMC',
      category: 'aviation',
      categoryLabel: 'Air Cargo IATA',
      duration: '1 day',
      hours: 8,
      modules: 2,
      level: 'All Levels',
      price: 2800000,
      priceFormatted: '2,800,000 ₫',
      rating: 4.5,
      reviews: 892,
      enrolled: 4532,
      image: 'images/course_2.jpg',
      badge: null,
      tags: ['IATA', 'security', 'aviation', 'cargo security'],
      description: 'Mandatory IATA cargo security awareness training for all personnel with access to air cargo. Covers threat recognition, screening procedures, and incident reporting.',
      updated: 'Oct 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Aviation Security Threats & Regulations', lessons: 3, duration: '4h', content: ['Global aviation security landscape', 'ICAO Annex 17 requirements', 'Vietnam Civil Aviation Authority security rules', 'Insider threat awareness'] },
        { title: 'Module 2: Cargo Security Procedures & Assessment', lessons: 3, duration: '4h', content: ['Cargo screening methods (X-ray, EDD)', 'Security chain of custody', 'Suspicious item and behaviour reporting', 'Certification assessment'] },
      ],
      requirements: ['Employment in aviation or cargo handling industry', 'Government-issued ID required'],
      outcomes: ['Recognize aviation security threats', 'Apply cargo screening procedures', 'Report security incidents correctly', 'Maintain aviation security chain of custody'],
    },
    {
      id: 23,
      title: 'Port Operations & Berth Planning',
      instructor: 'TS. Lê Xuân Hải',
      org: 'Vietnam National University of Transport (UTH)',
      category: 'fiata',
      categoryLabel: 'FIATA & Maritime',
      duration: '6 weeks',
      hours: 60,
      modules: 7,
      level: 'Intermediate',
      price: 10200000,
      priceFormatted: '10,200,000 ₫',
      rating: 4.7,
      reviews: 213,
      enrolled: 897,
      image: 'images/course_3.jpg',
      badge: null,
      tags: ['port operations', 'berth', 'terminal planning', 'maritime'],
      description: 'Comprehensive training in port operations management, berth planning, and terminal productivity optimization for port professionals.',
      updated: 'Jul 2026',
      language: 'Vietnamese',
      curriculum: [
        { title: 'Module 1: Port Types & Infrastructure', lessons: 3, duration: '8h', content: ['Port typology: bulk, container, multipurpose', 'Quay design and berth dimensions', 'Hinterland connectivity', 'Vietnam seaport master plan 2030'] },
        { title: 'Module 2: Berth Planning & Scheduling', lessons: 4, duration: '10h', content: ['Vessel scheduling optimization', 'Berth allocation problem (BAP) models', 'SHIP2PORT coordination', 'Berth productivity benchmarks'] },
        { title: 'Module 3: Cargo Handling Equipment', lessons: 3, duration: '9h', content: ['Ship-to-shore (STS) crane operations', 'Rubber-tyred gantry (RTG) crane management', 'Reach stacker and forklift operations', 'Equipment maintenance planning'] },
        { title: 'Module 4: Terminal Productivity', lessons: 3, duration: '9h', content: ['TEU throughput measurement', 'Crane move rate optimization', 'Yard density management', 'Gate throughput improvement'] },
        { title: 'Module 5: Port Safety & Environment', lessons: 2, duration: '8h', content: ['ISPS Code implementation', 'Port environmental regulations', 'Oil spill contingency planning', 'Green port initiatives'] },
        { title: 'Module 6: Port Community Systems', lessons: 2, duration: '8h', content: ['Port Community System (PCS) implementation', 'Single Window integration', 'PortBase and similar platforms'] },
        { title: 'Module 7: Final Simulation & Assessment', lessons: 1, duration: '8h', content: ['Port operations simulation exercise', 'Crisis management scenario', 'Certification assessment'] },
      ],
      requirements: ['Employment at a seaport, terminal, or shipping line', 'Basic knowledge of maritime operations'],
      outcomes: ['Plan and optimize berth allocation and vessel scheduling', 'Manage container terminal productivity', 'Apply ISPS security protocols', 'Implement port community systems'],
    },
    {
      id: 24,
      title: 'Net Zero Supply Chain & Scope 3 Emissions',
      instructor: 'TS. Nguyễn Thị Lan Phương',
      org: 'Sustainable Supply Chain Institute Vietnam',
      category: 'esg',
      categoryLabel: 'ESG & Green',
      duration: '3 weeks',
      hours: 30,
      modules: 4,
      level: 'Advanced',
      price: 7800000,
      priceFormatted: '7,800,000 ₫',
      rating: 4.8,
      reviews: 198,
      enrolled: 743,
      image: 'images/course_4.jpg',
      badge: null,
      tags: ['net zero', 'scope 3', 'emissions', 'supply chain sustainability'],
      description: 'Advanced training on achieving net-zero supply chains. Covers Scope 3 emissions measurement, supplier engagement, Science-Based Targets, and carbon neutrality claims.',
      updated: 'Oct 2026',
      language: 'Vietnamese / English',
      curriculum: [
        { title: 'Module 1: Net Zero Frameworks', lessons: 3, duration: '8h', content: ['Race to Zero campaign and COP commitments', 'Net Zero vs. Carbon Neutral vs. Climate Positive', 'Science-Based Targets (SBTi) criteria', 'Vietnam NDC and corporate alignment'] },
        { title: 'Module 2: Scope 3 Measurement', lessons: 4, duration: '8h', content: ['15 Scope 3 categories explained', 'Purchased goods & services emissions (Cat.1)', 'Upstream transportation (Cat.4)', 'Use of sold products (Cat.11)', 'Third-party data and spend-based methods'] },
        { title: 'Module 3: Supplier Engagement & Decarbonization', lessons: 3, duration: '7h', content: ['Supplier emission disclosure programs', 'CDP Supply Chain program', 'Green procurement criteria', 'Supplier collaboration on reduction targets'] },
        { title: 'Module 4: Net Zero Roadmap Development', lessons: 2, duration: '7h', content: ['Baseline setting and target year selection', 'Reduction lever identification and prioritization', 'Carbon removal and offset quality standards', 'Net Zero report structure and verification'] },
      ],
      requirements: ['Completion of ESG & Green Logistics course or equivalent', 'Basic knowledge of GHG Protocol'],
      outcomes: ['Measure Scope 3 emissions across supply chain categories', 'Set and validate Science-Based Targets', 'Develop a credible net-zero roadmap', 'Engage suppliers on emission reductions'],
    },
  ];

  // ── CATEGORY COLORS ─────────────────────────────────────────
  const CAT_COLORS = {
    fiata:    '#0A66C2',
    aviation: '#0284c7',
    customs:  '#0A66C2',
    warehouse:'#004182',
    coldchain:'#0284c7',
    esg:      '#059669',
  };
  const CAT_BG = {
    fiata:    'rgba(10,35,66,0.12)',
    aviation: 'rgba(2,132,199,0.12)',
    customs:  'rgba(217,119,6,0.12)',
    warehouse:'rgba(13,122,107,0.12)',
    coldchain:'rgba(8,145,178,0.12)',
    esg:      'rgba(22,163,74,0.12)',
  };
  const BADGE_CONFIG = {
    bestseller: { label: 'Best Seller', cls: 'badge-bestseller' },
    hot:        { label: '🔥 Hot',      cls: 'badge-hot' },
    new:        { label: '✨ New',      cls: 'badge-new' },
  };
  const IMG_CYCLE = ['images/course_1.jpg','images/course_2.jpg','images/course_3.jpg','images/course_4.jpg'];
  const STAR_HTML = (r) => {
    const full = Math.floor(r), half = r % 1 >= 0.5;
    let s = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) s += '<i class="fa-solid fa-star crs-gold-star"></i>';
      else if (i === full && half) s += '<i class="fa-solid fa-star-half-stroke crs-gold-star"></i>';
      else s += '<i class="fa-regular fa-star crs-gold-star"></i>';
    }
    return s;
  };

  // ── STATE ────────────────────────────────────────────────────
  let _activePill = 'all';
  let _activeSort = 'popular';
  let _searchTerm = '';
  let _bookmarks  = new Set();

    // ── RENDER COURSE CARD (WOLFRAM U STYLE - LOGISTICS TOPICS) ──────────
  const WF_BADGES = {
    1: { label: 'ON DEMAND', cls: 'wf-badge-demand' },
    2: { label: 'ON DEMAND', cls: 'wf-badge-demand' },
    3: { label: 'UPDATED', cls: 'wf-badge-updated', edition: '3rd Edition' },
    4: { label: 'NEW', cls: 'wf-badge-new' },
    5: { label: 'NEW', cls: 'wf-badge-new' },
    6: { label: 'NEW', cls: 'wf-badge-new' },
    7: { label: 'NEW', cls: 'wf-badge-new' },
    8: { label: 'NEW', cls: 'wf-badge-new' },
    9: { label: 'POPULAR', cls: 'wf-badge-popular' },
    10: { label: 'ON DEMAND', cls: 'wf-badge-demand' },
    11: { label: 'UPDATED', cls: 'wf-badge-updated', edition: '2026 Edition' },
    12: { label: 'POPULAR', cls: 'wf-badge-popular' },
    13: { label: 'NEW', cls: 'wf-badge-new' },
    14: { label: 'ON DEMAND', cls: 'wf-badge-demand' },
    15: { label: 'UPDATED', cls: 'wf-badge-updated', edition: '2nd Edition' },
    16: { label: 'POPULAR', cls: 'wf-badge-popular' }
  };

  function getBadgeForCourse(c) {
    if (WF_BADGES[c.id]) return WF_BADGES[c.id];
    const types = ['ON DEMAND', 'NEW', 'UPDATED', 'POPULAR'];
    const idx = (c.id || 0) % 4;
    const label = types[idx];
    const clses = ['wf-badge-demand', 'wf-badge-new', 'wf-badge-updated', 'wf-badge-popular'];
    return { label, cls: clses[idx], edition: label === 'UPDATED' ? '2026 Edition' : null };
  }

  const FORMAT_MAP = {
    1: '16 weeks | FIATA Certified',
    2: '40 Hours | IATA Certification',
    3: '60 Hours | Masterclass',
    4: '12 Modules | Executive Diploma',
    5: '1 h | Webinar',
    6: '1 h 15 min | Webinar',
    7: '7 h | Interactive Course',
    8: '22 min | Video Lesson',
    9: '42 min | Video Course',
    10: '2 h 30 min | Interactive Course',
    11: '5 h | Study Group',
    12: '5 h | Study Group',
    13: '2 h | Interactive Lab',
    14: '3 h 45 min | Webinar',
    15: '8 h | Certified Course',
    16: '30 min | Video Lesson',
    17: '1 h 30 min | Technical Seminar',
    18: '6 h | Masterclass',
    19: '45 min | Video Lesson',
    20: '10 h | Interactive Course',
    21: '4 h | Executive Briefing',
    22: '1 h 10 min | Webinar',
    23: '3 h | Study Group',
    24: '12 h | Advanced Diploma'
  };

  function getFormatForCourse(c) {
    if (FORMAT_MAP[c.id]) return FORMAT_MAP[c.id];
    const formats = ['Webinar', 'Interactive Course', 'Video Lesson', 'Study Group'];
    const fmt = formats[(c.id || 0) % formats.length];
    const dur = c.duration || (c.hours ? c.hours + ' h' : '2 h');
    return `${dur} | ${fmt}`;
  }

  function renderCard(c) {
    const img = c.image || 'images/course_1.jpg';
    const badge = getBadgeForCourse(c);
    const formatText = getFormatForCourse(c);
    const editionTag = badge.edition ? `<span class="wf-edition-tag">${badge.edition}</span>` : '';

    return `
    <div class="wf-course-card" data-category="${c.category}" data-id="${c.id}" onclick="hydrateCourseDetail(${c.id}); switchView('view-course-detail')">
      <div class="wf-card-header">
        <div class="wf-header-top-row">
          <span class="wf-badge ${badge.cls}">${badge.label}</span>
          <div class="wf-feature-icons">
            <span class="wf-feat-icon" title="Certificate Included">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
            </span>
            <span class="wf-feat-icon" title="Accredited Certification">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z"/></svg>
            </span>
          </div>
        </div>
        <h4 class="wf-card-title">${c.title}</h4>
      </div>

      <div class="wf-card-media">
        <img src="${img}" alt="${c.title}" class="wf-card-img" loading="lazy" onerror="this.src='images/course_1.jpg'" />
        ${editionTag}
      </div>

      <div class="wf-card-footer-strip">
        <span>${formatText}</span>
      </div>
    </div>`;
  }

  // ── RENDER GRID ──────────────────────────────────────────────
  function renderGrid(courses) {
    const grid  = document.getElementById('coursesGrid');
    const empty = document.getElementById('coursesEmpty');
    const countEl = document.getElementById('wfResultsCount') || document.getElementById('coursesGridCount');
    if (!grid) return;
    if (courses.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'flex';
    } else {
      if (empty) empty.style.display = 'none';
      grid.innerHTML = courses.map(renderCard).join('');
    }
    if (countEl) countEl.textContent = `${courses.length} results`;
  }

  function getFilteredCourses() {
    return COURSES_DB.slice();
  }

  // ── FILTER FUNCTIONALITY (WOLFRAM U TOOLBAR) ──────────────────
  window.applyWolframFilters = function() {
    const type = document.getElementById('wfFilterType')?.value || '';
    const diff = document.getElementById('wfFilterDifficulty')?.value || '';
    const cert = document.getElementById('wfFilterCertification')?.value || '';
    const time = document.getElementById('wfFilterTime')?.value || '';
    const sort = document.getElementById('wfFilterSort')?.value || 'popular';
    const q = (document.getElementById('wfSearchInput')?.value || '').trim().toLowerCase();

    let list = COURSES_DB.slice();

    if (type && type !== 'all') {
      const typeKeywords = {
        'interactive': ['interactive', 'course', 'lab', 'workshop', 'diploma'],
        'webinar': ['webinar', 'seminar', 'briefing', 'session'],
        'video': ['video', 'lesson', 'lecture'],
        'studygroup': ['study', 'group', 'cohort', 'masterclass']
      };
      const allowed = typeKeywords[type] || [type];
      list = list.filter(c => {
        const fmt = getFormatForCourse(c).toLowerCase();
        return allowed.some(k => fmt.includes(k));
      });
    }

    if (diff && diff !== 'all') {
      list = list.filter(c => (c.level || '').toLowerCase() === diff.toLowerCase());
    }

    if (cert && cert !== 'all') {
      list = list.filter(c => {
        const cat = (c.category || '').toLowerCase();
        const title = (c.title || '').toLowerCase();
        const tags = (c.tags || []).join(' ').toLowerCase();
        const org = (c.org || '').toLowerCase();
        return cat.includes(cert) || title.includes(cert) || tags.includes(cert) || org.includes(cert);
      });
    }

    if (time && time !== 'all') {
      if (time === 'short') list = list.filter(c => (c.hours || 10) < 5);
      else if (time === 'medium') list = list.filter(c => (c.hours || 10) >= 5 && (c.hours || 10) <= 20);
      else if (time === 'long') list = list.filter(c => (c.hours || 10) > 20);
    }

    if (q) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.instructor || '').toLowerCase().includes(q) ||
        (c.org || '').toLowerCase().includes(q) ||
        (c.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'popular') list.sort((a,b) => (b.enrolled || 0) - (a.enrolled || 0));
    else if (sort === 'newest') list.sort((a,b) => b.id - a.id);
    else if (sort === 'title') list.sort((a,b) => a.title.localeCompare(b.title));
    else if (sort === 'rating') list.sort((a,b) => (b.rating || 0) - (a.rating || 0));

    renderGrid(list);
  };

  window.resetWolframFilters = function() {
    if (document.getElementById('wfFilterType')) document.getElementById('wfFilterType').value = '';
    if (document.getElementById('wfFilterDifficulty')) document.getElementById('wfFilterDifficulty').value = '';
    if (document.getElementById('wfFilterCertification')) document.getElementById('wfFilterCertification').value = '';
    if (document.getElementById('wfFilterTime')) document.getElementById('wfFilterTime').value = '';
    if (document.getElementById('wfFilterSort')) document.getElementById('wfFilterSort').value = 'popular';
    if (document.getElementById('wfSearchInput')) document.getElementById('wfSearchInput').value = '';
    renderGrid(COURSES_DB.slice());
  };

  window.filterCoursesByPill = function(btn, filter) {
    if (document.getElementById('wfFilterCertification')) {
      document.getElementById('wfFilterCertification').value = filter === 'all' ? '' : filter;
      applyWolframFilters();
    }
  };

  window.filterCourseCards = function() {
    applyWolframFilters();
  };

  window.sortCourses = function(sort) {
    if (document.getElementById('wfFilterSort')) {
      document.getElementById('wfFilterSort').value = sort;
      applyWolframFilters();
    }
  };

  window.bookmarkCourse = function(courseId, btn) {
    // Stub
  };


  // ── PUBLIC: Accordion toggle ─────────────────────────────────
  window.toggleCourseModule = function(headerEl) {
    const row = headerEl.closest('.crs-module-row');
    if (!row) return;
    const isOpen = row.classList.toggle('open');
    const chevron = headerEl.querySelector('.mod-chevron');
    if (chevron) chevron.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
  };

  // ── PUBLIC: Hydrate course detail ────────────────────────────
  // ── PUBLIC: Hydrate Wolfram-Style Course Detail ──────────────
  let _isVideoPlaying = false;
  let _videoTimer = null;

  window.togglePlayPreviewVideo = function() {
    _isVideoPlaying = !_isVideoPlaying;
    const playIcon = document.getElementById('crsPlayIcon');
    const bigPlayBtn = document.getElementById('crsBigPlayBtn');
    const progressFill = document.getElementById('crsVideoProgress');
    const timeDisplay = document.getElementById('crsVideoTime');

    if (_isVideoPlaying) {
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      if (bigPlayBtn) bigPlayBtn.style.opacity = '0';
      showToast('Đang phát video bài giảng xem trước (HD)...');
      
      let progress = 32;
      clearInterval(_videoTimer);
      _videoTimer = setInterval(() => {
        progress = (progress + 1) % 100;
        if (progressFill) progressFill.style.width = progress + '%';
        const mins = Math.floor((progress / 100) * 22);
        const secs = Math.floor(((progress / 100) * 22 * 60) % 60);
        if (timeDisplay) timeDisplay.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')} / 22:00`;
      }, 1000);
    } else {
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      if (bigPlayBtn) bigPlayBtn.style.opacity = '1';
      clearInterval(_videoTimer);
      showToast('Đã tạm dừng video.');
    }
  };

  window.seekVideoPreview = function(e) {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
    const progressFill = document.getElementById('crsVideoProgress');
    if (progressFill) progressFill.style.width = pct + '%';
    const mins = Math.floor((pct / 100) * 22);
    const secs = Math.floor(((pct / 100) * 22 * 60) % 60);
    const timeDisplay = document.getElementById('crsVideoTime');
    if (timeDisplay) timeDisplay.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')} / 22:00`;
  };

  window.toggleVideoFullscreen = function() {
    const box = document.getElementById('crsVideoContainer');
    if (!box) return;
    if (!document.fullscreenElement) {
      box.requestFullscreen().catch(() => showToast('Chế độ xem toàn màn hình'));
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  window.hydrateCourseDetail = function(courseId) {
    const c = COURSES_DB.find(x => x.id === courseId) || COURSES_DB[0];
    if (!c) return;

    // Reset video state
    _isVideoPlaying = false;
    clearInterval(_videoTimer);
    const playIcon = document.getElementById('crsPlayIcon');
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    const bigPlayBtn = document.getElementById('crsBigPlayBtn');
    if (bigPlayBtn) bigPlayBtn.style.opacity = '1';

    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

    // 1. Top Header & Meta
    setText('crsDetailTitleTop', c.title);
    setText('crsDetailTitleCard', c.title);
    setText('crsDetailFormatTop', getFormatForCourse(c).split('|')[1]?.trim() || 'Interactive Course');
    setText('crsDetailDurationTop', c.duration || (c.hours ? c.hours + ' Hours' : '22 min'));
    setText('crsDetailLevelTop', c.level || 'Advanced');
    setText('crsDetailAuthor', c.instructor || 'TS. Nguyễn Thành Long');
    setText('crsDetailOrg', c.org || 'VALOMA Institute & Logistics Research');

    // 2. Video Poster & Title
    const poster = document.getElementById('crsVideoPoster');
    if (poster) {
      poster.src = c.image || 'images/course_1.jpg';
      poster.onerror = () => { poster.src = 'images/course_1.jpg'; };
    }
    setText('crsVideoOverlayTitle', `${c.title} • Lecture Preview`);

    // 3. Overview Description & Frameworks
    setText('crsDetailDesc', c.description || 'Nội dung đào tạo thực tiễn kết hợp chuẩn mực quốc tế FIATA, IATA và quy định Hải quan Việt Nam.');
    const stds = (c.tags || ['logistics', 'supply chain', 'trade compliance']).map(t => t.toUpperCase()).join(', ');
    setText('crsDetailStandards', `${stds} • FIATA Multimodal Standards • ISO 27001 Security Compliance`);

    // 4. You'll Learn To Grid (6 Bullets)
    const outcomesGrid = document.getElementById('crsDetailOutcomesGrid');
    if (outcomesGrid) {
      const defaultOutcomes = [
        'Master end-to-end multimodal transport documentation & FIATA standards',
        'Design resilient supply chain networks and international risk mitigation plans',
        'Operate VNACCS/VCIS electronic customs clearance & tariff classifications',
        'Optimize deep-sea container dispatch and port terminal yard allocations',
        'Apply cold chain GDP storage standards to temperature-sensitive cargo',
        'Implement automated warehouse management systems (WMS) & robotics workflows'
      ];
      const items = (c.outcomes && c.outcomes.length >= 4) ? c.outcomes : defaultOutcomes;
      const col1 = items.slice(0, 3);
      const col2 = items.slice(3, 6);

      const renderCol = (list) => list.map(txt => `
        <div class="wf-learn-item">
          <span class="wf-bullet">&bull;</span>
          <span class="wf-learn-txt">${txt}</span>
        </div>`).join('');

      outcomesGrid.innerHTML = `
        <div class="wf-learn-col">${renderCol(col1)}</div>
        <div class="wf-learn-col">${renderCol(col2)}</div>
      `;
    }

    // 5. Related Resources (2x2 Grid of Other Courses)
    const relGrid = document.getElementById('crsRelatedResourcesGrid');
    if (relGrid) {
      const related = COURSES_DB.filter(x => x.id !== c.id).slice(0, 4);
      const types = ['INTERACTIVE COURSE', 'VIDEO COURSE', 'REGULATION & DOCUMENTATION', 'INTERACTIVE COURSE'];
      
      relGrid.innerHTML = related.map((r, i) => `
        <div class="wf-resource-card" onclick="hydrateCourseDetail(${r.id}); window.scrollTo({top:0, behavior:'smooth'})">
          <img src="${r.image || 'images/course_1.jpg'}" alt="${r.title}" class="wf-res-thumb" onerror="this.src='images/course_1.jpg'" />
          <div class="wf-res-content">
            <span class="wf-res-type">${types[i % types.length]}</span>
            <div class="wf-res-title">${r.title}</div>
          </div>
        </div>
      `).join('');
    }
  }

  function initCoursesView() {
    renderGrid(COURSES_DB.slice());
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCoursesView();
  });

  window.coursesController = {
    init: initCoursesView,
    getDB: () => COURSES_DB,
    renderGrid,
    getFilteredCourses: () => COURSES_DB.slice()
  };

})();
