import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ExerciseTracker from './pages/ExerciseTracker';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for Exercise Assignment */}
        
         <Route path="/" element={<ExerciseTracker />}/>

        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
