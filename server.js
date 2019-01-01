let express = require("express");
let exphbs = require("express-handlebars");
const routes = require ("./routes/routes.js");
const path = require("path");

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
app.use(express.static(path.join(__dirname, "/public")));
app.use (routes);

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

