# Project Status Report: StockShot Greenfield

**Last Updated: May 13, 2026**

## Project Overview

StockShot is a professional multi-outlet stock management and payroll application. The system is designed to provide real-time inventory tracking, audit logs for stock movements, and a robust payroll module, all governed by a granular role-based access control (RBAC) system.

## 🏗️ Technical Architecture

- **Frontend**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS with **shadcn/ui** (Nova preset).
- **State Management & Data Fetching**: TanStack Query (React Query) v5.
- **Backend-as-a-Service**: Firebase (Firestore, Authentication).
- **Routing**: React Router DOM v6.

## ✅ Implemented Features

### 1. Authentication & Security

- **Enhanced Auth Context**: Provides real-time access to the authenticated user's Firebase details and their Firestore profile (Role + Outlet assignment).
- **Role-Based Access Control (RBAC)**: Supports `admin`, `outlet_manager`, and `staff` roles.
- **Firestore Security Rules**: Implemented rules that isolate data per outlet for staff/managers while allowing global access for admins.
- **Protected Routes**: Custom components that guard pages based on authentication status, required roles, or outlet assignments.

### 2. Stock Management System

- **Global Item Catalog**: A shared collection of all stock items available across the organization.
- **Per-Outlet Inventory**: Specialized records tracking current balances for specific items at specific locations.
- **Atomic Transactions**: A service layer that uses Firestore transactions to ensure stock updates (IN, OUT, ADJUSTMENT) and audit logging are processed as a single unit.
- **Audit Trail**: Every stock movement is logged in a `stock_transactions` collection with previous and closing balances.

### 3. Dashboard & UI

- **Stock Overview**: Visual summary of total items, low stock alerts, and recent transactions.
- **Low Stock Feedback**: Automatic calculation of stock health with visual badges (Low, Medium, Good).
- **Responsive Tables**: Modern, clean data display using shadcn/ui table components.

### 4. Service Layers (Client-Side)

- **Outlet Service**: Full CRUD operations for managing locations and manager assignments.
- **Employee Service**: Management of staff records, including base salary and outlet assignment.
- **Enhanced Payroll Service**: Automated monthly payroll generation based on current employee records, mark-as-paid functionality, and filtering by month/outlet.

### 5. Developer Utilities

- **Seed System**: A built-in script to populate the database with test outlets, items, and initial stock levels for rapid development.

## 📂 Current File Structure

- `src/lib/firebase/`: Configuration, services (stock, payroll), and seeding logic.
- `src/contexts/`: Authentication and application state.
- `src/hooks/`: Data fetching hooks for stock, transactions, payroll, and user profiles.
- `src/components/`: Reusable UI elements, including auth guards and stock status indicators.
- `src/pages/`: Main application views (Dashboard, Login placeholders).

## 🚀 Next Steps

- Implement the **Stock Adjustment Form** for manual inventory corrections.
- Build the **Outlet Management Interface** for administrators.
- Complete the **Payroll Management UI** for generating and processing monthly salaries.
- Implement **Authentication Pages** (Sign-in/Sign-up) to replace the current placeholders.
