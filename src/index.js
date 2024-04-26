import currency from "currency.js";
import "./styles/style.css";
import _ from "lodash";

const defaultRates = { inbound: 55, outbound: 60 };
const promoRates = { inbound: 60, outbound: 50 };
const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

let isOutbound = true;
let exchangeRates = defaultRates;
let prevInput1 = 0;
let prevInput2 = 0;
let showRate = true;

// inputs
const input1Container = document.querySelector("#input1");
const input2Container = document.querySelector("#input2");

// flags
const btn1Flag = document.querySelector("#exchange-btn1>img");
const btn2Flag = document.querySelector("#exchange-btn2>img");

// country
const btn1Title = document.querySelector("#exchange-btn1>h1");
const btn2Title = document.querySelector("#exchange-btn2>h1");

// promo
const promoText = document.querySelector(".exchange-promo-offer>span");
const promoContainer = document.querySelector("#promo-container");

// switch
const exchangeSwitch = document.querySelector("#exchange-switch");

// inputs
const exchangeInput1 = document.querySelector("#exchange-input1");
const exchangeInput2 = document.querySelector("#exchange-input2");

// higher limits
const higherLimits = document.querySelector("#higher-limits");

// offer
const offerContainer = document.querySelector("#offer-container");
const offerValue = document.querySelector("#offer-value");

// contact btn
const submitBtn = document.querySelector("#submit-btn");
const contactBtn = document.querySelector("#contact-limit");

const updateInput1 = () => {
  const exchangeValue = isOutbound
    ? prevInput2 * promoRates.outbound
    : prevInput2 / promoRates.inbound;

  const offerExchangeValue = isOutbound
    ? prevInput2 * exchangeRates.outbound - exchangeValue
    : prevInput2 / exchangeRates.inbound - exchangeValue;

  exchangeInput1.value = currencyFormatter.format(currency(exchangeValue));

  prevInput1 = exchangeValue;

  if (offerExchangeValue > 0) {
    offerContainer.classList.remove("hide-me");
    offerValue.textContent = isOutbound
      ? `₱ ${currencyFormatter.format(currency(offerExchangeValue))}`
      : `$ ${currencyFormatter.format(currency(offerExchangeValue))}`;
  } else {
    offerContainer.classList.add("hide-me");
  }
};

const updateInput2 = () => {
  const exchangeValue = isOutbound
    ? prevInput1 / promoRates.outbound
    : prevInput1 * promoRates.inbound;

  const offerExchangeValue = isOutbound
    ? exchangeValue * exchangeRates.outbound - prevInput1
    : exchangeValue / exchangeRates.inbound - prevInput1;

  exchangeInput2.value = currencyFormatter.format(currency(exchangeValue));

  prevInput2 = exchangeValue;

  if (offerExchangeValue > 0) {
    offerContainer.classList.remove("hide-me");
    offerValue.textContent = isOutbound
      ? `₱ ${currencyFormatter.format(currency(offerExchangeValue))}`
      : `$ ${currencyFormatter.format(currency(offerExchangeValue))}`;
  } else {
    offerContainer.classList.add("hide-me");
  }
};

// debounce
const inputDebounce1 = _.debounce(updateInput1, 200);
const inputDebounce2 = _.debounce(updateInput2, 200);

const handleShowRate = () => {
  if (!showRate) {
    return;
  }
  showRate = false;
  promoContainer.classList.remove("hide-me");
};

const changeFlow = () => {
  isOutbound = !isOutbound;

  exchangeInput1.placeholder = isOutbound ? promoRates.outbound : 1;
  exchangeInput2.placeholder = isOutbound ? 1 : promoRates.inbound;

  // Update currency
  input1Container.classList.toggle("currency1");
  input1Container.classList.toggle("currency2");
  input2Container.classList.toggle("currency1");
  input2Container.classList.toggle("currency2");

  // Update Flag
  const tempUrl = btn1Flag.src;
  btn1Flag.src = btn2Flag.src;
  btn2Flag.src = tempUrl;

  // Update Country
  btn1Title.textContent = isOutbound ? "PH" : "U.S.";
  btn2Title.textContent = isOutbound ? "U.S." : "PH";

  // Update Promo
  promoText.textContent = isOutbound
    ? `₱${promoRates.outbound} = $1`
    : `$1 = ₱${promoRates.inbound}`;

  // Reset input and range
  exchangeInput1.value = "";
  exchangeInput2.value = "";
  prevInput1 = 0;
  prevInput2 = 0;
  showRate = true;

  higherLimits.classList.add("hide-me");
  offerContainer.classList.add("hide-me");
  promoContainer.classList.add("hide-me");
};

