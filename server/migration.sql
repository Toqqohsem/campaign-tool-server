-- Sample data for PostgreSQL database
-- This file contains the mock data in SQL format for easy import into RDS

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    project VARCHAR(255) NOT NULL,
    objective VARCHAR(255) NOT NULL,
    budget INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
    id VARCHAR(255) PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_motivations TEXT NOT NULL,
    pain_points TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creative assets table
CREATE TABLE IF NOT EXISTS creative_assets (
    id VARCHAR(255) PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    persona_id VARCHAR(255) NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('image', 'video')),
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad copy table
CREATE TABLE IF NOT EXISTS ad_copy (
    id VARCHAR(255) PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    persona_id VARCHAR(255) NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    headline VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(255) PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    persona_id VARCHAR(255) REFERENCES personas(id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('New', 'Contacted', 'Site Visit', 'Hot', 'Converted', 'Rejected')),
    rejection_reason VARCHAR(50) CHECK (rejection_reason IN ('Price', 'Location', 'Layout', 'Not Responsive')),
    age_range VARCHAR(50) NOT NULL,
    income_bracket VARCHAR(50) NOT NULL,
    family_size INTEGER NOT NULL,
    occupation VARCHAR(255) NOT NULL,
    education_level VARCHAR(255) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    location_area VARCHAR(255) NOT NULL,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    must_have_features TEXT,
    interaction_history TEXT,
    predicted_conversion_likelihood DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    buyer_segment VARCHAR(100) NOT NULL DEFAULT 'First-time Buyer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample campaigns
INSERT INTO campaigns (id, name, project, objective, budget, start_date, end_date, status, created_at, updated_at) VALUES
('1', 'Luxury Condos Downtown', 'SkyView Towers', 'Lead Generation', 50000, '2024-01-15', '2024-04-15', 'active', '2024-01-10T10:00:00Z', '2024-01-15T14:30:00Z'),
('2', 'Family Homes Suburbia', 'Green Valley Estates', 'Brand Awareness', 35000, '2024-02-01', '2024-05-01', 'active', '2024-01-25T09:15:00Z', '2024-02-01T11:20:00Z'),
('3', 'Investment Properties', 'Metro Investment Hub', 'Conversion', 75000, '2024-01-01', '2024-12-31', 'paused', '2023-12-20T16:45:00Z', '2024-01-20T13:10:00Z');

-- Insert sample personas
INSERT INTO personas (id, campaign_id, name, key_motivations, pain_points, created_at, updated_at) VALUES
('1', '1', 'Young Professional', 'Urban lifestyle, convenience, status symbol, walkability to work', 'High prices, limited parking, noise concerns, HOA fees', '2024-01-10T10:30:00Z', '2024-01-10T10:30:00Z'),
('2', '1', 'Empty Nester Couple', 'Downsizing, low maintenance, amenities, security', 'Leaving family home, storage space, community connection', '2024-01-10T10:35:00Z', '2024-01-10T10:35:00Z'),
('3', '2', 'Growing Family', 'Space for children, good schools, safe neighborhood, outdoor space', 'Budget constraints, long commutes, finding right school district', '2024-01-25T09:30:00Z', '2024-01-25T09:30:00Z'),
('4', '2', 'First-time Homebuyer', 'Building equity, stability, pride of ownership, tax benefits', 'Down payment, credit requirements, market complexity, inspection fears', '2024-01-25T09:35:00Z', '2024-01-25T09:35:00Z');

-- Insert sample creative assets
INSERT INTO creative_assets (id, campaign_id, persona_id, type, filename, url, created_at) VALUES
('1', '1', '1', 'image', 'downtown-condo-hero.jpg', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', '2024-01-12T09:15:00Z'),
('2', '1', '1', 'video', 'virtual-tour.mp4', 'https://example.com/virtual-tour.mp4', '2024-01-12T10:30:00Z'),
('3', '2', '3', 'image', 'family-home-exterior.jpg', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', '2024-01-26T14:20:00Z');

-- Insert sample ad copy
INSERT INTO ad_copy (id, campaign_id, persona_id, headline, description, created_at, updated_at) VALUES
('1', '1', '1', 'Live Where You Work - Luxury Downtown Living', 'Step out your door to world-class dining, entertainment, and your office. Modern amenities meet urban convenience.', '2024-01-12T11:45:00Z', '2024-01-12T11:45:00Z'),
('2', '1', '2', 'Embrace the Freedom of Downtown Living', 'Trade yard work for yoga classes. Maintenance-free luxury with concierge services and resort-style amenities.', '2024-01-12T11:50:00Z', '2024-01-12T11:50:00Z'),
('3', '2', '3', 'Your Family''s Perfect Home Awaits', 'Safe neighborhoods, excellent schools, and space to grow. Everything your family needs in one beautiful community.', '2024-01-26T15:10:00Z', '2024-01-26T15:10:00Z');

-- Insert sample leads
INSERT INTO leads (id, campaign_id, persona_id, first_name, last_name, email, phone, status, rejection_reason, age_range, income_bracket, family_size, occupation, education_level, bedrooms, bathrooms, location_area, budget_min, budget_max, property_type, must_have_features, interaction_history, predicted_conversion_likelihood, buyer_segment, created_at, updated_at) VALUES
('1', '1', '1', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '555-0123', 'Hot', NULL, '25-34', '$75,000-$100,000', 1, 'Software Engineer', 'Bachelor''s Degree', 2, 2, 'Downtown', 450000, 600000, 'Condo', 'Parking, Balcony, Modern Kitchen', 'Viewed property online, attended virtual tour, requested showing', 0.85, 'First-time Buyer', '2024-01-20T14:15:00Z', '2024-01-22T16:30:00Z'),
('2', '1', '2', 'Michael', 'Chen', 'michael.chen@email.com', '555-0124', 'Converted', NULL, '55-64', '$100,000+', 2, 'Executive', 'Master''s Degree', 2, 2, 'Downtown', 500000, 750000, 'Condo', 'Security, Amenities, Low Maintenance', 'Multiple property visits, contract signed, closing scheduled', 0.95, 'Downsizer', '2024-01-18T10:20:00Z', '2024-01-25T09:45:00Z'),
('3', '2', '3', 'Emily', 'Rodriguez', 'emily.rodriguez@email.com', '555-0125', 'Site Visit', NULL, '35-44', '$75,000-$100,000', 4, 'Teacher', 'Master''s Degree', 4, 3, 'Green Valley', 350000, 450000, 'Single Family', 'Large Yard, Good Schools, Safe Neighborhood', 'Initial inquiry, scheduled showing, visited model home', 0.72, 'Upgrader', '2024-02-02T11:30:00Z', '2024-02-05T15:15:00Z'),
('4', '2', '4', 'David', 'Thompson', 'david.thompson@email.com', '555-0126', 'Rejected', 'Price', '25-34', '$50,000-$75,000', 2, 'Nurse', 'Bachelor''s Degree', 3, 2, 'Green Valley', 250000, 350000, 'Single Family', 'Affordable, Move-in Ready', 'Inquired about pricing, found homes outside budget range', 0.25, 'Budget Conscious', '2024-02-01T13:45:00Z', '2024-02-03T10:20:00Z'),
('5', '3', NULL, 'Jennifer', 'Williams', 'jennifer.williams@email.com', '555-0127', 'Hot', NULL, '45-54', '$100,000+', 1, 'Real Estate Investor', 'MBA', 0, 0, 'Metro Area', 200000, 1000000, 'Investment', 'Cash Flow Positive, Appreciation Potential', 'Requested investment analysis, reviewed multiple properties', 0.88, 'Investor', '2024-01-15T16:20:00Z', '2024-01-18T14:10:00Z');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personas_campaign_id ON personas(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_persona_id ON leads(persona_id);
CREATE INDEX IF NOT EXISTS idx_creative_assets_campaign_id ON creative_assets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_creative_assets_persona_id ON creative_assets(persona_id);
CREATE INDEX IF NOT EXISTS idx_ad_copy_campaign_id ON ad_copy(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_copy_persona_id ON ad_copy(persona_id);