# 🧡 SARSAR - Premium Quick Commerce Platform

> Order now, delivered in 1 hour - Everything you need, instantly available with SARSAR

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.2-purple)
![License](https://img.shields.io/badge/license-Private-red)

## 📋 Overview

SARSAR is a premium quick commerce platform built for Butwal, Nepal, offering 1-hour delivery of groceries, daily essentials, and more. Built with modern web technologies for maximum performance, security, and user experience.

**Founder:** Vishal Sharma  
**Location:** Butwal, Nepal  
**Instagram:** [@_official_sarsar](https://www.instagram.com/_official_sarsar)

---

## ✨ Features

### 🛍️ Customer Features
- **Fast Browsing:** AI-powered search with instant results
- **Smart Cart:** Real-time updates and recommendations
- **Quick Checkout:** Streamlined 3-step process
- **Live Tracking:** Real-time order tracking with map
- **Wishlist:** Save favorite products
- **Reviews:** Rate and review products
- **Multiple Addresses:** Manage delivery locations
- **Order History:** Easy reordering

### 🏪 Supplier Features
- **Product Management:** Add, edit, delete products with ease
- **Order Fulfillment:** Optimized picking and packing interface
- **Inventory Tracking:** Real-time stock management
- **Analytics Dashboard:** Sales insights and performance metrics
- **Bulk Operations:** Import/export products via CSV

### 👨‍💼 Admin Features
- **Complete Control:** Full platform oversight
- **User Management:** Manage customers and suppliers
- **Financial Reports:** Revenue tracking and analytics
- **Marketing Tools:** Campaign and coupon management
- **System Settings:** Configure platform parameters

---

## 🚀 Tech Stack

### Frontend
- **React 18.3** - Modern UI framework
- **Vite 5.2** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Premium utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **React Query** - Server state management
- **React Router DOM** - Client-side routing

### Backend & Services
- **Firebase Authentication** - Secure user auth
- **Firestore** - Real-time NoSQL database
- **Firebase Storage** - File storage with CDN
- **Firebase Cloud Functions** - Serverless backend

### UI Components
- **Lucide React** - Beautiful icons
- **React Toastify** - Toast notifications
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization

---

## 📦 Installation

### Prerequisites
- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm
- **Firebase Account**
- **Git**

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sarsar-platform.git
cd sarsar-platform
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Firebase credentials
```

4. **Start development server**
```bash
pnpm dev
# or
npm run dev
```

The application will open at `http://localhost:3000`

---

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Storage
5. Copy your Firebase config to `.env.local`

### Environment Variables

See `.env.example` for all available configuration options.

Key variables:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_APP_NAME=SARSAR
VITE_CONTACT_PHONE=+9779821072912
```

---

## 🏗️ Project Structure

```
sarsar-platform/
├── public/              # Static files
├── src/
│   ├── assets/         # Images, fonts, animations
│   ├── components/     # React components
│   │   ├── ui/        # Reusable UI components
│   │   ├── layout/    # Layout components
│   │   ├── customer/  # Customer-specific components
│   │   ├── supplier/  # Supplier-specific components
│   │   ├── admin/     # Admin-specific components
│   │   └── shared/    # Shared components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── config/        # Configuration files
│   ├── styles/        # Global styles
│   ├── lib/           # Third-party library configs
│   ├── App.jsx        # Main App component
│   └── main.jsx       # Entry point
├── .env.example       # Environment variables template
├── package.json       # Dependencies
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── README.md          # This file
```

---

## 🎨 Design System

### Colors

**Primary (Orange)**
- Main: `#FF6B35`
- Deep: `#F7931E`
- Light: `#FFB88C`

**Secondary (Green)**
- Main: `#10B981`
- Dark: `#059669`

**Accent (Amber)**
- Main: `#F59E0B`

### Typography

**Fonts:**
- Display: Poppins
- Body: Inter
- Sans: System UI stack

**Sizes:** 16px base (18px preferred for readability)

### Animations

- Smooth page transitions
- Hover effects with scale
- Slide-in modals
- Shimmer loading states
- Float animations for CTAs

---

## 📱 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

### Code Style

- **ES6+** syntax
- **Functional components** with hooks
- **Tailwind** for styling
- **ESLint** for code quality
- **Prettier** for formatting (optional)

### Component Guidelines

```jsx
// Use named exports for components
export function MyComponent() {
  return <div>Content</div>
}

// Use path aliases
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice } from '@/utils/formatters'
```

---

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
```

---

## 🚢 Deployment

### Build for Production

```bash
pnpm build
```

This generates optimized files in the `dist/` directory.

### Hosting Options

**Recommended:** Hostinger
- Node.js support
- SSL included
- Daily backups
- 99.9% uptime

**Alternative:** Firebase Hosting, Vercel, Netlify

### Deploy to Hostinger

```bash
# SSH into server
ssh user@sarsar.com.np

# Clone and setup
git clone https://github.com/yourusername/sarsar-platform.git
cd sarsar-platform
pnpm install
pnpm build

# Setup PM2 for process management
pm2 start ecosystem.config.js
pm2 save
```

---

## 🔒 Security

- ✅ HTTPS/SSL encryption
- ✅ Environment variables for secrets
- ✅ Firebase security rules
- ✅ Input validation (client + server)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Regular security audits

---

## 📊 Performance

### Targets
- **Lighthouse Score:** 95+ (mobile)
- **Load Time:** < 2 seconds
- **FCP:** < 1.5s
- **LCP:** < 2.5s
- **CLS:** < 0.05

### Optimizations
- Code splitting by route
- Lazy loading images
- Tree shaking
- Gzip/Brotli compression
- CDN for static assets
- Service worker caching

---

## 🤝 Contributing

This is a private commercial project. Contributions are limited to the core team.

### For Team Members:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Wait for review

---

## 📄 License

Private & Proprietary - All Rights Reserved

Copyright © 2025 SARSAR Platform  
Created by Vishal Sharma

---

## 📞 Contact & Support

**Customer Support:**
- **WhatsApp:** +977 9821072912
- **Email:** support@sarsar.com.np
- **Hours:** 6 AM - 11 PM NPT

**Business Inquiries:**
- **Email:** hello@sarsar.com.np

**Social Media:**
- **Instagram:** [@_official_sarsar](https://www.instagram.com/_official_sarsar)
- **Founder:** [@sharma_vishal_o](https://www.instagram.com/sharma_vishal_o)

---

## 🙏 Acknowledgments

Built with ❤️ in Butwal, Nepal

**Tech Stack Credits:**
- React Team
- Vite Team
- Tailwind Labs
- Firebase Team
- Open Source Community

---

## 🗺️ Roadmap

### Phase 1 (Current) - MVP
- ✅ Core platform features
- ✅ Customer ordering
- ✅ Supplier fulfillment
- ✅ Admin management
- ✅ Real-time tracking

### Phase 2 (Month 2)
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Advanced analytics
- [ ] Marketing automation
- [ ] Loyalty program

### Phase 3 (Month 4)
- [ ] AI recommendations
- [ ] Voice search
- [ ] Subscription service
- [ ] Multi-city expansion
- [ ] Partner API

---

**🚀 Building the future of quick commerce in Nepal!**

*Made with 🧡 by Vishal Sharma*