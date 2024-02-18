const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests
// You can configure CORS options here as needed
app.use(cors());

// Import route modules
const volatilityRoutes = require('./routes/volatilityRoutes');

// Use routes
app.use('/volatility', volatilityRoutes);

// Catch-all route for 404 Not Found
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
