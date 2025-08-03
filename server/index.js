const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/UserRoutes');
const recipeRoutes = require('./routes/RecipeRoutes');
const { dbConnect } = require('./config/DbConnection');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));



app.use(
  cors({
    origin: ['https://satvikai.netlify.app', 'http://localhost:5173'],
    credentials: true,
  })
);

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/recipe', recipeRoutes);

app.get('/', (req, res) => {
    res.send('Hello from SatvikAI Backend on Vercel!');
});
module.exports = app;
