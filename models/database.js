const connFns = require("../config/connection.js");

var contactRef;

class AoCats {
    constructor(sCat, asSubCat) {
        this.sIsSubCatOf = sCat;
        this.sThisCat = asSubCat;
    }
}

let aoCatsRead = [];

const fs = require("fs");
let fdCats;

// functions for dealing with the categories

function openCatsFile(mode) {
    fdCats = fs.openSync("categories.txt", mode);
}

function writeCatsFile(aoCats) {
    openCatsFile("w");
    fs.writeFileSync(fdCats, JSON.stringify(aoCats));
    fs.closeSync(fdCats);
}

module.exports.writeFile = function () {
    writeCatsFile(aoCatsRead);
};

module.exports.readCatsFile = function () {
    openCatsFile("r");
    const sCats = fs.readFileSync(fdCats, "utf8");
    aoCatsRead = JSON.parse(sCats);
    fs.closeSync(fdCats);
    return (aoCatsRead);
};

module.exports.findSubCats = function (sCat) {
    let asSubCats = [];
    for (let i = 0; i < aoCatsRead.length; i++) {
        if (aoCatsRead[i].isSubCatOf === sCat) {
            asSubCats.push(acCatsRead.sThisCat);
        }
    }
};

var arrayUnique = function (arr) {
    return arr.filter(function (item, index) {
        return arr.indexOf(item) >= index;
    });
};

function buildCategories(asTag) {
    for (let i = 0; i < asTag.length; i++) {
        // first, clean up the string
        // ignore anything that doesn't begin with .
        if (asTag[i][0] !== ".") {
            continue;
        }
        // replace .. with _
        asTag[i] = asTag[i].replace("..", "_");
        // replace vendors with vendor
        asTag[i] = asTag[i].replace("vendors", "vendor");
        // replace . with _
        asTag[i] = asTag[i].replace(/\./g, "_");

        // tag is now "_cat_subcat_subcat_subcat...
        let asCatSub = asTag[i].split("_"); // Cat in the first element of the array, Subs in the others

        sIsSubCatOf = "";
        for (let j = 0; j < asCatSub.length; j++) { // go through the cats & subCats
            let iCatFound;
            iCatFound = aoCatsRead.findIndex(function (element) {
                return (element.sThisCat === asCatSub[j]);
            });
            if (iCatFound < 0) { // category doesn't exist - add it
                //                console.log("Found a new one", asCatSub[j]);
                aoCatsRead.push(new AoCats(sIsSubCatOf, asCatSub[j]));
            }
            sIsSubCatOf = asCatSub[j];
        }
    }
}

let iRows = 0;
let aoContacts = [];
let iSavedCount;

function importNames(iCount = 0) {
    if (iCount) {
        iSavedCount = iCount;
    }
    if (aoContacts.length === 0) { // done
        console.log (`Import names done - ${iRows} rows`);
//        document.body.style.cursor  = 'default';
        return;
    }
    var oContact = {};
    const nestedContent = aoContacts[0];
    Object.keys(nestedContent[0]).forEach(docTitle => {
        let givenName;
        let sPropName = docTitle.replace(/ /g, "");
        if (docTitle === "Given Name") {
            givenName = nestedContent[0][docTitle];
            oContact.GivenName = givenName;
        } else if (docTitle === "Family Name") {
            oContact.FamilyName = nestedContent[0][docTitle];
        } else if (docTitle === "Group Membership") {
            let asFirstSplit = [];
            let asSecondSplit = [];
            let sValue = nestedContent[0][docTitle];
            asFirstSplit = sValue.split(" ::: ");
            for (let i = 0; i < asFirstSplit.length; i++) {
                let sTemp;
                if (asFirstSplit[i][0] === ".") {
                    asFirstSplit[i] = asFirstSplit[i].slice(1);
                }
                // look for .locn and add "intl" if it"s not _USA
                if (asFirstSplit[i].indexOf(".loc_U") < 0) {
                    sTemp = asFirstSplit[i].replace(".loc", "intl");
                } else {
                    sTemp = asFirstSplit[i];
                }
                asSecondSplit = asSecondSplit.concat(sTemp.split("_"));
            }
            buildCategories(asFirstSplit);
            oContact[sPropName] = arrayUnique(asSecondSplit);
        } else {
            let value = nestedContent[0][docTitle];
            //get rid of %, and the comma after thousands
            value = value.toString().replace(/[%,]/g, "");
            if (nestedContent[0][docTitle] !== "") {
                oContact[sPropName] = value;
            }
        }
    });

    // now put it into the database
    aoContacts.shift(); // remove the one used
    connFns.insertContact(oContact, aoContacts.length === 0);  // iCount 0 except for first call
    iRows++;
    return;
}

module.exports.printRows = function () {
    return iRows;
}
module.exports.importNames = importNames;
module.exports.aoContacts = aoContacts;