# LiveRestaurantMenu 🍽️

LiveRestaurantMenu is a full-stack web application designed to help restaurant owners easily create, manage, and deploy beautiful, interactive digital menus for their customers. This project provides a complete solution, from user authentication to a dynamic menu builder and QR code generation, all managed through an intuitive dashboard.

---

## ✨ Key Features

* **Full User Authentication:** Secure user registration and login with email/password, including a "Forgot Password" feature with email-based password reset.
* **Social Login:** Quick and easy one-click login/signup using Google OAuth.
* **Multi-Menu Management:** A central dashboard where owners can create and manage multiple menu cards (e.g., Dinner, Brunch, Specials).
* **Interactive Menu Builder:** An intuitive interface to add categories and menu items, set prices, write descriptions, and tag dishes as veg, non-veg, or egg.
* **Live Dish Suggestions:** An intelligent suggestion system powered by a database that helps owners add common dishes quickly.
* **Template Customization:** A selection of 8 beautiful, pre-designed templates to change the look and feel of the public-facing menu.
* **Publishing & QR Code Generation:** Easily publish menus to make them live and instantly generate a unique QR code and shareable link.
* **Interactive Public Menu:** The final menu page for customers includes a search bar with live suggestions and filtering options.
* **User & Account Management:** A dedicated profile page to update user details and a settings page to customize the menu's appearance (e.g., currency, theme).
* **Dark/Light Mode:** A theme toggle for a comfortable user experience in the admin dashboard.

---

## 🚀 Tech Stack

This project is built using the MERN stack and other modern web technologies.

* **Frontend:**
    * [**React**](https://reactjs.org/) (UI Library)
    * [**React Router**](https://reactrouter.com/) (Client-side Routing)
    * [**Axios**](https://axios-http.com/) (HTTP Client)
    * [**CSS Modules**](https://github.com/css-modules/css-modules) (Scoped CSS)

* **Backend:**
    * [**Node.js**](https://nodejs.org/) (JavaScript Runtime)
    * [**Express.js**](https://expressjs.com/) (Web Framework)
    * [**MongoDB**](https://www.mongodb.com/) with [**Mongoose**](https://mongoosejs.com/) (NoSQL Database)
    * [**JSON Web Tokens (JWT)**](https://jwt.io/) (Authentication)
    * [**Passport.js**](http://www.passportjs.org/) (Google OAuth Strategy)
    * [**Nodemailer**](https://nodemailer.com/) (Email Sending)

---

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* **Node.js** installed on your machine.
* **Git** installed on your machine.
* A **MongoDB Atlas** account or a local MongoDB instance.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/LiveRestaurantMenu.git](https://github.com/your-username/LiveRestaurantMenu.git)
    cd LiveRestaurantMenu
    ```

2.  **Install Backend Dependencies:**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set Up Environment Variables:**
    * In the `backend` folder, create a file named `.env`.
    * Add the necessary environment variables. You can use the `.env.example` file as a template.
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_gmail_app_password
    CLIENT_URL=http://localhost:3000
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
    ```

5.  **Run the Backend Server:**
    ```sh
    cd ../backend
    npm run dev
    ```
    The backend will be running on `http://localhost:5000`.

6.  **Run the Frontend App:**
    ```sh
    cd ../frontend
    npm start
    ```
    The frontend will open in your browser at `http://localhost:3000`.

---

## 📂 Project Structure


/
├── backend/        # Node.js & Express API
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/       # React User Interface
├── public/
└── src/
├── api/
├── components/
├── contexts/
└── pages/


---

## ☁️ Deployment

This application is configured for easy deployment on modern hosting platforms.

* The **frontend** can be deployed as a static site on services like **Netlify** or **Vercel**.
* The **backend** can be deployed as a web service on platforms like **Render** or **Fly.io**.

---

## 🔮 Future Features

* Live analytics on the dashboard (e.g., menu view counts).
* More menu templates and customization options.
* Image uploads for menu items.
* Multi-language support for public menus.

