
var ff = new Firefeed("https://firefeed.firebaseio.com/", "http://localhost:5000");
function onLogin() {
  ff.login(prompt("Enter username", "Guest"), signedIn);
}
function onLogout() {
  ff.logout(signedOut);
}
function signedIn(err, user) {
  if (err) {
    alert("There was an error while logging in!");
    return;
  }
  showSuggested();
  updateStream();
  $("#login-box").css("display", "none");
  $("#welcome-msg").html("Welcome back to FireFeed, <b>" + user + "</b>!");
  $("#content-box").css("display", "block");
}
function signedOut(err) {
  if (err) {
    alert("There was an error while logging out!");
    return;
  }
  $("#login-box").css("display", "block");
  $("#welcome-msg").html("Welcome to FireFeed!");
  $("#content-box").css("display", "none");
}
function showSuggested() {
  ff.onNewSuggestedUser(function(user) {
    $("<li id='follow" + user + "' />")
        .html(user + " - <a href='#' onclick='followUser(\"" + user + "\");'>Follow</a>")
        .appendTo("#user-list");
  });
}
function updateStream() {
  ff.onNewSpark(function(id, spark) {
    if ($("#default-spark").length) {
      $("#default-spark").remove();
    }
    var elId = "#spark-" + id;
    var innerHTML = "<td>" + spark.author + "</td>" + "<td>" + spark.content + "</td>";
    if ($(elId).length) {
      $(elId).html(innerHTML);
    } else {
      $("#spark-stream tr:last").after($("<tr/>", {id: elId}).html(innerHTML));
    }
  });
}
function followUser(user) {
  ff.follow(user, function(err, done) {
    if (!err) {
      $("#follow" + user).delay(500).fadeOut("slow", function() {
        $(this).remove();
      });
      return;
    }
    alert("Could not follow user! " + err);
  });
}
function onSparkPost() {
  $("post-button").attr("disabled", "disabled");
  ff.post($("#new-spark").val(), function(err, done) {
    showPostedToast(!err);
  });
}
function showPostedToast(success) {
  $("post-button").removeAttr("disabled");

  var toast;
  if (success) {
    $("#new-spark").val("");
    toast = $("<span class='success'/>");
    toast.html("Successfully posted!")
  } else {
    toast = $("<span class='warning'/>");
    toast.html("Error while posting!");
  }
  toast.css("display", "none");

  toast.appendTo($("#submit-box"));
  toast.delay(100).fadeIn("slow", function() {
    $(this).delay(1000).fadeOut("slow", function() {
      $(this).remove();
    });
  });
}