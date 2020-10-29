/**
 * GLobal variables
 */
let activePage = window.location.pathname;
let db;
let users = [];

/**
 * initialization
 */
_initFirebase();
renderView();

/**
 * Function declarations
 */
function _initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDFB9Kr3k6rI0T_94lO6hcV3pWU_X-XJ5A",
    authDomain: "javascript-293715.firebaseapp.com",
    databaseURL: "https://javascript-293715.firebaseio.com",
    projectId: "javascript-293715",
    storageBucket: "javascript-293715.appspot.com",
    messagingSenderId: "711748984217",
    appId: "1:711748984217:web:10f6e4e39b074cb0a7c708",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.database();
}

function renderView(userIndex = null) {
  if (activePage === "/users.html") {
    db.ref("bill-splitter/users/")
      .once("value")
      .then((snapshot) => {
        users = snapshot.val();
        _renderUsers();
        if (userIndex) {
          renderUserDetails(userIndex);
        } else {
          document
            .getElementById("user-details__container")
            .classList.add("hidden");
        }
      });
  }
}

function _renderUsers() {
  if (users.length != 0) {
    let list = "";

    for (let [index, user] of Object.entries(users)) {
      list += `<a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="renderUserDetails('${index}')">
          <span>
            <img src="assets/images/${user.avatar}.jpg" alt="${user.avatar}" class="custom__user-list--image" />
            <span class="ml-1 h5">${user.name}</span>
          </span>`;
      if (user.amount < 0) {
        list += `<span class="badge badge-danger custom__user-list--amount">$${Math.abs(
          user.amount
        ).toFixed(2)}</span> `;
      } else if (user.amount > 0) {
        list += `<span class="badge badge-success custom__user-list--amount">$${user.amount.toFixed(
          2
        )}</span>`;
      } else {
        list += `<span class="badge badge-secondary custom__user-list--amount">$${user.amount.toFixed(
          2
        )}</span>`;
      }
      list += `</a>`;
    }
    document.getElementById("users").innerHTML = list;
  } else {
    document.getElementById(
      "users"
    ).innerHTML = `<div class="alert alert-warning" role="alert">No friends found! Add friends now and split your bills easily.</div>`;
  }
}

function _randomNumber(gender) {
  const n = Math.floor(Math.random() * (16 - 1 + 1) + 1);
  if (gender === "m") {
    return n % 2 !== 0 ? n : _randomNumber(gender);
  } else if (gender === "f") {
    return n % 2 === 0 ? n : _randomNumber(gender);
  } else {
    return n;
  }
}

/**
 * Events
 */
function renderUserDetails(userIndex) {
  let details = `<h3 class="card-title">${users[userIndex].name}</h3>`;
  let settleButton = `<a href="#" class="btn btn-primary" onclick="settleDues('${userIndex}')">Settle</a>`;
  let remindButton = "";

  if (users[userIndex].amount < 0) {
    details += `<p class="h4 text-danger">you owe $${Math.abs(
      users[userIndex].amount
    ).toFixed(2)}</p>`;
  } else if (users[userIndex].amount > 0) {
    details += `<p class="h4 text-success">owes you $${users[
      userIndex
    ].amount.toFixed(2)}</p>`;
    if (users[userIndex].number && users[userIndex].number != "") {
      remindButton = `<a href="tel:${users[userIndex].number}" class="btn btn-outline-success">Remind</a>`;
    }
  } else {
    details += `<p class="h4 text-secondary">all settled up</p>`;
    settleButton = "";
  }
  details += `<p class="card-text">
      <small class="text-muted">Last updated on ${users[userIndex].date}</small>
    </p>`;

  document.getElementById(
    "user-details__image"
  ).innerHTML = `<img src="assets/images/${users[userIndex].avatar}.jpg" class="card-img" alt="${users[userIndex].avatar}"/>`;
  document.getElementById("user-details").innerHTML = details;
  document.getElementById(
    "user-details__cta"
  ).innerHTML = `<div class="btn-group btn-group-sm" role="group">
      ${settleButton}
      ${remindButton}
    </div>
    <div class="btn-group btn-group-sm" role="group">
      <a href="#" class="btn btn-outline-primary ml-2" data-toggle="modal" data-target="#form--user" onclick="editUser('${userIndex}')">Edit profile</a>
      <a href="#" class="btn btn-outline-danger" onclick="removeUser('${userIndex}')">Remove</a>
    </div>`;
  document.getElementById("user-details__container").classList.remove("hidden");
}

function settleDues(userIndex) {
  if (confirm("Do you want to settle all dues?")) {
    db.ref(`bill-splitter/users/${userIndex}`).update({
      amount: 0,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      settled: true,
    });
    renderView(userIndex);
  }
}

function removeUser(userIndex) {
  if (users[userIndex].amount !== 0) {
    alert("There are dues outstanding!\nThe user can't be removed.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref(`bill-splitter/users/${userIndex}`).remove();
    renderView();
  }
}

function editUser(userIndex) {
  document.getElementById("user-form__title").innerText = "Edit profile";
  document.getElementById("user-form").setAttribute("data-user", userIndex);
  document.getElementById("username").value = users[userIndex].name;
  document.getElementById("number").value = users[userIndex].number;
  document.getElementById("consent").checked = false;
  for (let radio of document.getElementsByName("gender")) {
    if (radio.value === users[userIndex].gender) {
      radio.checked = true;
      break;
    }
  }
}

function addUser() {
  document.getElementById("user-form__title").innerText = "Add a friend";
  document.getElementById("user-form").setAttribute("data-user", "");
  document.getElementById("username").value = "";
  document.getElementById("number").value = "";
  document.getElementById("consent").checked = false;
  for (let radio of document.getElementsByName("gender")) {
    radio.checked = false;
  }
}

function submitUserForm() {
  const userIndex = document
    .getElementById("user-form")
    .getAttribute("data-user");
  const userName = DOMPurify.sanitize(
    document.getElementById("username").value,
    {
      ALLOWED_TAGS: [],
    }
  );
  const userNumber = DOMPurify.sanitize(
    document.getElementById("number").value,
    {
      ALLOWED_TAGS: [],
    }
  );
  let gender = "o";
  for (let radio of document.getElementsByName("gender")) {
    if (radio.checked) {
      gender = radio.value;
      break;
    }
  }

  if (userIndex !== "") {
    let userData = {};
    let infoChanged = false;

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
        year: "numeric",
      });
      db.ref(`bill-splitter/users/${userIndex}`).update(userData);
      renderView(userIndex);
    }
  } else {
    const key = db.ref().child("bill-splitter").push().key;
    let newUser = {};

    newUser[`bill-splitter/users/${key}`] = {
      name: userName,
      number: userNumber,
      gender: gender,
      amount: 0,
      avatar: "avatar-" + _randomNumber(gender),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      settled: true,
    };
    db.ref().update(newUser);
    renderView();
  }
}
