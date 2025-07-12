const express = require('express');
const app = express();

// Test the problematic route pattern
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
