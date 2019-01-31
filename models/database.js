const connFns = require("../config/connection.js");

let iBadOnes = 0;

let aasTagsMain = [
    ['1', '1'],
    ['event', 'event'],
    ['los', 'los'],
    ['mashable', 'mashable'],
    ['PP', 'PP'],
    ['seven-horizons', 'seven-horizons'],
    ['via-ace', 'via-ace'],
    ['x', 'x'],
    ['pp', 'Prodigium'],
    ['coc', 'Cinema of Change'],
    ['dis', 'dis'],
    ['ethn', 'Ethnicity'],
    ['gender', 'gender'],
    ['intellectual', 'intellectual'],
    ['id', 'ideology'],
    ['lang', 'Language spoken'],
    ['loc', 'Location'],
    ['net', 'Shared network'],
    ['team', 'Prodigium worker'],
    ['research', 'Researcher'],
    ['sport', 'Sports pro']
];

let aoTagNames = [];

for (i = 0; i < aasTagsMain.length; i++) {
    aoTagNames.push({
        'sShortName': aasTagsMain[i][0],
        'sLongName': aasTagsMain[i][1]
    });
}
//console.log(aoTagNames[0]);

class AoCats {
    constructor(sCat, asSubCat) {
        this.sIsSubCatOf = sCat;
        this.sThisCat = asSubCat;
    }
}

let aoCatsRead = [];

const fs = require("fs");
let fdCats;

function indexOfByKey(obj_list, key, value) {
    for (index in obj_list) {
        // console.log("iOBK: ", index, obj_list[index][key], value);
        if (obj_list[index][key] === value) return index;
    }
    return -1;
}


// functions for dealing with the categories

function openCatsFile(mode) {
    // if (mode === 'r') {
    // fs.accessSync('categories.txt', fs.constants.F_OK, (err) => {
    //     console.log(`categories.txt ${err ? 'does not exist' : 'exists'}`);
    //     if (err) {
    //         mode = 'w';     // open it for write (makes new one)
    //     }
    //   });
    // }
    fdCats = fs.openSync("categories.txt", mode);
}

function writeCatsFile(aoCats) {
    openCatsFile("w");
    fs.writeFileSync(fdCats, JSON.stringify(aoCats));
    fs.closeSync(fdCats);
}

module.exports.deleteCatsFile = function () {
    fs.unlinkSync('categories.txt', (err) => {
        if (err) throw err;
        console.log('categories file deleted');
    });
}

module.exports.writeFile = function () {
    console.log("wCF: ", aoCatsRead.length);
    console.log("Bad tags: ", iBadOnes);
    writeCatsFile(aoCatsRead);
    iBadOnes = 0;
};

module.exports.readCatsFile = function () {
    openCatsFile("a+");
    const sCats = fs.readFileSync(fdCats, "utf8");
    if (sCats.length) {
        aoCatsRead = JSON.parse(sCats);
    } else {
        aoCatsRead = [];
    }
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
            //console.log ("continue");
            iBadOnes++;
            continue;
        }
        asTag[i] = asTag[i].slice(1); // remove the .
        // replace .. with _
        asTag[i] = asTag[i].replace("..", "_");
        // replace vendors with vendor
        asTag[i] = asTag[i].replace("vendors", "vendor");
        // replace . with _
        asTag[i] = asTag[i].replace(/\./g, "_");

        // tag is now "_cat_subcat_subcat_subcat...
        let asCatSub = asTag[i].split("_"); // Cat in the first element of the array, Subs in the others

        // replace short category names with long
        let iTagPos = indexOfByKey(aoTagNames, 'sShortName', asCatSub[0]);
        // console.log ("iTP: ", iTagPos);
        if (iTagPos >= 0) {
            asCatSub[0] = aoTagNames[iTagPos].sLongName;
            //console.log ("sTS: ", req.body.sValue[0], sSearch);            
        }

        sIsSubCatOf = "";
        for (let j = 0; j < asCatSub.length; j++) { // go through the cats & subCats
            let iCatFound;
            //            if (aoCatsRead.length === 0) {
            //                iCatFound = -1;
            //            } else {
            //                console.log ("calling findIndex");
            iCatFound = aoCatsRead.findIndex(function (element) {
                return (element.sThisCat === asCatSub[j]);
            });
            //            }
            //            console.log ("iCatFound: ", iCatFound);
            if (iCatFound < 0) { // category doesn't exist - add it
                //console.log("Found a new one", asCatSub[j]);
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
        console.log(`Import names done - ${iRows} rows`);
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
                //if (asFirstSplit[i][0] === ".") {
                //    asFirstSplit[i] = asFirstSplit[i].slice(1);
                //}
                // look for .locn and add "intl" if it"s not _USA
                if (asFirstSplit[i].indexOf(".loc_U") < 0) {
                    sTemp = asFirstSplit[i].replace(".loc", "intl");
                } else {
                    sTemp = asFirstSplit[i];
                }
                if (sTemp[0] === '.') { // remove .
                    sTemp = sTemp.slice(1);
                }
                asSecondSplit = asSecondSplit.concat(sTemp.split("_"));
                // replace short names with long
                for (j = 0; j < asSecondSplit.length; j++) {
                    // replace short category names with long
                    let iTagPos = indexOfByKey(aoTagNames, 'sShortName', asSecondSplit[j]);
                    // console.log ("iTP: ", iTagPos);
                    if (iTagPos >= 0) {
                        asSecondSplit[j] = aoTagNames[iTagPos].sLongName;
                        //console.log ("sTS: ", req.body.sValue[0], sSearch);            
                    }
                }
            }
            //console.log ("Calling buildCats");
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
    connFns.insertContact(oContact, aoContacts.length === 0); // iCount 0 except for first call
    iRows++;
    return;
}

module.exports.printRows = function () {
    return iRows;
}
module.exports.importNames = importNames;
module.exports.aoContacts = aoContacts;