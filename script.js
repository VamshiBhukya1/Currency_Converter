const apiKey = 'YOUR_API_KEY'; // Replace with a valid API key
const apiURL = `https://api.exchangerate-api.com/v4/latest/`;

const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertButton = document.getElementById('convert');
const swapButton = document.getElementById('swap');
const resultText = document.getElementById('result');
const rateInfo = document.getElementById('rate-info');

// Load currency list
const loadCurrencies = async () => {
    try {
        const response = await fetch(apiURL + 'USD');
        const data = await response.json();
        const currencies = Object.keys(data.rates);

        currencies.forEach(currency => {
            fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
            toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
        });

        // Load previous selections
        fromCurrency.value = localStorage.getItem('fromCurrency') || 'USD';
        toCurrency.value = localStorage.getItem('toCurrency') || 'EUR';
        amountInput.value = localStorage.getItem('amount') || '';
    } catch (error) {
        resultText.textContent = "Error loading currencies!";
    }
};

// Perform conversion
const convertCurrency = async () => {
    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        resultText.textContent = "Please enter a valid amount!";
        return;
    }

    try {
        const response = await fetch(apiURL + fromCurrency.value);
        const data = await response.json();
        const rate = data.rates[toCurrency.value];
        const convertedAmount = (amount * rate).toFixed(2);

        resultText.textContent = `${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
        rateInfo.textContent = `Exchange Rate: 1 ${fromCurrency.value} = ${rate} ${toCurrency.value}`;

        // Save to localStorage
        localStorage.setItem('fromCurrency', fromCurrency.value);
        localStorage.setItem('toCurrency', toCurrency.value);
        localStorage.setItem('amount', amountInput.value);
    } catch (error) {
        resultText.textContent = "Error fetching exchange rate!";
    }
};

// Swap currencies
swapButton.addEventListener('click', () => {
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    convertCurrency();
});

convertButton.addEventListener('click', convertCurrency);

window.addEventListener('load', loadCurrencies);
