const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.get('/health', (req, res) => {
  res.json({ message: 'healthy' });
});

app.get('/me', (req, res) => {
  res.json({
    name: 'Abdulhamid Bello',
    email: 'abdulhamidbelloabefe@gmail.com',
    github: 'https://github.com/tuucay4'
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
