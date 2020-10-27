document.querySelector("#submit").addEventListener("click", e => {
  e.preventDefault();
  calculate();
});

document.querySelectorAll(".reduce").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    const inputId = e.currentTarget.getAttribute("data-target");
    const input = document.querySelector(`#${inputId}`);

    if (parseFloat(input.value) - 1 >= parseFloat(input.getAttribute("min"))) {
      input.value = parseFloat(input.value) - 1;
    }
  });
});
document.querySelectorAll(".increase").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    const inputId = e.currentTarget.getAttribute("data-target");
    const input = document.querySelector(`#${inputId}`);

    if (parseFloat(input.value) + 1 <= parseFloat(input.getAttribute("max"))) {
      input.value = parseFloat(input.value) + 1;
    }
  });
});

const calculate = () => {
  const bill = document.getElementById("bill").value,
    people = document.getElementById("people").value;

  const resultBox = document.getElementsByClassName("result--card")[0],
    validationNotice = document.getElementsByClassName("validation--notice")[0];

  if (bill === "" || people === "" || people == 0) {
    resultBox.classList.add("hidden");
    validationNotice.classList.remove("hidden");
  } else {
    validationNotice.classList.add("hidden");
    document.getElementById("amount").innerText = (
      parseFloat(bill) / parseFloat(people)
    ).toFixed(2);
    resultBox.classList.remove("hidden");
  }
};
