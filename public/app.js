"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var activePage = window.location.pathname;
var db, users, groups, categories;
var INPUT_ALLOWED_TAGS = {
  ALLOWED_TAGS: []
};

_initFirebase();

fetchData();

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

function fetchData() {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var fetchUsers = new Promise(function (resolve, reject) {
    db.ref("bill-splitter/users/").once("value").then(function (snapshot) {
      users = snapshot.val();
      resolve();
    });
  });
  var fetchGroups = new Promise(function (resolve, reject) {
    db.ref("bill-splitter/groups/").once("value").then(function (snapshot) {
      groups = snapshot.val();
      resolve();
    });
  });
  Promise.allSettled([fetchUsers, fetchGroups]).then(function () {
    _renderView(index);
  });
  db.ref("bill-splitter/categories/").once("value").then(function (snapshot) {
    categories = snapshot.val();
  });
}

function _renderView() {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (activePage === "/users.html") {
    _renderUsers();

    if (index) {
      renderUserDetails(index);
    } else {
      document.getElementById("user-details__container").classList.add("hidden");
    }
  } else if (activePage === "/groups.html") {
    _renderGroups();

    if (index) {
      renderGroupDetails(index);
    } else {
      document.getElementById("group-details__container").classList.add("hidden");
    }
  } else {
    _renderDashboard();
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
    document.getElementById("users").innerHTML = "<div class=\"alert alert-warning\" role=\"alert\">No friends yet! Add friends now and split your bills easily.</div>";
  }

  _renderDuesAlert();
}

function _renderGroups() {
  if (groups.length != 0) {
    var list = "";

    for (var _i2 = 0, _Object$entries2 = Object.entries(groups); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          index = _Object$entries2$_i[0],
          group = _Object$entries2$_i[1];

      list += "<a href=\"#\" class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\" onclick=\"renderGroupDetails('".concat(index, "')\">\n          <span>\n            <img src=\"assets/icons/").concat(group.type, ".svg\" alt=\"").concat(group.type, " icon\" class=\"custom__group-list--image\" />\n            <span class=\"ml-3 h5\">").concat(group.name, " </span>\n            <span class=\"badge badge-").concat(group.settled ? "secondary" : "primary", "\" style=\"font-size: small;\">$").concat(_totalExpense(index).toFixed(2), "</span>\n          </span>\n          <small class=\"text-muted\">").concat(group.settled ? "Settled up" : "Pending", "</small>\n      </a>");
    }

    document.getElementById("groups").innerHTML = list;
  } else {
    document.getElementById("groups").innerHTML = "<div class=\"alert alert-warning\" role=\"alert\">No groups found! Add a group now and record your expenses.</div>";
  }

  _renderDuesAlert();
}

