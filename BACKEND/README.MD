### 🧠 SaaS ERP System Architecture (Multi-Tenant + RBAC + Limits)

This system is designed as a **multi-tenant ERP SaaS application**, where multiple companies can use the platform independently, and each company can manage its own users, roles, branches, and business rules.

---

## 🏢 Core Concepts

### 1. Multi-Tenancy (Company-Based Isolation)

Each company represents a **tenant** in the system.

* A single user can belong to multiple companies
* Each company has its own:

  * roles
  * users
  * branches
  * permissions

This ensures **data isolation and scalability**

---

### 2. Branch-Level Structure

Each company can have multiple branches.

* Roles are defined at **company level**
* But users can have **different roles in different branches**
* This is handled via a mapping model

---

## 👤 Models Overview

### 🔹 User

Represents a person using the system.

* Unique by email
* Can belong to multiple companies

---

### 🔹 Company

Represents an organization (tenant)

* Contains company details (GST, PAN, address)
* Has multiple owners (users)

---

### 🔹 Branch

Represents a sub-unit of a company

* Linked to a company
* Used for location-based role assignment

---

### 🔹 Role (Dynamic RBAC)

Defines **what actions a user can perform**

* Stored per company
* Uses dynamic structure:

```js
permissions: [
  {
    module: "sales",
    actions: ["create", "read", "approve"]
  }
]
```

This allows:

* Adding new modules without schema change
* Adding new actions dynamically

---

### 🔹 UserCompanyRole (Core Mapping Model)

This is the **most important model**

It links:

* user
* company
* branch
* role
* limits

```js
UserCompanyRole {
  userId,
  companyId,
  branchId (null = all branches),
  roleId,
  limits
}
```

---

## 🔐 Access Control System

This system uses a **hybrid approach**:

### 1. RBAC (Role-Based Access Control)

Handled via `Role.permissions`

👉 Defines:

> What a user *can do*

Example:

* create sales
* approve purchase

---

### 2. ABAC (Attribute-Based Control via Limits)

Handled via `limits` in UserCompanyRole

👉 Defines:

> How much a user can do

Example:

```js
limits: {
  sales: {
    maxDiscountPercent: 10
  },
  approval: {
    maxApprovalAmount: 100000
  }
}
```

---

## ⚙️ Request Flow (How system works)

Every API request follows this flow:

### Step 1: Fetch User Role Mapping

```js
UserCompanyRole.findOne({
  userId,
  companyId,
  $or: [
    { branchId },
    { branchId: null }
  ]
}).populate("roleId")
```

---

### Step 2: Check Permission

```js
checkPermission(role, module, action)
```

👉 Validates:

* module exists
* action allowed

---

### Step 3: Check Limits

```js
checkLimit(userCompanyRole, module, key, value)
```

👉 Validates:

* numeric constraints (e.g. discount, approval amount)

---

### Step 4: Execute Business Logic

If both checks pass → proceed

---

## 🧩 Key Design Decisions

### ✅ Dynamic Permissions

* No schema change needed for new modules/actions
* Controlled via backend validation

---

### ✅ Branch-Aware Role Assignment

* `branchId = null` → applies to all branches
* specific `branchId` → branch-level control

---

### ✅ Separation of Concerns

| Component       | Responsibility       |
| --------------- | -------------------- |
| Role            | permissions          |
| UserCompanyRole | assignment + limits  |
| Limits          | business constraints |
| Middleware      | enforcement          |

---

## 🚀 Scalability

This design supports:

* multiple companies
* multiple branches
* dynamic roles
* customizable business rules

Without needing major schema changes

---

## 🧠 Final Summary

This system combines:

* **Multi-tenancy** (Company-based isolation)
* **RBAC** (permissions via roles)
* **ABAC** (limits via user-role mapping)
* **Branch-level flexibility**

Resulting in a **scalable, flexible, and production-ready ERP SaaS backend architecture**

---

### 💡 Core Principle

> Role = what you can do
> Limits = how much you can do

This separation ensures clarity, scalability, and maintainability in complex business systems.
date 18/april/2026


## 🔄 Implementation Progress Update (Auth + Git Workflow)

