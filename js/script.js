/* eslint-disable no-undef */
// Assuming avaliar, derivadaString, formatarDerivada, integralNumerica, encontrar_pontos_criticos, classificar_ponto_critico are globally available

document.addEventListener('DOMContentLoaded', () => {
    const tabDerivar = document.getElementById('tab-derivar');
    const tabIntegrar = document.getElementById('tab-integrar');
    const integralInputs = document.getElementById('integral-inputs');
    const btnCalcularDerivada = document.getElementById('btn-calcular-derivada');
    const btnCalcularIntegral = document.getElementById('btn-calcular-integral');
    const btnGerarGrafico = document.getElementById('btn-gerar-grafico');
    const funcaoInput = document.getElementById('funcao-input');
    const resultadoDiv = document.getElementById('resultado');
    const graficoCanvas = document.getElementById('grafico');
    let chart = null;

    // Mode state: 'derivar' or 'integrar'
    let mode = 'derivar';

    function switchMode(newMode) {
        mode = newMode;
        if (mode === 'derivar') {
            tabDerivar.classList.add('active');
            tabIntegrar.classList.remove('active');
            integralInputs.classList.add('hidden');
            btnCalcularDerivada.classList.remove('hidden');
            btnCalcularIntegral.classList.add('hidden');
            resultadoDiv.textContent = '';
        } else {
            tabDerivar.classList.remove('active');
            tabIntegrar.classList.add('active');
            integralInputs.classList.remove('hidden');
            btnCalcularDerivada.classList.add('hidden');
            btnCalcularIntegral.classList.remove('hidden');
            resultadoDiv.textContent = '';
        }
        clearChart();
    }

    tabDerivar.addEventListener('click', () => switchMode('derivar'));
    tabIntegrar.addEventListener('click', () => switchMode('integrar'));

    function clearChart() {
        if (chart) {
            chart.destroy();
            chart = null;
        }
    }

    function showError(message) {
        resultadoDiv.textContent = message;
        resultadoDiv.style.color = 'red';
    }

    function showResult(message) {
        resultadoDiv.textContent = message;
        resultadoDiv.style.color = '#222';
    }

    function parseFunctionTerms(funcStr) {
        // Adapted from main.js nova_funcao function to split terms considering parentheses and signs
        funcStr = funcStr.replace(/\s+/g, ''); // Remove spaces
        let termos = [];
        let inicio = 0;
        let dentro_parenteses = 0;

        for (let i = 0; i < funcStr.length; i++) {
            let char = funcStr[i];

            if (char === '(') {
                dentro_parenteses++;
            } else if (char === ')') {
                dentro_parenteses--;
            }
            if (i > 0 && dentro_parenteses === 0) {
                if ((char === '+' || char === '-') && funcStr[i - 1] !== '^') {
                    termos.push(funcStr.slice(inicio, i));
                    inicio = i;
                }
            }
        }
        termos.push(funcStr.slice(inicio));

        // Filter empty terms that may appear due to multiple signs or leading sign
        termos = termos.filter(t => t.trim() !== '');

        return termos;
    }

    btnCalcularDerivada.addEventListener('click', () => {
        const funcStr = funcaoInput.value.trim();
        if (!funcStr) {
            showError('Por favor, insira uma função válida.');
            return;
        }
        try {
            const termos = parseFunctionTerms(funcStr);
            const primeiraDerivadaTermos = derivadaString(termos);
            const primeiraDerivadaStr = formatarDerivada(primeiraDerivadaTermos);

            const segundaDerivadaTermos = derivadaString(primeiraDerivadaTermos);
            const segundaDerivadaStr = formatarDerivada(segundaDerivadaTermos);

            // Find critical points and classify them
            const pontosCriticos = encontrar_pontos_criticos(primeiraDerivadaStr);

            let pontosTexto = '';
            if (pontosCriticos.length === 0) {
                pontosTexto = '\nNenhum ponto crítico encontrado no intervalo [-10, 10].';
            } else {
                pontosTexto = '\nPontos críticos encontrados:\n';
                const classificacoes = classificar_ponto_critico(parseFunctionTerms(funcStr), pontosCriticos, segundaDerivadaStr);
                classificacoes.forEach(({ ponto, tipo, valor }) => {
                    pontosTexto += `x = ${ponto} (${tipo}), f(x) = ${valor.toFixed(6)}\n`;
                });
            }

            showResult(
                `f'(x) = ${primeiraDerivadaStr}\n` +
                `f''(x) = ${segundaDerivadaStr}` +
                pontosTexto
            );
        } catch (err) {
            showError('Erro ao calcular derivada: ' + err.message);
        }
        clearChart();
    });

    btnCalcularIntegral.addEventListener('click', () => {
        const funcStr = funcaoInput.value.trim();
        const a = parseFloat(document.getElementById('limite-inferior').value);
        const b = parseFloat(document.getElementById('limite-superior').value);
        const n = parseInt(document.getElementById('subdivisoes').value, 10);

        if (!funcStr) {
            showError('Por favor, insira uma função válida.');
            return;
        }
        if (isNaN(a) || isNaN(b) || isNaN(n)) {
            showError('Por favor, insira valores numéricos válidos para os limites e subdivisões.');
            return;
        }
        if (n <= 0) {
            showError('Número de subdivisões deve ser maior que zero.');
            return;
        }
        if (a >= b) {
            showError('O limite inferior deve ser menor que o limite superior.');
            return;
        }

        try {
            const resultados = integralNumerica(funcStr, a, b, n);
            showResult(
                `Integral numérica entre ${a} e ${b} com ${n} subdivisões:\n` +
                `Riemann Esquerda: ${resultados.riemannEsquerda.toFixed(6)}\n` +
                `Riemann Direita: ${resultados.riemannDireita.toFixed(6)}\n` +
                `Riemann Ponto Médio: ${resultados.riemannPontoMedio.toFixed(6)}\n` +
                `Trapézio: ${resultados.trapezio.toFixed(6)}`
            );
        } catch (err) {
            showError('Erro ao calcular integral: ' + err.message);
        }
        clearChart();
    });

    btnGerarGrafico.addEventListener('click', () => {
        const funcStr = funcaoInput.value.trim();
        if (!funcStr) {
            showError('Por favor, insira uma função válida.');
            return;
        }

        try {
            const termos = parseFunctionTerms(funcStr);
            const primeiraDerivadaTermos = derivadaString(termos);
            const segundaDerivadaTermos = derivadaString(primeiraDerivadaTermos);

            // Prepare data points
            const xValues = [];
            const yFunc = [];
            const yDeriv1 = [];
            const yDeriv2 = [];

            // Define range and step for plotting
            const xMin = -10;
            const xMax = 10;
            const step = 0.2;

            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x.toFixed(2));
                // Evaluate original function
                const yF = avaliar(funcStr, x);
                yFunc.push(isNaN(yF) ? null : yF);
                // Evaluate first derivative
                const deriv1Str = formatarDerivada(primeiraDerivadaTermos);
                const yD1 = avaliar(deriv1Str, x);
                yDeriv1.push(isNaN(yD1) ? null : yD1);
                // Evaluate second derivative
                const deriv2Str = formatarDerivada(segundaDerivadaTermos);
                const yD2 = avaliar(deriv2Str, x);
                yDeriv2.push(isNaN(yD2) ? null : yD2);
            }

            clearChart();

            chart = new Chart(graficoCanvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: [
                        {
                            label: 'f(x)',
                            data: yFunc,
                            borderColor: '#4a90e2',
                            backgroundColor: 'rgba(74, 144, 226, 0.2)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.3,
                        },
                        {
                            label: "f'(x)",
                            data: yDeriv1,
                            borderColor: '#50c878',
                            backgroundColor: 'rgba(80, 200, 120, 0.2)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.3,
                        },
                        {
                            label: "f''(x)",
                            data: yDeriv2,
                            borderColor: '#f39c12',
                            backgroundColor: 'rgba(243, 156, 18, 0.2)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.3,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    stacked: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            enabled: true,
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'x',
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'y',
                            }
                        }
                    }
                }
            });

            showResult('Gráfico gerado com sucesso.');
        } catch (err) {
            showError('Erro ao gerar gráfico: ' + err.message);
            clearChart();
        }
    });

    // Initialize in derivar mode
    switchMode('derivar');
});
