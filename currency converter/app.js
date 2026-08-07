const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let option = document.createElement("option");
        option.innerText = currCode;
        option.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            option.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            option.selected = true;
        }

        select.append(option);
    }

    updateFlag(select);

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

function updateFlag(element) {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `https://open.er-api.com/v6/latest/${fromCurr.value}`;

    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Network response was not OK");
        }

        const data = await response.json();

        const rate = data.rates[toCurr.value];

        if (!rate) {
            msg.innerText = "Currency not supported!";
            return;
        }

        const finalAmount = amtVal * rate;

        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        console.log(error);
        msg.innerText = "Unable to fetch exchange rate.";
    }
});

window.addEventListener("load", () => {
    btn.click();
});