### 🚀 Authentication Layer Implemented

The system now includes a complete **authentication module** built using clean architecture principles.

---

### 🔐 Signup (User Creation)

**Endpoint:**

```
POST /api/users/signup
```

**Flow:**

```
Route → validateSignup → controller → service → DB
```

**Key Features:**

* Input validation using middleware
* Password hashing using bcrypt
* Unique email enforced via MongoDB index
* Proper error handling (duplicate email - code 11000)
* Sensitive data (password) excluded from response

---

### 🔐 Login (JWT Authentication)

**Endpoint:**

```
POST /api/auth/login
```

**Flow:**

```
Route → validateLogin → controller → service → DB → JWT
```

**Key Features:**

* Validates email and password
* Uses bcrypt.compare for password verification
* Generates JWT token on successful login
* Returns:

```json
{
  "user": { ...safeUser },
  "token": "jwt_token"
}
```

---

### 🔑 JWT Strategy

* Token is generated during login
* Token contains:

```js
{ userId }
```

* Token expiry: 1 day
* Stored on client side
* Sent in headers for protected routes:

```
Authorization: Bearer <token>
```

---

### 🧱 Backend Architecture Applied

All features follow strict separation:

```
Route → Middleware → Controller → Service → Model
```

| Layer      | Responsibility            |
| ---------- | ------------------------- |
| Middleware | validation                |
| Controller | request/response handling |
| Service    | business logic            |
| Model      | database schema           |

---

### ⚠️ Security Measures Implemented

* Password hashing using bcrypt
* Password never returned in API response
* Duplicate user prevention using unique index
* Error handling standardized

---

### 🧪 Testing

* APIs tested using Postman
* JSON request body used
* Valid and invalid scenarios tested:

  * missing fields ❌
  * wrong password ❌
  * duplicate email ❌
  * successful login/signup ✅

---

### 🔄 Git Workflow Followed

A proper feature-based workflow is being used:

#### Feature Development

```
git checkout -b feature/user-create
git add .
git commit -m "feat: user signup"
git push origin feature/user-create
```

#### Merge Process

```
git checkout main
git merge feature/user-create
git push origin main
git branch -d feature/user-create
```

Same flow followed for:

* feature/auth-login

---

### 🧠 Current System Capabilities

The system now supports:

* User creation (signup) ✅
* Secure login with JWT ✅
* Clean layered backend architecture ✅
* Version-controlled development using Git ✅

---

### 🎯 Next Implementation Phase

The next step is to integrate authentication with authorization:

1. **authMiddleware**

   * Verify JWT
   * Attach user to request

2. **checkPermission Middleware**

   * Validate RBAC rules

3. **checkLimit Middleware**

   * Enforce business constraints (ABAC)

4. **First Business Module**

   * Purchase module (end-to-end flow)

---

### 💡 Updated System Principle

> Authentication = Who you are
> Authorization = What you can do
> Limits = How much you can do

This layered approach ensures a secure and scalable ERP system.

### 🔐 Auth Middleware (JWT Protection)

This middleware is responsible for securing protected API routes by verifying JWT tokens and identifying the authenticated user.

---

### 📌 Purpose

- Ensures only authenticated users can access protected endpoints
- Extracts user identity from JWT
- Attaches user information to the request for further authorization

---

### ⚙️ How It Works

1. Reads token from request header:

   Authorization: Bearer <token>

2. Verifies token using JWT secret

3. Extracts payload:

   { userId }

4. Attaches user to request:

   req.user = { userId }

5. Passes control to next middleware

---

### ❌ Failure Cases

- Missing token → 401 Unauthorized
- Invalid token → 401 Unauthorized
- Expired token → 401 Unauthorized

---

### 📁 Location

middlewares/auth.middleware.js

---

### 🔄 Request Flow

Route → authMiddleware → next()

---

### 💡 Notes

- This middleware does NOT query the database (kept lightweight)
- Handles only authentication (not authorization)
- Authorization (RBAC/ABAC) is handled in subsequent middleware

date 19/april/20264




## 🔄 Implementation Progress Update (Core ERP Modules + RBAC)

