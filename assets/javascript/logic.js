$(document).ready(function () {


var timeDisplayTimer;


   var loadFacts=function(){
   var facts=[];

   var queryURL = "http://numbersapi.com/10/10/date";

   for(var i=0;i<=2;i++)
{
        // Creates AJAX call for the specific movie button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
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

    

   


});