const handleInput1Logic = (currentValue) => {
  if (isOutbound && currentValue > 50000) {
    higherLimits.classList.remove("hide-me");
  } else if (!isOutbound && currentValue > 1000) {
    higherLimits.classList.remove("hide-me");
  } else {
    higherLimits.classList.add("hide-me");
  }

  return currentValue < 1000000000000000;
};

const handleInput2Logic = (currentValue) => {
  if (!isOutbound && currentValue > 60000) {
    higherLimits.classList.remove("hide-me");
  } else if (isOutbound && currentValue > 1000) {
    higherLimits.classList.remove("hide-me");
  } else {
    higherLimits.classList.add("hide-me");
  }

  return currentValue < 1000000000000000;
};

const handleInput1 = (e) => {
  const currentValue = currency(e.target.value).value;

  if (!isNaN(e.target.value) && handleInput1Logic(currentValue)) {
    handleShowRate();
    prevInput1 = currentValue;
    inputDebounce2();
  } else {
    exchangeInput1.value = prevInput1;
  }
};

const handleInput2 = (e) => {
  const currentValue = currency(e.target.value).value;

  if (!isNaN(e.target.value) && handleInput2Logic(currentValue)) {
    handleShowRate();
    prevInput2 = currentValue;
    inputDebounce1();
  } else {
    exchangeInput2.value = prevInput2;
  }
};

const handleInputBlur1 = (e) => {
  if (!e.target.value) {
    return;
  }

  exchangeInput1.value = currencyFormatter.format(currency(e.target.value));
};

const handleInputFocus1 = (e) => {
  if (!e.target.value) {
    return;
  }
  exchangeInput1.value = currency(e.target.value);
};

const handleInputBlur2 = (e) => {
  if (!e.target.value) {
    return;
  }

  exchangeInput2.value = currencyFormatter.format(currency(e.target.value));
};

const handleInputFocus2 = (e) => {
  if (!e.target.value) {
    return;
  }
  exchangeInput2.value = currency(e.target.value);
};

const handleSubmit = () => {
  window.open("https://app.tanggapp.com/Register", "_blank");
};

const handleContactUs = () => {
  window.open("https://www.tanggapp.com/support", "_blank");
};

const setFxInLocal = async () => {
  try {
    const responseRates = await fetch(
      `${process.env.API_URL}/api/v1/sendmoney/rate/fx`
    );
    if (responseRates.status === 200) {
      const jsonRates = await responseRates.json();
      localStorage.setItem(
        "exchange",
        JSON.stringify({ rates: jsonRates, time: Date.now() })
      );
      exchangeRates = jsonRates;
      return;
    }
    exchangeRates = defaultRates;
  } catch (error) {
    exchangeRates = defaultRates;
  }
};

const handleExchangeLogic = () => {
  const localRates = localStorage.getItem("exchange");

  if (localRates) {
    const rates = JSON.parse(localRates);
    if (!rates?.time || Date.now() - Number(rates.time) > 86400000) {
      setFxInLocal();
    } else {
      exchangeRates = rates.rates;
    }
  } else {
    setFxInLocal();
  }

  promoText.textContent = `₱${promoRates.outbound} = $1`;
  exchangeInput1.placeholder = promoRates.outbound;
  exchangeInput2.placeholder = 1;

  exchangeSwitch.addEventListener("click", _.debounce(changeFlow, 200));
  submitBtn.addEventListener("click", handleSubmit);
  contactBtn.addEventListener("click", handleContactUs);
  exchangeInput1.addEventListener("input", handleInput1);
  exchangeInput1.addEventListener("blur", handleInputBlur1);
  exchangeInput1.addEventListener("focus", handleInputFocus1);
  exchangeInput2.addEventListener("input", handleInput2);
  exchangeInput2.addEventListener("blur", handleInputBlur2);
  exchangeInput2.addEventListener("focus", handleInputFocus2);
};

document.addEventListener("DOMContentLoaded", handleExchangeLogic);
