# Setup Guide

## Prerequisite

- NodeJs (preferably the latest version)
- Yarn

## Clone the project
```
git clone https://github.com/Nitaray/thesis-management-system.git
cd thesis-management-system
```

## Install the dependencies

```
cd backend
yarn install
```

```
cd frontend
yarn install
```

## Start the project

### Backend

#### Config the environment variables

Create `backend/.env` file or set an environment variable accordingly.

```
DATASOURCE_URL = postgres://[user]:[password]@[net_location]:[port]/[dbname]

PORT = [port number] (Default 4000)

CLIENT_ORIGIN = [frontend's host] (Default localhost:3000)

REFRESH_TOKEN_EXPIRY = [expiry time in minutes] (Default 30 days)

JWT_EXPIRY = [expiry time in minutes] (Default 15 minutes)

JWT_SECRET = [Server jwt secret] (Optional)

K8S_TIMEOUT = [Deployment timeout in milliseconds] (Default 15 minutes)
```

Push the predefined schema to the database

```
npx prisma db push
```

#### Starting the server

```
npm run start
```
or
```
yarn start
```

### Frontend

#### Start the server

```
npm run start
```
or
```
yarn start
```

