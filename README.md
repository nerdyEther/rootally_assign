# Exercise Tracker Assignment

## 📋 Objective

Create a UI component using ReactJS and a backend using Node.js with either JavaScript or TypeScript. This component will allow a physiotherapist to assign exercises to patients in a structured way, providing flexibility in creating and managing exercise programs. 


## ✨ Features

- 🏋️ Add exercises from predefined categories
- 📋 Create and save custom workout programs
- 🔀 Drag and drop exercise reordering
- ✏️ Edit exercise details (sets, reps, hold time)
- 🔛 Toogle Side selection (left/right)
- 📅 Day selection for each exercise

## 🛠 Tech Stack

- **Frontend:** React
- **Backend:** Express.js
- **UI Components:** Shadcn/UI, Tailwind CSS

## 🚀 Prerequisites

- Node.js 
- npm 

## 💻 Installation

1. Clone the repository
```bash
git clone <your-repository-url>
cd exercise-tracker
```

2. Install Frontend Dependencies
```bash
cd client
npm install
```

3. Install Backend Dependencies
```bash
cd server
npm install
```

## 🔧 Running the Project

### Start Backend Server
```bash
cd server
node server.js
# Server will run on http://localhost:5555
```

### Start Frontend Development Server
```bash
cd client
npm run start
# Frontend will run on http://localhost:3000
```

## 📂 Project Structure

### Frontend Components
- `ExerciseTracker.js`: Main component.
- `SavedExercises.js`: Manages saved exercises.
- `ExerciseCard.js`: Individual exercise card component.

### Backend
- `server.js`: Express server with API endpoints.
- `data.json`: JSON file for storing data.

## 🌟 API Endpoints

- `GET /api/categories`: Fetch exercise categories
- `POST /api/programs`: Save new workout program
- `GET /api/programs`: Retrieve saved programs
- `PUT /api/programs/:id`: Update existing program


## 💻 Screen Recording of Implementation

   [Screen Recording](https://drive.google.com/file/d/1n5oKmb7RQBZoOCrB-nNP8qqqi5-Ll1k8/view?usp=drive_link)



