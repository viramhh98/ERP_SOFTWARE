src/
├── assets/             # Static files
│   ├── images/         # logo.png, login-bg.jpg
│   └── icons/          # svg icons (if not using a library)
│
├── components/         # Reusable UI "Building Blocks"
│   ├── ui/             # Atomic components (Buttons, Inputs, Badges)
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   └── shared/         # Complex components used in multiple places
│       ├── DataTable.jsx
│       └── StatCard.jsx
│
├── layouts/            # Page Wrappers
│   ├── AuthLayout.jsx  # Centered layout for Login/Signup
│   └── MainLayout.jsx  # Sidebar + Navbar layout for Dashboard pages
│
├── pages/              # Full Views (Components that handle data/logic)
│   ├── auth/           # Login, Forgot Password, Register
│   │   └── Login.jsx
│   ├── dashboard/      # Main Dashboard view
│   │   └── Overview.jsx
│   └── inventory/      # Inventory management pages
│       ├── ProductList.jsx
│       └── AddProduct.jsx
│
├── routes/             # Navigation Logic
│   └── AppRoutes.jsx
│
├── services/           # Backend communication
│   └── api.js          # Axios instance and API calls
│
├── utils/              # Helper functions
│   └── formatters.js   # e.g., currencyFormatter(), formatDate()
│
├── App.jsx             # Entry Point for Routing
└── main.jsx            # Entry Point for React
