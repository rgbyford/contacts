/* eslint-disable brace-style */
const MongoClient = require("mongodb").MongoClient;
const dbName = "toby";
//const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;
let dbToby;
const url = "mongodb://localhost:27017";

// Connect using MongoClient
//MongoClient.connect(MONGODB_URI, function (err, db) {
MongoClient.connect(url, function (err, client) {
    if (err) {
        throw err;
    }
    dbToby = client.db (dbName);
    dbToby.stats().then(function (res) {
        console.log("Connected to database: ", res);
    });
});

module.exports.queryDB = async function (asSearchAnd, asSearchOr) {
    //console.log ("asSAnd: ", asSearchAnd);
    //console.log ("asSOr: ", asSearchOr);
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
                // Show that the cursor is closed
                // cursor.toArray(function (err, items) {
                //     //test.equal(null, err);
                //     // Let"s close the db
                //     //                db.close();
                // });
                //dbToby.close ();
                resolve(asFound);
            }
            asFound.push(item);
            //console.log("item: ", item);
        });
        console.log("end of queryDB");
    });
};

module.exports.getSaved = function async () {
    return (adminDb.contacts.find());
};

function insertContactCallback(err, res) {
    if (err) {
        console.log("iC err: ", err);
    }
    if (res) {
        //console.log("iC result: ", ++iCC, res.result);
    }
}

module.exports.insertContact = function (oContact) {
    dbToby.collection("contacts").updateOne({
        "E-mail1-Value": oContact["E-mail1-Value"]
    }, {$set: oContact}, {
        upsert: true
    }, insertContactCallback);
    return;
};