The system has now evolved beyond authentication and includes core ERP modules with a fully functional Role-Based Access Control (RBAC) system built on a multi-tenant architecture.

---

### 🏢 Company Module (Multi-Tenancy Foundation)

This module establishes the foundation of the system by introducing **company-based isolation (tenancy)**.

**Features:**

* Authenticated users can create companies
* Each company acts as an independent tenant
* The creator is automatically assigned as the **OWNER**
* Initializes access control by creating:
  * Default OWNER role
  * UserCompanyRole mapping

**Flow:**

Route → authMiddleware → validation → controller → service → DB

**Outcome:**

* Multi-tenant structure established
* Ownership and access initialized at creation

---

### 🏬 Branch Module (Organizational Structure)

Branches enable **location-based segmentation within a company**, allowing fine-grained access control.

**Features:**

* Create branch under a company
* Fetch all branches by companyId
* Supports multiple branches per company

**Key Design Decisions:**

* Each branch is strictly linked to a single company
* Enables assigning different roles per branch

---

### 🛡️ Role Module (Dynamic RBAC System)

Roles define **what actions a user can perform** within a company.

**Features:**

* Create roles dynamically per company
* Fetch roles by companyId
* Supports flexible permission structure

**Permissions Structure:**

permissions: [
  {
    module: "sales",
    actions: ["create", "read", "update"]
  }
]

**Validation:**

* Only predefined modules are allowed (sales, purchase, inventory, etc.)
* Only predefined actions are allowed (create, read, update, etc.)
* Prevents invalid or malicious permission injection

**Design Benefit:**

* No schema change required for new modules/actions
* Fully dynamic and scalable permission system

---

### 👨‍💼 Employee Module (User + Role Assignment)

This module connects users with companies, branches, and roles — forming the **core access control system**.

**Features:**

* Create new user OR reuse existing user (based on email)
* Assign multiple roles across multiple branches
* Supports different roles per branch

**Request Structure:**

{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "password": "123456",
  "companyId": "...",
  "assignments": [
    {
      "branchId": "...",
      "roleId": "..."
    },
    {
      "branchId": "...",
      "roleId": "..."
    }
  ]
}

**Key Capabilities:**

* One user → multiple companies
* One user → multiple branches
* One user → different roles per branch

---

### 🔗 UserCompanyRole (Core Mapping Model)

This is the **most critical model** in the system.

It defines the relationship:

User ↔ Company ↔ Branch ↔ Role ↔ Limits

**Enhancements:**

* One document per unique combination:
  * userId
  * companyId
  * branchId
  * roleId
* Supports unlimited role assignments

**Outcome:**

* Highly flexible RBAC system
* Enables branch-level authorization

---

### ⚡ Bulk Role Assignment Optimization

To improve performance and scalability:

* Uses `insertMany()` for bulk insertion
* Handles duplicate entries gracefully

**Implementation Detail:**

{ ordered: false }

**Benefits:**

* Faster than loop-based inserts
* Prevents failure due to duplicate entries
* Suitable for large-scale systems

---

### 🔐 Business Validation (Data Integrity & Security)

Critical validations are implemented at the service layer to ensure **data consistency and tenant isolation**.

#### Role Validation

Ensures that assigned roles belong to the same company:

Role.find({ _id: { $in: roleIds }, companyId })

#### Input Normalization

Handles duplicate roleIds before validation:

const roleIds = [...new Set(assignments.map(a => a.roleId))];

**Why Important:**

* Prevents cross-company role assignment
* Avoids incorrect validation failures
* Ensures strict data isolation

---

### 🧱 Architecture Improvements

The system strictly follows clean architecture principles:

| Layer      | Responsibility            |
|------------|--------------------------|
| Middleware | Validation               |
| Controller | Request/Response Handling|
| Service    | Business Logic           |
| Model      | Database Schema          |

**Benefits:**

* Maintainable codebase
* Scalable system design
* Clear separation of concerns

---

### 🧠 Current System Capabilities

The system now supports:

* Multi-tenant company structure ✅  
* Branch-level organization ✅  
* Dynamic role-based access control (RBAC) ✅  
* Multi-branch role assignment per user ✅  
* Employee management system ✅  
* Secure and validated data flow ✅  
* Business-level validation for consistency ✅  