function _renderDashboard() {
  var title = document.getElementById("dashboard__title");
  var usersContainer = document.getElementById("dashboard__list--users");
  var groupsContainer = document.getElementById("dashboard__list--groups");

  var amount = _calculateTotal();

  var usersList = "<ul class=\"list-group list-group-flush\">";
  var groupsList = "<ul class=\"list-group list-group-flush\">";

  if (amount < 0) {
    title.innerHTML = "You owe your friend(s) <span class=\"display-4\">$".concat(Math.abs(amount.toFixed(2)), "!</span>");
    title.classList.add("text-danger");
  } else if (amount > 0) {
    title.innerHTML = "Your friend(s) owe you <span class=\"display-4\">$".concat(amount.toFixed(2), "!</span>");
    title.classList.add("text-success");
  } else {
    title.innerHTML = "Everything is settled up!";
  }

  for (var _i3 = 0, _Object$entries3 = Object.entries(users); _i3 < _Object$entries3.length; _i3++) {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
        index = _Object$entries3$_i[0],
        user = _Object$entries3$_i[1];

    if (!user.settled) {
      usersList += "\n        <li class=\"list-group-item d-flex justify-content-between\">\n          <span>".concat(user.name, "</span>\n          <span class=\"").concat(user.amount < 0 ? "text-danger" : "text-success", "\">$").concat(Math.abs(user.amount.toFixed(2)), "</span>\n        </li>\n      ");
    }
  }

  usersList += "<ul>";

  for (var _i4 = 0, _Object$entries4 = Object.entries(groups); _i4 < _Object$entries4.length; _i4++) {
    var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
        _index = _Object$entries4$_i[0],
        group = _Object$entries4$_i[1];

    if (!group.settled) {
      groupsList += "<li class=\"list-group-item\"><a href=\"/groups.html\">".concat(group.name, "</a></li>");
    }
  }

  groupsList += "<ul>";
  usersContainer.innerHTML = usersList;
  groupsContainer.innerHTML = groupsList;
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

function _todayDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function _totalExpense(groupIndex) {
  var total = 0;

  if (groups[groupIndex].activity) {
    for (var _i5 = 0, _Object$entries5 = Object.entries(groups[groupIndex].activity); _i5 < _Object$entries5.length; _i5++) {
      var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
          index = _Object$entries5$_i[0],
          activity = _Object$entries5$_i[1];

      total += parseFloat(activity.amount);
    }
  }

  return total;
}

function _calculateTotal() {
  var amount = 0;

  if (users.length !== 0) {
    for (var _i6 = 0, _Object$entries6 = Object.entries(users); _i6 < _Object$entries6.length; _i6++) {
      var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i6], 2),
          index = _Object$entries6$_i[0],
          user = _Object$entries6$_i[1];

      if (!user.settled) {
        amount += user.amount;
      }
    }
  }

  return amount;
}

function _renderDuesAlert() {
  var container = document.getElementById("totalDuesAlert");

  var amount = _calculateTotal();

  if (amount < 0) {
    container.innerHTML = "You have to pay <span class=\"h5\">$".concat(Math.abs(amount.toFixed(2)), "</span>. This amount is the total of all the dues for all the pending (non-settled) groups.");
    container.classList.add("alert-danger");
  } else if (amount > 0) {
    container.innerHTML = "You are owed <span class=\"h5\">$".concat(amount.toFixed(2), "</span>. This amount is the total of all the dues for all the pending (non-settled) groups.");
    container.classList.add("alert-success");
  } else {
    container.innerHTML = "Everything is settled up!";
    container.classList.add("alert-secondary");
  }
}

function renderUserDetails(userIndex) {
  var user = users[userIndex];
  var details = "<h3 class=\"card-title\">".concat(user.name, "</h3>");
  var settleButton = "<a href=\"#\" class=\"btn btn-primary\" onclick=\"settleDues('".concat(userIndex, "')\">Settle</a>");
  var remindButton = "";
  var memberGroups = "";

  if (user.amount < 0) {
    details += "<p class=\"h4 text-danger\">you owe $".concat(Math.abs(user.amount).toFixed(2), "</p>");
  } else if (user.amount > 0) {
    details += "<p class=\"h4 text-success\">owes you $".concat(user.amount.toFixed(2), "</p>");

    if (user.number && user.number != "") {
      remindButton = "<a href=\"tel:".concat(user.number, "\" class=\"btn btn-outline-success\">Remind</a>");
    }
  } else {
    details += "<p class=\"h4 text-secondary\">all settled up</p>";
    settleButton = "";
  }

  details += "<p class=\"card-text\">\n      <small class=\"text-muted\">Last updated on ".concat(user.date, "</small>\n    </p>");

  for (var _i7 = 0, _Object$entries7 = Object.entries(groups); _i7 < _Object$entries7.length; _i7++) {
    var _Object$entries7$_i = _slicedToArray(_Object$entries7[_i7], 2),
        index = _Object$entries7$_i[0],
        group = _Object$entries7$_i[1];

    if (group.users) {
      for (var _i8 = 0, _Object$entries8 = Object.entries(group.users); _i8 < _Object$entries8.length; _i8++) {
        var _Object$entries8$_i = _slicedToArray(_Object$entries8[_i8], 2),
            gUserIndex = _Object$entries8$_i[0],
            groupUser = _Object$entries8$_i[1];

        if (gUserIndex === userIndex) {
          memberGroups += "<li class=\"list-group-item\">\n              <a href=\"/groups.html\">\n                ".concat(group.name, "\n              </a>\n              <small class=\"text-muted\">(").concat(group.settled ? "settled up" : "pending", ")</small>\n            </li>");
          break;
        }
      }
    }
  }

  if (memberGroups === "") {
    memberGroups = "<div class=\"alert alert-primary\" role=\"alert\">".concat(user.name, " does not belong to any group yet.</div>");
  }

  document.getElementById("user-details__image").innerHTML = "<img src=\"assets/images/".concat(user.avatar, ".jpg\" class=\"card-img\" alt=\"").concat(user.avatar, "\"/>");
  document.getElementById("user-details").innerHTML = details;
  document.getElementById("user-details__groups").innerHTML = memberGroups;
  document.getElementById("user-details__cta").innerHTML = "<div class=\"btn-group btn-group-sm\" role=\"group\">\n      ".concat(settleButton, "\n      ").concat(remindButton, "\n    </div>\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <a href=\"#\" class=\"btn btn-outline-primary ml-2\" data-toggle=\"modal\" data-target=\"#form--user\" onclick=\"editUser('").concat(userIndex, "')\">Edit profile</a>\n      <a href=\"#\" class=\"btn btn-outline-danger\" onclick=\"removeUser('").concat(userIndex, "')\">Remove</a>\n    </div>");
  document.getElementById("user-details__container").classList.remove("hidden");
}

