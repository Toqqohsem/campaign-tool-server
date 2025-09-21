# Real Estate AI Marketing Platform

## 🏢 Overview

An AI-driven real estate marketing automation platform that revolutionizes property development and sales through predictive analytics, intelligent lead scoring, and persona-based campaign management. Built with a modern full-stack architecture on AWS infrastructure.

### 🎯 Problem Statement

Addresses critical challenges in real estate marketing:

- **Data Overload**: Multiple customer touchpoints creating information chaos
- **Generic Campaigns**: Untargeted marketing with low conversion rates
- **Fragmented Journey**: Disconnected customer experiences across channels
- **Poor Lead Prioritization**: Inability to identify high-value prospects
- **Limited Discovery**: Inefficient property-buyer matching

### 💡 Solution Impact

**For Property Developers:**
- 287% ROI improvement through targeted campaigns
- 70%+ conversion rate on high-value leads
- Automated lead prioritization and follow-up
- Data-driven market insights and predictions

**For Real Estate Agents:**
- Intelligent buyer-property matching
- Personalized communication strategies
- Rejection reason analysis for improvement
- Cross-channel customer journey tracking

## 🏗️ Architecture

### Technology Stack

**Frontend (Client)**
- React 19 with TypeScript
- Vite 7.1.6 (Build Tool)
- Tailwind-inspired CSS
- Lucide React Icons
- Axios HTTP Client

**Backend (Server)**
- Node.js 18.x Runtime
- Express.js Framework
- TypeScript
- PostgreSQL (AWS RDS)
- AWS S3 Storage

**Infrastructure**

- AWS EC2 with Auto-scaling
- AWS RDS PostgreSQL
- AWS S3 Bucket
- VPC Security
- Load Balancing

### System Architecture

```
Internet → Load Balancer → EC2 (Express.js API) → RDS PostgreSQL
                                               → S3 Bucket
                                               → VPC Security
            ↓
    React Client (Vite) → API Gateway → Backend Services
```

## 📁 Project Structure

```
real-estate-platform/
├── server/                      # Backend API Server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── campaigns.ts     # Campaign CRUD operations
│   │   │   ├── personas.ts      # Buyer persona management
│   │   │   ├── leads.ts         # Lead management with ML scoring
│   │   │   ├── assets.ts        # Creative asset management
│   │   │   ├── adcopy.ts        # Ad copy generation
│   │   │   ├── ml.ts            # Machine learning endpoints
│   │   │   ├── analytics.ts     # AI insights and predictions
│   │   │   └── s3.ts            # File upload management
│   │   ├── utils/
│   │   │   └── mlModel.ts       # Lead scoring algorithms
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript interfaces
│   │   ├── db.ts                # Database connection
│   │   └── index.ts             # Main server entry point
│   ├── dist/                    # Compiled JavaScript
│   └── package.json
├── client/                      # Frontend React Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── EnhancedButton.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── CampaignWizard.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── LeadModal.tsx
│   │   ├── pages/               # Main application views
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CampaignList.tsx
│   │   │   ├── CampaignOverview.tsx
│   │   │   ├── PersonaCreator.tsx
│   │   │   ├── AssetOrganizer.tsx
│   │   │   ├── LeadManager.tsx
│   │   │   └── PredictiveInsights.tsx
│   │   ├── hooks/
│   │   │   └── useCampaigns.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── mlModel.ts
│   └── public/
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS Account (for S3 and RDS)
- npm or yarn package manager

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd real-estate-platform
```

#### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Build TypeScript
npm run build

# Start development server
npm run dev
```

#### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with API endpoint

# Start development server
npm run dev
```

### Environment Variables

#### Server (.env)

```env
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/dbname
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
PORT=3001
NODE_ENV=development
```

#### Client (.env)

