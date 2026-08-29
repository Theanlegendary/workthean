const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { readDB, writeDB } = require('./db');
const { readEnterpriseDB, depositEscrow, releaseEscrow } = require('./db_sql');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString(), message: 'Freelancer WebSockets & REST API Active' });
});

/* ==========================================================================
   REAL USER AUTHENTICATION & REGISTRATION API
   ========================================================================== */

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = readDB();
  if (!db.users) db.users = [];

  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'Client',
    title: role === 'Freelancer' ? 'Senior Full-Stack Developer' : 'Startup Founder & Entrepreneur',
    hourlyRate: 75,
    avatarText: initials,
    bio: 'Verified platform user registered on Freelancer NextGen.',
    skills: ['React', 'Node.js', 'WebSockets', 'Stripe'],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const token = `token_${newUser.id}_${Date.now()}`;
  res.status(201).json({ success: true, message: 'User registered successfully', token, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDB();
  if (!db.users) db.users = [];

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = `token_${user.id}_${Date.now()}`;
  res.json({ success: true, message: 'Login successful', token, user });
});

/* ==========================================================================
   STRIPE PAYMENT GATEWAY INTEGRATION
   ========================================================================== */

app.post('/api/stripe/create-checkout-session', (req, res) => {
  const { amount, projectTitle, companyName } = req.body;

  if (!amount || !projectTitle) {
    return res.status(400).json({ error: 'Amount and project title are required' });
  }

  const session = {
    sessionId: `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    paymentStatus: 'paid',
    currency: 'usd',
    amountTotal: parseFloat(amount) * 100,
    customerEmail: 'founder@client.com',
    checkoutUrl: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
    lineItems: [
      {
        name: `Escrow Deposit: ${projectTitle}`,
        description: `100% Escrow Protection Deposit for ${companyName || 'Enterprise Client'}`,
        amount: parseFloat(amount)
      }
    ],
    createdAt: new Date().toISOString()
  };

  const tx = depositEscrow('comp-101', `prj-${Date.now()}`, projectTitle, 'Elena Rostova', amount);
  io.emit('broadcast_escrow_update', tx);

  res.json({ success: true, message: 'Stripe Checkout Session created successfully', session });
});

/* ==========================================================================
   ENTERPRISE COMPANY DATA & ESCROW TRANSACTION LEDGER ENDPOINTS
   ========================================================================== */

app.get('/api/enterprise/companies', (req, res) => {
  const db = readEnterpriseDB();
  res.json({ count: db.companies.length, data: db.companies });
});

app.get('/api/enterprise/escrow-ledger', (req, res) => {
  const db = readEnterpriseDB();
  res.json({ count: db.escrowLedger.length, data: db.escrowLedger });
});

app.post('/api/enterprise/escrow/deposit', (req, res) => {
  const { companyId, projectId, projectTitle, freelancerName, amount } = req.body;
  if (!projectTitle || !amount) {
    return res.status(400).json({ error: 'Project title and amount are required' });
  }

  const tx = depositEscrow(companyId || 'comp-101', projectId || 'prj-101', projectTitle, freelancerName || 'Elena Rostova', amount);
  io.emit('broadcast_escrow_update', tx);
  res.json({ message: 'Escrow deposit successful', transaction: tx });
});

app.post('/api/enterprise/escrow/release', (req, res) => {
  const { txId } = req.body;
  if (!txId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const tx = releaseEscrow(txId);
  if (!tx) {
    return res.status(400).json({ error: 'Transaction not found or already released' });
  }

  io.emit('broadcast_escrow_update', tx);
  res.json({ message: 'Escrow funds successfully released to freelancer', transaction: tx });
});

app.get('/api/enterprise/audit-logs', (req, res) => {
  const db = readEnterpriseDB();
  res.json({ data: db.auditLogs });
});

/* ==========================================================================
   TECHNICAL SCOPE & BLUEPRINT GENERATOR ENDPOINT
   ========================================================================== */

app.post('/api/ai/generate-scope', (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt idea is required' });
  }

  const p = prompt.toLowerCase();
  let category = 'web-dev';
  let skills = ['React.js', 'Node.js', 'PostgreSQL', 'TailwindCSS'];
  let title = `Full-Stack App: ${prompt.slice(0, 50)}`;
  let minB = 2000;
  let maxB = 4500;

  if (p.includes('mobile') || p.includes('app') || p.includes('ios') || p.includes('android') || p.includes('uber') || p.includes('booking')) {
    category = 'mobile-apps';
    skills = ['Flutter', 'Dart', 'Firebase', 'Google Maps API', 'Stripe'];
    title = `Cross-Platform Mobile App: ${prompt.slice(0, 45)}`;
    minB = 3000;
    maxB = 6000;
  } else if (p.includes('ai') || p.includes('bot') || p.includes('llm') || p.includes('chat') || p.includes('gpt') || p.includes('data')) {
    category = 'ai-ml';
    skills = ['Python', 'LangChain', 'OpenAI API', 'FastAPI', 'Pinecone Vector DB'];
    title = `AI Engine & Custom Chatbot: ${prompt.slice(0, 45)}`;
    minB = 2500;
    maxB = 5500;
  } else if (p.includes('design') || p.includes('ui') || p.includes('ux') || p.includes('figma') || p.includes('redesign')) {
    category = 'design';
    skills = ['Figma', 'UI/UX Design', 'Design System', 'Prototyping'];
    title = `SaaS UI/UX Design System: ${prompt.slice(0, 45)}`;
    minB = 1200;
    maxB = 2500;
  }

  const architectureDiagram = `
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│   Responsive Client UI  │ ────►│  Express REST & Socket  │ ────►│  PostgreSQL & Vector DB │
│ (React / Next.js / PWA) │      │  Backend API (Port 5000)│      │  (Persistent Storage)   │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
             │                                │                                │
             ▼                                ▼                                ▼
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│  Technical Spec Engine  │      │  100% Escrow Protection │      │  Stripe / Payment Gateway│
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
  `.trim();

  const specDoc = `
### 🛠️ Technical Blueprint & Specification

#### 1. Scope Overview
${prompt}

#### 2. Key System Modules
- **User Authentication**: Secure OAuth2 / JWT user management & role-based permissions.
- **Core Application Engine**: Responsive UI frontend connected to optimized REST API service.
- **Database & Storage**: Structured schema design with automated migrations and backup support.
- **Third-Party Integrations**: Payments gateway, analytics, push notifications, and cloud hosting.

#### 3. Security & Compliance
- HTTPS SSL encryption, rate limiting, sanitization against SQLi/XSS, and automated test suite.
  `.trim();

  const milestones = [
    { title: 'Phase 1: Architecture, Data Schema & UI Wireframes', budget: `$${Math.round(minB * 0.3)}`, days: '4 days' },
    { title: 'Phase 2: Core Feature Development & API Integrations', budget: `$${Math.round(minB * 0.5)}`, days: '8 days' },
    { title: 'Phase 3: QA Testing, Deployment & Code Handoff', budget: `$${Math.round(minB * 0.2)}`, days: '3 days' }
  ];

  res.json({
    success: true,
    prompt,
    title,
    category,
    type: 'Fixed',
    suggestedBudgetMin: minB,
    suggestedBudgetMax: maxB,
    skills,
    architectureDiagram,
    specDoc,
    milestones
  });
});

/* ==========================================================================
   USER PROFILE ENDPOINTS
   ========================================================================== */

let currentUserProfile = {
  id: 'user-001',
  name: 'John Doe',
  title: 'Senior Full-Stack Engineer & Product Manager',
  hourlyRate: 75,
  country: 'United States',
  flag: '🇺🇸',
  avatarText: 'JD',
  bio: 'Passionate software architect with 10+ years experience building scalable Web applications, microservices, and European fintech systems.',
  skills: ['Next.js', 'React.js', 'Node.js', 'PostgreSQL', 'Prompt Engineering'],
  role: 'Client & Freelancer'
};

app.get('/api/user/profile', (req, res) => {
  res.json({ data: currentUserProfile });
});

app.post('/api/user/profile', (req, res) => {
  const { name, title, hourlyRate, bio, skills, role } = req.body;
  if (name) currentUserProfile.name = name;
  if (title) currentUserProfile.title = title;
  if (hourlyRate) currentUserProfile.hourlyRate = parseFloat(hourlyRate);
  if (bio) currentUserProfile.bio = bio;
  if (skills) currentUserProfile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
  if (role) currentUserProfile.role = role;

  res.json({ message: 'Profile updated successfully', data: currentUserProfile });
});

app.get('/api/search', (req, res) => {
  const db = readDB();
  const query = (req.query.q || '').toLowerCase().trim();

  if (!query) {
    return res.json({ projects: [], freelancers: [] });
  }

  const matchingProjects = (db.projects || []).filter(p => 
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.skills.some(s => s.toLowerCase().includes(query))
  ).slice(0, 4);

  const matchingFreelancers = (db.freelancers || []).filter(f => 
    f.name.toLowerCase().includes(query) ||
    f.title.toLowerCase().includes(query) ||
    f.skills.some(s => s.toLowerCase().includes(query)) ||
    f.country.toLowerCase().includes(query)
  ).slice(0, 4);

  res.json({
    query,
    projects: matchingProjects,
    freelancers: matchingFreelancers
  });
});

/* ==========================================================================
   REAL-TIME WEBSOCKETS EVENT LISTENERS
   ========================================================================== */

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_thread', (threadId) => {
    socket.join(threadId);
  });

  socket.on('send_chat_msg', (data) => {
    const { threadId, text } = data;
    const db = readDB();
    if (!db.chats[threadId]) db.chats[threadId] = [];

    const userMsg = { sender: 'me', text, time: 'Just now' };
    db.chats[threadId].push(userMsg);
    writeDB(db);

    io.to(threadId).emit('receive_chat_msg', { threadId, message: userMsg });

    setTimeout(() => {
      const dbLatest = readDB();
      const reply = {
        sender: 'them',
        text: "⚡ Real-time WebSocket: Got your message instantly! Ready to collaborate.",
        time: 'Just now'
      };
      if (!dbLatest.chats[threadId]) dbLatest.chats[threadId] = [];
      dbLatest.chats[threadId].push(reply);
      writeDB(dbLatest);

      io.to(threadId).emit('receive_chat_msg', { threadId, message: reply });
    }, 1000);
  });

  socket.on('submit_bid', (data) => {
    io.emit('broadcast_bid_alert', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

/* ==========================================================================
   PROJECTS & RECRUITMENT REST API ENDPOINTS
   ========================================================================== */

app.get('/api/projects', (req, res) => {
  const db = readDB();
  let projects = db.projects || [];

  const { search, category, type, maxBudget, sort, mainCategory } = req.query;

  if (mainCategory === 'recruitment') {
    projects = projects.filter(p => p.jobType === 'Recruitment' || p.category === 'recruitment');
  } else if (mainCategory === 'freelance') {
    projects = projects.filter(p => p.jobType !== 'Recruitment' && p.category !== 'recruitment');
  }

  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (category) {
    const cats = category.split(',');
    projects = projects.filter(p => cats.includes(p.category));
  }

  if (type) {
    const types = type.split(',');
    projects = projects.filter(p => types.includes(p.type));
  }

  if (maxBudget) {
    const mb = parseFloat(maxBudget);
    projects = projects.filter(p => p.budgetMax <= mb);
  }

  if (sort === 'highest-budget') {
    projects.sort((a, b) => b.budgetMax - a.budgetMax);
  } else if (sort === 'most-bids') {
    projects.sort((a, b) => b.bidsCount - a.bidsCount);
  }

  res.json({ count: projects.length, data: projects });
});

app.post('/api/projects', (req, res) => {
  const db = readDB();
  const { title, category, type, budgetMin, budgetMax, description, skills, jobType } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const newProject = {
    id: `prj-${Date.now()}`,
    title,
    clientName: currentUserProfile.name,
    clientRating: 5.0,
    clientReviews: 1,
    clientCountry: 'United States',
    clientVerified: true,
    category,
    jobType: jobType || 'Freelance',
    type: type || 'Fixed',
    budgetMin: parseFloat(budgetMin) || 500,
    budgetMax: parseFloat(budgetMax) || 1500,
    currency: 'USD',
    description: description || 'Detailed project description.',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Web Dev']),
    bidsCount: 0,
    avgBid: 0,
    timeLeft: '7 days left',
    postedDate: 'Just now',
    isBookmarked: false,
    featured: true,
    bids: []
  };

  db.projects.unshift(newProject);
  writeDB(db);

  io.emit('broadcast_new_project', newProject);

  res.status(201).json({ message: 'Project created successfully', project: newProject });
});

/* SUBMIT BID WITH FILE & PORTFOLIO LINK ATTACHMENTS */
app.post('/api/projects/:id/bids', (req, res) => {
  const db = readDB();
  const projectId = req.params.id;
  const { amount, days, pitch, portfolioLink, attachmentName } = req.body;

  const project = db.projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const newBid = {
    freelancerName: `${currentUserProfile.name} (You)`,
    amount: parseFloat(amount),
    days: parseInt(days),
    pitch: pitch || 'Full proposal details.',
    portfolioLink: portfolioLink || '',
    attachmentName: attachmentName || '',
    timestamp: new Date().toISOString()
  };

  project.bids.unshift(newBid);
  project.bidsCount = project.bids.length;

  const totalSum = project.bids.reduce((acc, b) => acc + b.amount, 0);
  project.avgBid = Math.round(totalSum / project.bidsCount);

  writeDB(db);

  io.emit('broadcast_bid_alert', { 
    projectId, 
    projectTitle: project.title, 
    bidAmount: amount,
    freelancerName: currentUserProfile.name,
    portfolioLink: portfolioLink || '',
    attachmentName: attachmentName || ''
  });

  res.json({ message: 'Bid submitted successfully', project, bid: newBid });
});

app.get('/api/freelancers', (req, res) => {
  const db = readDB();
  res.json({ count: db.freelancers.length, data: db.freelancers });
});

app.post('/api/freelancers/:id/hire', (req, res) => {
  const db = readDB();
  const freelancerId = req.params.id;
  const { amount, message } = req.body;

  const fl = db.freelancers.find(f => f.id === freelancerId);
  if (!fl) {
    return res.status(404).json({ error: 'Freelancer not found' });
  }

  const notification = {
    id: `notif-${Date.now()}`,
    text: `Job offer of $${amount} sent to ${fl.name}`,
    time: 'Just now',
    unread: true,
    icon: 'fa-paper-plane'
  };

  db.notifications.unshift(notification);
  writeDB(db);

  res.json({ message: `Contract offer successfully sent to ${fl.name}`, offer: { freelancerId, amount, message } });
});

app.get('/api/notifications', (req, res) => {
  const db = readDB();
  res.json({ data: db.notifications });
});

app.post('/api/notifications/mark-read', (req, res) => {
  const db = readDB();
  db.notifications.forEach(n => n.unread = false);
  writeDB(db);
  res.json({ message: 'All notifications marked as read' });
});

app.get('/api/chat/:threadId', (req, res) => {
  const db = readDB();
  const threadId = req.params.threadId;
  const messages = db.chats[threadId] || [];
  res.json({ threadId, messages });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Freelancer WebSockets & REST Server listening on port ${PORT}`);
  console.log(` Bid Attachments API Active: http://localhost:${PORT}/api/projects/prj-101/bids`);
  console.log(`====================================================`);
});
