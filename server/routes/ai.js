const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


router.post('/breakdown', async (req, res) => {
  try {
    const { taskTitle } = req.body;

    if (!taskTitle) {
      return res.status(400).json({ message: 'Task title is required' });
    }


    const prompt = `Act as a project manager. Break the following high-level task into 3-5 actionable sub-tasks. Respond only with a numbered list, with each sub-task on a new line.
    
    Task: "${taskTitle}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

  
    const subTasks = text.split('\n').filter(task => task.length > 0);

    res.json({ subTasks: subTasks });

  } catch (error) {
    console.error('AI breakdown error:', error);
    res.status(500).json({ message: 'Error generating AI task breakdown' });
  }
});



router.post('/summary', async (req, res) => {
  try {
    const { completedTasks } = req.body; 

    if (!completedTasks || completedTasks.length === 0) {
      return res.status(400).json({ message: 'At least one completed task is required for a summary.' });
    }

    const taskListString = completedTasks.join('\n- ');

    const prompt = `Generate a concise, professional summary paragraph (2-3 sentences) of the following accomplishments:
    
    - ${taskListString}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary: summary });

  } catch (error) {
    console.error('AI summary error:', error);
    res.status(500).json({ message: 'Error generating AI summary' });
  }
});

module.exports = router;