

$(document).ready(function () {
    var currentDate = moment().format("MMMM Do, YYYY");
    console.log(currentDate);
    
    var currentTime = moment().format("LTS");
    console.log(currentTime);

    var timeDisplayTimer;

    
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



    var apiKey = "69cf46c3a095269894ea6a44c7369f49";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Seattle,US&units=imperial&&APPID=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            console.log("City: " + response.name)
            console.log("Country: " + response.sys.country)
            console.log("Description: " + response.weather[0].description)
            console.log("Temperature(F): " + response.main.temp)
            console.log("Wind Speed: " + response.wind.speed + "m/s")
        });




});


