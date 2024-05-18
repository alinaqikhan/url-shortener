const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('./routes');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongodb-server.57ej02p.mongodb.net/${process.env.MONGO_DB}`;
const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use(routes);

app.use((error, req, res, next) => {
  console.log(error); // helps during development
  const status = error.statusCode || 500;
  const message = error.message;
  const payload = { message };
  if (error.data) {
    payload.data = error.data;
  }
  res.status(status).json(payload);
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to Database!');
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  })
  .catch(err => console.log(err));
