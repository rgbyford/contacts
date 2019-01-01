/* eslint-disable no-unused-vars */
function showSubDept() {
    for (let i = 0; i < aasCinematograpy.length; i++) {
        //        $(`type=checkbox name=${i}`)
        $(".sub-dept").append(`<input type="checkbox" name="cbox" value="${aasCinematograpy[i][0]}">${aasCinematograpy[i][0]}<br>`);
    }
}

$(document).ready(function () {
    // function handleFileSelect(evt) {
    //     // event occurs after file(s) are chosen for import
    //     var files = evt.target.files; // FileList object
    //     // files is a FileList of File objects.
    //     for (var i = 0; files[i] !== undefined; i++) {
    //         cjFns.csvJson(files[i]);
    //     }
    //     //        queryDB();
    // }

    // $("#files").change(function () {
    //     handleFileSelect(event);
    // });

    $("#tag-dept").change(function () {
        sSelectedDept = $("#tag-dept").val();
        if (sSelectedDept === "c") {
            showSubDept();
        }
        //        alert($("#tag-dept").val());
    });

    $("#tag-main").change(function () {
        sSelectedMain = $("#tag-main").val();
        //        alert($("#tag-dept").val());
    });

    //var FCData = require ("./database.js");
    //var fcData = new FCData();

    var aoResults = [{}];

    // $("#search").click(function () {
    //     const buttonInput = {};
    //     buttonInput.sDept = $("#tag-dept").val();
    //     buttonInput.boxes = $("input[name=cbox]:checked");
    //     buttonInput.string = document.getElementById("input-button").value;
    //     var opts = {
    //         method: "POST",
    //         body: JSON.stringify(buttonInput),
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     };
    //     fetch("/contacts/submit", opts).then(function (response) {
    //         location.reload(); // essential to refresh the page
    //     });
    // });

    $(".names").on("click", (function () {
        const id = event.target.id;
        const sPhone = aoResults[id].oContact["Phone1-Value"];
        getContact(sPhone).then(function (resolve, reject) {
            if (reject) {
                throw err;
            }
            if (resolve.status === 404) {
                var sorry = document.createElement("p");
                sorry.textContent = "Sorry.  No image.";
                document.getElementById(id).appendChild(sorry);
            } else {
                var img = document.createElement("img");
                img.src = resolve.avatar;
                img.id = "picture";
                img.width = "150";
                document.getElementById(id).appendChild(img);
                $("#picture").attr("style", "display:block");
            }
            var phone = document.createElement("p");
            phone.textContent = sPhone;
            document.getElementById(id).appendChild(phone);

        });
    }));

    $("#locUSA").click(function () {
        fillUSA();
        sLocUSA = "any";
        sLocIntl = "none";
    });

    $("#locIntl").click(function () {
        $("#tag-loc").empty();
        for (let i = 0; i < aTagsLocIntl.length; i++) {
            $("#tag-loc").append($("<option>")
                .val(aTagsLocIntl[i][0])
                .html(aTagsLocIntl[i][1] === "" ? aTagsLocIntl[i][0] : aTagsLocIntl[i][1]));
        }
        sLocIntl = "any";
        sLocUSA = "none";
    });

    //    document.getElementById("files").addEventListener("change", handleFileSelect, false);

    // $("#tag-loc").empty();
    // for (let i = 0; i < aTagsLocUSA.length; i++) {
    //     $("#tag-loc").append($("<option>")
    //         .val(aTagsLocUSA[i][0])
    //         .html(aTagsLocUSA[i][1] === " ? aTagsLocUSA[i][0] : aTagsLocUSA[i][1])
    //     );
    // }

});

function selectCat(sId, sValue) {
    let obj = {};
    obj.sId = sId;
    obj.sValue = [sValue];
    console.log("selectCat", obj);
    //    console.log("JSON: ", JSON.stringify(obj));
    var opts = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/contacts/select", opts).then(function (response) {
        return (response.text());
    }).then(function (string) {
        // console.log("res: ", string);
        $("body").html(string);
        //        location.reload(); // essential to refresh the page
    });
}

function nextButton(sId) {
    console.log("button: ", `#${sId}`);
    console.log("Select value: ", $(`#${sId}`).val());
    let obj = {};
    obj.sId = sId;
    obj.sValue = $(`#${sId}`).val();
    console.log("selectCat", obj);
    var opts = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/contacts/select", opts).then(function (response) {
        return (response.text());
    }).then(function (string) {
        // console.log("res: ", string);
        $("body").html(string);
        //        location.reload(); // essential to refresh the page
    });
}

function andButton() {
    // make the "previous" para show the selections
    // and "start again" with the select buttons
    console.log("andButton");
    var opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/contacts/and", opts).then(function (response) {
        return (response.text());
    }).then(function (string) {
        // console.log("res: ", string);
        $("body").html(string);
        //        location.reload(); // essential to refresh the page
    });
}

function searchButton() {
    console.log("Search");
    const buttonInput = {};
    //    buttonInput.sDept = $("#tag-dept").val();
    //    buttonInput.boxes = $("input[name=cbox]:checked");
    //    buttonInput.string = document.getElementById("input-button").value;
    var opts = {
        method: "POST",
        body: JSON.stringify(buttonInput),
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/contacts/search", opts).then(function (response) {
        //        location.reload(); // essential to refresh the page
        return (response.text());
    }).then(function (string) {
        // console.log("res: ", string);
        $("body").html(string);
        //        location.reload(); // essential to refresh the page
    });

}


//const uploadFile = (file) => {
const importFile = (event) => {
//    console.log("upload: ", file);
    var formData = new FormData();

//    formData.append("avatar", file);
    formData.append("avatar", event.target.files[0]);
    formData.append("username", "abc123");

    var opts = {
        method: "PUT",
        body: formData
    };
    fetch("/contacts/import", opts).then(function (response) {
        return (response.text());
    }).then(function (string) {
        // console.log("res: ", string);
//        $("body").html(string);
        location.reload(); // essential to refresh the page
    });
};

// const importFile = (event) => {
// //    console.log("iF");
// //    console.log(event);
//     uploadFile(event.target.files[0]);
// };