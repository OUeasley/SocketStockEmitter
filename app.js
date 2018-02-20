var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var counter = 0;

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);
http.listen(8000)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('subscribe', function (msg) {
        var c = counter++;
        console.log('message: ' + msg);
        emitFunction(socket,c);
    });
});

var emitFunction = function (socket, symbol) {
    setInterval(function () {
        socket.emit('message',randomSymbolInformation(symbol))
    }, 500);
};

var randomSymbolInformation = function (symbol) {
    return {
        "symbol": "aapl" + symbol,
        "marketPercent": 0.03531,
        "bidSize": 100,
        "bidPrice": 174.42,
        "askSize": 100,
        "askPrice": 176.88,
        "volume": 593789,
        "lastSalePrice": 174.425,
        "lastSaleSize": 100,
        "lastSaleTime": 1518799059840,
        "lastUpdated": 1518799059548,
        "sector": "technologyhardwareequipmen",
        "securityType": "commonstock"
    }
};

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
