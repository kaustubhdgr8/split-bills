"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  var userIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (activePage === "/users.html") {
    db.ref("bill-splitter/users/").once("value").then(function (snapshot) {
      users = snapshot.val();

      _renderUsers();

      if (userIndex) {
        renderUserDetails(userIndex);
      } else {
        document.getElementById("user-details__container").classList.add("hidden");
      }
    });
  }
}

function _renderUsers() {
  if (users.length != 0) {
    var list = "";

    for (var _i = 0, _Object$entries = Object.entries(users); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          index = _Object$entries$_i[0],
          user = _Object$entries$_i[1];

      list += "<a href=\"#\" class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\" onclick=\"renderUserDetails('".concat(index, "')\">\n          <span>\n            <img src=\"assets/images/").concat(user.avatar, ".jpg\" alt=\"").concat(user.avatar, "\" class=\"custom__user-list--image\" />\n            <span class=\"ml-1 h5\">").concat(user.name, "</span>\n          </span>");

      if (user.amount < 0) {
        list += "<span class=\"badge badge-danger custom__user-list--amount\">$".concat(Math.abs(user.amount).toFixed(2), "</span> ");
      } else if (user.amount > 0) {
        list += "<span class=\"badge badge-success custom__user-list--amount\">$".concat(user.amount.toFixed(2), "</span>");
      } else {
        list += "<span class=\"badge badge-secondary custom__user-list--amount\">$".concat(user.amount.toFixed(2), "</span>");
      }

      list += "</a>";
    }

    document.getElementById("users").innerHTML = list;
  } else {
    document.getElementById("users").innerHTML = "<div class=\"alert alert-warning\" role=\"alert\">No friends found! Add friends now and split your bills easily.</div>";
  }
}

function _randomNumber(gender) {
  var n = Math.floor(Math.random() * (16 - 1 + 1) + 1);

  if (gender === "m") {
    return n % 2 !== 0 ? n : _randomNumber(gender);
  } else if (gender === "f") {
    return n % 2 === 0 ? n : _randomNumber(gender);
  } else {
    return n;
  }
}

function renderUserDetails(userIndex) {
  var details = "<h3 class=\"card-title\">".concat(users[userIndex].name, "</h3>");
  var settleButton = "<a href=\"#\" class=\"btn btn-primary\" onclick=\"settleDues('".concat(userIndex, "')\">Settle</a>");
  var remindButton = "";

  if (users[userIndex].amount < 0) {
    details += "<p class=\"h4 text-danger\">you owe $".concat(Math.abs(users[userIndex].amount).toFixed(2), "</p>");
  } else if (users[userIndex].amount > 0) {
    details += "<p class=\"h4 text-success\">owes you $".concat(users[userIndex].amount.toFixed(2), "</p>");

    if (users[userIndex].number && users[userIndex].number != "") {
      remindButton = "<a href=\"tel:".concat(users[userIndex].number, "\" class=\"btn btn-outline-success\">Remind</a>");
    }
  } else {
    details += "<p class=\"h4 text-secondary\">all settled up</p>";
    settleButton = "";
  }

  details += "<p class=\"card-text\">\n      <small class=\"text-muted\">Last updated on ".concat(users[userIndex].date, "</small>\n    </p>");
  document.getElementById("user-details__image").innerHTML = "<img src=\"assets/images/".concat(users[userIndex].avatar, ".jpg\" class=\"card-img\" alt=\"").concat(users[userIndex].avatar, "\"/>");
  document.getElementById("user-details").innerHTML = details;
  document.getElementById("user-details__cta").innerHTML = "<div class=\"btn-group btn-group-sm\" role=\"group\">\n      ".concat(settleButton, "\n      ").concat(remindButton, "\n    </div>\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <a href=\"#\" class=\"btn btn-outline-primary ml-2\" data-toggle=\"modal\" data-target=\"#form--user\" onclick=\"editUser('").concat(userIndex, "')\">Edit profile</a>\n      <a href=\"#\" class=\"btn btn-outline-danger\" onclick=\"removeUser('").concat(userIndex, "')\">Remove</a>\n    </div>");
  document.getElementById("user-details__container").classList.remove("hidden");
}

function settleDues(userIndex) {
  if (confirm("Do you want to settle all dues?")) {
    db.ref("bill-splitter/users/".concat(userIndex)).update({
      amount: 0,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      settled: true
    });
    renderView(userIndex);
  }
}

function removeUser(userIndex) {
  if (users[userIndex].amount !== 0) {
    alert("There are dues outstanding!\nThe user can't be removed.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref("bill-splitter/users/".concat(userIndex)).remove();
    renderView();
  }
}

function editUser(userIndex) {
  document.getElementById("user-form__title").innerText = "Edit profile";
  document.getElementById("user-form").setAttribute("data-user", userIndex);
  document.getElementById("username").value = users[userIndex].name;
  document.getElementById("number").value = users[userIndex].number;
  document.getElementById("consent").checked = false;

  var _iterator = _createForOfIteratorHelper(document.getElementsByName("gender")),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var radio = _step.value;

      if (radio.value === users[userIndex].gender) {
        radio.checked = true;
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function addUser() {
  document.getElementById("user-form__title").innerText = "Add a friend";
  document.getElementById("user-form").setAttribute("data-user", "");
  document.getElementById("username").value = "";
  document.getElementById("number").value = "";
  document.getElementById("consent").checked = false;

  var _iterator2 = _createForOfIteratorHelper(document.getElementsByName("gender")),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var radio = _step2.value;
      radio.checked = false;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

function submitUserForm() {
  var userIndex = document.getElementById("user-form").getAttribute("data-user");
  var userName = DOMPurify.sanitize(document.getElementById("username").value, {
    ALLOWED_TAGS: []
  });
  var userNumber = DOMPurify.sanitize(document.getElementById("number").value, {
    ALLOWED_TAGS: []
  });
  var gender = "o";

  var _iterator3 = _createForOfIteratorHelper(document.getElementsByName("gender")),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var radio = _step3.value;

      if (radio.checked) {
        gender = radio.value;
        break;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  if (userIndex !== "") {
    var userData = {};
    var infoChanged = false;

    if (userName !== users[userIndex].name) {
      userData.name = userName;
      infoChanged = true;
    }

    if (userNumber !== users[userIndex].number) {
      userData.number = userNumber;
      infoChanged = true;
    }

    if (gender !== users[userIndex].gender) {
      userData.gender = gender;
      userData.avatar = "avatar-" + _randomNumber(gender);
      infoChanged = true;
    }

    if (infoChanged) {
      userData.date = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      db.ref("bill-splitter/users/".concat(userIndex)).update(userData);
      renderView(userIndex);
    }
  } else {
    var key = db.ref().child("bill-splitter").push().key;
    var newUser = {};
    newUser["bill-splitter/users/".concat(key)] = {
      name: userName,
      number: userNumber,
      gender: gender,
      amount: 0,
      avatar: "avatar-" + _randomNumber(gender),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      settled: true
    };
    db.ref().update(newUser);
    renderView();
  }
}
//# sourceMappingURL=app.js.map
