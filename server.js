var express = require('express'),
    dog = require('./routes/dogs');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.set('view engine', 'jade');
});
 
app.get('/dogs', dog.findAll);
app.get('/dogs/get', dog.findById);

app.get('/doglist', dog.getDogList);

app.post('/dogs', dog.addDog);

app.put('/dogs/:id', dog.updateDog);
app.delete('/dogs/:id', dog.deleteDog);
 
app.listen(3000);
console.log('Listening on port 3000...');