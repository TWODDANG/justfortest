const express= require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// 하이 이유를 알았어. client 자체가 git에 안들어가있었음.........그래서 build도 안되었던거고.
require('dotenv').config();

const app = express();
if(process.env.NODE_ENV === 'production'){
    const path = require('path');
    app.use(express.static(path.join('client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'build','index.html'));
    });
    // const staticFiles = express.static(path.join(__dirname, '../../client/build'));
    // app.use(staticFiles);
    // app.get('/*', staticFiles)
}

const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const uri = process.env.ATLAS_URI;
console.log(uri);
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('MongoDb database connection established successfully');
});

const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');




//app.use(express.json());
app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
});