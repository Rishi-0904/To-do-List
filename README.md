📝 To-Do List Website

A simple and intuitive To-Do List web app that helps users organize daily tasks, boost productivity, and manage time effectively. Users can add, edit, delete, and mark tasks as complete with ease.

🚀 Features

Add, edit, and delete tasks

Mark tasks as completed

Persistent storage with database

Responsive and user-friendly interface

(Optional) Authentication using Google OAuth

🛠 Tech Stack

Frontend: React

Backend: Node.js, Express.js

Database: MongoDB

Authentication: Google OAuth / JWT (if enabled)

Deployment: Vercel / Netlify (Frontend), Heroku / Render (Backend)

📂 Project Structure
├── client/        # Frontend (React)
├── server/        # Backend (Node.js + Express.js)
├── models/        # MongoDB Schemas
├── routes/        # Express Routes
└── README.md

⚙️ Installation & Setup

Clone the repo

git clone https://github.com/your-username/todo-list.git
cd todo-list


Install dependencies for both frontend and backend

cd client && npm install
cd ../server && npm install


Set up environment variables in server/.env

MONGO_URI=your_mongodb_connection_string
PORT=5000
GOOGLE_CLIENT_ID=your_google_oauth_id   # if using OAuth
GOOGLE_CLIENT_SECRET=your_google_oauth_secret


Run the project

# Run backend
cd server
npm start

# Run frontend
cd client
npm start

📸 Screenshots (Optional)

Add screenshots of your app UI here

🔮 Future Enhancements

Add due dates and reminders

Categorize tasks (work, personal, etc.)

Dark mode support

Share tasks with friends

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.
