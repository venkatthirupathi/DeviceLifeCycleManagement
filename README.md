# DeviceCycle — Product Lifecycle Management Platform

DeviceCycle is a full-stack web application built to manage the complete lifecycle of devices in an organization — from the moment a device is registered to the day it gets decommissioned. It gives teams a clean, centralized place to track devices, monitor firmware, manage updates, and maintain a full audit trail of every change made.

---

## What it does

Organizations deal with dozens or hundreds of devices — laptops, workstations, field equipment — and keeping track of what's active, what needs a firmware update, and what's been retired can get messy fast. DeviceCycle solves that by giving you:

- A **live dashboard** showing total devices, active count, firmware versions, and outdated device alerts
- A **device registry** where you can add, update, or decommission devices with full status tracking
- A **firmware catalog** to manage firmware versions and see which devices are running outdated builds
- A **change log** that automatically records every action — device created, status changed, firmware upgraded, or device deleted — with timestamps
- A **notification panel** in the header that shows recent activity across your fleet in real time
- **Role-based access** so regular users can view data while only admins can make changes

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (dark mode support)
- TanStack Query v5 for data fetching and caching
- Lucide React for icons

**Backend**
- ASP.NET Core 8 Web API
- Entity Framework Core 8 with SQL Server
- ASP.NET Identity for user management
- JWT Bearer authentication

---

## Project Structure

```
Registration-Lifecycle-Basics/
├── DeviceCycle.Server/          # ASP.NET Core backend
│   ├── Controllers/             # API endpoints (Devices, Auth, ChangeLogs, Firmware)
│   ├── Models/                  # EF Core models and DbContext
│   ├── Migrations/              # Database migrations
│   └── appsettings.json         # Configuration (DB, JWT)
│
└── devicecycle-client/          # React frontend
    ├── src/
    │   ├── api/                 # API calls and mock fallback
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # Dashboard, Devices, Firmware, ChangeLogs, Login
    │   └── context/             # Auth and Theme context
    └── vite.config.ts           # Vite + proxy config
```

---

## Features at a Glance

| Feature | Details |
|---|---|
| Device Management | Add, edit, delete devices with serial number, model, status, firmware |
| Status Tracking | Active, Inactive, Retired, Decommissioned |
| Firmware Management | Add firmware versions, detect outdated devices |
| Change Logs | Auto-logged on every create, update, and delete |
| Delete Audit Trail | Deleted devices are preserved in logs with serial number and model |
| Notifications | Real-time activity panel in the header |
| Auth | JWT-based login, user registration, admin registration with secret code |
| Dark Mode | Full dark/light theme toggle |
| Form Validation | Email format check, password strength validation on login/register |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/register-admin` | Register an admin (requires secret code) |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/devices` | List all devices (optional status filter) |
| POST | `/api/devices` | Add a new device (Admin only) |
| PUT | `/api/devices/{id}` | Update a device (Admin only) |
| DELETE | `/api/devices/{id}` | Delete a device (Admin only) |
| GET | `/api/devices/outdated` | List devices not on latest firmware |
| GET | `/api/devices/missing-firmware` | List devices with no firmware assigned |
| GET | `/api/changelogs` | Query change logs with filters |
| GET | `/api/changelogs/device/{id}` | Full history for a specific device |
| GET | `/api/firmware` | List all firmware versions |
| POST | `/api/firmware` | Add a new firmware version (Admin only) |

---

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- SQL Server (local or express)

### Backend Setup

1. Update the connection string in `DeviceCycle.Server/appsettings.json` to point to your SQL Server instance
2. Run migrations:
```bash
dotnet ef database update
```
3. Start the server:
```bash
dotnet run
```
The API will be available at `https://localhost:7110`

### Frontend Setup

```bash
cd devicecycle-client
npm install
npm run dev
```
The app will run at `http://localhost:8080`

---

## Team

| Name | Role |
|---|---|
| Rutuja | Team Lead — Database design and data modeling |
| Prakhar | Frontend — React UI, routing, components, API integration |
| Venkat | Authentication — JWT setup, Identity, role management |
| Anshu | Backend — API controllers, business logic, EF Core |

---

## Notes

- Admin registration requires a secret code configured in `appsettings.json`
- All timestamps are stored in UTC and displayed in Indian Standard Time (IST)
- The app includes a mock data fallback so the UI works even when the backend is offline
