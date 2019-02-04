/* eslint-disable brace-style */
const MongoClient = require("mongodb").MongoClient;
const dbName = "toby";
//const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;
let dbToby;
const url = "mongodb://localhost:27017";
const routes = require("../routes/routes");
const dbFns = require('../models/database');

// Connect using MongoClient
MongoClient.connect(url, function (err, client) {
    if (err) {
        throw err;
    }
    dbToby = client.db(dbName);
    dbToby.stats().then(function (res) {
        console.log("Connected to database: ", res);
    });
});

module.exports.clearDB = async function () {
    try {
        await dbToby.collection("contacts").drop();
        console.log("Database emptied");
    } catch (error) {
        console.log("Error emptying database");
    }
}

module.exports.findImage = async function (phone, findImageCB) {
    let found;
    console.log("findImage 1: ", phone);
    let records = await dbToby.collection('images').find({
        'Phone1-Value': phone
    }).count();
    console.log("fI records: ", records);
    if (records > 0) {
        let cursor = await dbToby.collection('images').find({
            'Phone1-Value': phone
        });
        console.log("after find");
        let item = await cursor.next();
        console.log("findImage: ", item.imageURL);
        return (item.imageURL);
    }
    else {
        return ('');
    }
}

module.exports.storeImage = function (phone, imageURL) {
    console.log('storeImage: ', phone, imageURL);
    const res = dbToby.collection("images").insertOne({
        'Phone1-Value': phone,
        'imageURL': imageURL
    });
}

module.exports.queryDB = async function (asSearchAnd, asSearchOr) {
    //let iSearches = 0;
    let asFound = [];
    let oSearch = {
        GroupMembership: {
            $all: asSearchAnd,
            $in: asSearchOr
        }
    }
    return new Promise(async (resolve, reject) => {
        console.log (`typeof asSearchOr: ${typeof (asSearchOr)} length: ${asSearchOr.length} |${asSearchOr}|`);
        if (asSearchOr.length === 0) {
            // generates an error
            console.log ("Empty OR search");
            //console.log (`typeof asSearchAnd: ${typeof (asSearchAnd)} length: ${asSearchAnd.length} |${asSearchAnd}|`);
            if (asSearchAnd.length === 0) {
                oSearch = {};
                console.log ("Search any");
            }
            else {
                asSearchOr[0] = asSearchAnd[0];
            }
        }
        console.log(`SearchAnd: *${asSearchAnd}* searchOr: *${asSearchOr}*`);
//        console.log ("oSearch: ", oSearch);
//        const cursor = dbToby.collection("contacts").find({})
        const cursor = dbToby.collection("contacts").find(oSearch)
        
        // const cursor = dbToby.collection("contacts").find({
        //     GroupMembership: {
        //         $all: asSearchAnd,
        //         $in: asSearchOr
        //     }
        // })
        .project({
            GivenName: 1,
            FamilyName: 1,
            GroupMembership: 1,
            'Phone1-Value': 1,
            imageURL: 1
        });
        //console.log ('queryDB cursor: ', cursor);
        cursor.each(function (err, item) {
            if (err) {
                console.log("Cursor error: ", err);
                //throw (err);
            }
            if (item === null) {
                console.log(`Last item. ${asFound.length} found.`);
                resolve(asFound);
            }
            //console.log(item);
            asFound.push(item);
        });
        console.log("end of queryDB - found: ", asFound.length);
    });
};

const serverFns = require('../contacts.js');
let iRowsCBCount = 0;
let dbStuff = require("../models/database.js");
let oContactSaved;
let aoModified = [];
let bLast;
let iRowsResultBad;
let iModified = 0;;
let iRowsNBad;

module.exports.getSaved = function async () {
    return (adminDb.contacts.find());
};

module.exports.getModified = function () {
    console.log ("gM: ", aoModified.length);
    return (aoModified);
};

module.exports.clearModified = function () {
    aoModified.length = 0;
    return;
};

module.exports.getLoaded = function () {
    return (iRowsCBCount);
};

module.exports.prepLoad = function () {
    dbFns.clearContacts();
    iRowsCBCount = 0;
    iModified = 0;
    aoModified.length = 0;
}

function insertContactCallback(err, res) {
    //console.log("iCCB: ", rowCBCount);
    if (err) {
        console.log("iC err: ", err.name, err.message);
        console.log("iC err - not loaded", aoModified.length);
        //console.log ("result: ", err);
    } else {
        if (res.result.nModified > 0) {
            console.log(`nM > 0: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            console.log(`${oContactSaved.GivenName} ${oContactSaved.FamilyName}`);
            aoModified.push(oContactSaved);
            iModified++;
        }
        if (res.result.n !== 1) {
            console.log(`nR != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
            iRowsNBad++;
        }
        if (res.result.ok !== 1) {
            console.log(`ok != 1: ${iRowsCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
            iRowsResultBad++;
        }
        iRowsCBCount++;
        dbStuff.importNames(); // recursive call for next row
        //console.log("iC result: ", ++iCC, res.result);
    }
    //if (!bRenderedContacts && (iRowsCBCount >= iSavedCount - 2)) {
    if (bLast) {
        console.log("last callback");
        console.log("Modified: ", aoModified.length);
        console.log("RowsNBad", iRowsNBad);
        console.log("iRowsResultBad", iRowsResultBad);
        dbStuff.writeFile(); // categories
        serverFns.sendSomething();
        bRenderedContacts = true;
        bLast = false;
    }
    //    console.log ("Rows: ", iSavedCount, iRowsCBCount);
    return;
}

module.exports.insertContact = function (oContact, bLastParam) {
    bLast = bLastParam;
    oContactSaved = oContact;
    const res = dbToby.collection("contacts").updateOne({
        "E-mail1-Value": oContact["E-mail1-Value"],
        "GivenName": oContact["GivenName"],
        "FamilyName": oContact["FamilyName"]
    }, {
        $set: oContact
    }, {
        upsert: true
    }, insertContactCallback);
}