---

### 🎯 Next Implementation Phase

The next phase focuses on **runtime authorization**:

1. loadUserContext Middleware  
   * Fetch role based on company + branch  
   * Attach permissions and limits to request  

2. checkPermission Middleware  
   * Validate if user can perform specific actions  

3. checkLimit Middleware  
   * Enforce business constraints (ABAC)  

---

### 💡 Updated System Principle

Authentication = Who you are  
Authorization = What you can do  
Context = Where you belong (company + branch)  
Limits = How much you can do  

This layered design ensures a scalable, secure, and production-ready ERP SaaS system.


## 🔄 Implementation Progress Update (Party Module - Customer & Supplier Management)

### 👥 Party Module (Customer & Supplier)

The system now includes a unified **Party module** to manage both customers and suppliers.

---

### 📌 Concept

Instead of separate models for customers and suppliers, a single **Party model** is used with a `type` field:

* customer
* supplier
* both

This allows flexible and scalable management of business entities.

---

### ⚙️ Features

* Create party (customer/supplier/both)
* Fetch all parties by company
* Filter parties by type (customer or supplier)
* Search party by mobile number
* Multi-tenant support using companyId

---

### 🧱 Model Design

Each party contains:

* name
* type (customer | supplier | both)
* phone (unique per company)
* email (optional)
* address
* companyId

---

### 🔐 Data Integrity

* Phone number is enforced as **unique per company**
* Prevents duplicate party creation within the same tenant
* Supports same phone across different companies (multi-tenant safe)

---

### 🔍 Search Functionality

Implemented fast lookup using mobile number:

GET /api/parties/search?phone=9876543210&companyId=...

**Key Points:**

* Optimized for billing and quick lookup
* Always scoped by companyId to ensure data isolation

---

### 🧠 Design Decisions

* Party is a **company-level entity** (not branch-specific)
* Same party can be used across multiple branches
* Avoids duplication and ensures centralized data

---

### 🚫 Why No Balance in Party?

Balance is NOT stored in Party.

Instead:

* All transactions will be stored in **Ledger**
* Balance will be calculated dynamically

This ensures:

* Accurate financial tracking
* Full transaction history
* Auditability

---

### 🧠 Current Capabilities

The system now supports:

* Customer and supplier management in single model ✅  
* Multi-tenant party isolation ✅  
* Unique identification using phone number ✅  
* Fast search by mobile number ✅  
* Clean and scalable entity design ✅  

---

### 🎯 Next Implementation Phase

1. **Ledger Module**
   * Track debit/credit transactions
   * Manage credit system

2. **Balance Calculation**
   * Compute from ledger entries

3. **Integration**
   * Connect with sales and purchase modules

---

### 💡 Updated System Principle

Party = Who (customer/supplier)  
Branch = Where transaction happens  
Ledger = Money flow  
Balance = Derived value  





## 🔄 Implementation Progress Update (Item Module - Product Master)

### 📦 Item Module (Product Management)

The system now includes a core **Item module** which acts as the **product master** for the ERP system.

---

### 📌 Concept

- Items are maintained at **company level (tenant-level)**
- Same item can be used across multiple branches
- Each item is uniquely identified using a **SKU (Stock Keeping Unit)**

---

### ⚙️ Features

- Create item
- Fetch all items by company
- SKU-based uniqueness per company
- Multi-tenant support using company context

---

### 🧱 Model Design

Each item contains:

- name  
- sku (unique per company)  
- unit (pcs, kg, liter, etc.)  
- sellingPrice (default UI price)  
- costPrice (last purchase price)  
- companyId  
- isActive flag  

---

### 🔐 Data Integrity

- SKU is enforced as **unique per company**
- Prevents duplicate product entries within the same tenant
- Same SKU can exist across different companies (multi-tenant safe)

---

### 🧠 Design Decisions

- Item is a **company-level entity (not branch-specific)**
- Stock is handled separately per branch
- Price is **NOT derived from item during transactions**
- Actual transaction price is stored in:
  - Purchase
  - Sale

