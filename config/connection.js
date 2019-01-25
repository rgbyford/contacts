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

let rowCount = 0;
let rowCBCount = 0;
let dbStuff = require("../models/database.js");

function insertContactCallback(err, res) {
    //console.log("iCCB: ", rowCBCount);
    if (err) {
        console.log("iC err: ", err);
    }
    if (res.result.nModified > 0) {
        console.log(`Row: ${rowCBCount}: ${res.result.n} ${res.result.nModified} ${res.result.ok} `);
    }
    if (res.numberReturned !== 1) {
        console.log("rowCBCount: ", rowCBCount);
        console.log("Rows: ", rowCount);
    }
    rowCBCount++;
    dbStuff.importNames(); // recursive call for next row
    //console.log("iC result: ", ++iCC, res.result);
}

module.exports.insertContact = function (oContact) {
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
