const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors()); 
app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });


app.get('/', (req, res) => {
  res.send('TaskGenius API is running!');
});

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);