const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; // Use a different port

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from the project root
app.use(express.static(__dirname));

// Fallback route
app.get('*', (req, res) => {
  console.log(`Fallback route hit: ${req.path}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running at http://localhost:${PORT}`);
}); 