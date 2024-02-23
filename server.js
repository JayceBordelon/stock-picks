const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = 3000;



app.use(express.json());
app.use(cors());

// Import route modules
const stockScraping = require('./routes/scrapingRoutes');
const userRoutes = require("./routes/userRoutes")

// Use environment variable for MongoDB Connection URI
const mongoURI = process.env.MONGO_URI;

// Establish MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Use routes
app.use('/scrape', stockScraping);
app.use('/user', userRoutes);

// Ping route for simple server check
app.get('/ping', (req, res) => {
  console.log("I am alive!")
  res.send({message: 'pong'});
});

// Catch-all route for 404 Not Found
app.use((req, res) => {
  res.status(404).send({message: '404 Not Found'});
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