---

### 🔒 Multi-Tenant Handling (Company Context)

The system uses a **dynamic company context approach**:

- JWT → identifies user (`userId`)
- Request Header → provides active company (`activecompanyid`)







---

### ⚙️ Middleware Flow

Route → authMiddleware → activeCompanyMiddleware → controller → service → DB

---

### 🧩 Middleware Responsibilities

| Middleware               | Responsibility                    |
|------------------------|----------------------------------|
| authMiddleware         | Authenticate user (JWT)           |
| activeCompanyMiddleware| Attach active company to request  |

---

### ⚠️ Edge Case Handling

- User may not have any company (valid state)
- Business APIs require company via middleware
- Auth and onboarding APIs do not require company

---

### 🧠 Current Capabilities

- Product master management (Item module) ✅  
- Multi-tenant item isolation ✅  
- SKU-based uniqueness per company ✅  
- Clean architecture (controller/service separation) ✅  
- Middleware-based company context handling ✅  

---

### 🎯 Next Implementation Phase

1. Stock Module  
   - Maintain branch-wise inventory  

2. StockTransaction Module  
   - Track stock movement (IN/OUT)  

3. Purchase Module  
   - Create purchase entries  
   - Increase stock  
   - Create ledger entry  

4. Sale Module  
   - Reduce stock  
   - Generate revenue entries  

---

### 💡 Updated System Principle

Item = What is being sold  
Stock = Where it is stored  
Transaction = When it moves  
Ledger = Money flow  










## 🔄 Implementation Progress Update (Inventory + Accounting Core Engine)

The system has now evolved into a **fully functional ERP backend MVP**, integrating inventory management with accounting in a transaction-safe, multi-tenant architecture.

This phase marks the transition from foundational modules (Auth, RBAC, Party, Item) to **core business operations**, enabling real-world transactional workflows.

---

# 🧠 Overview of This Phase

This implementation introduces the **core ERP engine**, which handles:

- Inventory tracking (Stock)
- Stock movement auditing (StockTransaction)
- Purchase workflow (Stock Inflow)
- Sale workflow (Stock Outflow)
- Financial tracking (Ledger)

All modules are tightly integrated using a **transaction-safe service layer**, ensuring data consistency and reliability.

---

# 📦 Stock Module (Branch-Level Inventory Management)

## 📌 Concept

Stock represents the **quantity of items available at a specific branch**.

- Stock is maintained at:
  - itemId
  - companyId
  - branchId
- Each combination has a **single unique record**
- Quantity is always non-negative

---

## ⚙️ Features

- Fetch stock by item + branch
- Automatic stock creation during transactions
- Prevent negative stock using validation logic

---

## 🧠 Design Decisions

- Stock is NOT manually created via API
- Stock is automatically created when:
  - Purchase occurs
  - Opening stock is introduced
- Avoids unnecessary empty records and keeps system clean

---

## 🔐 Data Integrity

- Unique compound index ensures no duplicate stock entries
- Quantity cannot go below zero
- All updates go through service layer (no direct DB writes)

---

# 🔄 StockTransaction Module (Inventory Audit System)

## 📌 Concept

StockTransaction acts as a **complete audit log for all inventory movements**.

Every change in stock is recorded with:

- type: IN / OUT
- quantity
- referenceType
- referenceId

---

## ⚙️ Features

- Tracks all stock movements:
  - Purchase → IN
  - Sale → OUT
  - Future: returns, transfers, adjustments
- Enables traceability and debugging
- Links every transaction to its source

---

## 🧠 Design Decisions

- No public API for stock transactions
- Created internally via business flows only
- Prevents unauthorized stock manipulation

---

## 💡 Importance

Without StockTransaction:

- No audit trail ❌
- No debugging capability ❌
- No historical tracking ❌

---

# 🛒 Purchase Module (Inventory Inflow)

## 📌 Flow

Create Purchase  
→ Increase Stock  
→ Create StockTransaction (IN)  
→ Create Ledger Entry (CREDIT)  

---

## ⚙️ Features

- Multi-item purchase support
- Automatic stock increment
- Ledger entry for supplier liability
- Transaction-safe execution using MongoDB sessions

