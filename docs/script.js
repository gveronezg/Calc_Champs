document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Selection Logic ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const toolContents = document.querySelectorAll('.tool-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Update buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content sections
            toolContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // --- Core Calculation Logic ---

    // 1. Product Comparison
    const compareInputs = ['priceA', 'unitsA', 'weightA', 'priceB', 'unitsB', 'weightB'];
    compareInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateComparison);
    });

    function calculateComparison() {
        const pA = parseFloat(document.getElementById('priceA').value);
        const uA = parseFloat(document.getElementById('unitsA').value) || 1;
        const wA = parseFloat(document.getElementById('weightA').value);

        const pB = parseFloat(document.getElementById('priceB').value);
        const uB = parseFloat(document.getElementById('unitsB').value) || 1;
        const wB = parseFloat(document.getElementById('weightB').value);

        const resultDiv = document.getElementById('compare-result');
        const textSpan = document.getElementById('compare-text');
        const detailSpan = document.getElementById('compare-detail');

        if (pA && wA && pB && wB) {
            const yieldA = (uA * wA) / pA; // Amount per R$1
            const yieldB = (uB * wB) / pB;

            resultDiv.style.display = 'block';

            if (yieldA > yieldB) {
                const diff = ((yieldA / yieldB - 1) * 100).toFixed(1);
                textSpan.innerHTML = '<span class="highlight-green">Produto A</span> é melhor';
                detailSpan.innerHTML = `O Produto A rende <strong>${diff}%</strong> a mais por cada Real investido.`;
            } else if (yieldB > yieldA) {
                const diff = ((yieldB / yieldA - 1) * 100).toFixed(1);
                textSpan.innerHTML = '<span class="highlight-green">Produto B</span> é melhor';
                detailSpan.innerHTML = `O Produto B rende <strong>${diff}%</strong> a mais por cada Real investido.`;
            } else {
                textSpan.innerText = 'Custo idêntico';
                detailSpan.innerText = 'Ambos os produtos têm a mesma relação custo-benefício.';
            }
        } else {
            resultDiv.style.display = 'none';
        }
    }

    // 2. Investment Analysis
    const investInputs = ['installments', 'instValue', 'cashValue', 'yieldPerc'];
    investInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateInvestment);
    });

    function calculateInvestment() {
        const qParc = parseInt(document.getElementById('installments').value);
        const vParc = parseFloat(document.getElementById('instValue').value);
        const vCash = parseFloat(document.getElementById('cashValue').value);
        const pYield = parseFloat(document.getElementById('yieldPerc').value) || 0;

        const resultDiv = document.getElementById('invest-result');
        const textSpan = document.getElementById('invest-text');
        const detailSpan = document.getElementById('invest-detail');

        if (qParc && vParc && vCash) {
            const totalPaid = qParc * vParc;
            // Compound interest: M = P * (1 + i)^n
            const futureValue = vCash * Math.pow((1 + (pYield / 100)), qParc);

            resultDiv.style.display = 'block';

            if (futureValue > totalPaid) {
                const profit = (futureValue - totalPaid).toFixed(2);
                textSpan.innerHTML = 'Opção: <span class="highlight-green">PARCELAR</span>';
                detailSpan.innerHTML = `Se você investir o dinheiro à vista, terá <strong>R$ ${futureValue.toFixed(2)}</strong> ao final das parcelas.<br>Isso é <strong>R$ ${profit}</strong> a mais do que o custo do produto!`;
            } else {
                const loss = (totalPaid - futureValue).toFixed(2);
                textSpan.innerHTML = 'Opção: <span class="highlight-pink">À VISTA</span>';
                detailSpan.innerHTML = `O rendimento do investimento não cobre o custo do parcelamento.<br>Pagar à vista economiza <strong>R$ ${loss}</strong> em relação ao total parcelado final.`;
            }
        } else {
            resultDiv.style.display = 'none';
        }
    }

    // 3. Fuel Autonomy
    const fuelInputs = ['fuelPrice', 'fuelSpent', 'currentKm'];
    fuelInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateFuel);
    });

    function calculateFuel() {
        const price = parseFloat(document.getElementById('fuelPrice').value);
        const spent = parseFloat(document.getElementById('fuelSpent').value);
        const currentKm = parseFloat(document.getElementById('currentKm').value);

        const resultDiv = document.getElementById('fuel-result');
        const textSpan = document.getElementById('fuel-text');
        const detailSpan = document.getElementById('fuel-detail');

        if (price && spent && currentKm) {
            const liters = spent / price;
            const distance = liters * 10; // Assuming 10km/L
            const refillAt = currentKm + distance;

            resultDiv.style.display = 'block';
            textSpan.innerHTML = `<span class="highlight">${refillAt.toFixed(0)} KM</span>`;
            detailSpan.innerHTML = `Com R$ ${spent.toFixed(2)}, você abasteceu <strong>${liters.toFixed(2)} litros</strong>.<br>Deve rodar aproximadamente <strong>${distance.toFixed(0)} KM</strong>.`;
        } else {
            resultDiv.style.display = 'none';
        }
    }
});
