/* eslint-disable no-unused-vars */

console.log("index.js");
var aoResults = [{}];

//$(document).ready(function () {
    function initSocket () {
    var socket = io.connect();
    console.log(socket);
    //}

    //    });
    socket.on('connect', () => {
        console.log("Socket connected: ", socket.id); // 'G5p5...'
    });

    socket.on('news', (data) => {
        //    var message = event.data;
        console.log("Socket received: ", data);
        if (data.something === 'something') {
            console.log("something");
            var opts = {
                method: "GET"
            };
            console.log("fetch loaded");
            fetch("/loaded", opts).then(function (response) {
                return (response.text());
            }).then(function (string) {
                // console.log("res: ", string);
                $("body").html(string);
                //location.reload(); // essential to refresh the page
            });
            socket.close();
        }
        socket.emit('my other event', {
            my: 'data'
        });
    });
}

//});



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

function nameClick (sId) {
//$(".names").on("click"), (function () {
//    const obj.sId= event.target.id;
    //const sPhone = aoResults[id].oContact["Phone1-Value"];
    console.log ("clicked ", sId);
    let obj = {};
    obj.sId = sId;
    var opts = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/contacts/nameClicked", opts).then(function (response) {
        return (response.text());
    }).then(function (string) {
        //console.log (string);
        $("body").html(string);
        //location.reload(); // essential to refresh the page
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

//$("#files").on("click"), (function () {
function importFile(event) {
    console.log("load button");
    //        document.getElementById("page").style.cursor = "wait";
    let formData = new FormData();
    let bClearDB = $('#clearDB:checked').val();
    let bClearCats = $('#clearCats:checked').val();

    formData.append("avatar", event.target.files[0]);
    formData.append("clearDB", bClearDB);
    formData.append("clearCats", bClearCats);
    initSocket ();

    var opts = {
        method: "PUT",
        body: formData
    };
    fetch("/contacts/import", opts).then(function (response) {
        return (response.text());
    }).then(function (string) {
        // console.log("res: ", string);
        //        $("body").html(string);
        //location.reload(); // essential to refresh the page
    });
    $("#loading").html("Loading");
    $("#searchPageButton").hide();
}