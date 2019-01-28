/* eslint-disable brace-style */
const MongoClient = require("mongodb").MongoClient;
const dbName = "toby";
//const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;
let dbToby;
const url = "mongodb://localhost:27017";

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

module.exports.queryDB = async function (asSearchAnd, asSearchOr) {
    return new Promise((resolve, reject) => {
        if (asSearchOr.length === 0) {
            // generates an error
            asSearchOr[0] = asSearchAnd[0];
        }
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
        let asFound = [];
        cursor.each(async function (err, item) {
            if (err) {
                throw (err);
            }
            if (item === null) {
                console.log("No find - or last item");
                resolve(asFound);
            }
            asFound.push(item);
        });
        console.log("end of queryDB");
    });
};

module.exports.getSaved = function async () {
    return (adminDb.contacts.find());
};

//let routeModule = require("../routes/routes.js");
const serverFns = require('../server.js');
//let iRowCount = 0;
let iRowCBCount = 0;
let dbStuff = require("../models/database.js");
let oContactSaved;
let aoNotLoaded = [];
//let bRenderedContacts;
module.exports.aoNotLoaded = aoNotLoaded;
let bLast;

function insertContactCallback(err, res) {
    //console.log("iCCB: ", rowCBCount);
    if (err) {
        console.log("iC err: ", err.name, err.message);
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
        serverFns.sendSomething();
        bRenderedContacts = true;
        bLast = false;
    }
    //    console.log ("Rows: ", iSavedCount, iRowCBCount);
    return;
}

module.exports.insertContact = function (oContact, bLastParam) {
    bLast = bLastParam;
    // if (iCount > 0) { // first call
    //     bRenderedContacts = false;
    //     iSavedCount = iCount;
    // }
    //iRowCount++;
    oContactSaved = oContact;
    //console.log("iC: ", rowCount++);
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