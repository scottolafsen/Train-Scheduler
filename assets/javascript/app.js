$(document).ready(function () {
    var trainName = "";
    var destination = "";
    var firstTrain = 0;
    var frequency = "";

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDzHLgg_mi3XZCQuBeqB5NBrbeOJuwKabY",
        authDomain: "scottyofour.firebaseapp.com",
        databaseURL: "https://scottyofour.firebaseio.com",
        projectId: "scottyofour",
        storageBucket: "scottyofour.appspot.com",
        messagingSenderId: "711664229402"
      };
      firebase.initializeApp(config);
    var database = firebase.database();

      ///  Capture User Input on Form
    $("#submit").on("click", function (event) {
        event.preventDefault();
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();
        $("#train-name, #destination, #first-train, #frequency").val("");
        /// Sending input to firebase Database
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });
    /// Listener for database changes
    database.ref().on("child_added", function(snapshot) {
        // Log everything that's coming out of snapshot
        console.log(snapshot.val());
        console.log(snapshot.val().trainName);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().firstTrain);
        console.log(snapshot.val().frequency);
        /// Calculating Next train and minutes away
        var firstTimeConverted = moment(snapshot.val().firstTrain, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % snapshot.val().frequency;
        var tMinutesTillTrain = snapshot.val().frequency - tRemainder;
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
       /// Printing data children to html table
        $("#trains").append("<tr class='well'><td class='train-name'> " + snapshot.val().trainName +
    " </td><td class='destination'> " + snapshot.val().destination +
    " </td><td class='frequency'> " + snapshot.val().frequency +
    " </td><td class='next-arrival'> " + moment(nextTrain).format("hh:mm") +
    " </td><td class='minutes-away'> " + tMinutesTillTrain +
    " </td></tr>");
   

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


});