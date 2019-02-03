let dbStuff = require("./database.js");
let papa = require("papaparse");
var fs = require("fs");
let index = 0;      // just to count and display the rows
let fileName;

function CJDone(results) {
    dbStuff.importNames(index);
    console.log(`import done: ${index} rows according to papaparse`);
    fs.unlinkSync('./uploads/' + fileName);
    index = 0;
}

function CJRow(results) {
//    document.body.style.cursor  = 'wait';
    index++;
    dbStuff.pushContact(results.data);
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
    fileName = file;
    dbStuff.readCatsFile(); // read in existing categories
    // When the file is a local file we need to convert to a file Obj.
    var content = fs.readFileSync("./uploads/" + file, "utf8");
    papa.parse(content, myConfig);
};