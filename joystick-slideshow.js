sf = require('node-salesforce'); // For creating / updating a record on Salesforce
config = require('./config.js');

// Salesforce connection stuff
conn = new sf.Connection({
//  loginUrl : 'https://login.salesforce.com'
  clientId : config.CLIENT_ID,
  clientSecret : config.CLIENT_SECRET,
  redirectUri : config.CALLBACK_URL + '/oauth/_callback'
});
conn.login(config.USERNAME, config.PASSWORD, function(err) {
  if (!err) {
    console.log("the access token is : "+conn.accessToken);
    // ...
  } else {
    console.log('There got some error during the login: '+JSON.stringify(err));

  }
});

routes = require('./routes'); // index.js containing only one route => authenticate
https = require('https'); // ?? => because connected apps can't run without https
fs = require('fs');
path = require('path');
$ = require('jquery'); 
sslkey = fs.readFileSync('ssl-key.pem');
sslcert = fs.readFileSync('ssl-cert.pem');

options = {
    key: sslkey,
    cert: sslcert
};

express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http);

// all environments
app.set('port', process.env.PORT || 8443);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.post('/authenticate', routes.authenticate);

// Initializing the Arduinot BOARD using Johnny Five
var five = require("johnny-five"),
    board = new five.Board({
        repl: false
    });

app.use(express.static(__dirname + "/public"));

board.on("ready", function () {
    console.log("arduino ready");
    
    var joystick = new five.Joystick({
        pins: ["A0", "A1"],
        freq: 500
    });
    
    var prev = {};
    
    joystick.on("axismove", function (err, timestamp) {
        if (+this.fixed.x === 1) move("right");

        // if(+this.fixed.x>0.50 && +this.fixed.x<=1) move("right");
        // if (+this.fixed.x >= 0 &&) move("left");

        if (+this.fixed.x === 0) move("left");
        // if (+this.fixed.y>0.5 && +this.fixed.y === 1) move("up");
        if (+this.fixed.y === 1) move("up");
        
        if (+this.fixed.y === 0) move("down");
        
        if (prev.x !== this.fixed.x || prev.y !== this.fixed.y) {
            prev.x = this.fixed.x;
            prev.y = this.fixed.y;
            console.log(prev);
        }
    });
});


// 


function move(direction) {
    console.log(direction.toUpperCase());

    conn.sobject("Account").upsert({ // Upsert Table
      Name : 'Record '+direction,
      accountMaster__c : direction
    }, 'accountMaster__c', function(err, ret) {
      if (!err && ret.success) {
        console.log('Upsert Successfull');
      }
    });
    // socket.emit('accessToken', conn.accessToken);
    io.emit(direction);
}

http.listen(3000, function () {
    console.log("running on localhost:3000");
    setTimeout(function(){ io.emit("right");}, 8000);
    setTimeout(function(){ io.emit("left");}, 10000);
});

https.createServer(options, app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
