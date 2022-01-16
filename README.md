# Introduction:

MarocShip wishes to simplify the management of deliveries for it’s e-commerce partners with the creation of a Rest API.

Database: MongoDB (Monk/Mongoose).

Logs with Morgan and Winston.

# Config:

Copy or rename `.env.example` into `.env`, and fill in the values:

```
# Database:
DB_CLUSTER=
DB_NAME=
DB_USER=
DB_PASS=

# Client Origin
CLIENT_ORIGIN=

# Server Port
PORT=

# API Access Secrets
ADMIN_ACCESS_SECRET=
MANAGER_ACCESS_SECRET=
SUPERVISOR_ACCESS_SECRET=
DRIVER_ACCESS_SECRET=

# API Refresh Secrets
ADMIN_REFRESH_SECRET=
MANAGER_REFRESH_SECRET=
SUPERVISOR_REFRESH_SECRET=
DRIVER_REFRESH_SECRET=

# Admin Credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=

# NODE ENV
NODE_ENV=
```

Install dependencies:

```
npm install
```

Seed Admin account:

```
npm run seed:admin
```

# Usage:

Run server:

```
npm run dev
```

# Api:

Current user data format (for login, register and update):

```json
{
    "email": "email@domain.com",
    "password": "password"
}
```

* Login: Get an Access Token, Sets Refresh Token in cookie httpOnly.
* Refresh: Send Refresh Token from cookie to get new Access Token.

Admin endpoints:

Login (POST): `/admin/login`\
Refresh Token (POST): `/admin/refresh`\
Managers (GET): `/admin/managers`\
Manager (POST): `/admin/manager`\
Manager (PATCH): `/admin/manager/:id`

Manager endpoints:

Login (POST): `/manager/login`\
Refresh Token (POST): `/manager/refresh`\
Supervisors (GET): `/manager/supervisors`\
Drivers (GET): `/manager/drivers`\
Supervisor (POST): `/manager/supervisor`\
Driver (POST): `/manager/driver`\
Supervisor (PATCH): `/manager/supervisor/:id`\
Driver (PATCH): `/manager/driver/:id`

Supervisor endpoints:

Login (POST): `/supervisor/login`\
Refresh Token (POST): `/supervisor/refresh`

Driver endpoints:

Login (POST): `/driver/login`\
Refresh Token (POST): `/driver/refresh`