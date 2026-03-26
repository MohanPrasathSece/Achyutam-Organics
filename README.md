# Achyutam Organics E-Commerce Platform

Welcome to the **Achyutam Organics** e-commerce platform! This full-stack web application offers a complete, premium digital storefront for traditional Bilona method A2 Gir Cow dairy products, alongside a secure Admin Dashboard for ongoing business management.

## 🚀 Key Features

### For Customers (The Storefront)
*   **Fully Responsive UI**: Mobile-first design perfectly scaled for all screen sizes using Tailwind CSS, featuring custom typography and spacing for laptop/desktop views.
*   **Real-time Shopping Cart**: Global state management via React Context ensures instant cart updates without page reloads.
*   **Checkout & Payments**: Ready for **Razorpay** integration and robustly supports **Cash on Delivery (COD)** routing.
*   **Automated Email Lifecycles**: Customers automatically receive branded HTML emails providing order receipts, shipping tracking links, and delivery confirmations based on their order status.

### For Store Owners (Admin Dashboard)
*   **Secure Authentication**: Protected by Supabase Auth (JWT).
*   **Business Overview**: Instantly view total revenue, active orders, and product catalog sizes directly from the database.
*   **Order Fulfillment**: Add tracking IDs, tracking URLs, and click 'Shipped' to instantly log data to the database and trigger automated dispatch emails to customers.
*   **Intelligent Statuses**: Developer-friendly UI statuses automatically map to strict PostgreSQL backend constraints (`orders_status_check`) to prevent server crashes.

---

## 💻 Tech Stack & Architecture

### Frontend (Client-Side)
*   **React 18** & **Vite**: Superfast local development Server and strict hot-reloading.
*   **TypeScript**: Strongly-typed layouts and models.
*   **Tailwind CSS**: Highly optimized utility-first styling.
*   **React Router DOM v6**: Smooth, instantaneous Single Page Application (SPA) routing.
*   **Lucide React**: Clean, lightweight SVG icons.

### Backend (Server-Side)
*   **Node.js / Express.js**: Centralized API routing, running steadily with port-proxying configuration.
*   **Nodemailer Engine**: Custom SMTP utilities seamlessly generating responsive HTML tables injected with database metadata (`email.js`).
*   **Supabase (PostgreSQL)**: Core database logic enforcing highly strict tables (`orders`, `products`) and enforcing data integrity.

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
*   **Node.js** (v18 or higher recommended)
*   npm or yarn
*   A **Supabase** account with a configured PostgreSQL database
*   An **SMTP Email Provider** (e.g., Gmail, SendGrid)

### 1. Installation
Clone the repository and install all required dependencies:
```bash
git clone https://github.com/MohanPrasathSece/Achyutam-Organics.git
cd Achyutam
npm install
```

### 2. Environment Variables (.env Setup)
Create a `.env` file in the root directory of the project. **Never commit these secrets.** You will need the following configurations to run the app:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Connection
DATABASE_URL=your_postgres_database_url

# Email / SMTP Configuration
SMTP_HOST=smtp.your_provider.com
SMTP_PORT=465
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
EMAIL_FROM="Achyutam Organics <your_email@domain.com>"
OWNER_EMAIL="owner_receive@domain.com"
```

### 3. Database Schema
Ensure exactly that the Supabase PostgreSQL database contains the proper `orders` tables. *Crucially*, the constraint `orders_status_check` must permit the exact lowercase strings: `pending`, `confirmed`, `shipped`, `out for delivery`, `delivered`, `cancelled`.

### 4. Running the Complete Application
This project is configured to run the client and the server simultaneously. Run the following command:
```bash
npm run dev
```

*   The **Frontend development server** (Vite) will launch at `http://localhost:5173`.
*   The **Backend REST API** (Express) will launch at `http://localhost:4001` (and Vite proxies `/api` calls safely to it).

---

## 📬 Automated Email Testing
During development, if you manually test the `update-status` API on the Admin Orders page, ensure you provide valid SMTP credentials. Changing an order to "Shipped" will generate server logs ("Sending Email...") and dispatch live test emails securely via Node.

---
*Built with passion and purity for Achyutam Organics.*
