const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();

app.use(cors());
app.use(compression());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from AI Poster Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
to run in the express and compression  
