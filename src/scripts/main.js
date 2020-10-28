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

function renderView() {
  if (activePage === "/users.html") {
    db.ref("bill-splitter/users/")
      .once("value")
      .then((snapshot) => {
        users = snapshot.val();
        users.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
        _renderUsers();
      });
  }
}

function _renderUsers() {
  if (users.length != 0) {
    let list = "";
    users.forEach((user, index) => {
      list += `<a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="renderUserDetails(${index})">
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
    });
    document.getElementById("users").innerHTML = list;
  } else {
    document.getElementById(
      "users"
    ).innerHTML = `<div class="alert alert-warning" role="alert">No friends found! Add friends now and split your bills easily.</div>`;
  }
}

/**
 * Events
 */
function renderUserDetails(userIndex) {
  let details = `<h3 class="card-title">${users[userIndex].name}</h3>`;

  if (users[userIndex].amount < 0) {
    details += `<p class="h4 text-danger">you owe $${Math.abs(
      users[userIndex].amount
    ).toFixed(2)}</p>`;
  } else if (users[userIndex].amount > 0) {
    details += `<p class="h4 text-success">owes you $${users[
      userIndex
    ].amount.toFixed(2)}</p>`;
  } else {
    details += `<p class="h4 text-secondary">all settled up</p>`;
  }

  details += `<p class="card-text">
      <small class="text-muted">Last expense recorded on ${users[userIndex].date}</small>
    </p>`;

  document.getElementById(
    "user-details__image"
  ).innerHTML = `<img src="assets/images/${users[userIndex].avatar}.jpg" class="card-img" alt="${users[userIndex].avatar}"/>`;

  document.getElementById("user-details").innerHTML = details;
  document.getElementById("user-details__container").classList.remove("hidden");
}
