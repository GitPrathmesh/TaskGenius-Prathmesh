import React, { useState, useRef, useEffect } from 'react';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditableTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const taskTitleStyle = {
    textDecoration: task.completed ? 'line-through' : 'none',
    color: task.completed ? '#888' : '#333',
    flex: 1,
    cursor: 'pointer',
    margin: 0,
  };

  const handleSave = () => {
    const trimmed = (editableTitle || '').trim();
    if (trimmed.length === 0) {
      // Revert to original if empty
      setEditableTitle(task.title);
      setIsEditing(false);
      return;
    }

    if (trimmed !== task.title) {
      onEdit(task._id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditableTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="task-item">

      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task._id, !task.completed)}
      />

      {!isEditing ? (
        <>
          <p
            style={taskTitleStyle}
            onClick={() => onToggle(task._id, !task.completed)}
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to edit"
          >
            {task.title}
          </p>

          <button
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task title"
          >
            ✎
          </button>
        </>
      ) : (
        <input
          ref={inputRef}
          className="task-title-input"
          value={editableTitle}
          onChange={(e) => setEditableTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      )}

      <button className="delete-btn" onClick={() => onDelete(task._id)}>
        &times;
      </button>
    </div>
  );
}

export default TaskItem;