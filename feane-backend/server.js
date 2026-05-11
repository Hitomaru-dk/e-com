/**
 * server.js — Express entry point (ไม่เปลี่ยน interface เลย)
 * ทุก route ยังคง URL เดิม — frontend ไม่ต้องแก้ไขอะไร
 */

require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const productRoutes  = require('./routes/products');
const authRoutes     = require('./routes/auth');
const checkoutRoutes = require('./routes/checkout');

const app  = express();
const PORT = process.env.PORT || 3000;

require('./database'); // init SQLite tables on startup

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (_req, res) => res.send('Backend is running!'));

app.listen(PORT, () => console.log(`Server active → http://localhost:${PORT}`));