---

## 🧠 Business Logic

- Backend calculates:
  - item.total = quantity × price
  - totalAmount = sum of all items
- Prevents manipulation from frontend
- Ensures financial accuracy

---

## 🔐 Data Integrity

- Validates:
  - party exists
  - items exist
- Uses transactions:
  - rollback on failure
  - prevents partial updates

---

# 💰 Ledger Module (Accounting Engine)

## 📌 Concept

Ledger records all **financial transactions** in the system.

Each entry contains:

- partyId
- type (DEBIT / CREDIT)
- amount
- referenceType
- referenceId

---

## ⚙️ Features

- Tracks all monetary movements
- Linked with purchase and sale
- Enables balance calculation (derived, not stored)

---

## 🧠 Accounting Rules

| Action   | Ledger Entry |
|----------|-------------|
| Purchase | CREDIT      |
| Sale     | DEBIT       |
| Payment  | DEBIT       |
| Receipt  | CREDIT      |

---

## ⚠️ Design Rule

Ledger is **append-only**:

- No updates ❌
- No deletes ❌
- Only inserts ✅

---

# 🧾 Sale Module (Inventory Outflow)

## 📌 Flow

Create Sale  
→ Validate stock availability  
→ Decrease Stock  
→ Create StockTransaction (OUT)  
→ Create Ledger Entry (DEBIT)  

---

## ⚙️ Features

- Prevents overselling using stock validation
- Multi-item sale support
- Automatic stock deduction
- Transaction-safe execution

---

## 🧠 Key Logic

- Validates stock before sale
- Throws error if insufficient stock
- Ensures inventory consistency

---

# 🔐 Transaction Management (Critical System Design)

All business operations use **MongoDB transactions (sessions)**:

## Benefits:

- Atomic operations
- Rollback on failure
- Prevents partial updates

---

## Example Failure Handling

If any step fails:

- Purchase not saved ❌  
- Stock not updated ❌  
- Ledger not created ❌  

👉 Entire operation is rolled back

---

# 🧠 System-Wide Design Principles

---

## 1. Never Trust Frontend

- All totals calculated on backend
- Prevents manipulation and fraud

---

## 2. Service Layer as Single Source of Truth

All business logic is centralized:

- stockService
- purchaseService
- saleService
- ledgerService

---

## 3. Reference-Based Linking

Every transaction is linked using:

- referenceType
- referenceId

Enables:

- audit trails
- reporting
- debugging

---

## 4. Multi-Tenant Isolation

All data is scoped by:

- companyId
- branchId

Ensures strict tenant separation

---

# 🧠 Current System Capabilities

The system now supports:

- Product management (Item module) ✅  
- Branch-wise inventory tracking (Stock) ✅  
- Inventory audit logging (StockTransaction) ✅  
- Purchase flow (stock IN + ledger CREDIT) ✅  
- Sale flow (stock OUT + ledger DEBIT) ✅  
- Financial tracking via ledger ✅  
- Transaction-safe operations (rollback support) ✅  
- Strong validation and data integrity ✅  
- Multi-tenant + multi-branch architecture ✅  

---

# 🎯 Next Implementation Phase

The next phase will focus on completing the financial system and improving usability:

---

## 1. Payment & Receipt Module

- Record actual money transactions
- Settle outstanding balances

---

## 2. Balance Calculation

- Compute dynamically from ledger entries
- No balance stored in DB

---

## 3. Reporting System

- Sales reports
- Purchase reports
- Stock reports
- Ledger summaries

---

## 4. Advanced Features (Future)

- Discount handling
- Invoice numbering system
- Batch management
- GST / tax calculations

---

# 💡 Updated System Principle

Item = What is being sold  
Stock = Where it is stored  
StockTransaction = How it moves  
Purchase = Stock inflow  
Sale = Stock outflow  
Ledger = Money flow  
Balance = Derived value  

---

# 🚀 System Status

The backend now represents a **complete ERP MVP engine**, capable of handling:

- inventory management  
- transaction processing  
- financial tracking  

with a clean, scalable, and production-ready architecture.