# MtejaHub

A customer management system that lets an organization register, view, search, update and delete customer records. Admins manage every customer from one dashboard, and customers can sign up to view and update their own details.

---

## Features

### Admin
- Dashboard with stats: total customers, new in the last 7 and 30 days, and self-registered customers
- List of the 5 most recent customers
- Full customer list with pagination (10 per page)
- Search by first name, last name, email or phone
- Add, view, edit and delete customers
- Confirmation popup before every delete

### Customer
- Sign up and log in
- View their own profile
- Edit their own details
- Delete their own account (password confirmation plus a confirmation popup)

### General
- Role-based access: admins and customers only reach their own pages, enforced on both the backend and the frontend
- Input validation on the frontend (instant feedback) and the backend (Laravel Form Requests)
- Soft deletes: deleted records are hidden, not erased, so they can be restored
- Show/hide password toggle
- Responsive design for phones, tablets and laptops
- Blue and white theme

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React (Vite), React Router, axios, Tailwind CSS, lucide-react icons |
| Backend | Laravel, Laravel Sanctum (API tokens) |
| Database | MySQL |
| API testing | Postman |

---

## How it works

```
React app  ──(request + Bearer token)──▶  Laravel API  ──▶  MySQL
           ◀────────────(JSON)──────────
```

Every request to a protected route passes through these checks in Laravel:

1. **auth:sanctum** checks the token is valid
2. **Role middleware** checks the user is allowed (admin or customer)
3. **Form Request** validates the input
4. **Controller** reads or writes the database

---

## Project structure

```
Customer-Management-System/
├── Backend/                         Laravel API
│   ├── app/Http/Controllers/Api/    AuthController, CustomerController,
│   │                                ProfileController, DashboardController
│   ├── app/Http/Middleware/         EnsureUserHasRole
│   ├── app/Http/Requests/           Validation rules
│   ├── app/Models/                  User, Customer
│   ├── database/migrations/         users and customers tables
│   ├── database/seeders/            Admin account
│   └── routes/api.php               API routes
│
└── Frontend/                        React app
    └── src/
        ├── api/                     axios setup
        ├── components/              FormInput, CustomerForm, ConfirmModal,
        │                            ProtectedRoute
        ├── context/                 AuthContext (logged-in user and token)
        ├── layouts/                 AppLayout (navbar)
        ├── pages/                   Login, Register, NotFound
        │   ├── admin/               Dashboard, customers list, add, view, edit
        │   └── customer/            My profile, edit profile, settings
        └── utils/                   Validation and error helpers
```

---

## Getting started

### Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL
- Node.js 20.19+ or 22.12+

### 1. Clone the repository

```bash
git clone git@github.com:KimberlyWangui/Customer-Management-System.git
cd Customer-Management-System
```

### 2. Set up the backend

```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
```

Create an empty MySQL database called `customer_management`, then update these lines in `Backend/.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=customer_management
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
```

Build the tables and create the admin account:

```bash
php artisan migrate --seed
```

Optional: add 25 sample customers for testing:

```bash
php artisan tinker
```
```php
App\Models\Customer::factory()->count(25)->create();
exit
```

Start the backend:

```bash
php artisan serve
```

The API runs at `http://127.0.0.1:8000/api`.

### 3. Set up the frontend

Open a second terminal:

```bash
cd Frontend
npm install
```

Create a file called `.env` in the `Frontend` folder:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API endpoints

All endpoints start with `/api`. Protected endpoints need the header `Authorization: Bearer <token>`, and every request should send `Accept: application/json`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | /register | Public | Sign up as a customer |
| POST | /login | Public | Log in and get a token |
| POST | /logout | Logged in | Log out (deletes the token) |
| GET | /me | Logged in | Get the logged-in user |
| GET | /profile | Customer | View own profile |
| PUT | /profile | Customer | Update own profile |
| DELETE | /profile | Customer | Delete own account (needs `password`) |
| GET | /dashboard/stats | Admin | Dashboard numbers and recent customers |
| GET | /customers?search=&page= | Admin | List and search customers |
| POST | /customers | Admin | Add a customer |
| GET | /customers/{id} | Admin | View one customer |
| PUT | /customers/{id} | Admin | Update a customer |
| DELETE | /customers/{id} | Admin | Delete a customer |

### Response codes

| Code | Meaning |
| --- | --- |
| 200 / 201 | Success / created |
| 401 | Not logged in, or the token is invalid |
| 403 | Logged in, but not allowed (wrong role) |
| 404 | Customer not found |
| 422 | Validation failed (the response lists each field's error) |

---

## Validation rules

| Field | Rules |
| --- | --- |
| First name, last name | Required, up to 100 characters |
| Email | Required, valid format, unique |
| Phone | Required, 10 to 13 digits |
| Address | Optional, up to 255 characters |
| Password (sign up) | Required, at least 8 characters, must match the confirmation |

---

## Design decisions

- **Two roles.** The brief describes an organization managing its customers, so the admin side covers every requirement. The customer side is an extra that lets customers keep their own details up to date.
- **Customers added by an admin are records only.** They don't have a login. Customers who want to use the app can sign up themselves.
- **Soft deletes.** Deleted customers are hidden from the app but kept in the database (with `deleted_at` filled in), so mistakes can be undone. Deleted customers can't log in.
- **Customers can delete their own account** after re-entering their password and confirming in a popup.
- **API tokens instead of cookies.** Sanctum's token mode is simpler when the React app and the Laravel API run on different ports.
- **Security on the backend.** The frontend hides pages by role for a smoother experience, but the Laravel middleware is what actually blocks access.

---

## Author

**Kimberly Wangui**
