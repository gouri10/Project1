

$(document).ready(function () {

    var timeDisplayTimer;
    var currentDate;
    var currentTime;

    //load Date and time
    var loadDateAndTime = function () {
        currentDate = moment().format("MMMM Do, YYYY");
        $("#currentDate").text(currentDate);

        currentTime = moment().format("LTS");
        $("#currentTime").text(currentTime);

        $("#currentDay").text(moment().format("dddd"));

        timeDisplayTimer = setInterval(updateTime, 1000);
    }

    function updateTime() {
        currentTime = moment().format("LTS");
        $("#currentTime").text(currentTime);

    }

    var loadWeather = function () {

        var apiKey = "69cf46c3a095269894ea6a44c7369f49";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Seattle,US&units=imperial&&APPID=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                $("#currentWeather").text("Temperature(F): " + response.main.temp);
                $("#currentCity").text("City: " + response.name + ", " + response.sys.country);
                $("#currentDescription").text("Weather: " + response.weather[0].description);
                $("#currentWS").text("Wind Speed: " + response.wind.speed + " mph");
            });

    }


    var loadFacts = function () {
        var facts = [];

        var queryURL = "http://numbersapi.com/10/10/date";

        for (var i = 0; i <= 2; i++) {
            // Creates AJAX call for the specific movie button being clicked
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                facts.push(response);
                //    var factsunique=facts;
                //    factsunique.push(response);
                //    facts = factsunique.filter(
                //             function(a){if (!this[a]) {this[a] = 1; return a;}},
                //             {}
                //            );                   
            });
        }
    }
    loadFacts();
    loadWeather();
    loadDateAndTime();

});


