# Webinar Registration System - ViT vs CNN

A modern, responsive webinar registration web application built for the "ViT vs CNN: The Clash of Architectures" event. This system includes a public landing page for attendees and a protected admin dashboard for organizers.

![Webinar Thumbnail](/public/assets/thumbnail.png)

## 🚀 Features

### **Landing Page (`/`)**

-   **Modern Design**: Aesthetic UI with split-screen layout, deep blue/purple theme, and glassmorphism effects.
-   **Event Details**: Features speaker info, date, time, and location in a compact, readable format.
-   **Discussion Points**: Highlights key webinar topics (e.g., "An Image is Worth 16x16 Words", "Patch Embeddings").
-   **Registration Form**:
    -   Fields for Name, Email, WhatsApp, Job Title (Select), Institution, and Referral Source.
    -   Dynamic "Job Title" selection tailored for AI/Data Science roles.
    -   Prominent "Join WhatsApp Group" redirect upon successful registration.
-   **SEO Optimized**: Includes meta tags, Open Graph (Facebook/LinkedIn), and Twitter Card support.
-   **Responsive**: Fully optimized for mobile and desktop devices.

### **Admin Dashboard (`/admin`)**

-   **Secure Access**: Simple password-protected login (`/admin/login`).
-   **Analytics**:
    -   Total Registrants count.
    -   Top Referral Source tracking.
-   **Registrant Management**:
    -   Data Table with sortable/filterable columns.
    -   **Search**: Real-time filtering by Name or Email.
    -   **Filter**: Filter by Referral Source.
    -   **Delete**: Remove invalid registrations.
-   **Export**: One-click **CSV Export** for offline data analysis.
-   **Supabase Integration**: Seamlessly syncs data with Supabase (backend) or falls back to LocalStorage for testing.

---

## 🛠 Tech Stack

-   **Frontend**: React (TypeScript), Vite
-   **Styling**: Tailwind CSS v4, Lucide React (Icons)
-   **Routing**: React Router DOM
-   **Backend / Storage**: Supabase (PostgreSQL) with LocalStorage fallback
-   **Deployment**: Ready for Netlify/Vercel

---

## ⚙️ Getting Started

### 1. Prerequisites

-   Node.js (v18+)
-   npm or yarn

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/lhfazry/webinar.git
cd webinar
npm install
```

### 3. Environment Setup (Supabase)

To enable the database backend, create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

> **Note**: If you skip this step, the app will automatically default to **LocalStorage**, so you can test it immediately without a backend!

### 4. Database Schema (If using Supabase)

Run the SQL commands found in `supabase_schema.sql` in your Supabase SQL Editor to create the necessary tables and policies.

### 5. Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Admin Access

-   **URL**: `/admin`
-   **Default Password** (for demo): `admin123`
-   _Note: This is a simple client-side check. For production, integrate Supabase Auth._

---

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components (RegistrationForm, etc.)
├── lib/             # Utilities (DataService, Supabase client)
├── pages/           # Page views (LandingPage, AdminDashboard, AdminLogin)
├── types/           # TypeScript interfaces and types
└── App.tsx          # Main routing configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
