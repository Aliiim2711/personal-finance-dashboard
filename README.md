# 💰 Personal Finance Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)
![Plaid](https://img.shields.io/badge/Plaid-API-00D4AA?style=for-the-badge&logo=plaid)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, AI-powered personal finance management application with real-time bank connections, beautiful visualizations, and intelligent email notifications.**

[🚀 Live Demo](#) | [📖 Documentation](#installation) | [🐛 Report Bug](https://github.com/Aliiim2711/personal-finance-dashboard/issues)

</div>

---

## ✨ Features

### 🏦 **Real Bank Connections**
- Secure integration with **11,000+ financial institutions** via Plaid API
- Real-time account balance monitoring
- Support for checking, savings, credit cards, loans, and investment accounts
- Bank-level security with OAuth 2.0

### 📊 **Beautiful Data Visualizations**
- **Interactive pie charts** showing financial group breakdowns (Assets, Investments, Liabilities)
- **Dynamic line charts** tracking balance history over time
- **Real-time financial metrics** with color-coded indicators
- **Responsive design** that works on all devices

### 💰 **Intelligent Balance Tracking**
- **Automatic balance refresh** from connected accounts
- **Change detection** with threshold-based notifications
- **Historical data storage** for trend analysis
- **Net worth calculations** updated in real-time

### 📧 **Smart Email Notifications**
- **Automated daily balance updates** via professional HTML emails
- **Change alerts** when significant balance movements are detected
- **Beautiful email templates** with financial summaries
- **Customizable notification preferences**

### 🎨 **Modern User Interface**
- **Professional dashboard** with clean, intuitive design
- **Mobile-responsive** layout built with Tailwind CSS
- **Dark/light mode** support (coming soon)
- **Accessibility-first** approach with proper ARIA labels

---

## 🚀 Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Beautiful, responsive charts
- **Lucide React** - Modern icon library

### **Backend & Database**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database operations
- **SQLite** - Lightweight database (production-ready for PostgreSQL/MySQL)
- **Plaid API** - Secure financial data connections

### **Email & Notifications**
- **Nodemailer** - Email delivery service
- **HTML Email Templates** - Professional, responsive email design
- **SMTP Integration** - Works with Gmail, Outlook, and custom servers

---

## 📦 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Plaid account** (free developer tier)
- **Email provider** (Gmail recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aliiim2711/personal-finance-dashboard.git
   cd personal-finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials in `.env.local`:
   ```env
   # Plaid Configuration
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   
   # Email Configuration  
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### 🏦 Plaid Setup

1. **Create a Plaid account** at [dashboard.plaid.com](https://dashboard.plaid.com)
2. **Create a new application**
   - App name: "Personal Finance Dashboard"
   - Products: Select "Transactions"
   - Environment: Start with "Sandbox"
3. **Get your credentials** from the Keys section
4. **Add to your `.env.local` file**

### 📧 Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. **Add credentials to `.env.local`**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

---

## 🎯 Usage

### **Connect Your Banks**
1. Click **"Connect Bank Account"** on the dashboard
2. Search and select your financial institution
3. Securely log in through Plaid's interface
4. Choose which accounts to connect

### **Monitor Your Finances**
- View **real-time balances** across all connected accounts
- Track **assets, liabilities, and net worth** with automatic calculations
- Analyze **spending patterns** with interactive charts

### **Receive Smart Notifications**
- Get **daily email updates** when balances change
- Monitor **significant transactions** automatically
- Track **account activity** with detailed change logs

### **Refresh & Update**
- Use **"Refresh Balances"** to get latest data from banks
- **Automatic change detection** triggers email notifications
- **Historical tracking** builds trend analysis over time

---

## 📊 Screenshots

### Dashboard Overview
*Beautiful, responsive dashboard showing all your financial accounts in one place*

### Financial Analytics
*Interactive charts breaking down your finances by category and tracking trends over time*

### Email Notifications
*Professional HTML emails with balance updates and change summaries*

---

## 🚀 Deployment

### **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Aliiim2711/personal-finance-dashboard)

1. **Connect your GitHub repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on every push

### **Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy to Railway
railway login
railway init
railway up
```

### **Docker**
```bash
# Build Docker image
docker build -t finance-dashboard .

# Run container
docker run -p 3000:3000 finance-dashboard
```

---

## 🔒 Security & Privacy

### **Data Protection**
- **Local data storage** - Your financial data stays on your server
- **Encrypted connections** - All API calls use HTTPS/TLS
- **Environment variables** - Sensitive credentials are never committed to code
- **Plaid security** - Bank-level encryption and OAuth 2.0

### **Privacy First**
- **No third-party data sharing** - Your data is never sold or shared
- **Minimal data collection** - Only transaction data necessary for functionality
- **User control** - Connect/disconnect accounts anytime
- **Transparent operations** - Open source code you can audit

---

## 🛠 Development

### **Project Structure**
```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API endpoints
│   │   └── page.tsx        # Main dashboard
│   ├── components/         # React components
│   │   ├── PlaidLink.tsx   # Bank connection component
│   │   ├── FinancialGroupChart.tsx
│   │   └── BalanceHistoryChart.tsx
│   └── lib/                # Utilities
│       ├── prisma.ts       # Database client
│       ├── plaid.ts        # Plaid API client
│       └── email.ts        # Email service
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

### **Database Schema**
- **PlaidItem** - Connected financial institutions
- **Account** - Individual bank accounts  
- **AccountBalance** - Historical balance data

### **API Endpoints**
- `GET /api/accounts` - Fetch connected accounts
- `POST /api/refresh-balances` - Update balances and send notifications
- `POST /api/test-email` - Test email configuration
- `GET /api/balance-history` - Retrieve historical data

---

## 📈 Roadmap

### **Phase 1** ✅ *Complete*
- [x] Plaid bank integration
- [x] Real-time balance tracking
- [x] Email notifications
- [x] Interactive charts
- [x] Responsive UI

### **Phase 2** 🚧 *In Progress*
- [ ] Transaction categorization with AI
- [ ] Budget planning and alerts
- [ ] Goals and savings tracking
- [ ] Mobile app (React Native)

### **Phase 3** 📋 *Planned*
- [ ] Multi-user support
- [ ] Advanced analytics and insights
- [ ] Investment portfolio tracking
- [ ] Bill reminder system
- [ ] Credit score monitoring

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow **TypeScript best practices**
- Add **tests for new features**
- Update **documentation** as needed
- Follow **conventional commits**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Plaid](https://plaid.com)** - For providing secure financial data access
- **[Next.js](https://nextjs.org)** - For the amazing React framework
- **[Vercel](https://vercel.com)** - For seamless deployment platform
- **[Chart.js](https://chartjs.org)** - For beautiful data visualizations
- **[Tailwind CSS](https://tailwindcss.com)** - For rapid UI development

---

## 📞 Support & Contact

- **📧 Email**: aleemwadhwaniya01@gmail.com
- **🐛 Issues**: [GitHub Issues](https://github.com/Aliiim2711/personal-finance-dashboard/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Aliiim2711/personal-finance-dashboard/discussions)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Aliiim2711](https://github.com/Aliiim2711)

*Building the future of personal finance, one commit at a time.*

</div>
