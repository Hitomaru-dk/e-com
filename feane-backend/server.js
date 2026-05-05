const express = require('express');
const cors = require('cors');
const productRoutes  = require('./routes/products');
const authRoutes     = require('./routes/auth');
const checkoutRoutes = require('./routes/checkout');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/checkout', checkoutRoutes); // POST /api/checkout

app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is active on http://localhost:${PORT}`);
});