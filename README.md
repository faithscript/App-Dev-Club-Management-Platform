# App Development Club Management Platform

![App Banner](https://img.shields.io/badge/App%20Dev%20Club-Management%20Platform-blue?style=for-the-badge)
![Hackathon Winner](https://img.shields.io/badge/Hackathon-1st%20Place-gold?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN%20+%20Python-purple?style=for-the-badge)

A comprehensive team management platform designed for software contracting clubs to facilitate mentor-student collaboration, goal tracking, and competitive achievement through an arcade-themed interface.

## 🚀 Features

- **👤 User Management**: Complete profile system with roles (mentors/students)
- **📋 Bucket Lists**: Create and complete tasks within mentor groups
- **👥 Group Management**: Organize members into mentor-led teams
- **🏆 Leaderboard**: Track team progress and foster friendly competition
- **📱 Responsive Design**: Arcade-themed UI that works on all devices

## 🛠️ Technology Stack

### Frontend
- **React + TypeScript**: Component-based UI development
- **Tailwind CSS**: Utility-first styling
- **Zustand**: State management
- **Axios**: API requests
- **React Router**: Navigation

### Backend
- **FastAPI (Python)**: High-performance web framework
- **MongoDB & Atlas**: Database storage
- **GridFS**: File/image storage
- **JWT**: Authentication
- **RESTful API Architecture**

## 📋 Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- MongoDB account
- npm or yarn

## 🚀 Getting Started

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/faithscript/App-Dev-Club-Management-Platform.git

# Navigate to project directory
cd App-Dev-Club-Management-Platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd ctrl-alt-elite-back

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000
```

**Backend (.env)**
```
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
```

## 📸 Screenshots

<div align="center">
  <img src="screenshots/homepage.png" alt="Homepage" width="80%" />
  <p><em>Homepage with arcade theme</em></p>
  
  <img src="screenshots/bucket-list.png" alt="Bucket List" width="80%" />
  <p><em>Bucket list management interface</em></p>
  
  <img src="screenshots/leaderboard.png" alt="Leaderboard" width="80%" />
  <p><em>Team leaderboard showing progress</em></p>
</div>

## 🏗️ Project Structure

```
├── frontend/                # React + TypeScript frontend
│   ├── public/              # Static files
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── store/           # Zustand store
│       ├── lib/             # Utilities
│       └── styles/          # CSS files
│
└── ctrl-alt-elite-back/     # FastAPI backend
    ├── auth.py              # Authentication
    ├── bucket_list.py       # Bucket list management
    ├── database.py          # Database connection
    ├── group.py             # Group management
    ├── images.py            # Image handling
    ├── main.py              # Main application
    ├── models.py            # Data models
    └── user_profile.py      # User profile management
```

## 📊 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Register new user |
| `/auth/login` | POST | Login user |
| `/profile` | GET/PUT | Manage user profile |
| `/bucketlist/{mentor_name}/bucket_lists` | GET/POST | Manage bucket lists |
| `/images/upload` | POST | Upload profile images |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Acknowledgements

- Thanks to the App Development Club for the opportunity
- Special thanks to all team members who contributed
- Arcade theme inspiration from retro gaming
