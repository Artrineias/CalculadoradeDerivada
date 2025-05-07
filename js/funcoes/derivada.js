function derivada(funcao) {
    return funcao.map((termo) => {
        if (termo.tipo === "polinomial") {
            return termo.exp === 0 
            ? { tipo: "polinomial", coef: 0, exp: 0 }
            : { tipo: "polinomial", coef: termo.coef * termo.exp, exp: termo.exp - 1 };
        } else if (termo.tipo === "exponencial") {
            return {
                tipo: "exponencial",
                coef: termo.coef * Math.log(termo.base),
                base: termo.base
            }
        }
    });
}

module.exports = derivada;