function addUser() {
  document.getElementById("user-form__title").innerText = "Add a friend";
  document.getElementById("user-form").setAttribute("data-user", "");
  document.getElementById("username").value = "";
  document.getElementById("number").value = "";
  document.getElementById("consent").checked = false;

  var _iterator = _createForOfIteratorHelper(document.getElementsByName("gender")),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var radio = _step.value;
      radio.checked = false;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function editUser(userIndex) {
  var user = users[userIndex];
  document.getElementById("user-form__title").innerText = "Edit profile";
  document.getElementById("user-form").setAttribute("data-user", userIndex);
  document.getElementById("username").value = user.name;
  document.getElementById("number").value = user.number;
  document.getElementById("consent").checked = false;

  var _iterator2 = _createForOfIteratorHelper(document.getElementsByName("gender")),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var radio = _step2.value;

      if (radio.value === user.gender) {
        radio.checked = true;
        break;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

function removeUser(userIndex) {
  if (users[userIndex].amount !== 0) {
    alert("There are dues outstanding!\nThe user can't be removed.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref("bill-splitter/users/".concat(userIndex)).remove();
    fetchData();
  }
}

function settleDues(userIndex) {
  if (confirm("Do you want to settle all dues?")) {
    db.ref("bill-splitter/users/".concat(userIndex)).update({
      amount: 0,
      date: _todayDate(),
      settled: true
    });
    fetchData(userIndex);
  }
}

function renderGroupDetails(groupIndex) {
  var group = groups[groupIndex];
  document.getElementById("group-header").innerHTML = "<div class=\"d-flex flex-nowrap justify-content-between align-items-center\">\n      <h3 class=\"card-title mb-0\">\n        ".concat(group.name, "\n        <small class=\"text-muted\" style=\"font-size: initial;\">(").concat(group.settled ? "settled up" : "pending", ")</small>\n      </h3>\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <a href=\"#\" class=\"btn btn-outline-primary ml-2\" data-toggle=\"modal\" data-target=\"#form--group\" onclick=\"editGroup('").concat(groupIndex, "')\">Edit</a>\n        <a href=\"#\" class=\"btn btn-outline-danger\" onclick=\"removeGroup('").concat(groupIndex, "')\">Delete</a>\n      </div>\n    </div>\n    <p class=\"card-text\">\n      <small class=\"text-muted\">Last updated on ").concat(group.date, "</small>\n    </p>");
  document.getElementById("group-details--tabs").innerHTML = "<ul class=\"nav nav-tabs\">\n      <li class=\"nav-item\">\n        <a class=\"nav-link active\" href=\"#\" id=\"tab--friend\" onclick=\"activateTab(this, '".concat(groupIndex, "')\">\n          Friends\n          <span class=\"badge badge-").concat(group.settled ? "secondary" : "primary", "\">\n            ").concat(group.users ? Object.keys(group.users).length : 0, "\n          </span>\n        </a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" href=\"#\" id=\"tab--activity\" onclick=\"activateTab(this, '").concat(groupIndex, "')\">\n          Activity\n          <span class=\"badge badge-").concat(group.settled ? "secondary" : "primary", "\">\n            ").concat(group.activity ? Object.keys(group.activity).length : 0, "\n          </span>\n        </a>\n      </li>\n      <!-- <li class=\"nav-item\">\n        <a class=\"nav-link\" href=\"#\" id=\"tab--chart\" onclick=\"activateTab(this, '").concat(groupIndex, "')\">Chart</a>\n      </li> -->\n    </ul>");
  document.getElementById("group-details").innerHTML = "";
  var ctaButtons = "";

  if (group.users) {
    ctaButtons += "<button class=\"btn btn-primary btn-sm mr-2\" data-toggle=\"modal\" data-target=\"#form--expense\" onclick=\"addExpense('".concat(groupIndex, "')\">Record expense</button>");
  }

  document.getElementById("group-details__cta").innerHTML = "".concat(ctaButtons, "\n    <button class=\"btn btn-outline-primary btn-sm\" data-toggle=\"modal\" data-target=\"#form--member\" onclick=\"addGroupUser('").concat(groupIndex, "')\">Add new member</button>");
  document.getElementById("group-details__container").classList.remove("hidden");

  _renderGroupUsers(groupIndex);
}

function addGroup() {
  document.getElementById("group-form__title").innerText = "Create a new group";
  document.getElementById("group-form").setAttribute("data-group", "");
  document.getElementById("groupname").value = "";
  document.getElementById("groupconsent").checked = false;

  var _iterator3 = _createForOfIteratorHelper(document.getElementsByName("grouptype")),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var radio = _step3.value;
      radio.checked = false;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}

function editGroup(groupIndex) {
  var group = groups[groupIndex];
  document.getElementById("group-form__title").innerText = "Edit group details";
  document.getElementById("group-form").setAttribute("data-group", groupIndex);
  document.getElementById("groupname").value = group.name;
  document.getElementById("groupconsent").checked = false;

  var _iterator4 = _createForOfIteratorHelper(document.getElementsByName("grouptype")),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var radio = _step4.value;

      if (radio.value === group.type) {
        radio.checked = true;
        break;
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
}

function removeGroup(groupIndex) {
  if (!groups[groupIndex].settled) {
    alert("There are dues outstanding!\nThe group can't be deleted.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref("bill-splitter/groups/".concat(groupIndex)).remove();
    fetchData();
  }
}

function addGroupUser(groupIndex) {
  document.getElementById("member-form").setAttribute("data-group", groupIndex);
  var multiselect = document.getElementById("user-multiselect");
  var options = document.querySelectorAll("#user-multiselect option");
  options.forEach(function (o) {
    return o.remove();
  });

  for (var _i9 = 0, _Object$entries9 = Object.entries(users); _i9 < _Object$entries9.length; _i9++) {
    var _Object$entries9$_i = _slicedToArray(_Object$entries9[_i9], 2),
        index = _Object$entries9$_i[0],
        user = _Object$entries9$_i[1];

    multiselect.options[multiselect.options.length] = new Option(user.name, index, false);
  }
}

function removeGroupUser(groupIndex, userIndex) {
  if (groups[groupIndex].users[userIndex] !== 0) {
    alert("There are dues outstanding!\nThe user can't be removed.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref("bill-splitter/groups/".concat(groupIndex, "/users/").concat(userIndex)).remove();
    fetchData(groupIndex);
  }
}

function activateTab(el, groupIndex) {
  if (!el.classList.contains("active")) {
    document.getElementById("tab--friend").classList.remove("active");
    document.getElementById("tab--activity").classList.remove("active");
    document.getElementById("group-details").innerHTML = "";
    el.classList.add("active");
    var clickedTab = el.getAttribute("id");

    if (clickedTab === "tab--friend") {
      _renderGroupUsers(groupIndex);
    } else if (clickedTab === "tab--activity") {
      _renderGroupActivity(groupIndex);
    } else {}
  }
}

function _renderGroupUsers(groupIndex) {
  var groupRef = groups[groupIndex];
  var list = "<ul class=\"list-group list-group-flush mt-2\">";

  if (groupRef.users && Object.keys(groupRef.users).length !== 0) {
    var userRef;

    for (var _i10 = 0, _Object$entries10 = Object.entries(groupRef.users); _i10 < _Object$entries10.length; _i10++) {
      var _Object$entries10$_i = _slicedToArray(_Object$entries10[_i10], 2),
          index = _Object$entries10$_i[0],
          amount = _Object$entries10$_i[1];

      userRef = users[index];
      list += "<li class=\"list-group-item\">\n          <div class=\"d-flex justify-content-between align-items-center\">\n            <span class=\"d-flex justify-content-start align-items-center\">  \n              <img src=\"assets/images/".concat(userRef.avatar, ".jpg\" alt=\"").concat(userRef.avatar, "\" class=\"custom__group-user-list--image\" />\n              <span class=\"ml-1\">").concat(userRef.name, "</span>\n            </span>\n            <div style=\"text-align: right;\">");

      if (amount < 0) {
        list += "<span class=\"text-danger mr-2\"><small class=\"text-muted\">you owe</small> $".concat(Math.abs(amount).toFixed(2), "</span>");
      } else if (amount > 0) {
        list += "<span class=\"text-success mr-2\"><small class=\"text-muted\">owes you</small> $".concat(amount.toFixed(2), "</span>");
      } else {
        list += "<small class=\"text-muted mr-2\">all settled up</small>";
      }

      if (amount != 0) {
        list += "<button type=\"button\" class=\"btn btn-outline-primary btn-sm\">Settle</button>";
      } else {
        list += "<button type=\"button\" class=\"btn btn-outline-danger btn-sm\" onclick=\"removeGroupUser('".concat(groupIndex, "', '").concat(index, "')\">Remove</button>");
      }

      list += "</div>\n        </li>";
    }

    list += "</ul>";
  } else {
    list = "<div class=\"alert alert-warning mt-3\" role=\"alert\">No friends yet! Add friends to start recording your expenses.</div>";
  }

  document.getElementById("group-details").innerHTML = list;
}

function _renderGroupActivity(groupIndex) {
  var activities = groups[groupIndex].activity;
  var container = document.getElementById("group-details");

  if (!activities || Object.keys(activities).length === 0) {
    container.innerHTML = "<div class=\"alert alert-warning mt-3\" role=\"alert\">No bills added yet! Record your expenses now and split your bills easily.</div>";
  } else {
    var content = "<ul class=\"list-group list-group-flush mt-2\">";
    var paidByYou, debtAmount;

    for (var _i11 = 0, _Object$entries11 = Object.entries(activities); _i11 < _Object$entries11.length; _i11++) {
      var _Object$entries11$_i = _slicedToArray(_Object$entries11[_i11], 2),
          index = _Object$entries11$_i[0],
          activity = _Object$entries11$_i[1];

      paidByYou = activity.paidby === "0";

      if (paidByYou) {
        debtAmount = parseFloat(activity.amount) - parseFloat(activity.amount) / Object.keys(activity.split).length;
      } else {
        debtAmount = parseFloat(activity.amount) / Object.keys(activity.split).length;
      }

      content += "<li class=\"list-group-item\">\n          <div class=\"d-flex justify-content-between align-items-center mb-2\"> \n            <div class=\"d-flex justify-content-start align-items-baseline\">\n              <img \n                src=\"assets/icons/".concat(activity.category, ".svg\"\n                alt=\"").concat(activity.category, " icon\"\n                class=\"custom__group-category--image\">\n              <span class=\"ml-2 h5\">\n                ").concat(activity.description, "\n                <small class=\"text-muted\">(").concat(categories[activity.category], ")</small>\n              </span>\n            </div>\n            <div class=\"h5 text-").concat(paidByYou ? "success" : "danger", "\" style=\"text-align: right;\">\n              <small style=\"font-size: small;\">").concat(paidByYou ? "you lent" : "you borrowed", "</small>\n              $").concat(debtAmount.toFixed(2), "\n            </div>\n          </div>\n          <div class=\"d-flex justify-content-between align-items-start\">\n            <span class=\"d-flex flex-column align-items-start\">\n              <span>Total: $").concat(activity.amount, "</span>\n              <small class=\"text-muted\">\n                (Paid by ").concat(paidByYou ? "You" : users[activity.paidby].name, ")</small>\n            </span>\n            <span class=\"d-flex flex-column align-items-end\">");

      for (var _i12 = 0, _Object$entries12 = Object.entries(activity.split); _i12 < _Object$entries12.length; _i12++) {
        var _Object$entries12$_i = _slicedToArray(_Object$entries12[_i12], 2),
            userIndex = _Object$entries12$_i[0],
            user = _Object$entries12$_i[1];

        if (userIndex !== "0") {
          content += "<small>".concat(users[userIndex].name, "</small>");
        }
      }

      content += "</span>\n          </div>\n        </li>";
    }

    container.innerHTML = content;
  }
}

function addExpense() {
  var groupIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var containerGroup = document.getElementById("expense-group");
  var containerCategories = document.getElementById("expense-category");
  var containerName = document.getElementById("expense-name");
  var containerAmount = document.getElementById("expense-amount");
  var containerPaidby = document.getElementById("expense-paidby");
  var containerUsers = document.getElementById("expense-user-list");
  containerGroup.innerHTML = "";
  containerGroup.removeAttribute("disabled");
  containerCategories.innerHTML = "";
  containerName.value = "";
  containerAmount.value = "";
  containerPaidby.innerHTML = "";
  containerUsers.innerHTML = "";
  var listGroup = "";
  var listCategory = "";
  var listUsers = "<option value=\"0\">You</option>";
  var checkUsers = "";

  if (groupIndex) {
    listGroup = "<option value=\"".concat(groupIndex, "\" selected>").concat(groups[groupIndex].name, "</option>");
    containerGroup.setAttribute("disabled", "disabled");

    for (var _i13 = 0, _Object$entries13 = Object.entries(groups[groupIndex].users); _i13 < _Object$entries13.length; _i13++) {
      var _Object$entries13$_i = _slicedToArray(_Object$entries13[_i13], 2),
          index = _Object$entries13$_i[0],
          user = _Object$entries13$_i[1];

      listUsers += "<option value=\"".concat(index, "\">").concat(users[index].name, "</option>");
      checkUsers += "<div class=\"form-check\">\n        <input\n          class=\"form-check-input\"\n          type=\"checkbox\"\n          name=\"expense-users\"\n          id=\"".concat(index, "\"\n          value=\"").concat(index, "\"\n        />\n        <label class=\"form-check-label\" for=\"").concat(index, "\">").concat(users[index].name, "</label>\n      </div>");
    }
  } else {
    for (var _i14 = 0, _Object$entries14 = Object.entries(groups); _i14 < _Object$entries14.length; _i14++) {
      var _Object$entries14$_i = _slicedToArray(_Object$entries14[_i14], 2),
          _index2 = _Object$entries14$_i[0],
          group = _Object$entries14$_i[1];

      listGroup += "<option value=\"".concat(_index2, "\">").concat(group.name, "</option>");
    }

    for (var _i15 = 0, _Object$entries15 = Object.entries(users); _i15 < _Object$entries15.length; _i15++) {
      var _Object$entries15$_i = _slicedToArray(_Object$entries15[_i15], 2),
          _index3 = _Object$entries15$_i[0],
          _user = _Object$entries15$_i[1];

      listUsers += "<option value=\"".concat(_index3, "\">").concat(_user.name, "</option>");
      checkUsers += "<div class=\"form-check\">\n        <input\n          class=\"form-check-input\"\n          type=\"checkbox\"\n          name=\"expense-users\"\n          id=\"".concat(_index3, "\"\n          value=\"").concat(_index3, "\"\n        />\n        <label class=\"form-check-label\" for=\"").concat(_index3, "\">").concat(_user.name, "</label>\n      </div>");
    }
  }

  for (var _i16 = 0, _Object$entries16 = Object.entries(categories); _i16 < _Object$entries16.length; _i16++) {
    var _Object$entries16$_i = _slicedToArray(_Object$entries16[_i16], 2),
        _index4 = _Object$entries16$_i[0],
        category = _Object$entries16$_i[1];

    listCategory += "<option value=\"".concat(_index4, "\">").concat(category, "</option>");
  }

  containerGroup.innerHTML = listGroup;
  containerCategories.innerHTML = listCategory;
  containerPaidby.innerHTML = listUsers;
  containerUsers.innerHTML = checkUsers;
  document.getElementById("expense-form").setAttribute("data-group", groupIndex ? groupIndex : "");
}

document.getElementById("user-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var userIndex = document.getElementById("user-form").getAttribute("data-user");
  var userName = DOMPurify.sanitize(document.getElementById("username").value, INPUT_ALLOWED_TAGS);
  var userNumber = DOMPurify.sanitize(document.getElementById("number").value, INPUT_ALLOWED_TAGS);
  var gender;

  var _iterator5 = _createForOfIteratorHelper(document.getElementsByName("gender")),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var radio = _step5.value;

      if (radio.checked) {
        gender = radio.value;
        break;
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  if (userIndex !== "") {
    var user = users[userIndex];
    var userData = {};
    var infoChanged = false;

    if (userName !== user.name) {
      userData.name = userName;
      infoChanged = true;
    }

    if (userNumber !== user.number) {
      userData.number = userNumber;
      infoChanged = true;
    }

    if (gender !== user.gender) {
      userData.gender = gender;
      userData.avatar = "avatar-" + _randomNumber(gender);
      infoChanged = true;
    }

    if (infoChanged) {
      userData.date = _todayDate();
      db.ref("bill-splitter/users/".concat(userIndex)).update(userData);
      fetchData(userIndex);
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
      date: _todayDate(),
      settled: true
    };
    db.ref().update(newUser);
    fetchData();
  }

  $("#form--user").modal("toggle");
});
document.getElementById("group-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var groupIndex = document.getElementById("group-form").getAttribute("data-group");
  var groupName = DOMPurify.sanitize(document.getElementById("groupname").value, INPUT_ALLOWED_TAGS);
  var groupType;

  var _iterator6 = _createForOfIteratorHelper(document.getElementsByName("grouptype")),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var radio = _step6.value;

      if (radio.checked) {
        groupType = radio.value;
        break;
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }

  if (groupIndex !== "") {
    var group = groups[groupIndex];
    var groupData = {};
    var infoChanged = false;

    if (groupName !== group.name) {
      groupData.name = groupName;
      infoChanged = true;
    }

    if (groupType !== group.type) {
      groupData.type = groupType;
      infoChanged = true;
    }

    if (infoChanged) {
      groupData.date = _todayDate();
      db.ref("bill-splitter/groups/".concat(groupIndex)).update(groupData);
      fetchData(groupIndex);
    }
  } else {
    var key = db.ref().child("bill-splitter").push().key;
    var newGroup = {};
    newGroup["bill-splitter/groups/".concat(key)] = {
      name: groupName,
      type: groupType,
      date: _todayDate(),
      settled: true
    };
    db.ref().update(newGroup);
    fetchData(key);
  }

  $("#form--group").modal("toggle");
});
document.getElementById("member-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var groupIndex = document.getElementById("member-form").getAttribute("data-group");
  var multiselect = document.getElementById("user-multiselect");
  var userOptions = multiselect && multiselect.options;
  var selectedUsers = [];
  var groupMembers = {};
  var userGroupObj;

  for (var i = 0; i < userOptions.length; i++) {
    if (userOptions[i].selected) {
      selectedUsers.push(userOptions[i].value);
    }
  }

  selectedUsers.forEach(function (user) {
    userGroupObj = {};

    if (!groups[groupIndex].users || !groups[groupIndex].users[user]) {
      groupMembers[user] = 0;
    }

    userGroupObj[groupIndex] = true;
    db.ref("bill-splitter/users/".concat(user, "/groups")).update(userGroupObj);
    db.ref("bill-splitter/users/".concat(user)).update({
      date: _todayDate()
    });
  });
  db.ref("bill-splitter/groups/".concat(groupIndex, "/users")).update(groupMembers);
  db.ref("bill-splitter/groups/".concat(groupIndex)).update({
    date: _todayDate()
  });
  fetchData(groupIndex);
  $("#form--member").modal("toggle");
});
document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var groupIndex = DOMPurify.sanitize(document.getElementById("expense-group").value, INPUT_ALLOWED_TAGS);
  var categoryName = DOMPurify.sanitize(document.getElementById("expense-category").value, INPUT_ALLOWED_TAGS);
  var description = DOMPurify.sanitize(document.getElementById("expense-name").value, INPUT_ALLOWED_TAGS);
  var amount = DOMPurify.sanitize(document.getElementById("expense-amount").value, INPUT_ALLOWED_TAGS);
  var paidbyName = DOMPurify.sanitize(document.getElementById("expense-paidby").value, INPUT_ALLOWED_TAGS);
  var selectedUsers = {};
  var perPersonAmount;

  var _iterator7 = _createForOfIteratorHelper(document.getElementsByName("expense-users")),
      _step7;

  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var checkbox = _step7.value;

      if (checkbox.checked) {
        selectedUsers[checkbox.value] = true;
      }
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }

  selectedUsers[paidbyName] = true;

  if (paidbyName !== "0") {
    selectedUsers["0"] = true;
  }

  perPersonAmount = parseFloat(amount) / Object.keys(selectedUsers).length;
  var key = db.ref().child("bill-splitter").push().key;
  var newActivity = {};
  newActivity["bill-splitter/groups/".concat(groupIndex, "/activity/").concat(key)] = {
    category: categoryName,
    description: description,
    amount: amount,
    paidby: paidbyName,
    split: selectedUsers,
    date: _todayDate()
  };
  db.ref().update(newActivity);
  db.ref("bill-splitter/groups/".concat(groupIndex)).update({
    date: _todayDate(),
    settled: false
  });
  var groupUsersUpdate = {};
  var debt, updatedUserAmount, groupUserObj;

  if (paidbyName === "0") {
    for (var _i17 = 0, _Object$entries17 = Object.entries(selectedUsers); _i17 < _Object$entries17.length; _i17++) {
      var _Object$entries17$_i = _slicedToArray(_Object$entries17[_i17], 2),
          userIndex = _Object$entries17$_i[0],
          selectedUser = _Object$entries17$_i[1];

      if (userIndex !== "0") {
        groupUserObj = groups[groupIndex].users[userIndex];
        debt = groupUserObj ? groupUserObj + perPersonAmount : perPersonAmount;
        groupUsersUpdate[userIndex] = debt;
        updatedUserAmount = users[userIndex].amount + debt;
        db.ref("bill-splitter/users/".concat(userIndex)).update({
          amount: updatedUserAmount,
          settled: false
        });
      }
    }
  } else {
    groupUserObj = groups[groupIndex].users[paidbyName];
    debt = groupUserObj ? groupUserObj - perPersonAmount : 0 - perPersonAmount;
    groupUsersUpdate[paidbyName] = debt;
    updatedUserAmount = users[paidbyName].amount - perPersonAmount;
    db.ref("bill-splitter/users/".concat(paidbyName)).update({
      amount: updatedUserAmount,
      settled: false
    });
  }

  db.ref("bill-splitter/groups/".concat(groupIndex, "/users")).update(groupUsersUpdate);
  fetchData(groupIndex);
  $("#form--expense").modal("toggle");
});
//# sourceMappingURL=app.js.map
