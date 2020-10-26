"use strict";

document.querySelector("#submit").addEventListener("click", function (e) {
  e.preventDefault();
  calculate();
});
document.querySelectorAll(".reduce").forEach(function (button) {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    var inputId = e.currentTarget.getAttribute("data-target");
    var input = document.querySelector("#".concat(inputId));

    if (parseFloat(input.value) - 1 >= parseFloat(input.getAttribute("min"))) {
      input.value = parseFloat(input.value) - 1;
    }
  });
});
document.querySelectorAll(".increase").forEach(function (button) {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    var inputId = e.currentTarget.getAttribute("data-target");
    var input = document.querySelector("#".concat(inputId));

    if (parseFloat(input.value) + 1 <= parseFloat(input.getAttribute("max"))) {
      input.value = parseFloat(input.value) + 1;
    }
  });
});

var calculate = function calculate() {
  var bill = document.getElementById("bill").value,
      people = document.getElementById("people").value;
  var resultBox = document.getElementsByClassName("result--card")[0],
      validationNotice = document.getElementsByClassName("validation--notice")[0];

  if (bill === "" || people === "" || people == 0) {
    resultBox.classList.add("hidden");
    validationNotice.classList.remove("hidden");
  } else {
    validationNotice.classList.add("hidden");
    document.getElementById("amount").innerText = (parseFloat(bill) / parseFloat(people)).toFixed(2);
    resultBox.classList.remove("hidden");
  }
};
//# sourceMappingURL=app.js.map
