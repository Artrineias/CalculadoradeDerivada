document.addEventListener('DOMContentLoaded', () => {
    const tabDerivar = document.getElementById('tab-derivar');
    const tabIntegrar = document.getElementById('tab-integrar');
    const contentDerivar = document.getElementById('content-derivar');
    const contentIntegrar = document.getElementById('content-integrar');

    const inputFuncaoDerivar = document.getElementById('input-funcao-derivar');
    const btnCalcularDerivada = document.getElementById('btn-calcular-derivada');
    const resultadoDerivada = document.getElementById('resultado-derivada');

    const inputFuncaoIntegrar = document.getElementById('input-funcao-integrar');
    const inputLimiteInferior = document.getElementById('input-limite-inferior');
    const inputLimiteSuperior = document.getElementById('input-limite-superior');
    const inputSubdivisoes = document.getElementById('input-subdivisoes');
    const btnCalcularIntegral = document.getElementById('btn-calcular-integral');
    const resultadoIntegral = document.getElementById('resultado-integral');

    const btnGerarGrafico = document.getElementById('btn-gerar-grafico');
    const canvasGrafico = document.getElementById('grafico');
    let chart = null;

    let mode = 'derivar';

    function switchMode(newMode) {
        mode = newMode;
        if (mode === 'derivar') {
            tabDerivar.classList.add('active');
            tabIntegrar.classList.remove('active');
            contentDerivar.classList.add('active');
            contentIntegrar.classList.remove('active');
            clearResult(resultadoDerivada);
            clearResult(resultadoIntegral);
            // Ensure inputs are visible
            inputFuncaoDerivar.style.display = 'block';
            document.getElementById('input-intervalo-inferior').style.display = 'block';
            document.getElementById('input-intervalo-superior').style.display = 'block';
            btnCalcularDerivada.style.display = 'inline-block';

            inputFuncaoIntegrar.style.display = 'none';
            inputLimiteInferior.style.display = 'none';
            inputLimiteSuperior.style.display = 'none';
            inputSubdivisoes.style.display = 'none';
            btnCalcularIntegral.style.display = 'none';
        } else {
            tabDerivar.classList.remove('active');
            tabIntegrar.classList.add('active');
            contentDerivar.classList.remove('active');
            contentIntegrar.classList.add('active');
            clearResult(resultadoDerivada);
            clearResult(resultadoIntegral);
            // Ensure inputs are visible
            inputFuncaoDerivar.style.display = 'none';
            document.getElementById('input-intervalo-inferior').style.display = 'none';
            document.getElementById('input-intervalo-superior').style.display = 'none';
            btnCalcularDerivada.style.display = 'none';

            inputFuncaoIntegrar.style.display = 'block';
            inputLimiteInferior.style.display = 'block';
            inputLimiteSuperior.style.display = 'block';
            inputSubdivisoes.style.display = 'block';
            btnCalcularIntegral.style.display = 'inline-block';
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

    function clearResult(element) {
        element.innerHTML = '';
        element.style.color = '#222';
    }

    function showError(element, message) {
        element.innerHTML = `<span style="color:red;">${message}</span>`;
    }

    async function showResult(element, latexString) {
        // Replace newline characters and explicit \n strings with LaTeX line break \\
        let formattedLatex = latexString.replace(/\\n/g, '\\\\').replace(/\n/g, '\\\\');
        // Add extra line break after each line for spacing
        formattedLatex = formattedLatex.replace(/\\\\/g, '\\\\[12pt]');
        element.innerHTML = `\\[${formattedLatex}\\]`;
        if (window.MathJax) {
            await MathJax.typesetPromise([element]);
        }
    }

    function parseFunctionTerms(funcStr) {
        funcStr = funcStr.replace(/\s+/g, '');
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

        termos = termos.filter(t => t.trim() !== '');

        return termos;
    }

    btnCalcularDerivada.addEventListener('click', async () => {
        const funcStr = inputFuncaoDerivar.value.trim();
        const intervaloInferior = parseFloat(document.getElementById('input-intervalo-inferior').value);
        const intervaloSuperior = parseFloat(document.getElementById('input-intervalo-superior').value);

        if (!funcStr) {
            showError(resultadoDerivada, 'Por favor, insira uma função válida.');
            return;
        }
        if (isNaN(intervaloInferior) || isNaN(intervaloSuperior)) {
            showError(resultadoDerivada, 'Por favor, insira valores numéricos válidos para o intervalo.');
            return;
        }
        if (intervaloInferior >= intervaloSuperior) {
            showError(resultadoDerivada, 'O intervalo inferior deve ser menor que o intervalo superior.');
            return;
        }
        try {
            const termos = parseFunctionTerms(funcStr);
            const primeiraDerivadaTermos = derivadaString(termos);
            const primeiraDerivadaStr = formatarDerivada(primeiraDerivadaTermos);

            const segundaDerivadaTermos = derivadaString(primeiraDerivadaTermos);
            const segundaDerivadaStr = formatarDerivada(segundaDerivadaTermos);

            const pontosCriticos = encontrar_pontos_criticos(primeiraDerivadaStr, intervaloInferior, intervaloSuperior);

            let pontosTexto = [];
            if (pontosCriticos.length === 0) {
                pontosTexto.push(`\\text{Nenhum ponto crítico encontrado no intervalo } [${intervaloInferior}, ${intervaloSuperior}].`);
            } else {
                pontosTexto.push(`\\text{Pontos críticos encontrados:}`);
                const classificacoes = classificar_ponto_critico(funcStr, pontosCriticos, segundaDerivadaStr);
                classificacoes.forEach(({ ponto, tipo, valor }) => {
                    pontosTexto.push(`x = ${ponto} \\text{ (${tipo})}, f(x) = ${valor.toFixed(6)}`);
                });
            }

            await showResult(document.getElementById('firstDerivativeLatex'), `f'(x) = ${primeiraDerivadaStr}`);
            await showResult(document.getElementById('secondDerivativeLatex'), `f''(x) = ${segundaDerivadaStr}`);

            const criticalPointsList = document.getElementById('criticalPointsListLatex');
            criticalPointsList.innerHTML = '';
            pontosTexto.forEach(pt => {
                const li = document.createElement('li');
                li.innerHTML = `\\(${pt}\\)`;
                criticalPointsList.appendChild(li);
            });
            if (window.MathJax) {
                await MathJax.typesetPromise([criticalPointsList]);
            }

        } catch (err) {
            showError(resultadoDerivada, 'Erro ao calcular derivada: ' + err.message);
        }
        clearChart();
    });

    btnCalcularIntegral.addEventListener('click', async () => {
        const funcStr = inputFuncaoIntegrar.value.trim();
        const a = parseFloat(inputLimiteInferior.value);
        const b = parseFloat(inputLimiteSuperior.value);
        const n = parseInt(inputSubdivisoes.value, 10);

        if (!funcStr) {
            showError(resultadoIntegral, 'Por favor, insira uma função válida.');
            return;
        }
        if (isNaN(a) || isNaN(b) || isNaN(n)) {
            showError(resultadoIntegral, 'Por favor, insira valores numéricos válidos para os limites e subdivisões.');
            return;
        }
        if (n <= 0) {
            showError(resultadoIntegral, 'Número de subdivisões deve ser maior que zero.');
            return;
        }
        if (a >= b) {
            showError(resultadoIntegral, 'O limite inferior deve ser menor que o limite superior.');
            return;
        }

        try {
            const resultados = integralNumerica(funcStr, a, b, n);
            const latexString = `\\int_{${a}}^{${b}} f(x) dx = \\\\
                \\text{Riemann Esquerda}: ${resultados.riemannEsquerda.toFixed(6)} \\\\
                \\text{Riemann Direita}: ${resultados.riemannDireita.toFixed(6)} \\\\
                \\text{Riemann Ponto Médio}: ${resultados.riemannPontoMedio.toFixed(6)} \\\\
                \\text{Trapézio}: ${resultados.trapezio.toFixed(6)} \\\\`;

            await showResult(resultadoIntegral, latexString);
        } catch (err) {
            showError(resultadoIntegral, 'Erro ao calcular integral: ' + err.message);
        }
        clearChart();
    });

    btnGerarGrafico.addEventListener('click', () => {
        const funcStr = mode === 'derivar' ? inputFuncaoDerivar.value.trim() : inputFuncaoIntegrar.value.trim();
        if (!funcStr) {
            alert('Por favor, insira uma função válida.');
            return;
        }

        try {
            const termos = parseFunctionTerms(funcStr);
            const primeiraDerivadaTermos = derivadaString(termos);
            const segundaDerivadaTermos = derivadaString(primeiraDerivadaTermos);

            const xValues = [];
            const yFunc = [];
            const yDeriv1 = [];
            const yDeriv2 = [];

            const xMin = -10;
            const xMax = 10;
            const step = 0.2;

            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x.toFixed(2));
                const yF = avaliar(funcStr, x);
                yFunc.push(isNaN(yF) ? null : yF);
                const deriv1Str = formatarDerivada(primeiraDerivadaTermos);
                const yD1 = avaliar(deriv1Str, x);
                yDeriv1.push(isNaN(yD1) ? null : yD1);
                const deriv2Str = formatarDerivada(segundaDerivadaTermos);
                const yD2 = avaliar(deriv2Str, x);
                yDeriv2.push(isNaN(yD2) ? null : yD2);
            }

            clearChart();

            chart = new Chart(canvasGrafico, {
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

            showResult(mode === 'derivar' ? resultadoDerivada : resultadoIntegral, 'Gráfico gerado com sucesso.');
        } catch (err) {
            showError(mode === 'derivar' ? resultadoDerivada : resultadoIntegral, 'Erro ao gerar gráfico: ' + err.message);
            clearChart();
        }
    });

    switchMode('derivar');
});
