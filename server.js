/*
 * @author: Manuel Araujo <alejandromanuel5187@gmail.com>
 * Created on 2017-10-13 11:42:39 
 */
const mongoose  = require('mongoose');
const app       = require('./app')
const config    = require('./server/config/config');


// Port Number
const port = process.env.PORT || 8080;

// Connect To DataBase
mongoose.connect(config.database.url, {useMongoClient: true}, (err, res) => {
    if (err) {
        return console.log(`Database error: ${err}`);
    }
    console.log(`Conected to database ${config.database.url}`);
    app.listen(port, () => {
        console.log(`Server Started on port ${port}`);
    })
});
