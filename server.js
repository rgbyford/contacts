let express = require("express");
let exphbs = require("express-handlebars");
const routes = require ("./routes/routes.js");
const path = require("path");
const serveStatic = require("serve-static");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

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
console.log ("app use routes");
app.use (routes);
console.log ("serve static: ", path.join(__dirname, 'public'));
app.use(serveStatic(path.join(__dirname, 'public')));
console.log ("app get");
app.get('*', function(req, res) {
    console.log ("myreact sendFile: ", path.join (__dirname, req.params[0]));
    res.sendFile(path.join(__dirname, req.params[0]));
    console.log ("myreact sendFile done: ", path.join ("/var/www/html/", req.params[0]));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

//GET https://people.googleapis.com/v1/people/me/connections?personFields=names&key={YOUR_API_KEY}

// ClientID: 337267580802-n4h5nb0aj5qs26u4at3rkivmki0sgb4i.apps.googleusercontent.com

//https://www.googleapis.com/auth/contacts

