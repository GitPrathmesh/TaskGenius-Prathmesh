import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './index.css';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import FilterControls from './components/FilterControls';
import SummaryModal from './components/SummaryModal';



const API_BASE = '/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [aiLoading, setAiLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');


  const [summary, setSummary] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. Fetch Tasks (Read) 
  useEffect(() => {

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/tasks`);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []); 


const createTask = async (title) => {
    try {
      // Send the new task to the server
      const { data: newTask } = await axios.post(`${API_BASE}/tasks`, { title });
      
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  //Toggle
  const handleToggle = async (id, newCompletedStatus) => {
    try {
      // Send the update to the server
      const { data: updatedTask } = await axios.put(`${API_BASE}/tasks/${id}`, {
        completed: newCompletedStatus,
      });

      // Update the task in our local state
      setTasks(
        tasks.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // 4. Delete Task 
  const handleDelete = async (id) => {
    try {
    
      await axios.delete(`${API_BASE}/tasks/${id}`);

      // Remove task from our local state
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Edit task title
  const handleEditTitle = async (id, newTitle) => {
    try {
      const { data: updatedTask } = await axios.put(`${API_BASE}/tasks/${id}`, {
        title: newTitle,
      });

      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error editing task title:', error);
    }
  };

const handleAiBreakdown = async (taskTitle) => {
    setAiLoading(true);
    try {
      // AI breakdown endpoint
      const { data } = await axios.post(`${API_BASE}/ai/breakdown`, { taskTitle });
      
      //subtasks
      if (data.subTasks && data.subTasks.length > 0) {
        
        const newTasksPromises = data.subTasks.map(subTaskTitle => {

          const cleanedTitle = subTaskTitle.replace(/^\d+\.\s*/, '');
          return axios.post(`${API_BASE}/tasks`, { title: cleanedTitle });
        });
        
        const results = await Promise.all(newTasksPromises);
        const newTasks = results.map(res => res.data);

        // 4. Add all new tasks to our state
        setTasks([...newTasks, ...tasks]);
      }
    } catch (error) {
      console.error('Error during AI breakdown:', error);
    }
    setAiLoading(false);
  };


  const filteredTasks = useMemo(() => {
    if (filter === 'ACTIVE') {
      return tasks.filter(task => !task.completed);
    }
    if (filter === 'COMPLETED') {
      return tasks.filter(task => task.completed);
    }
    return tasks; 
  }, [tasks, filter]);



  const handleAiSummary = async () => {
    //completed tasks
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length === 0) {
      alert("You must have at least one completed task to generate a summary.");
      return;
    }


    const completedTaskTitles = completedTasks.map(task => task.title);

    setAiLoading(true);
    setIsModalOpen(true); 
    
    try {
      // 3.summary endpoint
      const { data } = await axios.post(`${API_BASE}/ai/summary`, {
        completedTasks: completedTaskTitles
      });
     
      setSummary(data.summary);

    } catch (error) {
      console.error("Error generating AI summary:", error);
      setSummary("Sorry, an error occurred while generating the summary.");
    }
    setAiLoading(false);
  };

  const closeSummaryModal = () => {
    setIsModalOpen(false);
    // Clear summary 
    setTimeout(() => setSummary(''), 300); 
  };

  return (
   <> <div className="App">
      <header>
        <h1>TaskGenius</h1>
        <p>AI-Enhanced Task Management</p>
      </header>

      <main>
        
        <TaskForm
          onTaskCreate={createTask}
          onAiBreakdown={handleAiBreakdown}
          aiLoading={aiLoading}
        />

 
        <div className="controls-container">
          <FilterControls currentFilter={filter} onFilterChange={setFilter} />
          <button
              className="summary-btn"
              onClick={handleAiSummary}
              disabled={aiLoading}
            >
              Generate Summary
            </button>
        </div>
        
        <div className="task-list">
   
          <h2>My Tasks ({filteredTasks.length})</h2>
          {loading && <p>Loading tasks...</p>}
          
    
          {!loading && tasks.length === 0 && (
             <p>No tasks yet. Add one!</p>
          )}
          
          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
             <p>No {filter.toLowerCase()} tasks found.</p>
          )}

        
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEditTitle}
            />
          ))}
        </div>
      </main>
    </div>

    {isModalOpen && (
        <SummaryModal 
          summary={summary}
          aiLoading={aiLoading}
          onClose={closeSummaryModal}
        />
      )}
    </>
  );
}

export default App;