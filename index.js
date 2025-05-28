const express = require('express');
const app = express();
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
