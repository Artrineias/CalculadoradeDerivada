
document.addEventListener('DOMContentLoaded', () => {
    const funcaoInput = document.getElementById('funcaoInput');
    const tabDerivada = document.getElementById('tabDerivada');
    const tabIntegral = document.getElementById('tabIntegral');
    const integralParams = document.getElementById('integralParams');
    const limiteInferior = document.getElementById('limiteInferior');
    const limiteSuperior = document.getElementById('limiteSuperior');
    const numIntervalos = document.getElementById('numIntervalos');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultDiv = document.getElementById('result');
    const ctx = document.getElementById('functionChart').getContext('2d');

    let chart = null;
    let tipoCalc = 'derivada';

    function setActiveTab(tab) {
        if (tab === 'derivada') {
            tabDerivada.classList.add('active');
            tabDerivada.setAttribute('aria-selected', 'true');
            tabDerivada.setAttribute('tabindex', '0');
            tabIntegral.classList.remove('active');
            tabIntegral.setAttribute('aria-selected', 'false');
            tabIntegral.setAttribute('tabindex', '-1');
            integralParams.style.display = 'none';
            tipoCalc = 'derivada';
        } else {
            tabIntegral.classList.add('active');
            tabIntegral.setAttribute('aria-selected', 'true');
            tabIntegral.setAttribute('tabindex', '0');
            tabDerivada.classList.remove('active');
            tabDerivada.setAttribute('aria-selected', 'false');
            tabDerivada.setAttribute('tabindex', '-1');
            integralParams.style.display = 'block';
            tipoCalc = 'integral';
        }
        resultDiv.textContent = '';
        if (chart) {
            chart.destroy();
            chart = null;
        }
    }

    tabDerivada.addEventListener('click', () => setActiveTab('derivada'));
    tabIntegral.addEventListener('click', () => setActiveTab('integral'));

    calcularBtn.addEventListener('click', () => {
        const funcao = funcaoInput.value.trim();
        if (!funcao) {
            alert('Por favor, insira uma função.');
            return;
        }

        if (chart) {
            chart.destroy();
            chart = null;
        }

        if (tipoCalc === 'derivada') {
            try {
                const termos = window.expressaoParaTermos(funcao);
                const derivada = window.derivadaString(termos);
                const derivadaFormatada = window.formatarDerivada(derivada);
                const segundaDerivada = window.derivadaString(derivada);
                const segundaDerivadaFormatada = window.formatarDerivada(segundaDerivada);
                const pontosCriticos = window.encontrar_pontos_criticos(derivadaFormatada);
                const classificacao = window.classificar_ponto_critico(termos.join(''), pontosCriticos, segundaDerivadaFormatada);

                let output = `Primeira derivada: f'(x) = ${derivadaFormatada}\n`;
                output += `Segunda derivada: f''(x) = ${segundaDerivadaFormatada}\n\n`;

                if (pontosCriticos.length === 0) {
                    output += 'Nenhum ponto crítico encontrado no intervalo [-10, 10].\n';
                } else {
                    output += 'Pontos críticos encontrados:\n';
                    classificacao.forEach(item => {
                        output += `x = ${item.ponto.toFixed(6)} (${item.tipo}), f(x) = ${item.valor.toFixed(6)}\n`;
                    });
                }

                resultDiv.textContent = output;

                // Plot original function and first derivative
                const originalFunc = x => window.avaliar(funcao, x);
                const derivFunc = x => window.avaliar(derivadaFormatada, x);

                const xLabels = [];
                const originalData = [];
                const derivData = [];

                for (let x = -10; x <= 10; x += 0.1) {
                    xLabels.push(x.toFixed(2));
                    try {
                        const y1 = originalFunc(x);
                        originalData.push(isNaN(y1) ? null : y1);
                    } catch {
                        originalData.push(null);
                    }
                    try {
                        const y2 = derivFunc(x);
                        derivData.push(isNaN(y2) ? null : y2);
                    } catch {
                        derivData.push(null);
                    }
                }

                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: xLabels,
                        datasets: [
                            {
                                label: 'f(x)',
                                data: originalData,
                                borderColor: 'blue',
                                fill: false,
                                tension: 0.1,
                            },
                            {
                                label: "f'(x)",
                                data: derivData,
                                borderColor: 'red',
                                fill: false,
                                tension: 0.1,
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
                            title: {
                                display: true,
                                text: 'Função e sua Derivada'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }
                });

            } catch (error) {
                resultDiv.textContent = 'Erro ao calcular derivada: ' + error.message;
            }
        } else if (tipoCalc === 'integral') {
            const a = parseFloat(limiteInferior.value);
            const b = parseFloat(limiteSuperior.value);
            const n = parseInt(numIntervalos.value);

            if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
                alert('Por favor, insira valores válidos para os limites e número de intervalos.');
                return;
            }

            try {
                const resultados = window.integralNumerica(funcao, a, b, n);
                let output = 'Integrais Numéricas:\n';
                output += `Soma de Riemann (esquerda): ${resultados.riemannEsquerda.toFixed(6)}\n`;
                output += `Soma de Riemann (direita): ${resultados.riemannDireita.toFixed(6)}\n`;
                output += `Soma de Riemann (ponto médio): ${resultados.riemannPontoMedio.toFixed(6)}\n`;
                output += `Regra dos Trapézios: ${resultados.trapezio.toFixed(6)}\n`;

                resultDiv.textContent = output;

                // Plot original function
                const originalFunc = x => window.avaliarFuncao(funcao, x);

                const xLabels = [];
                const yData = [];
                for (let x = a; x <= b; x += (b - a) / 100) {
                    xLabels.push(x.toFixed(2));
                    try {
                        const y = originalFunc(x);
                        yData.push(isNaN(y) ? null : y);
                    } catch {
                        yData.push(null);
                    }
                }

                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: xLabels,
                        datasets: [{
                            label: 'f(x)',
                            data: yData,
                            borderColor: 'blue',
                            fill: false,
                            tension: 0.1,
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Função'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }
                });

            } catch (error) {
                resultDiv.textContent = 'Erro ao calcular integrais: ' + error.message;
            }
        }
    });

    // Initialize with derivative tab active
    setActiveTab('derivada');
});
