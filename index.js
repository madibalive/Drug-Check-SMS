var express = require("express");
var app = express();
var port = 5000;
var bodyParser = require('body-parser');
var cors = require('cors');
var Parse = require('parse/node')
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())
//
Parse.initialize("ID", "KEY");

var ctrl = require('./controller/index_ctrl.js');
var viewCtrl = require('./controller/view_ctrl.js');


app.get('/', viewCtrl.renderIndex());

app.post('/add', viewCtrl.addNew())

app.post('/sms', ctrl.webhook())

app.get('/health', ctrl.health())



app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send('error');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send('error');
});
app.listen(port, function () {
    console.log('listenin on port : ' + port);

})