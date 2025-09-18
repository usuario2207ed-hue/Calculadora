// calculadora.js

document.addEventListener('DOMContentLoaded', () => {

    /* --- Referências aos elementos do DOM --- */
    const navButtons = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.calculator-panel');
    
    // Calculadora Comum e Científica
    const commonDisplay = document.getElementById('common-display');
    const scientificDisplay = document.getElementById('scientific-display');
    const commonButtons = document.getElementById('common').querySelectorAll('.btn');
    const scientificButtons = document.getElementById('scientific').querySelectorAll('.btn');

    let currentInput = '0';
    let operator = null;
    let firstOperand = null;
    let isWaitingForSecondOperand = false;
    let isCommonMode = true;

    /* --- Funções de Lógica da Calculadora Comum/Científica --- */
    function updateDisplay(displayEl, value) {
        displayEl.textContent = value;
    }

    function handleNumber(number) {
        if (isWaitingForSecondOperand) {
            currentInput = number;
            isWaitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        updateDisplay(isCommonMode ? commonDisplay : scientificDisplay, currentInput);
    }

    function handleOperator(op) {
        if (operator && isWaitingForSecondOperand) {
            operator = op;
            return;
        }
        
        const inputValue = parseFloat(currentInput);
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = String(result);
            firstOperand = result;
        }
        
        isWaitingForSecondOperand = true;
        operator = op;
        updateDisplay(isCommonMode ? commonDisplay : scientificDisplay, currentInput);
    }
    
    const performCalculation = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => Math.pow(a, b) // Lógica para o botão de potencia
    };

    function handleEquals() {
        if (!operator || isWaitingForSecondOperand) return;

        const secondOperand = parseFloat(currentInput);
        const result = performCalculation[operator](firstOperand, secondOperand);
        
        currentInput = String(result);
        firstOperand = null;
        operator = null;
        isWaitingForSecondOperand = false;
        updateDisplay(isCommonMode ? commonDisplay : scientificDisplay, currentInput);
    }

    function handleScientific(func) {
        const value = parseFloat(currentInput);
        let result = 0;
        switch(func) {
            case 'sin': result = Math.sin(value * Math.PI / 180); break;
            case 'cos': result = Math.cos(value * Math.PI / 180); break;
            case 'tan': result = Math.tan(value * Math.PI / 180); break;
            case 'sqrt': result = Math.sqrt(value); break;
            case 'log': result = Math.log10(value); break;
            case 'pi': result = Math.PI; break;
            case 'e': result = Math.E; break;
            default: return;
        }
        currentInput = String(result);
        updateDisplay(scientificDisplay, currentInput);
    }

    function clearAll() {
        currentInput = '0';
        operator = null;
        firstOperand = null;
        isWaitingForSecondOperand = false;
        updateDisplay(isCommonMode ? commonDisplay : scientificDisplay, currentInput);
    }

    function backspace() {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay(isCommonMode ? commonDisplay : scientificDisplay, currentInput);
    }

    /* --- Lógica de Navegação entre Paineis --- */
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(btn.dataset.target);
            targetPanel.classList.add('active');
            
            isCommonMode = btn.dataset.target === 'common';
            // Reseta a calculadora ao mudar o painel
            clearAll();
        });
    });

    /* --- Gerenciamento de Eventos de Clique --- */
    commonButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('number') || btn.classList.contains('decimal')) {
                handleNumber(btn.textContent);
            } else if (btn.classList.contains('operator')) {
                handleOperator(btn.textContent);
            } else if (btn.classList.contains('equals')) {
                handleEquals();
            } else if (btn.classList.contains('clear')) {
                clearAll();
            } else if (btn.classList.contains('backspace')) {
                backspace();
            }
        });
    });
    
    scientificButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('number') || btn.classList.contains('decimal')) {
                handleNumber(btn.textContent);
            } else if (btn.classList.contains('operator')) {
                handleOperator(btn.textContent);
            } else if (btn.classList.contains('equals')) {
                handleEquals();
            } else if (btn.classList.contains('clear')) {
                clearAll();
            } else if (btn.classList.contains('backspace')) {
                backspace();
            } else if (btn.classList.contains('scientific-btn')) {
                handleScientific(btn.textContent.trim());
            }
        });
    });

    /* --- Lógica da Calculadora Financeira --- */
    const capitalInput = document.getElementById('capital');
    const rateInput = document.getElementById('rate');
    const timeInput = document.getElementById('time');
    const simpleResultEl = document.getElementById('simple-result');
    const calculateSimpleBtn = document.getElementById('calculate-simple');

    const capitalCompInput = document.getElementById('capital-comp');
    const rateCompInput = document.getElementById('rate-comp');
    const timeCompInput = document.getElementById('time-comp');
    const compoundResultEl = document.getElementById('compound-result');
    const calculateCompoundBtn = document.getElementById('calculate-compound');
    
    calculateSimpleBtn.addEventListener('click', () => {
        const capital = parseFloat(capitalInput.value);
        const rate = parseFloat(rateInput.value) / 100;
        const time = parseFloat(timeInput.value);

        if (!capital || !rate || !time) {
            simpleResultEl.textContent = 'Preencha todos os campos.';
            return;
        }

        const simpleInterest = capital * rate * time;
        const totalAmount = capital + simpleInterest;

        simpleResultEl.innerHTML = `Juros Simples: R$ ${simpleInterest.toFixed(2)}<br>Montante Final: R$ ${totalAmount.toFixed(2)}`;
    });

    calculateCompoundBtn.addEventListener('click', () => {
        const capital = parseFloat(capitalCompInput.value);
        const rate = parseFloat(rateCompInput.value) / 100;
        const time = parseFloat(timeCompInput.value);

        if (!capital || !rate || !time) {
            compoundResultEl.textContent = 'Preencha todos os campos.';
            return;
        }

        const totalAmount = capital * Math.pow((1 + rate), time);
        const compoundInterest = totalAmount - capital;

        compoundResultEl.innerHTML = `Juros Compostos: R$ ${compoundInterest.toFixed(2)}<br>Montante Final: R$ ${totalAmount.toFixed(2)}`;
    });


    /* --- Lógica dos Conversores --- */
    const unitFromInput = document.getElementById('unit-from');
    const unitFromResultEl = document.getElementById('unit-result');
    const unitFromTypeSelect = document.getElementById('unit-from-type');
    const unitToTypeSelect = document.getElementById('unit-to-type');
    const unitTypeSelect = document.getElementById('unit-type');

    const unitConversions = {
        'length': {
            'metros': 1, 'quilômetros': 1000, 'centímetros': 0.01, 'milímetros': 0.001
        },
        'weight': {
            'gramas': 1, 'quilogramas': 1000, 'miligramas': 0.001, 'toneladas': 1000000
        },
        'volume': {
            'litros': 1, 'mililitros': 0.001, 'galões': 3.785
        }
    };

    function populateUnitSelects() {
        const selectedType = unitTypeSelect.value;
        const units = Object.keys(unitConversions[selectedType]);
        
        unitFromTypeSelect.innerHTML = units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
        unitToTypeSelect.innerHTML = units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
    }

    function convertUnit() {
        const value = parseFloat(unitFromInput.value);
        if (isNaN(value)) {
            unitFromResultEl.textContent = 'Insira um valor válido.';
            return;
        }
        
        const selectedType = unitTypeSelect.value;
        const fromUnit = unitFromTypeSelect.value;
        const toUnit = unitToTypeSelect.value;

        const valueInBaseUnit = value * unitConversions[selectedType][fromUnit];
        const convertedValue = valueInBaseUnit / unitConversions[selectedType][toUnit];
        
        unitFromResultEl.textContent = `${convertedValue.toFixed(2)} ${toUnit}`;
    }

    unitFromInput.addEventListener('input', convertUnit);
    unitFromTypeSelect.addEventListener('change', convertUnit);
    unitToTypeSelect.addEventListener('change', convertUnit);
    unitTypeSelect.addEventListener('change', () => {
        populateUnitSelects();
        convertUnit();
    });

    // Inicializa os selects
    populateUnitSelects();
    
    // Conversor de Moedas (API Externa - Exemplo)
    const currencyFromInput = document.getElementById('currency-from');
    const currencyFromResultEl = document.getElementById('currency-result');
    const currencyFromTypeSelect = document.getElementById('currency-from-type');
    const currencyToTypeSelect = document.getElementById('currency-to-type');
    
    // As taxas de câmbio são estáticas neste exemplo. Em um projeto real, você usaria uma API como o ExchangeRate-API.
    const exchangeRates = {
        'USD': 1,
        'EUR': 0.93, // Taxa de hoje
        'BRL': 5.45 // Taxa de hoje
    };

    function convertCurrency() {
        const value = parseFloat(currencyFromInput.value);
        if (isNaN(value)) {
            currencyFromResultEl.textContent = 'Insira um valor válido.';
            return;
        }
        const fromCurrency = currencyFromTypeSelect.value;
        const toCurrency = currencyToTypeSelect.value;
        
        const valueInUSD = value / exchangeRates[fromCurrency];
        const convertedValue = valueInUSD * exchangeRates[toCurrency];
        
        currencyFromResultEl.textContent = `R$ ${convertedValue.toFixed(2)}`;
    }

    currencyFromInput.addEventListener('input', convertCurrency);
    currencyFromTypeSelect.addEventListener('change', convertCurrency);
    currencyToTypeSelect.addEventListener('change', convertCurrency);
    
    // Conversor de Temperatura
    const tempFromInput = document.getElementById('temp-from');
    const tempFromResultEl = document.getElementById('temp-result');
    const tempFromTypeSelect = document.getElementById('temp-from-type');
    const tempToTypeSelect = document.getElementById('temp-to-type');

    function convertTemp() {
        const value = parseFloat(tempFromInput.value);
        if (isNaN(value)) {
            tempFromResultEl.textContent = 'Insira um valor válido.';
            return;
        }
        
        const fromUnit = tempFromTypeSelect.value;
        const toUnit = tempToTypeSelect.value;
        let convertedValue;
        
        const toCelsius = {
            'celsius': temp => temp,
            'fahrenheit': temp => (temp - 32) * 5/9,
            'kelvin': temp => temp - 273.15
        };

        const fromCelsius = {
            'celsius': temp => temp,
            'fahrenheit': temp => (temp * 9/5) + 32,
            'kelvin': temp => temp + 273.15
        };
        
        const valueInCelsius = toCelsius[fromUnit](value);
        convertedValue = fromCelsius[toUnit](valueInCelsius);
        
        tempFromResultEl.textContent = `${convertedValue.toFixed(2)} °${toUnit.charAt(0).toUpperCase()}`;
    }
    
    tempFromInput.addEventListener('input', convertTemp);
    tempFromTypeSelect.addEventListener('change', convertTemp);
    tempToTypeSelect.addEventListener('change', convertTemp);
    
});