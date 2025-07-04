const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middlewares/logger');
const urlRoutes = require('./routes/urlRoutes');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(logger); 
app.use('/', urlRoutes);

mongoose.connect("mongodb://localhost:27017/url-shortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");

  app.get('/', (req, res) => {
  res.send("Connected");
});

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error("MongoDB connection error:", err));
