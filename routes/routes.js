let express = require("express");
let router = express.Router();
const cjFns = require("../models/csvjson.js");
const dbFunctions = require("../models/database.js");
const dbConn = require("../config/connection.js");
let aoCats = [{}];
let asPrev = [];
let iAnds = -1;
let bAndBtnDisabled = false;

function renderContacts(res) {
    let asCatStrings = [];
    console.log("renderContacts");
    // set up the "level 0" categories
    aoCats = dbFunctions.readCatsFile();
    let j = 0;
    aoCats.forEach(function (element) {
        if (element.sIsSubCatOf === "") {
            asCatStrings[j++] = element.sThisCat;
        }
    });
    asCatStrings.sort();
    asCatStrings.unshift("any");
    console.log("rC asPrev: ", asPrev);
    res.render("index", {
        cats11: asCatStrings,
        cats12: [],
        cats13: [],
        cats14: [],
        asPrev: asPrev,
        search: false
    });
}

router.get("/contacts", function (req, res) {
    asPrev.forEach((element, i) => {
        asPrev[i] = "";
    });
    iAnds = -1;
    dbConn.aoNotLoaded = [];
    console.log("get contacts");
    renderContacts(res);
});

router.get("/loaded", function (req, res) {
    console.log("get loaded");
    res.render("loaded", {
        iNotLoaded: dbConn.aoNotLoaded.length,
        aoNotLoaded: dbConn.aoNotLoaded
    });
});

router.get("/loadContacts", function (req, res) {
    console.log("get loadContacts");
    res.render("loadContacts", {});
});

router.get("/contacts/and", function (req, res) {
    console.log("get contacts/and");
    renderContacts(res);
});

var multer = require("multer");
var uploadMulter = multer({
    dest: "./uploads/"
});

router.get("/", function (req, res) {
    console.log("get /");
    res.redirect("/contacts");
});

router.get("/searchPage", function (req, res) {
    console.log("get searchPage");
    res.redirect("/contacts");
});


// I don"t know if the "avatar" here has to match what is in the put
router.put("/contacts/import", uploadMulter.single("avatar"), function (req, res, next) {
    //req.file.filename gives the file name on the server
    // req.file.originalname gives the client file name
    // console.log("body: ", req.body);
    //    document.body.style.cursor  = 'wait';
    // console.log ("res render import");
    // res.render("loadcontacts", {
    //     loading: true
    // });
    console.log ("/contacts/import req body: ", req.body);
    if (req.body.clearDB === 'on') {
        dbFunctions.clearDatabase ();
        // empty the database collection
        // have to wait for the empty to finish
    }
    if (req.body.clearCats === 'on') {
        // erase the categories file
        // wait until done
    }

    cjFns.csvJson(req.file.filename); // needs to return a not loaded list
    //    res.render("index", {});
});

let asValues = [];

