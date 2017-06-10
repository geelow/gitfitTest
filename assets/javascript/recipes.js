var baseURL = "https://api.edamam.com/search?q="
var appKey = "4cb43262ed46d6be10b05df6cb89da13"
var app_ID = "875f4d15"
var resultCount = 30;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyB_JQagylAT6I5kjHi0lx34v_PTvXMG8Dw",
    authDomain: "gitfit-58bb2.firebaseapp.com",
    databaseURL: "https://gitfit-58bb2.firebaseio.com",
    projectId: "gitfit-58bb2",
    storageBucket: "gitfit-58bb2.appspot.com",
    messagingSenderId: "536732614585"
};
firebase.initializeApp(config);

//set variable to refer to database
var database = firebase.database();

//"child_added" is the wrong event to use for building an array on FB
/*database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    var returnResult = childSnapshot.val().input;

    $("#recentHistory").html("Recent Search: " + returnResult);
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
}); */



//function to clear results field
function resetSearchResults() {
    $("#recipe-input-field").val("");
};
//function to create the search query with users input
function createQuery() {
    var edamamIngredient = $("#recipe-input-field").val().trim()
    return {
        ingredient: edamamIngredient,
        edamamUrl: baseURL + edamamIngredient + "&limit=" + resultCount + "&app_ID" + app_ID + "&app_key=" + appKey,
    }
 //   inputVal = $("#recipe-input-field").val().trim();
   // queryURL = baseURL + inputVal + "&limit=" + resultCount + "&app_ID" + app_ID + "&app_key=" + appKey;
}
//function to allow user to press enter instead of Search
function searchKeypress(event) {
    if (event.keyCode === 13) { //checks whether the pressed key is "Enter"
        onSearchClick();
    }
}

var recentSearches = []
function onSearchClick() {
    $("#recipesRow").empty();
    //edmamam api
    var query = createQuery();
    fetchResults(query.edamamUrl);
    //firebase api
    recentSearches.splice(0, 0, query.ingredient);
    recentSearches = recentSearches.slice(0,4);
    database.ref().set(recentSearches);
    //cleanup
    resetSearchResults();
};

function fetchResults(edamamUrl) {
    $.ajax({
        url: edamamUrl,
        method: "GET"
            // Store all of the retrieved data inside of an object called "response"
    }).done(function(response) {
        if (response.hits.length === 0) return;

        // Log the queryURL
        //console.log(queryURL);
        var resultsElem;
        for (var i = 0; i < Math.min(30, response.hits.length); i++) {
            recipeURL = response.hits[i].recipe.url;
            recipeName = response.hits[i].recipe.label;
            recipeImage = response.hits[i].recipe.image;
            recipeYield = response.hits[i].recipe.yield;
            recipeCalories = Math.floor(response.hits[i].recipe.calories / recipeYield);

            if (recipeCalories < 500) {
                displayImage = "<a class='Recipe' href='" + recipeURL + "' target='_blank'><img src='" + recipeImage + "'/></a>";
                displayURL = "<a class='Recipe' href='" + recipeURL + "' target='_blank'>" + recipeName + "</a>";
                $("#recipesRow").prepend("<div class='recipe-inline'>" + displayImage + "<br>" + displayURL + "<br>Calories Per Serving: " + recipeCalories + "</div>");
            }
        }
    });
};

//On click event to get recipes and list them to the recipesRow div
$(document).ready(function() {
    event.preventDefault();

    $("#recipe-input-field").on("keypress", searchKeypress);

    $("#recipeSearchButton").on("click", onSearchClick);

    database.ref().on("value", function(snapshot) {
            recentSearches = snapshot.val() || []
            var html = ""
            for (var i = 0; i < recentSearches.length; i++) {
                html += recentSearches[i] + " ";
            }
            $("#recentHistoryList").html(html)
    }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
    });

//push data to firebase

});

//voice commands function
/*if (annyang) {
    //defining commands
    var commands = {
        'recipes with *tag': function(tag) {
            console.log(tag);


            createQuery(); 
            $("#recipesRow").empty();
            voiceQuery();
            fetchResults(edamamUrl);
            resetSearchResults();
        }
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. 
    annyang.start();
}
*/