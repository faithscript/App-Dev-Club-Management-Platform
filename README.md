# CosmoLink - App Dev Club Management Platform

![CosmoLink Logo](ctrl-alt-elite-front/public/app-dev-club-logo.png)

## 🚀 Overview

CosmoLink is an application designed to strengthen community bonds within the App Dev Club Bootcamp by facilitating meaningful connections between mentors and mentees. It addresses the challenge of limited interaction within and across mentor groups by providing a platform where participants can engage in collaborative activities.

Developed by team Ctrl-Alt-Elite (Abhinav, Allison, Amanda, Emmanuel, Faith, Seonyoung).

## ✨ Key Features

- **🏆 Bucket List**: Mentees can suggest and vote on activities for their groups, fostering collaboration and teamwork
- **📊 Leaderboard**: Motivates groups through friendly competition by showcasing engagement scores
- **👥 Group Management**: Easily create, join, and manage mentor groups
- **👤 User Profiles**: Personalized profiles for all participants with customizable avatars
- **🔐 Secure Authentication**: Safe and reliable user authentication system

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend tooling

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **MongoDB** - NoSQL database for storing user information
- **Motor** - Async MongoDB driver for Python
- **Pydantic** - Data validation and settings management
- **Passlib/bcrypt** - For password hashing
- **GridFS** - For storing and retrieving images

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.9+
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ctrl-alt-elite-back
   ```

2. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Make sure MongoDB is running on your system.

4. Start the backend server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ctrl-alt-elite-front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📚 API Documentation

When the backend is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🌟 Usage

1. Register an account or login with existing credentials
2. Create or join a mentor group
3. Suggest activities on the Bucket List page
4. Vote on activities you'd like to participate in
5. Complete activities and earn points for your group
6. Check the Leaderboard to see your group's ranking

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or feedback regarding CosmoLink, please contact any member of team Ctrl-Alt-Elite. 