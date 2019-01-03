/* eslint-disable brace-style */
const MongoClient = require("mongodb").MongoClient;
const routes = require("../routes/routes.js");
//const test = require("assert");
// Connection url
const dbName = "toby";
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;
let dbToby;
//let asFound = [];
//let db;
// Connect using MongoClient
MongoClient.connect(MONGODB_URI, function (err, db) {
    if (err) {
        throw err;
    }
    //    dbToby = db;then(function () {
    //    console.log(db);
    dbToby = db;
    dbToby.stats().then(function (res) {
        console.log("Connected to database: ", res);
    });
});

// module.exports.getFoundItems = function () {
//     return (asFound);
// };

module.exports.queryDB = async function (asSearch) {
    return new Promise((resolve, reject) => {
        const cursor = dbToby.collection("contacts").find({
            GroupMembership: {
                $all: asSearch
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
    }, oContact, {
        upsert: true
    }, insertContactCallback);
    return;
};

//     let dbContact = new Contact(oContact);
//     console.log("insertContact link: ", dbContact.link);
//     // if it is in already saved, do an update to the note.
//     // otherwise do an insert
//     let notSaved = true;
//     for (let j = 0; j < aoAlreadySaved.length; j++) { // check if already saved
//         if (aoAlreadySaved[j].link === oContact.link) { //not headlines because they change!
//             notSaved = false;
//             break;
//         }
//     }

//     if (notSaved) { // insert
//         // console.log("Not here - add to AlreadySaved");
//         aoAlreadySaved.push(oContact);
//         dbContact.save(function (err) {
//             if (err) {
//                 return console.error(err);
//             }
//             //            console.log(dbContact);
//         });
//     } else {
//         // console.log("Already here - update");
//         // console.log("Note: ", oContact.note);
//         let conditions = {
//             link: oContact.link
//         };
//         let update = {
//             $set: {
//                 note: oContact.note
//             }
//         };
//         let options = {
//             multi: false
//         };
//         Contact.update(conditions, update, options, udCallback);
//     }
// }

// function udCallback(err, numAffected) {
//     console.log("udC err: ", err);
//     console.log("udC updated count: ", numAffected);
// }