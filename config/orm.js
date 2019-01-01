// collRef = require("./connection.js");


// collRef.get().then(function (snapshot) {
//     $("#stats").append($("<p>")
//         .html(snapshot.size + " contacts")
//     );
// });

// query = collRef.where('oContact.GroupMembership', 'array-contains', "man");
// query.get().then(snapshot => {
//     $("#stats").append($("<p>")
//         .html(snapshot.size + " males")
//     );

// });

// query = collRef.where('oContact.GroupMembership', 'array-contains', "woman");
// query.get().then(snapshot => {
//     $("#name-list").append($("<p>")
//         .html(snapshot.size + " females")
//     );
// });

// var firestore = {
//     dbInsert(contactRef, oContact) {
//         collRef.doc(contactRef).set({
//             oContact
//         });
//         return;
//     },

//     dbSearchTags(tag1) {
//         if (tag1 === "") {
//             query = collRef;
//         } else {
//             query = collRef.where("oContact.GroupMembership", "array-contains", tag1);
//         }
//         return query;
//     }
// };

// module.exports = firestore;