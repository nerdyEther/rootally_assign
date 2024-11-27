import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Trash2, GripVertical, Edit, Save, X, Plus, Minus } from 'lucide-react';
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

const SideSwitch = ({ 
    side, 
    onSideChange, 
    disabled = false, 
    hasSameExerciseOnOtherSide = false 
  }) => {
    const handleSideToggle = (checked) => {
      const newSide = checked ? 'right' : 'left';
    
      if (!hasSameExerciseOnOtherSide) {
        onSideChange(newSide);
      }
    };
  
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="side-toggle"
          checked={side === 'right'}
          onCheckedChange={handleSideToggle}
          disabled={disabled || hasSameExerciseOnOtherSide}
          className={`
            data-[state=checked]:bg-blue-500 
            data-[state=unchecked]:bg-blue-500
            ${hasSameExerciseOnOtherSide ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ cursor: disabled || hasSameExerciseOnOtherSide ? 'default' : 'pointer' }}
        />
        <Label
          htmlFor="side-toggle"
          className={`text-sm cursor-default select-none ${hasSameExerciseOnOtherSide ? 'text-gray-400' : ''}`}
        >
          {side === 'right' ? 'Right' : 'Left'}
        </Label>
      </div>
    );
  };

const EditableCounter = ({
  label,
  value,
  onDecrement,
  onIncrement,
  onChange,
}) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center space-x-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 text-center text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 ease-in-out"
          min="0"
        />
      </div>
    </div>
  );
};

const ExerciseCard = ({
  exercise,
  index,
  editingExerciseId,
  editedExercise,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDuplicate,
  onEditChange,
  hasOppositeSideExercise,
  incrementValue,
  decrementValue
}) => {
  const [selectedDays, setSelectedDays] = useState(exercise.days || []);

  const handleDaysToggle = (day) => {
    if (editingExerciseId === exercise.id) { 
      const updatedDays = selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day];

      setSelectedDays(updatedDays);
      onEditChange('days', updatedDays); 
    }
  };

  const renderDayButtons = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => (
      <Button
        key={day}
        size="sm"
        variant={selectedDays.includes(day) ? 'default' : 'outline'}
        className={`m-1 px-2 py-1 text-xs ${selectedDays.includes(day) ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'} hover:bg-none hover:text-none focus:outline-none`}
        onClick={() => handleDaysToggle(day)}
        disabled={false}
      >
        {day}
      </Button>
    ));
  };

  return (
    <Draggable
      key={exercise.id.toString()}
      draggableId={exercise.id.toString()}
      index={index}
    >
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${snapshot.isDragging ? 'shadow-lg' : ''} relative w-full`}
        >
          <CardContent className="p-4 sm:p-6">
           
            <div
              {...provided.dragHandleProps}
              className="absolute top-3 left-3 cursor-move"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>

            <div className="absolute top-3 right-3 flex space-x-2">
              {editingExerciseId === exercise.id ? (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={onSave} className="px-2 py-1 text-xs">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={onCancel} className="px-2 py-1 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(exercise)}
                    className="px-2 py-1 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(exercise.id)}
                    className="px-2 py-1 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

         
            <div className="pl-8 pr-8 mt-6">
              <h3 className="font-bold text-lg sm:text-xl mb-4">{exercise.exercise}</h3>

            
              <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                
                  <div className="text-sm flex flex-col sm:flex-row items-center justify-start">
                    <strong className="mr-2">Sets:</strong> 
                    {editingExerciseId === exercise.id ? (
                      <EditableCounter
                        label=""
                        value={editedExercise.sets}
                        onChange={(val) => onEditChange('sets', val)}
                        onIncrement={() => incrementValue('sets')}
                        onDecrement={() => decrementValue('sets')}
                      />
                    ) : (
                      <span>{exercise.sets || '0'}</span>
                    )}
                  </div>

           
                  <div className="text-sm flex flex-col sm:flex-row items-center justify-start">
                    <strong className="mr-2">Reps:</strong>
                    {editingExerciseId === exercise.id ? (
                      <EditableCounter
                        label=""
                        value={editedExercise.reps}
                        onChange={(val) => onEditChange('reps', val)}
                        onIncrement={() => incrementValue('reps')}
                        onDecrement={() => decrementValue('reps')}
                      />
                    ) : (
                      <span>{exercise.reps || '0'}</span>
                    )}
                  </div>

          
                  <div className="text-sm flex flex-col sm:flex-row items-center justify-start">
                    <strong className="mr-2">Hold :</strong>
                    {editingExerciseId === exercise.id ? (
                      <EditableCounter
                        label=""
                        value={editedExercise.holdTime}
                        onChange={(val) => onEditChange('holdTime', val)}
                        onIncrement={() => incrementValue('holdTime')}
                        onDecrement={() => decrementValue('holdTime')}
                      />
                    ) : (
                      <span>{exercise.holdTime || '0'}</span>
                    )}
                  </div>

         
                  <div className="text-sm flex flex-col sm:flex-row items-center justify-start">
                    <strong className="mr-2">Side:</strong>
                    <div>
                      <SideSwitch
                        side={editingExerciseId === exercise.id ? (editedExercise.side || 'left') : (exercise.side || 'left')}
                        onSideChange={(newSide) => onEditChange('side', newSide)}
                        disabled={editingExerciseId !== exercise.id}
                        hasSameExerciseOnOtherSide={
                          editingExerciseId === exercise.id 
                            ? hasOppositeSideExercise(exercise) 
                            : false
                        }
                      />
                    </div>
                  </div>

       
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-blue-500 hover:bg-blue-600 mt-2 sm:ml-4 w-full sm:w-auto text-xs"
                    onClick={() => onDuplicate(exercise)}
                    disabled={hasOppositeSideExercise(exercise)}
                  >
                    Duplicate
                  </Button>
                </div>
              </div>

        
              <div className="mb-4">
                <div className="flex flex-col">
                  <div className="text-sm flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      <strong className="mr-2">Days:</strong>
                      <div className="flex flex-wrap items-center">{renderDayButtons()}</div>
                    </div>
                    
               
                    <div className="flex items-center space-x-2">
                      <strong className="mr-2">Freq/Day:</strong>
                      {editingExerciseId === exercise.id ? (
                        <EditableCounter
                          label=""
                          value={editedExercise.frequencyPerDay || 1}
                          onChange={(val) => onEditChange('frequencyPerDay', val)}
                          onIncrement={() => incrementValue('frequencyPerDay')}
                          onDecrement={() => decrementValue('frequencyPerDay')}
                        />
                      ) : (
                        <span>{exercise.frequencyPerDay || '1'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-sm flex-grow flex flex-col sm:flex-row items-start sm:items-center">
                  <strong className="mr-2 mb-1 sm:mb-0">Notes:</strong> 
                  {editingExerciseId === exercise.id ? (
                    <Input
                      placeholder="Edit Notes"
                      value={editedExercise.notes || ''}
                      onChange={(e) => onEditChange('notes', e.target.value)}
                      className="w-full resize-y min-h-[40px] max-h-[120px]"
                    />
                  ) : (
                    <span className="whitespace-pre-wrap">{exercise.notes || 'N/A'}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default ExerciseCard;