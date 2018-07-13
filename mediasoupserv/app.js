var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





const WebRtcServer = require('mediasoup-server').WebRtcServer;

const hostname = os.hostname();

const webRtcServer = new WebRtcServer();
webRtcServer.listen({
    enableDebug: true,
    key: fs.readFileSync('../allkey/server.key'),
    cert: fs.readFileSync('../allkey/server.crt'),
    port: 3888,
    path: 'public',
}).on('listen', () => {
    console.log('Mediasoup demo started');
})
    .on('web-listen', (port) => {
        console.log(`Open https://${hostname}:${port} with browser`);
    })
    .on('new-connection', (connection) => {
        console.log(`New connection [${connection.id}]`);

        connection
            .on('error', (err) => {
                console.log(`Connection [${connection.id}] error: ${err}`);
            })
            .on('receive', (action, data) => {
                console.log(`Connection [${connection.id}] receive [${action}]`);
            })
            .on('send', (action, data) => {
                console.log(`Connection [${connection.id}] send [${action}]`);
            })
            .on('new-stream', (stream) => {
                console.log(`Connection [${connection.id}] peer [${stream.peer.id}] new stream [${stream.id}]`);
            })
            .on('ready', (peerConnection) => {
                console.log(`Connection [${connection.id}] peer [${peerConnection.peer.id}] ready`);
            })
            .on('close', (peerId) => {
                console.log(`Connection [${connection.id}] peer [${peerId}] closed`);
            })
            .on('disconnect', (err) => {
                console.log(`Connection [${connection.id}] signaling disconnected`);
                connection = null;
            });
    });











module.exports = app;
