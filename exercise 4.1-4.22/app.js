const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middlewares = require('./utils/middlewares');

const app = express();

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => logger.info('Connected to MONGODB'))
.catch((err) => {
    logger.error("Error connecting to MongoDB:", err.message)
})

app.use(cors());
app.use(middlewares.tokenExtractor);
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use(middlewares.unknownEndpoint);

module.exports = app;