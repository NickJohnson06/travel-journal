# ✈️ Travel Journal & Planner

A full-stack **MERN** application that allows users to **plan trips**, **record travel memories**, and **track travel details** — all in one secure, easy-to-use interface.

---

## 🌍 Overview

The **Travel Journal & Planner** combines trip organization and journaling in a single web app.  
Users can create trips, add notes or photos, and manage itineraries while logged into their personal account.

Built with the **MERN stack** and **Tailwind CSS**, the app demonstrates user authentication, CRUD operations, JavaScript validation, and modern responsive styling.

---

## 🧭 Features

### 🔐 User Authentication
- Secure **login, signup, and logout** functionality  
- Session-based authentication using JWT and bcrypt  
- Routes protected at both backend and frontend levels  

### 🧳 Trip Management (CRUD)
- **Create:** Add new trips with destination, dates, budget, and notes  
- **Read:** View all upcoming and past trips on the dashboard  
- **Update:** Edit existing trip details  
- **Delete:** Remove trips from your dashboard permanently  

### 📖 Journal Entries
- Add daily journal entries tied to a specific trip  
- Edit or delete entries at any time  
- Optional photo upload and timestamp tracking  

### 👤 Profile Page
- Displays user info, trip count, and travel stats  
- Editable “About Me” section for personalization  

### 💻 Form Validation
- Frontend JavaScript validation using React state and handlers  
- Required field checks for trips, dates, and entries  
- Real-time feedback for invalid or missing fields  

### 🎨 Styling
- Built with **Tailwind CSS** for rapid, consistent design  
- Fully responsive layout for mobile and desktop  
- Modern, minimal, travel-inspired color palette  

---

## 🗂️ Page Structure

| Page | Route | Description | Access |
|------|--------|--------------|--------|
| **Login** | `/login` | User login page | Public |
| **Signup** | `/signup` | New user registration | Public |
| **Dashboard** | `/dashboard` | View all trips | Protected |
| **Add Trip** | `/trips/new` | Create a new trip | Protected |
| **Trip Detail** | `/trips/:id` | View trip info and journal entries | Protected |
| **Edit Trip** | `/trips/:id/edit` | Update trip details | Protected |
| **Profile** | `/profile` | View and edit user info | Protected |

---

## 🧩 Technical Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React (Vite or CRA) + Tailwind CSS |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT + bcrypt |
| **Validation** | React state + server-side checks |
| **Styling** | Tailwind utility classes |
