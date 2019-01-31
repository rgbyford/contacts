/* eslint-disable brace-style */
const MongoClient = require("mongodb").MongoClient;
const dbName = "toby";
//const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;
let dbToby;
const url = "mongodb://localhost:27017";
const routes = require ("../routes/routes");
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

let iSearches = 0;

module.exports.queryDB = async function (asSearchAnd, asSearchOr) {
    let asFound = [];
    return new Promise(async (resolve, reject) => {
        if (asSearchOr.length === 0) {
            // generates an error
            asSearchOr[0] = asSearchAnd[0];
        }
        console.log(`Search ${iSearches++}: ${asSearchAnd} ::: ${asSearchOr}`);
        const cursor = dbToby.collection("contacts").find({
            GroupMembership: {
                $all: asSearchAnd,
                $in: asSearchOr
            }
        }).project({
            GivenName: 1,
            FamilyName: 1,
            GroupMembership: 1
        });
        cursor.each(function (err, item) {
            if (err) {
                console.log("Cursor error: ", err);
                //throw (err);
            }
            if (item === null) {
                console.log(`Last item. ${asFound.length} found.`);
                resolve(asFound);
            }
            // console.log(asFound);
            asFound.push(item);
        });
        console.log("end of queryDB - found: ", asFound.length);
    });
};

module.exports.getSaved = function async () {
    return (adminDb.contacts.find());
};

module.exports.getNotLoaded = function () {
    return (aoNotLoaded);
};

module.exports.clearNotLoaded = function () {
    aoNotLoaded.length = 0;
    return;
};

const serverFns = require('../contacts.js');
let iRowCBCount = 0;
let dbStuff = require("../models/database.js");
let oContactSaved;
let aoNotLoaded = [];
let bLast;

function insertContactCallback(err, res) {
    //console.log("iCCB: ", rowCBCount);
    if (err) {
        console.log("iC err: ", err.name, err.message);
        console.log ("iC err - not loaded", aoNotLoaded.length);
        //console.log ("result: ", err);
    } else {
        if (res.result.nModified > 0) {
            console.log(`nM > 0: ${iRowCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            console.log(`${oContactSaved.GivenName} ${oContactSaved.FamilyName}`);
            aoNotLoaded.push(oContactSaved);
        }
        if (res.result.n !== 1) {
            console.log(`nR != 1: ${iRowCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
        }
        if (res.result.ok !== 1) {
            console.log(`ok != 1: ${iRowCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok}`);
            //console.log("rowCBCount: ", rowCBCount);
            //    console.log("Rows: ", rowCount);
        }
        iRowCBCount++;
        dbStuff.importNames(); // recursive call for next row
        //console.log("iC result: ", ++iCC, res.result);
    }
    //if (!bRenderedContacts && (iRowCBCount >= iSavedCount - 2)) {
    if (bLast) {
        console.log("last callback");
        console.log ("Not loaded: ", aoNotLoaded.length);
        dbStuff.writeFile(); // categories
        serverFns.sendSomething();
        bRenderedContacts = true;
        bLast = false;
    }
    //    console.log ("Rows: ", iSavedCount, iRowCBCount);
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