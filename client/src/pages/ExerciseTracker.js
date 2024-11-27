import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "../components/ui/dropdown-menu";
import SavedExercises from './SavedExercises';
import { toast, Toaster } from "react-hot-toast";
import { ChevronDown } from 'lucide-react';

const ExerciseTracker = () => {
  const [programName, setProgramName] = useState('');
  const [savedExercises, setSavedExercises] = useState([]);
  const [savedCombos, setSavedCombos] = useState([]);
  const [exerciseCategories, setExerciseCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5555/api/categories");
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setExerciseCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        alert('Could not load exercise categories');
      }
    };

    fetchCategories();
    fetchSavedCombos();
  }, []);

  useEffect(() => {
    if (currentCombo && currentCombo.exercises) {
      const programNameChanged = programName !== currentCombo.name;
      const exercisesChanged = !isComboExercisesIdentical(currentCombo.exercises, savedExercises);
      
      setHasUnsavedChanges({
        saveAsNewCombo: programNameChanged,
        updateExistingCombo: exercisesChanged && !programNameChanged
      });
    } else if (savedExercises.length > 0 || programName.trim() !== '') {
      setHasUnsavedChanges({
        saveAsNewCombo: true,
        updateExistingCombo: false
      });
    } else {
      setHasUnsavedChanges({
        saveAsNewCombo: false,
        updateExistingCombo: false
      });
    }
  }, [programName, savedExercises, currentCombo]);

  // All the existing helper functions remain the same
  const isComboExercisesIdentical = (originalExercises = [], currentExercises = []) => {
    if (originalExercises.length !== currentExercises.length) return false;
    return originalExercises.every((origExercise, index) => {
      const currentExercise = currentExercises[index];
      return (
        origExercise.exercise === currentExercise.exercise &&
        origExercise.category === currentExercise.category &&
        origExercise.sets === currentExercise.sets &&
        origExercise.reps === currentExercise.reps &&
        origExercise.holdTime === currentExercise.holdTime &&
        origExercise.days === currentExercise.days &&
        origExercise.side === currentExercise.side &&
        origExercise.notes === currentExercise.notes &&
        (origExercise.frequencyPerDay || 1) === (currentExercise.frequencyPerDay || 1)  // Add this line
      );
    });
  };

  const duplicateExercise = (exerciseToClone) => {
    const newExercise = {
      ...exerciseToClone,
      id: Date.now(),
    };
    setSavedExercises(prev => [...prev, newExercise]);
  };

  const fetchSavedCombos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5555/api/programs");
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setSavedCombos(data);
    } catch (err) {
      console.error("Error fetching combos:", err);
      alert('Could not load saved workout combos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedExercises = Array.from(savedExercises);
    const [reorderedItem] = reorderedExercises.splice(result.source.index, 1);
    reorderedExercises.splice(result.destination.index, 0, reorderedItem);
    setSavedExercises(reorderedExercises);
  };

  const addExerciseToProgram = (category, exercise) => {
    const isDuplicate = savedExercises.some(
      (ex) => ex.exercise === exercise && ex.category === category
    );

    if (isDuplicate) {
      toast.error(`The exercise "${exercise}" from category "${category}" already exists in the program.`, {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    const newExercise = {
      id: Date.now(),
      category,
      exercise,
      sets: '',
      reps: '',
      holdTime: '',
      days: '',
      side: '',
      notes: ''
    };
    setSavedExercises((prev) => [...prev, newExercise]);
  };

  const updateExerciseDetails = (id, field, value) => {
    setSavedExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const removeExercise = (id) => {
    setSavedExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const clearAllExercises = () => {
    setSavedExercises([]);
  };

  const saveCombo = async () => {
    const comboExists = savedCombos.some(
      (combo) => combo.name.toLowerCase() === programName.toLowerCase()
    );
  
    if (comboExists) {
      toast.error(`A combo with the name "${programName}" already exists. Please choose a different name.`, {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }
  
    if (!programName.trim()) {
      alert('Please enter a program name');
      return;
    }
  
    if (savedExercises.length === 0) {
      alert('Please add at least one exercise to the program');
      return;
    }

    const newCombo = {
      name: programName,
      exercises: savedExercises.map((ex, index) => ({
        order: index,
        exercise: ex.exercise,
        category: ex.category,
        sets: ex.sets,
        reps: ex.reps,
        holdTime: ex.holdTime,
        days: ex.days,
        side: ex.side,
        notes: ex.notes,
        frequencyPerDay: ex.frequencyPerDay || 1 
      }))
    };
    
    try {
      const response = await fetch("http://localhost:5555/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCombo)
      });

      if (!response.ok) {
        throw new Error('Failed to save combo');
      }

      const result = await response.json();
      alert(`Combo "${programName}" saved successfully!`);
      fetchSavedCombos();
      setCurrentCombo(result);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error saving combo:", err);
      alert("Failed to save the combo. Please try again.");
    }
  };

  const updateCombo = async () => {
    if (!currentCombo) return;
  
    try {
      const updateData = {
        name: programName,
        exercises: savedExercises.map((ex, index) => ({
          order: index,
          exercise: ex.exercise,
          category: ex.category,
          sets: ex.sets,
          reps: ex.reps,
          holdTime: ex.holdTime,
          days: ex.days,
          side: ex.side,
          notes: ex.notes,
          frequencyPerDay: ex.frequencyPerDay || 1 
        }))
      };
  
      const response = await fetch(`http://localhost:5555/api/programs/${currentCombo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
  
      const responseBody = await response.json();
  
      if (!response.ok) {
        throw new Error(responseBody.error || 'Failed to update combo');
      }
  
      alert(`Combo "${programName}" updated successfully!`);
      fetchSavedCombos();
      setCurrentCombo(responseBody.program);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error updating combo:", err);
      alert(`Failed to update the combo: ${err.message}`);
    }
  };

  const loadSavedCombo = (combo) => {
    setProgramName(combo.name);
    setCurrentCombo(combo);

    const sortedExercises = combo.exercises
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((exercise) => ({
        id: Date.now() + Math.random(),
        category: exercise.category || "Unknown",
        exercise: exercise.exercise,
        sets: exercise.sets || '',
        reps: exercise.reps || '',
        holdTime: exercise.holdTime || '',
        days: exercise.days || '',
        side: exercise.side || '',
        notes: exercise.notes || '',
        frequencyPerDay: exercise.frequencyPerDay || 1  
      }));
    
    setSavedExercises(sortedExercises);
    setHasUnsavedChanges(false);
  };

  return (
    <>
      <Toaster/>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl sm:text-2xl text-center sm:text-left">
                Exercise Program Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Program Name</Label>
                  <Input
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder="Enter program name"
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" className="w-full">
                        Saved Combos
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {isLoading ? (
                        <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                      ) : savedCombos.length === 0 ? (
                        <DropdownMenuItem>No combos available</DropdownMenuItem>
                      ) : (
                        savedCombos.map((combo) => (
                          <DropdownMenuItem
                            key={combo.id}
                            onSelect={() => loadSavedCombo(combo)}
                          >
                            {combo.name}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    onClick={clearAllExercises} 
                    variant="destructive"
                    disabled={savedExercises.length === 0}
                    className="w-full sm:w-auto"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <SavedExercises 
                savedExercises={savedExercises} 
                removeExercise={removeExercise}
                updateExerciseDetails={updateExerciseDetails}
                duplicateExercise={duplicateExercise}
              />

              <div className="space-y-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      Add Exercise
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {Object.keys(exerciseCategories).map((category) => (
                      <DropdownMenuSub key={category}>
                        <DropdownMenuSubTrigger>{category}</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {exerciseCategories[category].map((exercise) => (
                            <DropdownMenuItem
                              key={exercise}
                              onSelect={() => addExerciseToProgram(category, exercise)}
                            >
                              {exercise}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <Button 
                    onClick={updateCombo} 
                    variant="secondary"
                    disabled={!currentCombo || !hasUnsavedChanges.updateExistingCombo}
                    className="w-full sm:w-auto"
                  >
                    Save Combo
                  </Button>
                  <Button 
                    onClick={saveCombo} 
                    variant="default"
                    disabled={!hasUnsavedChanges.saveAsNewCombo || 
                             !programName.trim() || 
                             savedExercises.length === 0}
                    className="w-full sm:w-auto"
                  >
                    Save as New Combo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>
    </>
  );
};

export default ExerciseTracker;