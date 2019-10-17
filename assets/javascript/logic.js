window.onload = function () {

    // var apiKey = "73913b50cabd4950b081af4938f71ceb";
    var apiKey = "b23f58cf877046d29a4ea9c055890aaf";
    var query1 = "https://api.weatherbit.io/v2.0/forecast/hourly?city=Seattle,US&key=" + apiKey + "&hours=24";
    var date = moment().format("YYYY-MM-DD");
    var nextdate = moment().add(1, 'days').format("YYYY-MM-DD");

    var query2 = "https://api.weatherbit.io/v2.0/history/hourly?city=Seattle,US&start_date=" + date + "&end_date=" + nextdate + "&tz=local&key=" + apiKey;

    var options = {
        backgroundColor: "transparent",

        animationEnabled: true,
        title: {
            // text: "Weather Report Per Hour",
        },
        axisX: {
            interval: 3,
            intervalType: "hour",
            valueFormatString: "hh",
            labelFontColor: "yellow",
            // gridThickness: 0,
            // lineThickness: 0,
            // tickLength: 0,
            // labelFormatter: function () {
            //     return " ";
            // }
        },
        axisY: {
            gridThickness: 0,
            lineThickness: 0,
            tickLength: 0,
            labelFormatter: function () {
                return " ";
            }
        },

        data: [{
            lineColor: "yellow",
            type: "area",
            color: "#F0E68C",
            toolTipContent: "At {label} Hours: {y} Degrees Celsius",
            dataPoints: [],

        }]
    };

    $.ajax({
        url: query2,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            var pasthours = moment().format("HH");
            var futurehours = response.data.length - pasthours;
            for (var i = 0; i <= pasthours; i++) {
                options.data[0].dataPoints.push({ label: moment(response.data[i].timestamp_local).format("hh A"), y: response.data[i].temp });

            }
            $.ajax({
                url: query1,
                method: "GET"
            })
                .then(function (response1) {
                    console.log(response1);
                    for (var i = 0; i < futurehours - 1; i++) {
                        options.data[0].dataPoints.push({ label: moment(response1.data[i].timestamp_local).format("hh A"), y: response1.data[i].temp });

                    }

                    $("#chartContainer").CanvasJSChart(options);

                });
        });
}

$(document).ready(function () {

    var timeDisplayTimer;
    var currentDate;
    var currentTime;



    var firebaseConfig = {
        apiKey: "AIzaSyB0L_zmqWF5nPq7AjgyOuh6LvMMBPpltz8",
        authDomain: "daydashboard.firebaseapp.com",
        databaseURL: "https://daydashboard.firebaseio.com",
        projectId: "daydashboard",
        storageBucket: "daydashboard.appspot.com",
        messagingSenderId: "601335236816",
        appId: "1:601335236816:web:d14de5c8167c18efb676d5"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    if (sessionStorage.length > 0) {

        var userName = sessionStorage.getItem("name");
        var email = sessionStorage.getItem("email");
        var userAddedEmail = sessionStorage.getItem("userAddedEmail");
        var tasksRef = firebase.database().ref("users/" + userAddedEmail + "/tasks/");
        var factsRef = firebase.database().ref("users/" + userAddedEmail + "/facts/");
        var bigDaysRef = firebase.database().ref("users/" + userAddedEmail + "/bigDays/");

    }

    for (var i = 1; i < 13; i++) {
        $("#inputMonth").append("<option>" + i + "</option>");
    }

    for (var i = 1; i < 32; i++) {
        $("#inputDay").append("<option>" + i + "</option>");
    }



    //load Date and time
    var loadDateAndTime = function () {
        if (sessionStorage.length > 0) {

            userName = sessionStorage.getItem("name");
            email = sessionStorage.getItem("email");
            userAddedEmail = sessionStorage.getItem("userAddedEmail");
            taskRef = firebase.database().ref("users/" + userAddedEmail + "/tasks/");

            $("#dashBoardheader").text("Hello " + userName);
        }


        currentDate = moment().format("MMMM Do, YYYY");
        $("#currentDate").text(currentDate + " (" + moment().format("dddd") + ")");

        currentTime = moment().format("LTS");
        $("#currentTime").text(currentTime);

        timeDisplayTimer = setInterval(updateTime, 1000);

    }

    function updateTime() {
        currentTime = moment().format("LTS");
        $("#currentTime").text(currentTime);

    }

    var loadWeather = function () {

        var apiKey = "69cf46c3a095269894ea6a44c7369f49";
        var apiKey1 = "73913b50cabd4950b081af4938f71ceb";

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Seattle,US&units=imperial&&APPID=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                $("#currentWeather").text(response.main.temp + "F");
                $("#currentCity").text(response.name + ", " + response.sys.country);
                $("#currentDescription").text(response.weather[0].description);
                $("#currentWS").text("Wind Speed: " + response.wind.speed + " mph");
                $("#humidity").text("Humidity:" + "48%");
            });

    }


    var loadFacts = function () {

        var dateToday = moment().format("MM/DD");
        var queryURL = "https://numbersapi.com/" + dateToday + "/date";
        for (var i = 0; i <= 3; i++) {
            // Creates AJAX call for the specific movie button being clicked
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                $("#coolfacts").append($("<li>").text(response));
                //    var factsunique=facts;
                //    factsunique.push(response);
                //    facts = factsunique.filter(
                //             function(a){if (!this[a]) {this[a] = 1; return a;}},
                //             {}
                //            );                   
            });
        }
    }

    function fireBaseUserDataUpdate(type, obj) {
        var userDataRef = firebase.database().ref("users/" + userAddedEmail + "/" + type + "/");
        if (type === "tasks") {
            userDataRef.push({
                task: obj.task,
                isDaily: obj.isDaily,
                checked: false
            })
        }
        if (type === "bigDays") {
            userDataRef.push({
                occasion: obj.occasion,
                month: obj.month,
                date: obj.date
            })
        }
        if (type === "facts") {
            userDataRef.push({
                fact: obj.fact,
                user: obj.user
            })
        }

    };


    $("#addTask").on("click", function (event) {
        event.preventDefault();
        var task=$("#task").val();
        var checked = $("input[name='taskType']:checked").val();
        var isdailyInput = false;
        if (checked === "daily") {
            isdailyInput = true;
        }
        else {
            isdailyInput = false;
        }
        if(task!=="")
        {
        var taskObj = { task: task, isDaily: isdailyInput };
        fireBaseUserDataUpdate("tasks", taskObj)
        $("#task").val("");
        }
    })


    tasksRef.on("child_added", function (snapshot) {
        var sv = snapshot.val();
        var task = sv.task;
        var isDaily = sv.isDaily;
        var checked = sv.checked;

        if (isDaily === false) {
            var checkBoxInput = $('<label/>').addClass("todoLabel").html(task)
                .prepend($('<input/>').attr({ type: 'checkbox', class: 'checkbox' }));
            $("#onetime-tasks").append(checkBoxInput);
        }
        else {
            var checkBoxInput = $('<label/>').addClass("todoLabel").html(task)
                .prepend($('<input/>').attr({ type: 'checkbox', class: 'checkbox' }));
            $("#daily-tasks").append(checkBoxInput);
        }

    });


    $("#addFactBtn").on("click", function (event) {
        event.preventDefault();
        var userFact = $("#inputAddFact").val();
        var user = userName;

        if (userFact !== "") {
            var factObj = { fact: userFact, user: user };
            fireBaseUserDataUpdate("facts", factObj);
            $("#inputAddFact").val("");
        }

    })

    factsRef.on("child_added", function (snapshot) {
        var sv = snapshot.val();
        console.log(sv);
        var fact = sv.fact;
        var user = sv.user;

        var newFact = $("<li>");
        newFact.text(fact + " (" + user + ")");
        $("#userfacts").append(newFact);

    });



    $("#addBigDayBtn").on("click", function (event) {
        event.preventDefault();
        var occasion = $("#inputAddBigDay").val();
        var month = $("#inputMonth").val();
        var day = $("#inputDay").val();

        if (occasion !== "") {
            var occasionObj = { occasion: occasion, month: month, date: day };
            fireBaseUserDataUpdate("bigDays", occasionObj);
            $("#inputAddBigDay").val("");
        }

    })

    bigDaysRef.on("child_added", function (snapshot) {
        var sv = snapshot.val();
        var occasion = sv.occasion;
        var month = sv.month;
        var date = sv.date;

        today = new Date();
        const saveDate = new Date(today.getFullYear(), month, date);
        const one_day = 1000 * 60 * 60 * 24;
        countdown = Math.ceil((saveDate.getTime() - today.getTime()) / (one_day));
        var newOccasion = $("<li>");

        if (countdown > 0) {
            newOccasion.text(countdown + " days more to go for your " + occasion + "!");
            $("#dates").append(newOccasion);
        } else if (countdown == 0) {
            newOccasion.text("It's your " + occasion);
            $("#dates").append(newOccasion);
        } else {
            saveDate.setFullYear(saveDate.getFullYear() + 1);
            countdown = Math.ceil((saveDate.getTime() - today.getTime()) / (one_day));
            newOccasion.text(countdown + " days more to go for your " + occasion + "!");
            $("#dates").append(newOccasion);
        }

    });



    // This section builds NYT query URL
    function buildQueryURL() {
        var currentDate = moment().format("YYYY-MM-D");
        console.log(currentDate);
        var apiKey = "&api-key=muGcCiFCyAcrCUHr9wU1tQbNTvHzkFjd";
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=pub_date:(" + currentDate + ")" + apiKey;
        console.log("---------------\nURL: " + queryURL + "\n---------------");
        return queryURL;
    }

    // This section imports/builds the articles on page
    function updatePage(NYTData) {
        var numArticles = 10;

        console.log(NYTData);
        console.log("------------------------------------");

        for (var i = 0; i < numArticles; i++) {
            var article = NYTData.response.docs[i];
            var articleCount = i + 1;
            var $articleList = $("<ul>");

            $articleList.addClass("list-group");
            $("#article-section").append($articleList);

            var headline = article.headline;
            var $articleListItem = $("<li class='list-group-item articleHeadline'>");

            // if (headline && headline.main) {
            //     console.log(headline.main);
            //     $articleListItem.append(
            //     "<span class='label label-primary'>" +
            //         articleCount +
            //         "</span>" +
            //         headline.main 
            //     );
            // }

            if (headline && headline.main) {
                console.log(headline.main);
                $articleListItem.append(
                    headline.main
                );
            }

            var byline = article.byline;

            if (byline && byline.original) {
                console.log(byline.original);
                $articleListItem.append("<h5>" + byline.original + "</h5>");
            }

            var section = article.section_name;
            console.log(article.section_name);
            if (section) {
                $articleListItem.append("<h5>Section: " + section + "</h5>");
            }


            $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
            console.log(article.web_url);
            $articleList.append($articleListItem);
        }
    }

    $("#signoutBtn").on("click", function () {
        //firebase.auth().signOut();
        sessionStorage.clear();
        window.location.replace("index.html");
    });

    // clears out article section
    function clear() {
        $("#article-section").empty();
    }

    // This section takes all the above functions and calls them together with the ajax
    function loadArticles() {
        clear();
        var queryURL = buildQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(updatePage);
    }



    loadFacts();
    loadArticles();
    loadWeather();
    loadDateAndTime();

});
