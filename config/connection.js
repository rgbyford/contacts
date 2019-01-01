/* eslint-disable brace-style */
const MongoClient = require("mongodb").MongoClient;
//const test = require("assert");
// Connection url
const dbName = "toby";
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;
let dbToby;
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

module.exports.queryDB = async function (sSearch) {
    console.log("sSearch: ", sSearch);
    const cursor = dbToby.collection("contacts").find({
//        GroupMembership: sSearch
        GroupMembership: {$all: ["pp", "actor", "old"]}
    }).project({
        GivenName: 1,
        FamilyName: 1,
        GroupMembership: 1
    });
    console.log(cursor.cmd);
    cursor.each(function (err, item) {
        if (err) {throw (err);}
        // If the item is null then the cursor is exhausted/empty and closed
        if (item === null) {
            console.log ("No find");
            // Show that the cursor is closed
            // cursor.toArray(function (err, items) {
            //     //test.equal(null, err);

            //     // Let"s close the db
            //     //                db.close();
            // });
        }
        console.log(item);
    });
    //    await cursor.nextObject();
    return (cursor);
};


//let Contact;
//let aoAlreadySaved = [];
//console.log("init aoAS");

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", async function () {
//             console.log("we"
//                 re connected!");
//                 const ContactSchema = new mongoose.Schema({
//                     heading: String,
//                     story: String,
//                     link: String,
//                     note: String
//                 }); Contact = mongoose.model("Contact", ContactSchema);
//             });

module.exports.getSaved = function async () {
    return (adminDb.contacts.find());
};

let iCC = 0;

function insertContactCallback(err, res) {
    if (err) {
        console.log("iC err: ", err);
    }
    if (res) {
        //console.log("iC result: ", ++iCC, res.result);
    }
}
//db.contacts.find({"oContact.GivenName": "Aaron"})
// GroupMembership
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