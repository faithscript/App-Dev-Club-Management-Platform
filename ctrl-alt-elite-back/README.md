# User Management API

## Tech Stack & Dependencies

- **FastAPI**: 
- **MongoDB**: 
- **Motor**: Async MongoDB driver for Python
- **Pydantic**: Data validation and settings management
- **Passlib/bcrypt**: For password hashing
- **GridFS**: For storing and retrieving images (built into MongoDB)
- **Python-dotenv**: For loading environment variables
- **Python-multipart**: For handling file uploads

All these dependencies are listed in the `requirements.txt` file, so you can install everything at once.

## Setup Requirements

Before you start, make sure you have these installed:
- Python 3.x
- MongoDB
- pip (Python package manager)

### Installing MongoDB on Mac
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
```

### Installing MongoDB on Windows
Download and install from: https://www.mongodb.com/try/download/community

## To use

1. Clone this repository:
```bash
git clone [your-repo-url]
cd [repo-name]
```

2. Install the required Python packages:
```bash
pip install -r requirements.txt
```

3. Start MongoDB:
```bash
# On Mac
brew services start mongodb-community

# On Windows
# MongoDB should run as a service automatically after installation
```

4. Run the server:
```bash
python main.py
```

The server will start at `http://localhost:8000`

## API Features

- **Authentication**: Signup and login
- **Profile Management**: Create and update user profiles
- **Group Management**: Create and manage groups
- **Bucket Lists**: Create and manage bucket lists
- **Image Storage**: Upload, retrieve, and delete images

## Testing the API

Visit `http://localhost:8000/docs` in your browser to see the API documentation. You can test all endpoints directly from there!

## Troubleshooting

If you run into issues:
1. Make sure MongoDB is running
2. Check that all dependencies are installed
3. Make sure port 8000 isn't being used by another application
4. Check the console for any error messages

Need help? Reach out to any team member!
