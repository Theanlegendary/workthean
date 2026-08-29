/**
 * REAL ENTERPRISE COMPANY SYSTEM DATA ENGINE
 * Relational Database & Escrow Transaction Ledger Module
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'enterprise_store.json');

// Initialize Default Seed Database if file doesn't exist
function initEnterpriseDB() {
  if (!fs.existsSync(DB_PATH)) {
    const seedData = {
      companies: [
        {
          id: 'comp-101',
          name: 'Vercel Inc.',
          domain: 'vercel.com',
          logo: 'fa-bolt',
          industry: 'Cloud Infrastructure & Frontend',
          country: 'United States 🇺🇸',
          escrowBalance: 125000,
          verified: true,
          description: 'Develop. Preview. Ship. Vercel is the platform for frontend developers.'
        },
        {
          id: 'comp-102',
          name: 'Stripe Technologies',
          domain: 'stripe.com',
          logo: 'fa-credit-card',
          industry: 'Financial Technology & Payments',
          country: 'United States 🇺🇸',
          escrowBalance: 350000,
          verified: true,
          description: 'Financial infrastructure for the internet. Millions of businesses use Stripe.'
        },
        {
          id: 'comp-103',
          name: 'Linear Systems',
          domain: 'linear.app',
          logo: 'fa-layer-group',
          industry: 'Software Project Management',
          country: 'San Francisco 🇺🇸',
          escrowBalance: 85000,
          verified: true,
          description: 'The issue tracking tool built for high-performing modern software teams.'
        },
        {
          id: 'comp-104',
          name: 'Supabase Cloud',
          domain: 'supabase.com',
          logo: 'fa-database',
          industry: 'Open Source Backend as a Service',
          country: 'Singapore 🇸🇬',
          escrowBalance: 190000,
          verified: true,
          description: 'The open source Firebase alternative. Build in a weekend, scale to millions.'
        }
      ],
      freelancers: [
        {
          id: 'fl-101',
          name: 'Elena Rostova',
          companyRole: 'Contractor',
          hourlyRate: 65,
          country: 'Estonia 🇪🇪',
          completedJobs: 48,
          walletBalance: 14250,
          verified: true
        },
        {
          id: 'fl-102',
          name: 'Marcus Vance',
          companyRole: 'Senior iOS Architect',
          hourlyRate: 95,
          country: 'United States 🇺🇸',
          completedJobs: 32,
          walletBalance: 28400,
          verified: true
        }
      ],
      escrowLedger: [
        {
          id: 'tx-801',
          companyId: 'comp-101',
          companyName: 'Vercel Inc.',
          freelancerName: 'Elena Rostova',
          projectId: 'prj-101',
          projectTitle: 'Next.js 14 E-Commerce Platform',
          amount: 4500,
          status: 'LOCKED_IN_ESCROW',
          createdAt: '2026-07-22T14:30:00Z',
          approvedAt: null
        },
        {
          id: 'tx-802',
          companyId: 'comp-102',
          companyName: 'Stripe Technologies',
          freelancerName: 'Marcus Vance',
          projectId: 'prj-102',
          projectTitle: 'Flutter Logistics App',
          amount: 6000,
          status: 'RELEASED_COMPLETED',
          createdAt: '2026-07-20T09:15:00Z',
          approvedAt: '2026-07-22T18:00:00Z'
        }
      ],
      auditLogs: [
        {
          id: 'log-901',
          actor: 'Vercel Inc. (Client)',
          action: 'ESCROW_DEPOSIT',
          details: 'Locked $4,500 into Escrow for Project "Next.js 14 E-Commerce Platform"',
          timestamp: '2026-07-22T14:30:00Z'
        },
        {
          id: 'log-902',
          actor: 'Elena Rostova (Freelancer)',
          action: 'SUBMIT_MILESTONE_DELIVERABLE',
          details: 'Submitted Phase 1 Architecture Deliverable for review',
          timestamp: '2026-07-23T08:10:00Z'
        }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2), 'utf8');
  }
}

function readEnterpriseDB() {
  initEnterpriseDB();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading enterprise DB:', e);
    return { companies: [], freelancers: [], escrowLedger: [], auditLogs: [] };
  }
}

function writeEnterpriseDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing enterprise DB:', e);
    return false;
  }
}

// Deposit Money into Escrow Ledger
function depositEscrow(companyId, projectId, projectTitle, freelancerName, amount) {
  const db = readEnterpriseDB();
  const company = db.companies.find(c => c.id === companyId) || db.companies[0];

  const tx = {
    id: `tx-${Date.now()}`,
    companyId: company.id,
    companyName: company.name,
    freelancerName,
    projectId,
    projectTitle,
    amount: parseFloat(amount),
    status: 'LOCKED_IN_ESCROW',
    createdAt: new Date().toISOString(),
    approvedAt: null
  };

  company.escrowBalance += parseFloat(amount);
  db.escrowLedger.unshift(tx);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    actor: `${company.name} (Client)`,
    action: 'ESCROW_DEPOSIT',
    details: `Deposited $${amount} into Escrow for "${projectTitle}"`,
    timestamp: new Date().toISOString()
  });

  writeEnterpriseDB(db);
  return tx;
}

// Release Escrow Payment to Freelancer
function releaseEscrow(txId) {
  const db = readEnterpriseDB();
  const tx = db.escrowLedger.find(t => t.id === txId);
  if (!tx || tx.status === 'RELEASED_COMPLETED') return null;

  tx.status = 'RELEASED_COMPLETED';
  tx.approvedAt = new Date().toISOString();

  const fl = db.freelancers.find(f => f.name === tx.freelancerName) || db.freelancers[0];
  if (fl) {
    fl.walletBalance += tx.amount;
  }

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    actor: `${tx.companyName} (Client)`,
    action: 'ESCROW_RELEASE',
    details: `Approved deliverable & released $${tx.amount} to ${tx.freelancerName}`,
    timestamp: new Date().toISOString()
  });

  writeEnterpriseDB(db);
  return tx;
}

module.exports = {
  readEnterpriseDB,
  writeEnterpriseDB,
  depositEscrow,
  releaseEscrow
};
