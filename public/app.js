"use strict";

var activePage = window.location.pathname;
var db;
var users = [];

_initFirebase();

renderView();

function _initFirebase() {
  var firebaseConfig = {
    apiKey: "AIzaSyDFB9Kr3k6rI0T_94lO6hcV3pWU_X-XJ5A",
    authDomain: "javascript-293715.firebaseapp.com",
    databaseURL: "https://javascript-293715.firebaseio.com",
    projectId: "javascript-293715",
    storageBucket: "javascript-293715.appspot.com",
    messagingSenderId: "711748984217",
    appId: "1:711748984217:web:10f6e4e39b074cb0a7c708"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  db = firebase.database();
}

function renderView() {
  if (activePage === "/users.html") {
    db.ref("bill-splitter/users/").once("value").then(function (snapshot) {
      users = snapshot.val();
      users.sort(function (a, b) {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
      });

      _renderUsers();
    });
  }
}

function _renderUsers() {
  if (users.length != 0) {
    var list = "";
    users.forEach(function (user, index) {
      list += "<a href=\"#\" class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\" onclick=\"renderUserDetails(".concat(index, ")\">\n          <span>\n            <img src=\"assets/images/").concat(user.avatar, ".jpg\" alt=\"").concat(user.avatar, "\" class=\"custom__user-list--image\" />\n            <span class=\"ml-1 h5\">").concat(user.name, "</span>\n          </span>");

      if (user.amount < 0) {
        list += "<span class=\"badge badge-danger custom__user-list--amount\">$".concat(Math.abs(user.amount).toFixed(2), "</span> ");
      } else if (user.amount > 0) {
        list += "<span class=\"badge badge-success custom__user-list--amount\">$".concat(user.amount.toFixed(2), "</span>");
      } else {
        list += "<span class=\"badge badge-secondary custom__user-list--amount\">$".concat(user.amount.toFixed(2), "</span>");
      }

      list += "</a>";
    });
    document.getElementById("users").innerHTML = list;
  } else {
    document.getElementById("users").innerHTML = "<div class=\"alert alert-warning\" role=\"alert\">No friends found! Add friends now and split your bills easily.</div>";
  }
}

function renderUserDetails(userIndex) {
  var details = "<h3 class=\"card-title\">".concat(users[userIndex].name, "</h3>");

  if (users[userIndex].amount < 0) {
    details += "<p class=\"h4 text-danger\">you owe $".concat(Math.abs(users[userIndex].amount).toFixed(2), "</p>");
  } else if (users[userIndex].amount > 0) {
    details += "<p class=\"h4 text-success\">owes you $".concat(users[userIndex].amount.toFixed(2), "</p>");
  } else {
    details += "<p class=\"h4 text-secondary\">all settled up</p>";
  }

  details += "<p class=\"card-text\">\n      <small class=\"text-muted\">Last expense recorded on ".concat(users[userIndex].date, "</small>\n    </p>");
  document.getElementById("user-details__image").innerHTML = "<img src=\"assets/images/".concat(users[userIndex].avatar, ".jpg\" class=\"card-img\" alt=\"").concat(users[userIndex].avatar, "\"/>");
  document.getElementById("user-details").innerHTML = details;
  document.getElementById("user-details__container").classList.remove("hidden");
}
//# sourceMappingURL=app.js.map
