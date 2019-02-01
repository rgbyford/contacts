// Enrich API
fetch = require("node-fetch");

var apiKey = "hcyo5tkTZ3DscDXQurTlBlpUrTMhUpv1";

module.exports.getContact = function (sPhone) {
    return (new Promise(function (resolve, reject) {
        fetch("https://api.fullcontact.com/v3/person.enrich", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "text/plain charset=utf-8"
            },
            body: JSON.stringify({
                //            only phone and e-mail will work - fullName does not
                "phone": sPhone
                // is fairly flexible I know that 1xxxyyyzzzz works, as does xxx-yyy-zzzz
                //            "email": "rgbyford@gmail.com"
            })
        }).then(res => res.json()).catch(err => console.log("E1: " + err)).then(data => {
            //            console.log(data);
            resolve(data); // returns a promise with "data" as the "resolve"
        }).catch(err => console.log("E2: " + err));
    }));
};

// function addInfo() {
//     fetch("https://api.fullcontact.com/v3/person.enrich", {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${apiKey}`
//         },
//         body: JSON.stringify({
//             // one to identify the contact, others to update
//             "phone": "14128897490",
//             "age": "65"
//         })
//     }).then(function (res) {
//         return res.json();
//     }).then(function (json) {
//         console.log(json);
//     });
// }

// Contacts API
// var express = require("express");

// var app = express();
// app.use(express.json());
// var PORT = process.env.PORT || 3000;

// app.listen(PORT, function () {
//     console.log("App listening on PORT " + PORT);
// });

// const clientId = "FybJxut2EtRKshZJOAnABTOP76Mohn0Z";
// const clientSecret = "gy96gJfYWJquzF5V9sbtwoo4hH0h1CTL";
// //const redirectUri = "https://localhost:3000/redirect";
// const redirectUri = encodeURIComponent ("https://da4ab879.ngrok.io/redirect");

// var fullcontact = require("contacts-api-node")({
//     clientId: clientId,
//     clientSecret: clientSecret,
//     redirectUri: redirectUri,
//     scope: "contacts.read, tags.read",
//     userAgent: "RogerTest2"
// });

// app.get("/", function (req, res) {
//     console.log("app.get /: ", req.query);
// })

// app.get("/redirect", function (req, res) {
//     console.log("app.get /redirect: ", req.query);
// })

// app.post("/redirect", function (req, res) {
//     console.log("app.post /redirect: ", req.query);
// })

// //console.log("FC oauth: " + fullcontact.oauth);
// //console.log ("FC keys: ", Object.keys (fullcontact.oauth));
// //console.log("ATU: " + fullcontact.oauth.urls.accessToken);
// var accessTknUri = fullcontact.oauth.urls.accessToken;
// var accessTkn;

// //testFunc();

// //test ();

// const test = async () => {
//     const res = await fullcontact.oauth.exchangeAuthCode("<code>");
//     console.log("test: ", res);
// };

// async function testFunc() {
//     var realToken = await fullcontact.fetch(accessTknUri).then(function (res) {
//         res.text().then(function (res2) {
//             console.log("R2: " + res2);
//         });
//     });
//     //     const res = await fullcontact.contacts.contacts.get(accessTkn, {
//     //        contactIds: ["abc"]
//     const res = await fullcontact.contacts.contacts.search(accessTkn, {
//         //        searchQuery: "givenName: Roger"
//         //        query: "givenName: Roger"
//         //        query: "Gender: male"
//         //        query: "name.givenName: Roger"
//         //        searchQuery: "name.givenName: Roger"
//         //        "givenName": "Roger"
//         "searchQuery": "first:Roger"
//     }).then(function (res) {
//         console.log("Search result: " + res);
//     }).catch(function (err) {
//         console.log("Search error: " + err);
//     });
// }

// //console.log ("Test: " + test);
// var code;
// //authorize user


// async function authorizeUser () {
//     console.log("fetching user");
//     let url = `https://app.fullcontact.com/oauth/authorize?response_type=code`;
//     url += `client_id=${clientId}&redirect_uri=${redirectUri}&scopes=contacts.read`;
//     let result = await fetch(url, {
//         method: "POST",
//         headers: {
//             "clientId": clientId,
//             "clientSecret": clientSecret,
//             "redirectUri": redirectUri,
//             "scopes": "contacts.read, tags.read"
//         }
//     });
//     console.log ("fetch returns: ", result);
// //    console.log("Result: " + res.size, res.timeout); 
// }
// // ).then(function (res) {
// //     }).catch(function (err) {
// //         console.log("Error: " + err);
// //     });
// // }

// //authorizeUser ().then (() => {
// //    console.log ("auth then");
// //});

// //firstOAuth ();

// async function firstOAuth() {
//     await fetch("https://app.fullcontact.com/oauth/authorize", {
//         method: "POST",
//         headers: {
//             "clientId": clientId,
//             "clientSecret": clientSecret,
//             "redirectUri": redirectUri,
//             "scopes": "contacts.read, tags.read"
//         }
//     }).then(function (res) {
//         code = res.code;
//         console.log("Result: " + res.size, res.timeout);
//         console.log("Keys: " + Object.keys(res));
//     }).catch(function (err) {
//         console.log("Error: " + err);
//     });
// }

// var ClientOAuth2 = require("client-oauth2");

// //auth is an access token, I believe
// var auth = new ClientOAuth2({
//     clientId: clientId,
//     clientSecret: clientSecret,
//     //  accessTokenUri: "https://github.com/login/oauth/access_token",
//     //  authorizationUri: "https://github.com/login/oauth/authorize",
//     redirectUri: "http://localhost:3000/redirect",
//     scopes: ["contacts.read", "tags.read"]
// });

// //console.log ("auth: ", auth);


// async function getFromUri() {
//     thing = await fetch(redirectUri);
// }

// //testContacts ();

// async function testContacts() {
//     console.log("testing");
//     const res = await fullcontact.oauth.exchangeAuthCode(code)
//         .then(function (test) {
//             //do something
//             console.log(res);
//             console.log(test);
//         }).catch(function (err) {
//             console.log("Error:" + err)
//         });
// }