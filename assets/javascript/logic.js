

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
                $("#currentCity").text("City: " + response.name + " ," + response.sys.country);
                $("#currentDescription").text("Weather: " + response.weather[0].description);
                $("#currentWS").text("Wind Speed: " + response.wind.speed + "m/s");
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
        
    loadArticles();
    loadFacts();
    loadWeather();
    loadDateAndTime();

});


