const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5555;


app.use(express.json());
app.use(cors());


const DATA_PATH = "./data.json";


const readData = () => {
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(data);
};


const writeData = (newData) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2));
};

// API Endpoints

// fetch exercise categories 
app.get("/api/categories", (req, res) => {
  const data = readData();
  res.json(data.categories);
});

// save a new  program
app.post("/api/programs", (req, res) => {
  const { name, exercises } = req.body;

  if (!name || !exercises || !exercises.length) {
    return res.status(400).json({ error: "Program name and exercises are required" });
  }

  const data = readData();
  const newProgram = {
    id: Date.now(),
    name,
    exercises
  };

  data.programs.push(newProgram);
  writeData(data);

  res.status(201).json({ message: "Program saved successfully", program: newProgram });
});

// fetch combos
app.get("/api/programs", (req, res) => {
  const data = readData();
  res.json(data.programs);
});

app.put("/api/programs/:id", (req, res) => {
    const { id } = req.params;
    const { name, exercises } = req.body;
  
    
    if (!name || !exercises || !exercises.length) {
      return res.status(400).json({ error: "Program name and exercises are required" });
    }
  
    const data = readData();
    
    const programIndex = data.programs.findIndex(program => program.id === parseInt(id));
  
    if (programIndex === -1) {
      return res.status(404).json({ error: "Program not found" });
    }
  
   
    data.programs[programIndex] = {
      id: parseInt(id), 
      name,
      exercises
    };
  
    writeData(data);
  
    res.json({ 
      message: "Program updated successfully", 
      program: data.programs[programIndex] 
    });
  });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
