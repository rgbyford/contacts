/* eslint-disable no-unused-vars */

console.log("index.js");
var aoResults = [{}];

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
        //console.log (string);
        $("body").html(string);
        //location.reload(); // essential to refresh the page
    });
}

$(".names").on("click"), (function () {
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
});


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

const importFile = (event) => {
    var formData = new FormData();
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