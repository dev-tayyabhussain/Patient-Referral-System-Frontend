# MediNet Frontend

A comprehensive healthcare management platform frontend built with React, TypeScript, and Material-UI. This application provides role-based access control for doctors, hospital administrators, patients, and super administrators with a complete approval workflow system.

## 🚀 Features

### Core Features

- **Role-Based Authentication**: Secure login system for different user types
- **Approval Workflow**: Complete approval system for hospitals and doctors
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful interface built with Material-UI
- **Type Safety**: Full TypeScript implementation

### User Roles

- **Super Admin**: System administration and hospital approval
- **Hospital Admin**: Hospital management and doctor approval
- **Doctor**: Patient care and appointment management
- **Patient**: Appointment booking and health record access

### Approval Workflow

- **Hospital Registration**: Requires Super Admin approval
- **Doctor Registration**: Requires Hospital Admin approval
- **Status Tracking**: Real-time approval status updates
- **Email Notifications**: Automated approval notifications

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Vite** - Build tool

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DaniyalAlam09/medinet-frontend.git
   cd medinet-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Update the environment variables in `.env.local`:

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=MediNet
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   └── layout/         # Layout components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── pages/              # Page components
│   ├── admin/          # Super admin pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── doctor/         # Doctor pages
│   ├── hospital/       # Hospital admin pages
│   └── patient/        # Patient pages
├── routes/             # Route configuration
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── theme/              # Material-UI theme configuration
```

## 🔐 Authentication & Authorization

### Login Flow

1. User enters credentials
2. System validates with backend
3. JWT token stored securely
4. User redirected to appropriate dashboard

### Approval Flow

1. **Hospital Admin**: Registers → Pending approval → Super Admin approves → Access granted
2. **Doctor**: Registers → Pending approval → Hospital Admin approves → Access granted
3. **Patient**: Registers → Immediate access
4. **Super Admin**: Registers → Immediate access

### Protected Routes

- All dashboard routes require authentication
- Role-based access control for specific features
- Approval status checked before access

## 🎨 UI/UX Features

### Design System

- **Primary Color**: #1988C8 (Blue)
- **Secondary Color**: #339164 (Green)
- **Typography**: Custom font sizing and weights
- **Components**: Consistent Material-UI theming

### Responsive Design

- Mobile-first approach
- Breakpoints: xs, sm, md, lg, xl
- Adaptive navigation and layouts
- Touch-friendly interactions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

### Build Configuration

- Vite configuration in `vite.config.ts`
- TypeScript configuration in `tsconfig.json`
- ESLint configuration in `.eslintrc.js`

## 🚀 Performance

### Optimization Features

- Code splitting with dynamic imports
- Lazy loading of routes
- Optimized bundle size
- Tree shaking for unused code
- Image optimization

### Bundle Analysis

```bash
npm run build -- --analyze
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@medinet.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with approval workflow
- **v0.9.0** - Beta release with basic functionality
- **v0.8.0** - Alpha release with core features

---

**MediNet Frontend** - Connecting healthcare professionals and patients through technology.
