const express = require('express');
require('dotenv').config();
const userRoutes = require('../server/routes/UserRoutes');
const recipeRoutes = require('./routes/RecipeRoutes');
const { dbConnect } = require('./config/DbConnection');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const Port = process.env.PORT;
dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use('/api/v1',userRoutes);
app.use('/api/v1/recipe',recipeRoutes);
app.get('/',(req,res) => {
res.send("Server Working")
});
app.listen(Port,() => {
    console.log("App Started At Port",Port);
})