router.post("/contacts/select", function (req, res) {
    let asCats = [];
    //    let asTemp = [];
    let asCats11 = [];
    let asCats12 = [];
    let asCats13 = [];
    let asCats14 = [];
    let bCats12Done = false;
    let bCats11Done = false;
    let bDone = (typeof (req.body.sValue) !== "string") && (req.body.sValue.length > 1);
    if (!bDone) {
        aoCats.forEach(function (element, i) {
            if (element.sIsSubCatOf === req.body.sValue[0]) {
                //            console.log("ISO: ", element.sIsSubCatOf, req.body.sValue[0]);
                asCats[i + 1] = element.sThisCat;
            }
        });
        asCats = asCats.filter(v => v !== "");
        asCats = asCats.sort();
        asCats.unshift("any");
        //console.log("asC: ", asCats, " ", asCats.length);
        bAndBtnDisabled = asCats.length > 2;
    } else {
        bAndBtnDisabled = false;
    }
    if (1) {
        //    if (asCats.length >= 1) { // 1 for "any" and 1 more
        /*eslint-disable indent*/
        switch (req.body.sId) {
            case "cats11":
                // We've just had the case, so move on to the next one
                asValues[1] = req.body.sValue;
                asCats11 = [asValues[1]];
                asCats12 = asCats;
                asValues[2] = asCats12[0];
                bCats11Done = true;
                break;
            case "cats12":
                //                bAndBtnDisabled = false;
                asValues[2] = req.body.sValue;
                console.log("sV12: ", asValues[2]);
                asCats11 = [asValues[1]];
                asCats12 = [asValues[2]];
                asCats13 = asCats.length > 2 ? asCats : [];
                console.log("asC13: ", asCats13);
                asValues[3] = asCats13[0];
                bCats11Done = true;
                bCats12Done = true;
                break;
            case "cats13":
                asValues[3] = req.body.sValue;
                console.log("sV13: ", asValues[3]);
                asCats11 = [asValues[1]];
                asCats12 = [asValues[2]];
                asCats13 = [asValues[3]];
                asCats14 = asCats.length > 2 ? asCats : [];
                bCats11Done = true;
                bCats12Done = true;
                asValues[4] = asCats14[0];
                break;
            case "cats14":
                asValues[4] = req.body.sValue;
                console.log("sV14: ", asValues[4]);
                asCats11 = [asValues[1]];
                asCats12 = [asValues[2]];
                asCats13 = [asValues[3]];
                asCats14 = [asValues[4]];
                bCats11Done = true;
                bCats12Done = true;
                // asValues[5] = asCats15[0];
                break;
            default:
                console.log("sId error: ", req.body.sId);
                break;
        }
        /* eslint-enable indent*/
        //console.log("cs: ", asPrev);
        res.render("index", {
            cats11: asCats11,
            cats12: asCats12,
            cats13: asCats13,
            cats14: asCats14,
            asPrev: asPrev,
            andBtnDisabled: bAndBtnDisabled,
            cats11Done: bCats11Done,
            cats12Done: bCats12Done,
            search: false
        });
    } else {
        // set last of asValues - use the last char of "catsxx" as []
        asValues[parseInt(req.body.sId.substr(-1))] = req.body.sValue;
    }
});

function setPrevious() {
    //    console.log("iAnds: ", iAnds);
    iAnds++;
    if (iAnds === 0) {
        asPrev.length = 0;
    }
    asPrev[iAnds] = "";
    for (let i = 0; i < asValues.length; i++) {
        if (asValues[i] !== undefined) {
            //console.log(`asV${i}: ${asValues[i]}`);
            asPrev[iAnds] += asValues[i] + " ";
        }
        asValues[i] = "";
    }
}

router.post("/contacts/and", function (req, res) {
    setPrevious();
    res.redirect("/contacts/and");
});

router.post("/contacts/search", async function (req, res) {
    setPrevious();
    iAnds = -1;
    let asSearchAnd = [];
    let asSearchOr = [];

    asPrev.forEach((sFind, index) => {
        sFind = sFind.trim();
        let asFinds = sFind.split(" ");
        if (asFinds.length > 1) { //['x y']
            asFinds.forEach((sCat, j) => {
                let asFindCommas = sCat.split(",");
                if (asFindCommas.length > 1) {
                    // there's an OR
                    asFindCommas.forEach((sCatOr, k) => {
                        asSearchOr.push(sCatOr);
                    });
                } else {
                    if (sCat !== "any") {
                        asSearchAnd.push(sCat);
                    }
                }
            });
        } else {
            asSearchAnd.push(asFinds[0]);
        }
    });
    // try splitting each sub-array by ','
    // search is <first element> AND <second element>
    // if split returns > 1, build an OR (pp AND (a OR c))
    // if split returns 1, just treat it "as is" (1 AND ace)
    // if "any" as the last sub-array, ignore it
    // so search string is "{$and [{$eq: array0}" + if there's an or ", $or[{$eq: subarray0}, {$eq: subarray1}, ...]]}"
    // otherwise ", {$eq: array1}, {$eq: array2}]}"
    // if last asPrev, add "} to search string.  Else add ", "
    // end for each asPrev.  Go around, 

    dbConn.queryDB(asSearchAnd, asSearchOr).then(function (asFound) {
        res.render("index", {
            asPrevSearch: asPrev,
            asFound: asFound,
            iFound: asFound.length
        });
    });
    return;
});


module.exports = router;