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
                $("#currentCity").text(response.name + " ," + response.sys.country);
                $("#currentDescription").text(response.weather[0].description);
                $("#currentWS").text("Wind Speed: " + response.wind.speed + "m/s");
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



    loadFacts();
    loadWeather();
    loadDateAndTime();

});


