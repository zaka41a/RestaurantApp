# 🍽️ RestaurantApp

A modern **restaurant management web application** built with **React (frontend)** and **PHP/MySQL (backend)**.  
The app allows staff to **take customer orders, manage tables, and track menus** with a clean and responsive interface.

---

## 🚀 Features

- 🔐 **Secure authentication** (login system with session handling)  
- 📋 **Menu management**: fetch items from backend (burgers, desserts, drinks, etc.)  
- 🪑 **Table management**: assign orders to specific tables  
- 🛒 **Order cart**: add/remove dishes, calculate totals dynamically  
- ✅ **Order validation**: send orders to backend via API  
- 🎨 **Modern UI**: dark theme with styled cards and responsive design  

---

## 🛠️ Tech Stack

### Frontend
- [React](https://react.dev/) – UI components & state management  
- Vanilla CSS – custom styling (dark theme, cards, buttons)  

### Backend
- [PHP](https://www.php.net/) – REST API endpoints  
- MySQL – database for menu, tables, and orders  

---

## 📂 Project Structure

```bash
RestaurantApp/
├── backend/                # PHP API & database logic
│   ├── api/
│   │   ├── auth/login.php  # Login endpoint
│   │   ├── menu.php        # Fetch menu items
│   │   ├── tables.php      # Fetch tables
│   │   └── orders.php      # Handle orders
│   └── uploads/            
│
├── frontend/               # React app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Login.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── index.css       # Global styles
│   │   └── ...
│   └── package.json
│
└── README.md
