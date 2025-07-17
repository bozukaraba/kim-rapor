# 📊 ReportHub - Comprehensive Data Management System

A production-ready React + TypeScript application for managing and analyzing platform data, website analytics, news mentions, and RPA reports with role-based access control.

## 🚀 **Live Demo**

**Production URL:** [https://kim-rapor.vercel.app](https://kim-rapor.vercel.app)

### Demo Accounts
- **Admin Demo:** Click "Admin Olarak Giriş Yap" - Full access to all data and analytics
- **Staff Demo:** Click "Personel Olarak Giriş Yap" - Limited to data entry and personal reports

## ⭐ **Key Features**

### 🎯 **Core Functionality**
- **Multi-Data Type Support:** Platform, Website, News, RPA Reports
- **Role-Based Access Control:** Admin vs Staff permissions
- **Real-Time Data Sync:** Live updates via Supabase
- **Advanced Filtering:** Date range, staff, platform, and data type filters
- **Responsive Design:** Mobile-first approach with Tailwind CSS

### 📊 **Data Management**
- **Platform Analytics:** Social media metrics (followers, engagement, reach)
- **Website Analytics:** Traffic, conversion, bounce rate tracking
- **News Monitoring:** Sentiment analysis and source tracking  
- **RPA Reports:** Email distribution and routing analytics

### 🔐 **Security & Authentication**
- **Supabase Auth:** Secure user registration and login
- **Row Level Security (RLS):** Database-level access control
- **Production Error Handling:** Comprehensive error boundaries
- **Demo Mode:** No-signup testing capabilities

## 🛠️ **Technology Stack**

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Chart.js** for data visualization

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** with RLS policies
- **Real-time subscriptions** for live updates

### Deployment
- **Vercel** for hosting
- **Production-ready** configuration
- **Security headers** included

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bozukaraba/kim-rapor.git
cd kim-rapor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 **Production Deployment**

### Build for Production
```bash
npm run build:prod
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run deploy:vercel
```

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy dist/ folder to your hosting provider
```

## 🎨 **Project Structure**

```
src/
├── components/           # React components
│   ├── AdminDashboard.tsx   # Admin analytics dashboard
│   ├── StaffDashboard.tsx   # Staff personal dashboard
│   ├── DataEntry.tsx        # Multi-tab data entry forms
│   ├── Login.tsx           # Authentication component
│   └── ErrorBoundary.tsx   # Production error handling
├── context/
│   └── AppContext.tsx      # Global state management
├── types/
│   └── index.ts           # TypeScript interfaces
├── config/
│   └── production.ts      # Production configuration
└── supabase.ts           # Database helper functions
```

## 🔧 **Available Scripts**

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run build:prod      # Build with production optimizations
npm run preview         # Preview production build locally
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run deploy:vercel   # Deploy to Vercel
```

## 📊 **Database Schema**

### Core Tables
- `platform_data` - Social media analytics
- `website_data` - Website traffic metrics  
- `news_data` - Media mentions and sentiment
- `rpa_data` - Email routing and distribution reports

### Authentication
- Supabase Auth with custom user metadata
- Role-based permissions (admin/staff)
- Demo mode support

## 🎯 **User Roles & Permissions**

### Admin Role
- ✅ View all data from all staff members
- ✅ Advanced filtering and analytics
- ✅ Staff performance insights
- ✅ Export and reporting capabilities
- ✅ Full CRUD operations

### Staff Role  
- ✅ Data entry across all categories
- ✅ View own submitted data only
- ✅ Personal performance tracking
- ✅ Goal monitoring dashboard
- ❌ Cannot view other staff data

## 🚀 **Production Features**

### Performance
- **Optimized Build:** Tree-shaking and code splitting
- **Lazy Loading:** Dynamic imports for better performance
- **Caching:** Static asset optimization

### Security
- **HTTPS Only:** Secure data transmission
- **Security Headers:** XSS and CSRF protection  
- **Input Validation:** Client and server-side validation
- **Error Monitoring:** Production error tracking

### Monitoring
- **Real-time Updates:** Live data synchronization
- **Error Boundaries:** Graceful error handling
- **Performance Metrics:** Build size analysis

## 🔄 **Data Flow**

1. **Authentication:** User logs in via Supabase Auth
2. **Role Detection:** System determines admin vs staff permissions
3. **Data Fetching:** Context loads relevant data based on role
4. **Real-time Sync:** Supabase subscriptions update UI live
5. **Filtering:** Advanced filtering based on user selections

## 🧪 **Testing & Quality**

### Development
- TypeScript for type safety
- ESLint for code quality
- Real-time error checking

### Production
- Error boundaries for crash prevention
- Fallback UI components
- Performance monitoring

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

- **Documentation:** Check this README
- **Issues:** Create GitHub issues for bugs
- **Demo:** Use live demo for testing

---

**Built with ❤️ using React + TypeScript + Supabase** 