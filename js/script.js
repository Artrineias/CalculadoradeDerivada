function criarEntradas() {
    const n = Number(document.getElementById("numTermos").value);
    const form = document.getElementById("formFuncoes");
    form.innerHTML = "";
    for (let i = 0; i < n; i++) {
      form.innerHTML += `
        <h3>Termo ${i + 1}</h3>
        Tipo: <select name="tipo${i}">
          <option value="p">Polinomial</option>
          <option value="e">Exponencial</option>
        </select><br>
        Coeficiente: <input type="number" step="any" name="coef${i}" required><br>
        Expoente (ou base para exponencial): <input type="number" step="any" name="expbase${i}" required><br>
      `;
    }
  }
  
  function obterFuncao(n) {
    let funcao = [];
    for (let i = 0; i < n; i++) {
      let tipo = document.querySelector(`[name='tipo${i}']`).value;
      let coef = parseFloat(document.querySelector(`[name='coef${i}']`).value);
      let valor = parseFloat(document.querySelector(`[name='expbase${i}']`).value);
      if (tipo === 'p') {
        funcao.push({ tipo: 'polinomial', coef, exp: valor });
      } else {
        funcao.push({ tipo: 'exponencial', coef, base: valor });
      }
    }
    return funcao;
  }
  
  function imprimeFuncao(funcao) {
    return funcao.map((termo, i) => {
      if (termo.tipo === "polinomial") {
        return `Termo ${i + 1}: ${termo.coef} * x^${termo.exp}`;
      } else {
        return `Termo ${i + 1}: ${termo.coef.toFixed(4)} * ${termo.base}^x`;
      }
    }).join('<br>');
  }
  
  function derivada(funcao) {
    return funcao.map((termo) => {
      if (termo.tipo === "polinomial") {
        return termo.exp === 0
          ? { tipo: "polinomial", coef: 0, exp: 0 }
          : { tipo: "polinomial", coef: termo.coef * termo.exp, exp: termo.exp - 1 };
      } else {
        return {
          tipo: "exponencial",
          coef: termo.coef * Math.log(termo.base),
          base: termo.base
        };
      }
    });
  }
  
  function pontosCriticos(derivada) {
    let pontos = [];
    derivada.forEach((termo) => {
      if (termo.tipo === 'polinomial' && termo.exp === 0) {
        pontos.push({ x: 0, y: 0 }); // Exemplo: para polinômios constantes
      }
    });
    return pontos;
  }
  
  function processarFuncao() {
    const n = Number(document.getElementById("numTermos").value);
    const funcao = obterFuncao(n);
  
    let primeiraDerivada = derivada(funcao);
    let segundaDerivada = derivada(primeiraDerivada);
    let pontosCriticosDerivada = pontosCriticos(primeiraDerivada);
    
    let funcaoText = imprimeFuncao(funcao);
    let primeiraDerivadaText = imprimeFuncao(primeiraDerivada);
    let segundaDerivadaText = imprimeFuncao(segundaDerivada);
    
    document.getElementById("saida").innerHTML = `
      <h2>Função Original:</h2>
      <p>${funcaoText}</p>
      <h2>Primeira Derivada:</h2>
      <p>${primeiraDerivadaText}</p>
      <h2>Segunda Derivada:</h2>
      <p>${segundaDerivadaText}</p>
    `;
    
    desenharGrafico(funcao, primeiraDerivada, segundaDerivada, pontosCriticosDerivada);
  }
  
  function desenharGrafico(funcao, primeiraDerivada, segundaDerivada, pontosCriticos) {
    const ctx = document.getElementById("grafico").getContext("2d");
  
    // Função para desenhar o gráfico
    const desenharFuncao = (funcao, x) => {
      return funcao.reduce((acc, termo) => {
        return acc + termo.coef * Math.pow(x, termo.exp);
      }, 0);
    };
  
    const desenharPrimeiraDerivada = (derivada, x) => {
      return derivada.reduce((acc, termo) => {
        return acc + termo.coef * Math.pow(x, termo.exp);
      }, 0);
    };
  
    const desenharSegundaDerivada = (derivada, x) => {
      return derivada.reduce((acc, termo) => {
        return acc + termo.coef * Math.pow(x, termo.exp);
      }, 0);
    };
  
    let xValues = [];
    let yValuesFuncao = [];
    let yValuesPrimeiraDerivada = [];
    let yValuesSegundaDerivada = [];
  
    for (let x = -10; x <= 10; x += 0.1) {
      xValues.push(x);
      yValuesFuncao.push(desenharFuncao(funcao, x));
      yValuesPrimeiraDerivada.push(desenharPrimeiraDerivada(primeiraDerivada, x));
      yValuesSegundaDerivada.push(desenharSegundaDerivada(segundaDerivada, x));
    }
  
    // Gráfico
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [
          {
            label: 'Função Original',
            data: yValuesFuncao,
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'Primeira Derivada',
            data: yValuesPrimeiraDerivada,
            borderColor: 'green',
            fill: false
          },
          {
            label: 'Segunda Derivada',
            data: yValuesSegundaDerivada,
            borderColor: 'red',
            fill: false
          },
          {
            label: 'Pontos Críticos',
            data: pontosCriticos,
            borderColor: 'black',
            backgroundColor: 'black',
            radius: 5,
            pointStyle: 'circle',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          x: { type: 'linear' },
          y: { beginAtZero: true }
        }
      }
    });
  }
  