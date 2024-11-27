import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ExerciseTracker from './pages/ExerciseTracker';

const App = () => {
  return (
    <Router>
      <Routes>
      
        
         <Route path="/" element={<ExerciseTracker />}/>

      </Routes>
    </Router>
  );
};

export default App;
