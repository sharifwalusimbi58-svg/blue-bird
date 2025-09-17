# UGMarket - E-commerce Platform

A full-stack e-commerce platform built with Node.js/Express backend and React frontend.

## Features

- User authentication (login/register)
- Product catalog
- Shopping cart
- Order management
- Seller dashboard
- Admin panel

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file (see example below)
3. Start backend: `npm run dev`
4. Start frontend: `npm start`

## Environment Variables

Create a `.env` file with the following variables:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ugmarket
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=5000