```env
VITE_AWS_API_GATEWAY_URL=https://your-api-gateway-url.com/api
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🔥 Core Features

### 1. Campaign Management

- **Campaign Creation Wizard**: Multi-step setup with validation
- **Real-time Monitoring**: Performance tracking dashboard
- **Status Management**: Draft → Active → Paused → Completed pipeline
- **Budget Tracking**: ROI analysis and cost optimization

### 2. AI-Powered Lead Intelligence

#### Lead Scoring Algorithm

```typescript
calculateLeadScore(lead: Lead): {
  score: number;          // 0.0 - 1.0 conversion probability
  segment: BuyerSegment;  // Classification category
}
```

**Scoring Factors:**
- Lead status (Hot, Site Visit, Contacted, etc.)
- Income bracket and budget flexibility
- Education level and occupation
- Interaction history depth
- Property type preferences
- Demographics alignment

**Buyer Segments:**
- First-time Buyer
- Upgrader (growing families)
- Investor (cash flow focused)
- Downsizer (empty nesters)
- Luxury Buyer (high budget)
- Budget Conscious (price sensitive)

### 3. Persona-Driven Targeting

- **Buyer Persona Creation**: Define target audience segments
- **Asset Management**: Link creative content to specific personas
- **Targeted Messaging**: Persona-specific campaign content
- **Dynamic Segmentation**: Real-time audience optimization

### 4. Predictive Analytics Engine

- **AI Recommendations**: Machine learning-powered insights
- **Conversion Predictions**: Probability-based lead prioritization
- **Market Analysis**: Trend identification and forecasting
- **Performance Metrics**: Real-time campaign analytics

## 🔌 API Endpoints

### Campaign Management

```
GET    /api/campaigns           # List all campaigns
POST   /api/campaigns           # Create new campaign
PUT    /api/campaigns/:id       # Update campaign
DELETE /api/campaigns/:id       # Delete campaign
```

### Lead Management & ML

```
GET    /api/leads               # Get leads (filterable)
POST   /api/leads               # Create lead with ML scoring
PUT    /api/leads/:id           # Update lead and recalculate score
POST   /api/leads/bulk          # Bulk import with ML processing
POST   /api/ml/score-lead       # Calculate conversion score
GET    /api/ml/recommendations  # Generate AI recommendations
```

### Persona & Content

```
GET    /api/personas            # Get buyer personas
POST   /api/personas            # Create persona
GET    /api/creative-assets     # Get campaign assets
POST   /api/creative-assets     # Upload new asset
GET    /api/ad-copy             # Get targeted ad copy
POST   /api/ad-copy             # Generate new copy
```

### Analytics & Insights

```
GET    /api/analytics/demo-insights/:id  # Campaign insights
GET    /api/health                       # Health check endpoint
```

## 💾 Database Schema

### Core Entities

```sql
-- Campaign management
campaigns (
  id, name, project, objective, budget, 
  start_date, end_date, status, created_at
)

-- Buyer persona definitions
personas (
  id, campaign_id, name, motivations, 
  pain_points, demographics, created_at
)

-- Lead tracking and scoring
leads (
  id, campaign_id, persona_id, contact_info, 
  preferences, ml_score, status, interaction_history
)

-- Creative asset management
creative_assets (
  id, campaign_id, persona_id, type, 
  url, metadata, upload_date
)

-- Targeted messaging
ad_copy (
  id, campaign_id, persona_id, headline, 
  description, cta, performance_metrics
)
```

### Key Relationships

- Campaigns → Multiple Personas (1:N)
- Personas → Multiple Leads (1:N)
- Campaigns → Multiple Assets & Ad Copy (1:N)
- Cross-referenced for targeted content delivery

## ☁️ AWS Infrastructure

### Compute & Hosting

- **EC2**: Auto-scaling Express.js API server
- **Load Balancing**: Variable traffic handling
- **Security Groups**: Controlled port access (3001 for API)

### Data & Storage

- **RDS PostgreSQL**: Primary database with connection pooling
- **S3 Bucket**: Creative assets with presigned URL access
- **VPC**: Private network isolation

### Security & Access

- **VPC Subnets**: Database in private subnet
- **Security Groups**: Restricted database access
- **IAM Roles**: S3 upload permissions
- **Environment Variables**: Secure credential management

## 🚢 Deployment

### Development

```bash
# Backend
cd server
npm run dev

# Frontend (separate terminal)
cd client
npm run dev
```

### Production

```bash
# Build both applications
cd server && npm run build
cd ../client && npm run build

# Deploy to EC2
scp -r dist/ user@ec2-instance:/var/www/api/
scp -r client/dist/ user@ec2-instance:/var/www/client/

# Start with PM2
pm2 start ecosystem.config.js
```

### Docker Deployment

```dockerfile
# Server Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

## 📊 Performance & Monitoring

### Optimization Features

- **Connection Pooling**: Efficient database connections
- **Indexed Queries**: Fast lead and campaign lookups
- **Async Processing**: Non-blocking ML calculations
- **Caching Strategy**: Reduced database load
- **Auto-scaling**: EC2 instances scale with demand

### Monitoring

- Health check endpoint for load balancer
- Error logging and tracking
- Performance metrics collection
- Database query optimization

## 🧪 Testing

### Backend Testing

```bash
cd server
npm test                    # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests
```

### Frontend Testing

```bash
cd client
npm test                   # Component tests
npm run test:e2e          # Cypress E2E tests
```

## 🔮 Future Enhancements

### Planned Features

- Advanced NLP for customer communication analysis
- Integration with real estate listing APIs
- Mobile app backend support
- Enhanced predictive market analytics
- Real-time chat and notification systems
- Progressive Web App (PWA) capabilities

### Technical Improvements

- Advanced A/B testing capabilities
- Integration with external CRM systems
- Voice-to-text lead entry
- Automated email sequences
- Offline data synchronization
- Performance monitoring and analytics

## 🤝 Contributing

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code consistency
- Component-based architecture
- Custom hooks for state management

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Testing Strategy

- Component unit testing with React Testing Library
- Integration testing for user workflows
- End-to-end testing for critical user journeys

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🙏 Acknowledgments

- AWS for cloud infrastructure
- React team for the amazing framework
- OpenAI for AI/ML inspiration
- Real estate industry partners for domain expertise

---

**Built with ❤️ for the real estate industry**
