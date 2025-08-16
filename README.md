# 🏥 VIRTRA - Modern Healthcare Platform

![Virtra](./public/VirTraHome.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

> **VIRTRA** is a cutting-edge healthcare platform that revolutionizes patient care through modern technology, secure authentication, and intuitive user experiences. Built with Next.js 15, React 19, and Supabase for a seamless healthcare management solution.

## ✨ Features

### 🔐 **Secure Authentication**
- **Supabase Auth Integration** - Enterprise-grade authentication
- **Protected Routes** - Secure access to sensitive healthcare data
- **Session Management** - Persistent user sessions with automatic logout
- **Role-based Access** - Different access levels for patients and healthcare providers

### 🏠 **Patient Dashboard**
- **Personalized Overview** - Custom dashboard with patient-specific information
- **Appointment Management** - Schedule, view, and manage medical appointments
- **Health Records** - Secure access to medical history and documents
- **Real-time Updates** - Live notifications and status updates

### 📅 **Appointment System**
- **Smart Scheduling** - Intelligent appointment booking with availability checking
- **Video Consultations** - Integrated video call functionality for remote care
- **Confirmation System** - Automated appointment confirmations and reminders
- **Rescheduling** - Flexible appointment modification up to 2 hours before

### 🧠 **VIRTRA AI Assistant**
- **AI-Powered Health Support** - Intelligent health queries and guidance
- **Symptom Analysis** - Preliminary health assessments
- **Medical Information** - Access to reliable health information
- **Personalized Recommendations** - AI-driven health suggestions

### 📚 **Health Bits Knowledge Hub**
- **Nutrition Guides** - Comprehensive dietary advice and meal planning
- **Workout Routines** - Exercise programs for all fitness levels
- **Health Articles** - Expert medical insights and wellness advice
- **Trending Health News** - Latest medical research and breakthroughs

### 👤 **Profile Management**
- **Personal Information** - Complete profile customization
- **Avatar Upload** - Profile picture management with Supabase Storage
- **Medical History** - Secure storage of health records
- **Preferences** - Personalized platform settings

### 🎨 **Modern UI/UX**
- **Responsive Design** - Optimized for all devices and screen sizes
- **Dark Theme** - Eye-friendly dark mode interface
- **Glassmorphism Effects** - Modern backdrop blur and transparency
- **Smooth Animations** - Fluid transitions and micro-interactions
- **Accessibility** - WCAG compliant design for inclusive healthcare

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.3.4** - React framework with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

### **Backend & Database**
- **Supabase** - Open-source Firebase alternative
  - **Authentication** - Built-in auth with multiple providers
  - **PostgreSQL Database** - Reliable relational database
  - **Real-time Subscriptions** - Live data updates
  - **Storage** - File upload and management

### **State Management**
- **Zustand** - Lightweight state management
- **React Hooks** - Modern React state management

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Turbopack** - Fast development builds

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- **Supabase** account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/virtra.git
   cd virtra
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Set up the required database tables (see `AUTHENTICATION_GUIDE.md`)
   - Configure authentication settings

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start

# Run linting
npm run lint
```

## 📁 Project Structure

```
virtra/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Patient dashboard
│   ├── appointment/       # Appointment management
│   ├── health-bits/       # Health knowledge hub
│   ├── profile/          # User profile management
│   ├── virtra-ai/        # AI health assistant
│   ├── login/            # Authentication pages
│   └── signup/           # User registration
├── components/            # Reusable React components
│   ├── Topbar.tsx        # Navigation header
│   ├── Sidebar.tsx       # Side navigation
│   ├── Footer.tsx        # Footer component
│   ├── AuthLayout.tsx    # Authentication wrapper
│   └── ProtectedRoute.tsx # Route protection
├── lib/                  # Utility libraries
│   └── supabaseClient.ts # Supabase configuration
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Configure authentication providers
3. Set up database tables for profiles and appointments
4. Configure storage buckets for avatar uploads
5. Set up Row Level Security (RLS) policies

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY` - Private key for server-side operations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Scalable hosting

## 🤝 Contributing

We welcome contributions to make VIRTRA even better!

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test thoroughly before submitting PRs
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) for detailed setup instructions
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/yourusername/virtra/issues)
- **Discussions**: Join community discussions in [GitHub Discussions](https://github.com/yourusername/virtra/discussions)

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Next.js Team** for the incredible React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon library
- **Vercel** for seamless deployment and hosting

---

<div align="center">

**Built with ❤️ for better healthcare**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/virtra?style=social)](https://github.com/yourusername/virtra/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/virtra?style=social)](https://github.com/yourusername/virtra/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/virtra)](https://github.com/yourusername/virtra/issues)

</div>