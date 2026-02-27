# SmartFarmer SKACE

**Intelligent Agriculture Platform for Zambian Farmers**  
*Created by Samuel Kaoma*

---

## Overview

SmartFarmer SKACE is a comprehensive, production-ready agricultural intelligence platform designed specifically for Zambian farmers. It combines AI-powered recommendations, real-time monitoring, market intelligence, and gamification to help farmers increase productivity, optimize resources, and maximize profitability.

## Key Features

### 1. **AI Recommendation Engine**
- Real-time recommendations based on farm data, weather, and market conditions
- Disease and pest detection with prevention strategies
- Yield prediction and optimization suggestions
- Priority-based alerts for urgent farm issues

### 2. **Farm Management Dashboards**
- **Crops Dashboard**: Track planting dates, health status, growth stage, estimated yield
- **Livestock Dashboard**: Monitor animal health, production, and care schedules
- **Storage Dashboard**: Manage produce inventory with expiration tracking
- **Analytics Dashboard**: Comprehensive farm performance metrics and trends

### 3. **Gamification System**
- Achievement badges (10+ unique achievements)
- Points-based reward system
- Farmer tier progression: Beginner → Bronze → Silver → Gold → Platinum
- Real-time progress tracking and leaderboards

### 4. **Market Intelligence**
- Current commodity prices for Zambian markets
- Demand trend analysis
- Seasonal best-selling times
- Revenue estimator and price alerts

### 5. **Real-Time Weather & Disease Monitoring**
- Regional weather forecasts
- Disease and pest pattern database
- Prevention and treatment recommendations
- Risk assessment scoring

### 6. **Mobile-Responsive Design**
- Fully optimized for mobile, tablet, and desktop
- Smooth animations and transitions
- Dark mode support
- Accessibility-first design principles

---

## Technology Stack

### Backend
- **Framework**: Next.js 16 with App Router
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **API Routes**: 9+ comprehensive REST endpoints
- **Validation**: Zod schema validation
- **Server Functions**: PostgreSQL functions for calculations

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Handling**: react-hook-form
- **Toast Notifications**: Sonner

### Database Schema
10 main tables with full RLS:
- `profiles` - User farm information
- `crops` - Crop tracking and health
- `livestock` - Animal management
- `storage` - Produce inventory
- `farm_logs` - Activity logging
- `recommendations` - AI suggestions
- `user_achievements` - Gamification tracking
- `user_stats` - Points and tier progression
- `weather_data` - Regional forecasts
- `market_prices` - Commodity pricing
- `disease_pest_library` - Disease/pest reference
- `achievement_definitions` - Badge definitions

---

## Project Structure

```
/app
  /auth              - Authentication pages (login, signup, sign-up-success)
  /dashboard         - Main dashboard with layout
    /crops           - Crop management page
    /livestock       - Livestock management page
    /storage         - Storage/inventory management
    /analytics       - Analytics and statistics
    /settings        - User settings
  /api               - API routes
    /recommendations - AI recommendations endpoint
    /achievements    - Achievement checking
    /notifications   - User notifications
    /market          - Market data endpoint
  /about             - About page with creator credits

/components
  /ui                - shadcn/ui components
  /dashboard-nav     - Navigation component
  /dashboard-header  - Header with user info
  /recommendations-card    - Recommendation display
  /achievements-showcase   - Achievement display
  /market-prices-card      - Market intelligence
  /farm-stats              - KPI display
  /tier-badge              - Farmer tier badge

/lib
  /supabase          - Supabase client setup
  /farm-calculations - Utility functions for calculations

/hooks
  /use-notifications - Real-time notifications hook
  /use-achievements  - Achievement tracking hook

/scripts            - Database migration scripts
  /001-012          - Create tables and RLS policies
  /002b             - Additional tables (weather, market)
  /012              - Seed mock data

/styles
  /globals.css       - Emerald theme with animations
```

---

## Database Features

### Row-Level Security (RLS)
All sensitive tables use RLS policies to ensure users can only access their own data.

### PostgreSQL Functions
- `calculate_crop_health()` - Real-time crop health scoring
- `predict_yield()` - Yield estimation based on conditions
- `generate_recommendations()` - AI-powered suggestions
- `update_user_stats()` - Automatic stat calculation

### Triggers
- Auto-create user profile on signup
- Auto-calculate user stats on data changes
- Auto-check and unlock achievements

---

## API Endpoints

### Recommendations
- `GET/POST /api/recommendations` - Fetch/create recommendations

### Achievements
- `GET/POST /api/achievements` - Fetch/unlock achievements

### Notifications
- `GET/POST /api/notifications` - Fetch/create notifications

### Market Data
- `GET /api/market` - Fetch current market prices

---

## Color Scheme

- **Primary**: Emerald (#059669) - Represents growth and agriculture
- **Secondary**: Teal (#14B8A6) - Water and sustainability
- **Accents**: Amber (Gold tier), Orange (Bronze), Slate (Silver)
- **Neutrals**: White, Gray tones

## Design Highlights

- **Gradient backgrounds** for visual appeal
- **Smooth animations** (fade-in, scale, slide-in)
- **Glass morphism effects** for modern UI
- **Responsive grid layouts** using Tailwind
- **Interactive charts** for data visualization
- **Mobile-first approach** with progressive enhancement

---

## Authentication Flow

1. User signs up with email/password
2. Email confirmation required
3. Automatic profile creation via trigger
4. Redirect to dashboard
5. Session management via Supabase

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (connected)
- Environment variables configured

### Installation
```bash
npm install
```

### Environment Setup
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Run Development Server
```bash
npm run dev
```

### Database Setup
All SQL migrations are in `/scripts/`. Execute them in order on your Supabase database.

---

## Key Implementation Details

### Real-Time Updates
Uses Supabase real-time subscriptions for live notifications and alerts.

### AI Recommendations
Algorithm considers:
- Current weather conditions
- Crop/livestock health scores
- Disease/pest risk patterns
- Market price trends
- Farm history and patterns

### Gamification Logic
- Achievements unlock based on predefined conditions
- Points awarded per achievement
- Tier progression thresholds:
  - Beginner: 0-500 pts
  - Bronze: 500-1500 pts
  - Silver: 1500-3000 pts
  - Gold: 3000-5000 pts
  - Platinum: 5000+ pts

---

## Security Features

- **Row-Level Security**: Each user's data is isolated
- **Authentication**: Secure email/password with JWT
- **Input Validation**: Zod schemas on all API routes
- **Password Hashing**: Handled by Supabase Auth
- **HTTPS**: All connections encrypted
- **CSRF Protection**: Built-in to Next.js

---

## Performance Optimizations

- Server-side rendering for fast initial load
- Image optimization with Next.js Image
- Component code-splitting
- Database query optimization with indexes
- Caching strategies with revalidateTag()

---

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance
- Mobile accessibility

---

## Future Enhancements

- [ ] Multi-language support (Nyanja, Bemba, etc.)
- [ ] SMS notifications for low-connectivity areas
- [ ] Computer vision for crop disease detection
- [ ] IoT sensor integration for real-time monitoring
- [ ] Mobile app (React Native)
- [ ] Cooperative/group management features
- [ ] Financial lending integration
- [ ] Weather API integration (third-party)
- [ ] Predictive analytics with machine learning

---

## Support & Credits

**Creator**: Samuel Kaoma  
**Platform**: SmartFarmer SKACE  
**Tagline**: Intelligent Agriculture for Zambia

For support or inquiries, contact the development team.

---

## License

SmartFarmer SKACE is developed by Samuel Kaoma. All rights reserved.

---

*Built with ❤️ for the farmers of Zambia*
