const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is active on http://localhost:${PORT}`);
});