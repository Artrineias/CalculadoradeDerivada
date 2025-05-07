function avaliar(funcao, x) {
    let resultado = 0;
    funcao.forEach(termo => {
        if (termo.tipo === "polinomial") {
            resultado += termo.coef * (x ** termo.exp);
        } else {
            resultado += termo.coef * (termo.base ** x); 
        }
    });
    return resultado;
}

function encontrar_pontos_criticos(primeiraDerivada, inicio = -10, fim = 10, passo = 0.001, tolerancia = 1e-8) {
    let pontos_criticos = [];
    let x = inicio;
    let y_anterior = avaliar(primeiraDerivada, x);
    while (x <= fim) {
        let y = avaliar(primeiraDerivada, x);
        if (Math.abs(y) < tolerancia || y * y_anterior < 0) { // Detecta mudança de sinal
            let ponto = Number(x.toFixed(3));
            if (!pontos_criticos.includes(ponto)) { // Evita duplicatas
                pontos_criticos.push(ponto);
            }
        }
        y_anterior = y;
        x += passo;
    }
    return pontos_criticos;
}

module.exports = avaliar;
module.exports = encontrar_pontos_criticos;
