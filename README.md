# Exercise Tracker

## 📋 Project Overview

Exercise Tracker is a full-stack web application designed to help users create, manage, and track workout programs with ease. The application provides a flexible interface for adding exercises, organizing workout routines, and saving custom exercise combinations.

## ✨ Features

- 🏋️ Add exercises from predefined categories
- 📋 Create and save custom workout programs
- 🔀 Drag and drop exercise reordering
- ✏️ Edit exercise details (sets, reps, hold time)
- 🔛 Side selection (left/right)
- 📅 Day selection for each exercise

## 🛠 Tech Stack

- **Frontend:** React
- **Backend:** Express.js
- **UI Components:** Shadcn/UI, Tailwind CSS
- **Drag and Drop:** @hello-pangea/dnd
- **State Management:** React Hooks
- **Notifications:** React Hot Toast

## 🚀 Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## 💻 Installation

1. Clone the repository
```bash
git clone <your-repository-url>
cd exercise-tracker
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd backend
npm install
```

## 🔧 Running the Project

### Start Backend Server
```bash
cd backend
node server.js
# Server will run on http://localhost:5555
```

### Start Frontend Development Server
```bash
cd frontend
npm start
# Frontend will run on http://localhost:3000
```

## 📂 Project Structure

### Frontend Components
- `ExerciseTracker.js`: Main component managing program state
- `SavedExercises.js`: Manages list of saved exercises
- `ExerciseCard.js`: Individual exercise card component

### Backend
- `server.js`: Express server with API endpoints
- `data.json`: JSON file for storing categories and programs

## 🌟 Key API Endpoints

- `GET /api/categories`: Fetch exercise categories
- `POST /api/programs`: Save new workout program
- `GET /api/programs`: Retrieve saved programs
- `PUT /api/programs/:id`: Update existing program

## 📦 Dependencies

- React
- Express
- @hello-pangea/dnd
- React Hot Toast
- Tailwind CSS
- Shadcn/UI Components

## 🔮 Potential Improvements

- User authentication
- Local storage backup
- More exercise categories
- Enhanced error handling
- Robust form validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

[Add your license here]

## 👥 Contributors

[Add contributor names]

## 📞 Support

For any questions or issues, please open an GitHub issue.
