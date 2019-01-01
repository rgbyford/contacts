//var file = File.createFromFileName("path/to/some/file");

//var csvFiles = document.querySelectorAll(".csv");

let dbFunctions = require("./database.js");
let papa = require("papaparse");
var fs = require("fs");

function CJDone(results) {
    // console.log("CJD: ", results);
    dbFunctions.writeFile();
    //    dbFunctions.importNames(results.data);
    console.log("import done");
}

function CJRow(results) {
    // console.log("CJR");
    dbFunctions.importNames(results.data);
}

var myConfig = {
    newline: "", // auto-detect
    // eslint-disable-next-line quotes
    quoteChar: '"',
    delimiter: "", // auto-detect
    // eslint-disable-next-line quotes
    escapeChar: '"',
    header: true,
    trimHeaders: false,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: CJRow,
    complete: CJDone,
    error: undefined,
    download: false,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined
};

module.exports.csvJson = function (file) {
    dbFunctions.readCatsFile(); // read in existing categories
    // When the file is a local file when need to convert to a file Obj.
    var content = fs.readFileSync("./uploads/" + file, "utf8");
    papa.parse(content, myConfig);
    // console.log("csvJson");
};

