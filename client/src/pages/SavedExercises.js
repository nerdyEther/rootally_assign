import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import ExerciseCard from './ExerciseCard';

const SavedExercises = ({ 
  savedExercises, 
  removeExercise, 
  updateExerciseDetails,
  duplicateExercise
}) => {
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editedExercise, setEditedExercise] = useState(null);

  const startEditMode = (exercise) => {
    setEditingExerciseId(exercise.id);
    setEditedExercise({ 
      ...exercise, 
      side: exercise.side || 'left'
    });
  };

  const cancelEditMode = () => {
    setEditingExerciseId(null);
    setEditedExercise(null);
  };

  const saveExerciseDetails = () => {
    if (editedExercise) {
      Object.keys(editedExercise).forEach(field => {
        if (field !== 'id' && field !== 'category' && field !== 'exercise') {
          updateExerciseDetails(editedExercise.id, field, editedExercise[field]);
        }
      });
      setEditingExerciseId(null);
      setEditedExercise(null);
    }
  };

  const handleEditChange = (field, value) => {
    setEditedExercise(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const incrementValue = (field) => {
    setEditedExercise(prev => ({
      ...prev,
      [field]: String(parseInt(prev[field] || '0') + 1)
    }));
  };

  const decrementValue = (field) => {
    setEditedExercise(prev => {
      const currentValue = parseInt(prev[field] || '0');
      return {
        ...prev,
        [field]: String(currentValue > 0 ? currentValue - 1 : 0)
      };
    });
  };

  const hasOppositeSideExercise = (exercise) => {
    const currentSide = exercise.side || 'left';
    const oppositeSide = currentSide === 'left' ? 'right' : 'left';
    
    return savedExercises.some(ex => 
      ex.id !== exercise.id && 
      ex.exercise === exercise.exercise && 
      ex.category === exercise.category && 
      (ex.side || 'left') === oppositeSide
    );
  };

  const hasSameExerciseOnOtherSide = (exercise, side) => {
    return savedExercises.some(ex => 
      ex.id !== exercise.id && 
      ex.exercise === exercise.exercise && 
      ex.category === exercise.category && 
      (ex.side || 'left') === side
    );
  };

  const handleDuplicate = (exercise) => {
    if (!hasOppositeSideExercise(exercise)) {
      const currentSide = exercise.side || 'left';
      duplicateExercise({
        ...exercise,
        side: currentSide === 'left' ? 'right' : 'left'
      });
    }
  };

  return (
    <Card className="w-full max-w-full md:max-w-3xl mx-auto px-2 md:px-0">
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="text-xl md:text-2xl font-bold text-center">
          Saved Programs
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        {savedExercises.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 md:py-8 text-base md:text-lg">
            Add Exercises or Load Combos!
          </p>
        ) : (
          <Droppable droppableId="exercises-list">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="max-h-[400px] md:max-h-[600px] overflow-y-auto pr-1 md:pr-2 space-y-2 md:space-y-4"
              >
                {savedExercises.map((exercise, index) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    editingExerciseId={editingExerciseId}
                    editedExercise={editedExercise}
                    onEdit={startEditMode}
                    onSave={saveExerciseDetails}
                    onCancel={cancelEditMode}
                    onDelete={removeExercise}
                    onDuplicate={handleDuplicate}
                    onEditChange={handleEditChange}
                    hasOppositeSideExercise={hasOppositeSideExercise}
                    incrementValue={incrementValue}
                    decrementValue={decrementValue}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedExercises;