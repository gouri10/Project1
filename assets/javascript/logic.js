window.onload = function () {

    var apiKey = "73913b50cabd4950b081af4938f71ceb";
    var query1 = "https://api.weatherbit.io/v2.0/forecast/hourly?city=Seattle,US&key=" + apiKey + "&hours=24";
    var date=moment().format("YYYY-MM-DD");    
    var nextdate=moment().add(1, 'days').format("YYYY-MM-DD");
    
    var query2 = "https://api.weatherbit.io/v2.0/history/hourly?city=Seattle,US&start_date="+date+"&end_date="+nextdate+"&tz=local&key=" + apiKey;

    var options = {
        backgroundColor:"transparent",
        
        animationEnabled: true,
        title: {
            // text: "Weather Report Per Hour",
        },
        axisX: {
            interval: 3,
            intervalType: "hour",
            valueFormatString: "hh",
            labelFontColor:"yellow",
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
            lineColor:"yellow",
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

    //load Date and time
    var loadDateAndTime = function () {
        currentDate = moment().format("MMMM Do, YYYY");
        $("#currentDate").text(currentDate +" ("+moment().format("dddd")+")");

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
        var apiKey1="73913b50cabd4950b081af4938f71ceb";
        
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
                $("#humidity").text("Humidity:" +"48%");
            });

    }


    var loadFacts = function () {
        var facts = [];
var dateToday=moment().format("MM/DD");
        var queryURL = "http://numbersapi.com/"+dateToday+"/date";

        for (var i = 0; i <= 3; i++) {
            // Creates AJAX call for the specific movie button being clicked
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                facts.push(response);
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


    // This section builds NYT query URL
    function buildQueryURL() {
        var currentDate = moment().format("YYYY-MM-D");
        console.log(currentDate);
        var apiKey = "&api-key=muGcCiFCyAcrCUHr9wU1tQbNTvHzkFjd";
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=pub_date:(" + currentDate + ")" +apiKey;
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
    
    // clears out article section
    function clear() {
        $("#article-section").empty();
    }
    
    // This section takes all the above functions and calls them together with the ajax
    function loadArticles(){
        clear();
        var queryURL = buildQueryURL();
    
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(updatePage);
    }

    // BIG DAY FEATURE

        // Firebase Call

            // Your web app's Firebase configuration
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


        // Variables
        var month;
        var day;
        var event;
        var eventCounter = "0";
        var placeHolder = $("<li>");

        // Firesbase Pull && Page Update
        firebase.database().ref().on("value", function(snapshot) {
            contents = snapshot.val();
            console.log(contents);
            if (contents == null){
                $("#dates").append("You have no Big Days! Click below to add them!");
                console.log("You have no events!");
            } else {
            eventCounter = snapshot.val().eventCounter.counter;
            console.log("counter: " +eventCounter);
            var results= snapshot.val().events;
            console.log(results);
            $("#dates").empty();
                for (i=1; i<eventCounter+1; i++){
                    event= results[i].eventLog;
                    month = results[i].dateLog[0];
                    day = results[i].dateLog[1];
                    console.log(month);
                    updateCountdown(month, day, event);
            }
            }

        });
        
       
               
        function BigDayLoad(){
            $(".text-center").empty();
            $(".text-center").append("<button class='btn-primary'>Add Your Big Days</button>");
            
            $(".btn-primary").on("click", function(){
                userInput();
                $(".text-center").empty();
            })
        };
       
        // Reveals user input form
        function userInput(){

            $("#userInput").empty();
            displayForm();
            
            // Submit Feature
            $("#submit").on("click", function(){
               // Fetches input 
                month= $("#month").val()-1;
                day= $("#day").val();
                event= $("#event").val();
                checkInput();
            })
        };

        function displayForm(){
            $("#userInput").append("<label class='big-day-input-label' for='event'>Occasion:</label><input type='text' id='event' name='event'></input><br>");
            $("#userInput").append("<label class='big-day-input-label' for='month'>Month:</label><input type='text' id='month'></input><br>");
            $("#userInput").append("<label class='big-day-input-label' for='day'>Day:</label><input type='text' id='day'></input><br>");
            $("#userInput").append("<br><button id='submit'>Submit</button>");
        };


        function checkInput(){
            if (month > "12" || day >"31" || event.length < "1" || event.length >"14"){
                // Inappropriate data response
                month = "0";
                day = "0";
                event = "0";
                $("#userInput").empty();
                displayForm();
                $("#bd-heading").append(" -- ERROR!"); 
                
                // Stores/populates data and hides/resets form
            } else if (month<"12" && day<"32" && month> "0" && day> "0") {
                var date = [month, day];
                eventCounter++;

                // Store in firebase
                fireUpdate(eventCounter, event, date, eventCounter);

                errorReset();
                console.log("Complete");
            }
        };

        function updateCountdown(MM, DD, EV){
            today=new Date();
            const saveDate=new Date(today.getFullYear(), MM, DD);
            const one_day=1000*60*60*24;
            countdown = Math.ceil((saveDate.getTime()-today.getTime())/(one_day))

            if (countdown > 0){
                placeHolder.append(countdown +" days left until your " +EV +"!</li> <br>");
                console.log(countdown +" days left until " +EV +"!");
                $("#dates").append(placeHolder);
                placeHolder=$("<li>");
            }else if(countdown == 0) {
                placeHolder.append("It's your " +EV +"!</li> <br>");
                console.log("It's your " +EV +"!");
                $("#dates").append(placeHolder);
                placeHolder=$("<li>");
            }else {
                saveDate.setFullYear(saveDate.getFullYear()+1); 
                countdown = Math.ceil((saveDate.getTime()-today.getTime())/(one_day));
                placeHolder.append(countdown +" days left until your " +EV +"!</li> <br>");
                console.log(countdown +" days left until " +EV +"!");
                $("#dates").append(placeHolder);
                placeHolder=$("<li>");
            }
        }

        function errorReset(){
            // Hide user input--Reset error
            $("#userInput").empty();
            $("#bd-heading").empty(); 
            $("#bd-heading").append("Your Bid Days"); 
        }

        function fireUpdate(eventTitle, data1, data2, data3){
            var userInputRef = firebase.database().ref("events/" +eventTitle +"/");
            userInputRef.set ({
                eventLog: data1,
                dateLog: data2
            })
            var userInputRef = firebase.database().ref("eventCounter/");
            userInputRef.set ({
                counter: data3
            })
        };
        
    loadArticles();
    BigDayLoad();
    loadFacts();
    loadWeather();
    loadDateAndTime();

});


