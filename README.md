# Wonderlust — Airbnb Clone  

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com/)

> A full-stack **Airbnb clone** built using **Node.js**, **Express**, **MongoDB Atlas**, and **EJS** — featuring authentication, CRUD operations, image uploads, and secure deployment.

---

##  Live Demo  
🔗 **Visit App:** [https://wonderlust-p3w8.onrender.com/listings](https://wonderlust-p3w8.onrender.com/listings)

---

##  Overview  

**Wonderlust** is a complete web application inspired by **Airbnb**, designed to explore the architecture of real-world web apps — including user authentication, data relationships, and deployment.

It demonstrates how to build a production-grade server with **Express.js**, manage persistent data with **MongoDB Atlas**, and serve dynamic pages using **EJS templating**.

---

##  Tech Stack  

| Category | Technology |
|-----------|-------------|
| **Frontend** | HTML5, CSS3, Bootstrap, EJS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | Passport.js (Local Strategy) |
| **File Uploads** | Multer  |
| **Utilities** | dotenv, Method-Override, Express-Session, Connect-Flash |
| **Deployment** | Render |

---

##  Features  

-  User Authentication (Signup / Login / Logout)  
-  Create, Edit, and Delete Listings  
-  Upload and Manage Images using **Multer** + **Cloudinary**  
-  Add and Delete Reviews  
-  Authorization — Only the owner can modify or delete their listings  
-  Flash Messages for success/error feedback  
-  Deployed with **MongoDB Atlas** on **Render**  

 ##  Installation & Setup  

Clone the repository and install dependencies:

```bash
git clone https://github.com/siddhiii01/wonderlust.git
cd wonderlust
npm install

## Create a .env file in the root directory:

# Cloudinary configuration
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Map API
MAP_API_KEY=your_mapbox_api_key

# Stripe configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Domain
DOMAIN=http://localhost:8000/listings

# MongoDB Atlas connection
ATLASDB_URL=your_mongodb_atlas_connection_string

# Session secret
SECRET=your_session_secret

---

## Run your app
node app.js
The application will be  at:
 http://localhost:8080/listings



