import React, { useState } from 'react';

function TaskForm({ onTaskCreate,onAiBreakdown, aiLoading }) {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!newTitle.trim()) return;

    onTaskCreate(newTitle); 
    setNewTitle(''); 
  };


  const handleAiClick = () => {
    if (!newTitle.trim()) return; 
    onAiBreakdown(newTitle);
  };

 return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a new task (or a big goal for AI)"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        disabled={aiLoading} 
      />

   
      <button
        type="button" 
        className="ai-btn"
        onClick={handleAiClick}
        disabled={aiLoading} 
      >
        {aiLoading ? '...' : 'AI ✨'}
      </button>

      <button type="submit" disabled={aiLoading}>
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;