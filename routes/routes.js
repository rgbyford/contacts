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
    //console.log("renderContacts");
    // set up the "level 0" categories
    aoCats = dbFunctions.readCatsFile();
    let j = 0;
    aoCats.forEach(function (element) {
        if (element.sIsSubCatOf === "") {
            asCatStrings[j++] = element.sThisCat;
            //console.log ("rC subCat of empty", element.sThisCat);
        }
    });
    asCatStrings.sort();
    asCatStrings.unshift("any");
    //console.log("rC asPrev: ", asPrev);
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
    console.log("get loadContacts");
    renderContacts(res);
});

router.get("/loaded", function (req, res) {
    let aoNotLoaded = [];
    aoNotLoaded = dbConn.getNotLoaded();
    console.log("get loaded");
    console.log("aoNL length", aoNotLoaded.length);
    console.log("aoNL[0]: ", aoNotLoaded[0]);
    res.render("loaded", {
        iNotLoaded: aoNotLoaded.length,
        aoNotLoaded: aoNotLoaded
    });
});

router.get("/loadContacts", function (req, res) {
    console.log("glC - cleared aoNL");
    dbConn.clearNotLoaded();
    console.log("get contacts");
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
router.put("/contacts/import", uploadMulter.single("avatar"), async function (req, res, next) {
    //req.file.filename gives the file name on the server
    // req.file.originalname gives the client file name
    // console.log("body: ", req.body);
    //    document.body.style.cursor  = 'wait';
    // console.log ("res render import");
    // res.render("loadcontacts", {
    //     loading: true
    // });
    console.log("/contacts/import req body: ", req.body);
    if (req.body.clearDB === 'on') {
        await dbConn.clearDB();
        // empty the database collection
    }
    if (req.body.clearCats === 'on') {
        dbFunctions.deleteCatsFile();
        // erase the categories file
    }

    cjFns.csvJson(req.file.filename); // needs to return a not loaded list
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
    let sSearch;
    let bDone = (typeof (req.body.sValue) !== "string") && (req.body.sValue.length > 1);
    //console.log("req.body.sValue: ", req.body);
    if (!bDone) {
        // console.log ("rbs: ", req.body.sValue[0]);
        // console.log (aoTagNames);
        aoCats.forEach(function (element, i) {
            // if indexof >= 0 take short string of index
            //            if (element.sIsSubCatOf === req.body.sValue[0]) {
            if (element.sIsSubCatOf === req.body.sValue[0]) {
                //console.log("ISO: ", element.sIsSubCatOf, req.body.sValue[0]);
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
    //    if (1) {
    //    if (asCats.length >= 1) { // 1 for "any" and 1 more
    /*eslint-disable indent*/
    switch (req.body.sId) {
        case "cats11":
            // We've just had the case, so move on to the next one
            asValues[1] = req.body.sValue;
            //console.log("sV11: ", asValues[1]);
            asCats11 = [asValues[1]];
            asCats12 = asCats;
            asValues[2] = asCats12[0];
            bCats11Done = true;
            break;
        case "cats12":
            asValues[2] = req.body.sValue;
            //console.log("sV12: ", asValues[2]);
            asCats11 = [asValues[1]];
            asCats12 = [asValues[2]];
            asCats13 = asCats.length > 2 ? asCats : [];
            //console.log("asC13: ", asCats13);
            asValues[3] = asCats13[0];
            bCats11Done = true;
            bCats12Done = true;
            break;
        case "cats13":
            asValues[3] = req.body.asValues;
            //console.log("sV13: ", asValues[3]);
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
            //console.log("sV14: ", asValues[4]);
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
    // } else {
    //     // set last of asValues - use the last char of "catsxx" as []
    //     asValues[parseInt(req.body.sId.substr(-1))] = req.body.sValue;
    // }
});

function setPrevious() {
    //console.log("iAnds: ", iAnds);
    iAnds++;
    if (iAnds === 0) {
        asPrev.length = 0;
    }
    asPrev[iAnds] = "";
    for (let i = 0; i < asValues.length; i++) {
        if (asValues[i] !== undefined) {
            //console.log(`asV${i}: ${asValues[i]}`);
            // let iTagPos = indexOfByKey(aoTagNames, 'sShortName', asValues[i]);
            // console.log ("iTP: ", iTagPos);
            // if (iTagPos >= 0) {
            //     asPrev[iAnds] = aoTagNames[iTagPos].sLongName + ' ';
            //     console.log ("sP: ", asPrev[iAnds]);            
            // } else {
            asPrev[iAnds] += asValues[i] + " ";
            //     console.log ("sP failed");
            // }
        }
        asValues[i] = "";
    }
}

router.post("/contacts/and", function (req, res) {
    setPrevious();
    res.redirect("/contacts/and");
});

let aoFoundPeople = [];

router.post("/contacts/nameClicked", function (req, res) {
    let person = aoFoundPeople[req.body.sId];
    console.log ("aoFP: ", aoFoundPeople);
    console.log("name clicked: ", req.body.sId);
    console.log(person);
    console.log("Phone: ", person['Phone1-Value']);
    if (person['Phone1-Value'] === undefined) {
        person.Phone1 = "no phone number";
    } else {
        person.Phone1 = person['Phone1-Value'];
    }
    testFC(person.Phone1).then(function (picture) {
        person.image = true;
        person.picture = picture;
        aoFoundPeople[req.body.sId] = person;
        res.render("index", {
            search: true,
            asPrevSearch: asPrev,
            aoFound: aoFoundPeople
            });

        // res.render("index", {
        //     search: true,
        //     asPrevSearch: asPrev,
        //     aoFound: aoFoundPeople,
    });
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

    //console.log("/contacts/search: ", asSearchAnd, asSearchOr);
    dbConn.queryDB(asSearchAnd, asSearchOr).then(function (aoFound) {
        // mongo returns an extra null element on the end of the array
        aoFound.length = aoFound.length - 1;
        // don't ask why HowMany is done in such a weird way
        // handlebars wasn't coping with an extra variable
        for (let i = 0; i < aoFound.length; i++) {
            aoFound[i].itemNum = i;
        }
        aoFound[0].HowMany = aoFound.length;
        aoFoundPeople = aoFound;
        //        console.log("/contacts/search: ", aoFoundPeople);
        // testFC(aoFound[0]['Phone1-Value']).then(function (picture) {
        res.render("index", {
            search: true,
            asPrevSearch: asPrev,
            aoFound: aoFound
        });
        // });
    });
    return;
});

let fc = require('../models/full-contact.js');

async function testFC(sPhone) {
    resolve = await fc.getContact(sPhone);
    //    console.log("resolve: ", resolve);
    //    .then(function (resolve, err) {
    let img = {};
    if (resolve.status == 404) {
        console.log("no image");
        img.src = "";
        // var sorry = document.createElement("p");
        // sorry.textContent = 'Sorry.  No image.';
        // document.getElementById('picture').appendChild(sorry);
    } else {
        //var img = document.createElement("img");
        console.log("found an image: ", resolve.avatar);
        img.src = resolve.avatar;
        img.id = "picture";
        img.width = '150';
        // $('#picture').appendChild(img);
        // $('#picture').attr("style", "display:block");
    }
    // var phone = document.createElement("p");
    // phone.textContent = sPhone;
    // document.getElementById(id).appendChild(phone);
    return (resolve.avatar);
    // .catch(function (err) {
    //     console.log("FC error: ", err);
    // });
    // return (resolve.avator;
}

module.exports = router;