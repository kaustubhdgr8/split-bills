/**
 * GLobal variables
 */
let activePage = window.location.pathname;
let db, users, groups, categories;
const INPUT_ALLOWED_TAGS = {
  ALLOWED_TAGS: [],
};

/**
 * initialization
 */
_initFirebase();
fetchData();

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
function fetchData(index = null) {
  const fetchUsers = new Promise((resolve, reject) => {
    db.ref("bill-splitter/users/")
      .once("value")
      .then((snapshot) => {
        users = snapshot.val();
        resolve();
      });
  });
  const fetchGroups = new Promise((resolve, reject) => {
    db.ref("bill-splitter/groups/")
      .once("value")
      .then((snapshot) => {
        groups = snapshot.val();
        resolve();
      });
  });

  Promise.allSettled([fetchUsers, fetchGroups]).then(() => {
    _renderView(index);
  });

  db.ref("bill-splitter/categories/")
    .once("value")
    .then((snapshot) => {
      categories = snapshot.val();
    });
}
function _renderView(index = null) {
  if (activePage === "/users.html") {
    _renderUsers();
    if (index) {
      renderUserDetails(index);
    } else {
      document
        .getElementById("user-details__container")
        .classList.add("hidden");
    }
  } else if (activePage === "/groups.html") {
    _renderGroups();
    if (index) {
      renderGroupDetails(index);
    } else {
      document
        .getElementById("group-details__container")
        .classList.add("hidden");
    }
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
    ).innerHTML = `<div class="alert alert-warning" role="alert">No friends yet! Add friends now and split your bills easily.</div>`;
  }
}
function _renderGroups() {
  if (groups.length != 0) {
    let list = "";

    for (let [index, group] of Object.entries(groups)) {
      list += `<a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="renderGroupDetails('${index}')">
          <span>
            <img src="assets/icons/${group.type}.svg" alt="${
        group.type
      } icon" class="custom__group-list--image" />
            <span class="ml-3 h5">${group.name} </span>
            <span class="badge badge-${
              group.settled ? "secondary" : "primary"
            }" style="font-size: small;">$${_totalExpense(index).toFixed(
        2
      )}</span>
          </span>
          <small class="text-muted">${
            group.settled ? "Settled up" : "Pending"
          }</small>
      </a>`;
    }
    document.getElementById("groups").innerHTML = list;
  } else {
    document.getElementById(
      "groups"
    ).innerHTML = `<div class="alert alert-warning" role="alert">No groups found! Add a group now and record your expenses.</div>`;
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
function _todayDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function _totalExpense(groupIndex) {
  let total = 0;
  if (groups[groupIndex].activity) {
    for (let [index, activity] of Object.entries(groups[groupIndex].activity)) {
      total += parseFloat(activity.amount);
    }
  }
  return total;
}

/**
 * User events
 */
function renderUserDetails(userIndex) {
  const user = users[userIndex];
  let details = `<h3 class="card-title">${user.name}</h3>`;
  let settleButton = `<a href="#" class="btn btn-primary" onclick="settleDues('${userIndex}')">Settle</a>`;
  let remindButton = "";
  let memberGroups = "";

  if (user.amount < 0) {
    details += `<p class="h4 text-danger">you owe $${Math.abs(
      user.amount
    ).toFixed(2)}</p>`;
  } else if (user.amount > 0) {
    details += `<p class="h4 text-success">owes you $${user.amount.toFixed(
      2
    )}</p>`;
    if (user.number && user.number != "") {
      remindButton = `<a href="tel:${user.number}" class="btn btn-outline-success">Remind</a>`;
    }
  } else {
    details += `<p class="h4 text-secondary">all settled up</p>`;
    settleButton = "";
  }
  details += `<p class="card-text">
      <small class="text-muted">Last updated on ${user.date}</small>
    </p>`;

  for (let [index, group] of Object.entries(groups)) {
    if (group.users) {
      for (let [gUserIndex, groupUser] of Object.entries(group.users)) {
        if (gUserIndex === userIndex) {
          memberGroups += `<li class="list-group-item">
              <a href="/groups.html">
                ${group.name}
              </a>
              <small class="text-muted">(${
                group.settled ? "settled up" : "pending"
              })</small>
            </li>`;
          break;
        }
      }
    }
  }
  if (memberGroups === "") {
    memberGroups = `<div class="alert alert-primary" role="alert">${user.name} does not belong to any group yet.</div>`;
  }

  document.getElementById(
    "user-details__image"
  ).innerHTML = `<img src="assets/images/${user.avatar}.jpg" class="card-img" alt="${user.avatar}"/>`;
  document.getElementById("user-details").innerHTML = details;
  document.getElementById("user-details__groups").innerHTML = memberGroups;
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
function editUser(userIndex) {
  const user = users[userIndex];
  document.getElementById("user-form__title").innerText = "Edit profile";
  document.getElementById("user-form").setAttribute("data-user", userIndex);
  document.getElementById("username").value = user.name;
  document.getElementById("number").value = user.number;
  document.getElementById("consent").checked = false;
  for (let radio of document.getElementsByName("gender")) {
    if (radio.value === user.gender) {
      radio.checked = true;
      break;
    }
  }
}
function removeUser(userIndex) {
  if (users[userIndex].amount !== 0) {
    alert("There are dues outstanding!\nThe user can't be removed.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref(`bill-splitter/users/${userIndex}`).remove();
    fetchData();
  }
}
function settleDues(userIndex) {
  if (confirm("Do you want to settle all dues?")) {
    db.ref(`bill-splitter/users/${userIndex}`).update({
      amount: 0,
      date: _todayDate(),
      settled: true,
    });
    fetchData(userIndex);
  }
}

/**
 * Group events
 */
function renderGroupDetails(groupIndex) {
  const group = groups[groupIndex];
  document.getElementById(
    "group-header"
  ).innerHTML = `<div class="d-flex flex-nowrap justify-content-between align-items-center">
      <h3 class="card-title mb-0">
        ${group.name}
        <small class="text-muted" style="font-size: initial;">(${
          group.settled ? "settled up" : "pending"
        })</small>
      </h3>
      <div class="btn-group btn-group-sm" role="group">
        <a href="#" class="btn btn-outline-primary ml-2" data-toggle="modal" data-target="#form--group" onclick="editGroup('${groupIndex}')">Edit</a>
        <a href="#" class="btn btn-outline-danger" onclick="removeGroup('${groupIndex}')">Delete</a>
      </div>
    </div>
    <p class="card-text">
      <small class="text-muted">Last updated on ${group.date}</small>
    </p>`;
  document.getElementById(
    "group-details--tabs"
  ).innerHTML = `<ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active" href="#" id="tab--friend" onclick="activateTab(this, '${groupIndex}')">
          Friends
          <span class="badge badge-${group.settled ? "secondary" : "primary"}">
            ${group.users ? Object.keys(group.users).length : 0}
          </span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="tab--activity" onclick="activateTab(this, '${groupIndex}')">
          Activity
          <span class="badge badge-${group.settled ? "secondary" : "primary"}">
            ${group.activity ? Object.keys(group.activity).length : 0}
          </span>
        </a>
      </li>
      <!-- <li class="nav-item">
        <a class="nav-link" href="#" id="tab--chart" onclick="activateTab(this, '${groupIndex}')">Chart</a>
      </li> -->
    </ul>`;
  document.getElementById("group-details").innerHTML = "";

  let ctaButtons = "";
  if (group.users) {
    ctaButtons += `<button class="btn btn-primary btn-sm mr-2" data-toggle="modal" data-target="#form--expense" onclick="addExpense('${groupIndex}')">Record expense</button>`;
  }
  document.getElementById("group-details__cta").innerHTML = `${ctaButtons}
    <button class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#form--member" onclick="addGroupUser('${groupIndex}')">Add new member</button>`;

  document
    .getElementById("group-details__container")
    .classList.remove("hidden");

  _renderGroupUsers(groupIndex);
}
function addGroup() {
  document.getElementById("group-form__title").innerText = "Create a new group";
  document.getElementById("group-form").setAttribute("data-group", "");
  document.getElementById("groupname").value = "";
  document.getElementById("groupconsent").checked = false;
  for (let radio of document.getElementsByName("grouptype")) {
    radio.checked = false;
  }
}
function editGroup(groupIndex) {
  const group = groups[groupIndex];
  document.getElementById("group-form__title").innerText = "Edit group details";
  document.getElementById("group-form").setAttribute("data-group", groupIndex);
  document.getElementById("groupname").value = group.name;
  document.getElementById("groupconsent").checked = false;
  for (let radio of document.getElementsByName("grouptype")) {
    if (radio.value === group.type) {
      radio.checked = true;
      break;
    }
  }
}
function removeGroup(groupIndex) {
  if (!groups[groupIndex].settled) {
    alert("There are dues outstanding!\nThe group can't be deleted.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref(`bill-splitter/groups/${groupIndex}`).remove();
    fetchData();
  }
}
function addGroupUser(groupIndex) {
  document.getElementById("member-form").setAttribute("data-group", groupIndex);
  const multiselect = document.getElementById("user-multiselect");
  const options = document.querySelectorAll("#user-multiselect option");
  options.forEach((o) => o.remove());

  for (let [index, user] of Object.entries(users)) {
    multiselect.options[multiselect.options.length] = new Option(
      user.name,
      index,
      false
    );
  }
}
function removeGroupUser(groupIndex, userIndex) {
  if (groups[groupIndex].users[userIndex] !== 0) {
    alert("There are dues outstanding!\nThe user can't be removed.");
  } else if (confirm("Are you sure?\nThere is no going back!")) {
    db.ref(`bill-splitter/groups/${groupIndex}/users/${userIndex}`).remove();
    fetchData(groupIndex);
  }
}
function activateTab(el, groupIndex) {
  if (!el.classList.contains("active")) {
    document.getElementById("tab--friend").classList.remove("active");
    document.getElementById("tab--activity").classList.remove("active");
    //document.getElementById("tab--chart").classList.remove("active");
    document.getElementById("group-details").innerHTML = "";

    el.classList.add("active");
    const clickedTab = el.getAttribute("id");

    if (clickedTab === "tab--friend") {
      _renderGroupUsers(groupIndex);
    } else if (clickedTab === "tab--activity") {
      _renderGroupActivity(groupIndex);
    } else {
      // _renderGroupChart(groupIndex);
    }
  }
}
function _renderGroupUsers(groupIndex) {
  const groupRef = groups[groupIndex];
  let list = `<ul class="list-group list-group-flush mt-2">`;

  if (groupRef.users && Object.keys(groupRef.users).length !== 0) {
    let userRef;

    for (let [index, amount] of Object.entries(groupRef.users)) {
      userRef = users[index];
      list += `<li class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <span class="d-flex justify-content-start align-items-center">  
              <img src="assets/images/${userRef.avatar}.jpg" alt="${userRef.avatar}" class="custom__group-user-list--image" />
              <span class="ml-1">${userRef.name}</span>
            </span>
            <div style="text-align: right;">`;
      if (amount < 0) {
        list += `<span class="text-danger mr-2"><small class="text-muted">you owe</small> $${Math.abs(
          amount
        ).toFixed(2)}</span>`;
      } else if (amount > 0) {
        list += `<span class="text-success mr-2"><small class="text-muted">owes you</small> $${amount.toFixed(
          2
        )}</span>`;
      } else {
        list += `<small class="text-muted mr-2">all settled up</small>`;
      }
      if (amount != 0) {
        list += `<button type="button" class="btn btn-outline-primary btn-sm">Settle</button>`;
      } else {
        list += `<button type="button" class="btn btn-outline-danger btn-sm" onclick="removeGroupUser('${groupIndex}', '${index}')">Remove</button>`;
      }
      list += `</div>
        </li>`;
    }
    list += `</ul>`;
  } else {
    list = `<div class="alert alert-warning mt-3" role="alert">No friends yet! Add friends to start recording your expenses.</div>`;
  }

  document.getElementById("group-details").innerHTML = list;
}
function _renderGroupActivity(groupIndex) {
  const activities = groups[groupIndex].activity;
  const container = document.getElementById("group-details");

  if (!activities || Object.keys(activities).length === 0) {
    container.innerHTML = `<div class="alert alert-warning mt-3" role="alert">No bills added yet! Record your expenses now and split your bills easily.</div>`;
  } else {
    let content = `<ul class="list-group list-group-flush mt-2">`;
    let paidByYou, debtAmount;

    for (let [index, activity] of Object.entries(activities)) {
      paidByYou = activity.paidby === "0";
      if (paidByYou) {
        debtAmount =
          parseFloat(activity.amount) -
          parseFloat(activity.amount) / Object.keys(activity.split).length;
      } else {
        debtAmount =
          parseFloat(activity.amount) / Object.keys(activity.split).length;
      }
      content += `<li class="list-group-item">
          <div class="d-flex justify-content-between align-items-center mb-2"> 
            <div class="d-flex justify-content-start align-items-baseline">
              <img 
                src="assets/icons/${activity.category}.svg"
                alt="${activity.category} icon"
                class="custom__group-category--image">
              <span class="ml-2 h5">
                ${activity.description}
                <small class="text-muted">(${
                  categories[activity.category]
                })</small>
              </span>
            </div>
            <div class="h5 text-${
              paidByYou ? "success" : "danger"
            }" style="text-align: right;">
              <small style="font-size: small;">${
                paidByYou ? "you lent" : "you borrowed"
              }</small>
              $${debtAmount.toFixed(2)}
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-start">
            <span class="d-flex flex-column align-items-start">
              <span>Total: $${activity.amount}</span>
              <small class="text-muted">
                (Paid by ${
                  paidByYou ? "You" : users[activity.paidby].name
                })</small>
            </span>
            <span class="d-flex flex-column align-items-end">`;

      for (let [userIndex, user] of Object.entries(activity.split)) {
        if (userIndex !== "0") {
          content += `<small>${users[userIndex].name}</small>`;
        }
      }

      content += `</span>
          </div>
        </li>`;
    }
    container.innerHTML = content;
  }
}

/**
 * Expense events
 */
function addExpense(groupIndex = null) {
  const containerGroup = document.getElementById("expense-group");
  const containerCategories = document.getElementById("expense-category");
  const containerName = document.getElementById("expense-name");
  const containerAmount = document.getElementById("expense-amount");
  const containerPaidby = document.getElementById("expense-paidby");
  const containerUsers = document.getElementById("expense-user-list");

  containerGroup.innerHTML = "";
  containerGroup.removeAttribute("disabled");
  containerCategories.innerHTML = "";
  containerName.value = "";
  containerAmount.value = "";
  containerPaidby.innerHTML = "";
  containerUsers.innerHTML = "";

  let listGroup = "";
  let listCategory = "";
  let listUsers = `<option value="0">You</option>`;
  let checkUsers = "";

  if (groupIndex) {
    listGroup = `<option value="${groupIndex}" selected>${groups[groupIndex].name}</option>`;
    containerGroup.setAttribute("disabled", "disabled");
    for (let [index, user] of Object.entries(groups[groupIndex].users)) {
      listUsers += `<option value="${index}">${users[index].name}</option>`;
      checkUsers += `<div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          name="expense-users"
          id="${index}"
          value="${index}"
        />
        <label class="form-check-label" for="${index}">${users[index].name}</label>
      </div>`;
    }
  } else {
    for (let [index, group] of Object.entries(groups)) {
      listGroup += `<option value="${index}">${group.name}</option>`;
    }
    for (let [index, user] of Object.entries(users)) {
      listUsers += `<option value="${index}">${user.name}</option>`;
      checkUsers += `<div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          name="expense-users"
          id="${index}"
          value="${index}"
        />
        <label class="form-check-label" for="${index}">${user.name}</label>
      </div>`;
    }
  }
  for (let [index, category] of Object.entries(categories)) {
    listCategory += `<option value="${index}">${category}</option>`;
  }

  containerGroup.innerHTML = listGroup;
  containerCategories.innerHTML = listCategory;
  containerPaidby.innerHTML = listUsers;
  containerUsers.innerHTML = checkUsers;
  document
    .getElementById("expense-form")
    .setAttribute("data-group", groupIndex ? groupIndex : "");
}

/**
 * Event listener bindings
 */
document.getElementById("user-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const userIndex = document
    .getElementById("user-form")
    .getAttribute("data-user");
  const userName = DOMPurify.sanitize(
    document.getElementById("username").value,
    INPUT_ALLOWED_TAGS
  );
  const userNumber = DOMPurify.sanitize(
    document.getElementById("number").value,
    INPUT_ALLOWED_TAGS
  );
  let gender;
  for (let radio of document.getElementsByName("gender")) {
    if (radio.checked) {
      gender = radio.value;
      break;
    }
  }

  if (userIndex !== "") {
    const user = users[userIndex];
    let userData = {};
    let infoChanged = false;

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
      db.ref(`bill-splitter/users/${userIndex}`).update(userData);
      fetchData(userIndex);
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
      date: _todayDate(),
      settled: true,
    };
    db.ref().update(newUser);
    fetchData();
  }
  $("#form--user").modal("toggle");
});
document.getElementById("group-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const groupIndex = document
    .getElementById("group-form")
    .getAttribute("data-group");
  const groupName = DOMPurify.sanitize(
    document.getElementById("groupname").value,
    INPUT_ALLOWED_TAGS
  );
  let groupType;
  for (let radio of document.getElementsByName("grouptype")) {
    if (radio.checked) {
      groupType = radio.value;
      break;
    }
  }

  if (groupIndex !== "") {
    const group = groups[groupIndex];
    let groupData = {};
    let infoChanged = false;

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
      db.ref(`bill-splitter/groups/${groupIndex}`).update(groupData);
      fetchData(groupIndex);
    }
  } else {
    const key = db.ref().child("bill-splitter").push().key;
    let newGroup = {};

    newGroup[`bill-splitter/groups/${key}`] = {
      name: groupName,
      type: groupType,
      date: _todayDate(),
      settled: true,
    };
    db.ref().update(newGroup);
    fetchData(key);
  }
  $("#form--group").modal("toggle");
});
document.getElementById("member-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const groupIndex = document
    .getElementById("member-form")
    .getAttribute("data-group");
  const multiselect = document.getElementById("user-multiselect");
  const userOptions = multiselect && multiselect.options;
  let selectedUsers = [];
  let groupMembers = {};
  let userGroupObj;

  for (let i = 0; i < userOptions.length; i++) {
    if (userOptions[i].selected) {
      selectedUsers.push(userOptions[i].value);
    }
  }
  selectedUsers.forEach((user) => {
    userGroupObj = {};
    if (!groups[groupIndex].users || !groups[groupIndex].users[user]) {
      groupMembers[user] = 0;
    }
    userGroupObj[groupIndex] = true;
    db.ref(`bill-splitter/users/${user}/groups`).update(userGroupObj);
    db.ref(`bill-splitter/users/${user}`).update({
      date: _todayDate(),
    });
  });

  db.ref(`bill-splitter/groups/${groupIndex}/users`).update(groupMembers);
  db.ref(`bill-splitter/groups/${groupIndex}`).update({
    date: _todayDate(),
  });

  fetchData(groupIndex);
  $("#form--member").modal("toggle");
});
document.getElementById("expense-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const groupIndex = DOMPurify.sanitize(
    document.getElementById("expense-group").value,
    INPUT_ALLOWED_TAGS
  );
  const categoryName = DOMPurify.sanitize(
    document.getElementById("expense-category").value,
    INPUT_ALLOWED_TAGS
  );
  const description = DOMPurify.sanitize(
    document.getElementById("expense-name").value,
    INPUT_ALLOWED_TAGS
  );
  const amount = DOMPurify.sanitize(
    document.getElementById("expense-amount").value,
    INPUT_ALLOWED_TAGS
  );
  const paidbyName = DOMPurify.sanitize(
    document.getElementById("expense-paidby").value,
    INPUT_ALLOWED_TAGS
  );

  let selectedUsers = {};
  let perPersonAmount;

  for (const checkbox of document.getElementsByName("expense-users")) {
    if (checkbox.checked) {
      selectedUsers[checkbox.value] = true;
    }
  }
  selectedUsers[paidbyName] = true;
  if (paidbyName !== "0") {
    selectedUsers["0"] = true;
  }

  perPersonAmount = parseFloat(amount) / Object.keys(selectedUsers).length;

  const key = db.ref().child("bill-splitter").push().key;
  let newActivity = {};

  newActivity[`bill-splitter/groups/${groupIndex}/activity/${key}`] = {
    category: categoryName,
    description: description,
    amount: amount,
    paidby: paidbyName,
    split: selectedUsers,
    date: _todayDate(),
  };

  db.ref().update(newActivity);
  db.ref(`bill-splitter/groups/${groupIndex}`).update({
    date: _todayDate(),
    settled: false,
  });

  let groupUsersUpdate = {};
  let debt, updatedUserAmount, groupUserObj;

  if (paidbyName === "0") {
    for (let [userIndex, selectedUser] of Object.entries(selectedUsers)) {
      if (userIndex !== "0") {
        groupUserObj = groups[groupIndex].users[userIndex];
        debt = groupUserObj ? groupUserObj + perPersonAmount : perPersonAmount;

        groupUsersUpdate[userIndex] = debt;
        updatedUserAmount = users[userIndex].amount + debt;

        db.ref(`bill-splitter/users/${userIndex}`).update({
          amount: updatedUserAmount,
          settled: false,
        });
      }
    }
  } else {
    groupUserObj = groups[groupIndex].users[paidbyName];
    debt = groupUserObj ? groupUserObj - perPersonAmount : 0 - perPersonAmount;

    groupUsersUpdate[paidbyName] = debt;
    updatedUserAmount = users[paidbyName].amount - perPersonAmount;

    db.ref(`bill-splitter/users/${paidbyName}`).update({
      amount: updatedUserAmount,
      settled: false,
    });
  }

  db.ref(`bill-splitter/groups/${groupIndex}/users`).update(groupUsersUpdate);
  fetchData(groupIndex);
  $("#form--expense").modal("toggle");
});
