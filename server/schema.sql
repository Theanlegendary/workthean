-- ==========================================================================
-- FREELANCER PLATFORM CLOUD DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ==========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_text VARCHAR(10),
    role VARCHAR(50) DEFAULT 'User',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_rating NUMERIC(3,2) DEFAULT 5.0,
    client_country VARCHAR(100) DEFAULT 'United States',
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'Fixed',
    budget_min NUMERIC(10,2) NOT NULL,
    budget_max NUMERIC(10,2) NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    bids_count INT DEFAULT 0,
    avg_bid NUMERIC(10,2) DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Proposals & Bids Table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
    freelancer_name VARCHAR(255) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    days INT NOT NULL,
    pitch TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Freelancers Directory Table
CREATE TABLE IF NOT EXISTS freelancers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.0,
    hourly_rate NUMERIC(10,2) NOT NULL,
    country VARCHAR(100) NOT NULL,
    tagline TEXT,
    skills TEXT[] DEFAULT '{}',
    completed_jobs INT DEFAULT 0,
    success_rate INT DEFAULT 100
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    text TEXT NOT NULL,
    time_ago VARCHAR(100) DEFAULT 'Just now',
    unread BOOLEAN DEFAULT TRUE,
    icon VARCHAR(100) DEFAULT 'fa-bell',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id VARCHAR(100) NOT NULL,
    sender VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index optimizations
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_bids_project_id ON bids(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_thread ON chat_messages(thread_id);
