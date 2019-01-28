let express = require("express");
const app = express();
let exphbs = require("express-handlebars");
//var booting = require('booting');

//var app = require('./app');
const PORT = process.env.PORT || 3000;


//http.listen(PORT);

// booting(app)
//     .use(require('./config/connection'))
//     .use(require('./models/database'))
//     .start(function (err, app) {
//         appListen();
//     });

const routes = require("./routes/routes.js");
const path = require("path");
const serveStatic = require("serve-static");
//const app = express();
app.use(express.json());
//const connFns = require("/config/connection.js");

console.log("blah blah");
//console.log("socket: ", io);

//connFns.establishSocket (http);


app.use(function (req, res, next) {
    //    console.log ("app next");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
    assemble: {
        options: {
            helpers: ["./public/csvjson.js"]
        }
    },
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//console.log ("path: ", path.join(__dirname, "/public"));
//app.use(express.static(path.join(__dirname, "/public")));
//console.log("app use routes");
app.use(routes);
//console.log("serve static: ", path.join(__dirname, 'public'));
app.use(serveStatic(path.join(__dirname, 'public')));
//console.log("app get");
app.get('*', function (req, res) {
    console.log("contacts sendFile: ", path.join(__dirname, req.params[0]));
    res.sendFile(path.join(__dirname, req.params[0]));
    console.log("contacts sendFile done: ", path.join("/var/www/html/", req.params[0]));
});


//  app.start();
//})

// app.boot(function (err) {
//     http.listen(PORT, function () {
//         console.log('http listening on *:3000');
//     });
// });

//GET https://people.googleapis.com/v1/people/me/connections?personFields=names&key={YOUR_API_KEY}

// ClientID: 337267580802-n4h5nb0aj5qs26u4at3rkivmki0sgb4i.apps.googleusercontent.com

//https://www.googleapis.com/auth/contacts

let server = app.listen(PORT);
let io = require('socket.io').listen(server);

//const server = require("../server.js");
//console.log("server.io: ", server.io);

io.on('connection', function (socket) {
    console.log('a user connected');
    // socket.emit('news', {
    //     hello: 'world'
    // });
    socket.on('my other event', function (data) {
        console.log("other event", data);
    });
});

module.exports.sendSomething = function () {
    io.emit ('news', {something: 'something'});
}

