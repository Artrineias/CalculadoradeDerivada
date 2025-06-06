const math = require('mathjs');

// Função auxiliar para avaliar a função em um ponto x
function avaliarFuncao(funcao, x) {
    try {
        // Substitui 'e' por Math.E para compatibilidade
        const funcaoProcessada = funcao.replace(/\be\b/g, Math.E.toString());
        return math.evaluate(funcaoProcessada, { x });
    } catch (erro) {
        throw new Error(`Erro ao avaliar a função: ${erro.message}`);
    }
}

// Método de Riemann (esquerda, direita, ponto médio)
function riemann(funcao, a, b, n, tipo = 'esquerda') {
    if (n <= 0) throw new Error("Número de subdivisões deve ser positivo");
    if (a >= b) throw new Error("Limite inferior deve ser menor que o superior");
    
    const dx = (b - a) / n;
    let soma = 0;
    
    for (let i = 0; i < n; i++) {
        let xi;
        switch (tipo) {
            case 'esquerda':
                xi = a + i * dx;
                break;
            case 'direita':
                xi = a + (i + 1) * dx;
                break;
            case 'pontoMedio':
                xi = a + (i + 0.5) * dx;
                break;
            default:
                throw new Error("Tipo deve ser 'esquerda', 'direita' ou 'pontoMedio'");
        }
        soma += avaliarFuncao(funcao, xi);
    }
    return soma * dx;
}

// Regra dos Trapézios
function trapezio(funcao, a, b, n) {
    if (n <= 0) throw new Error("Número de subdivisões deve ser positivo");
    if (a >= b) throw new Error("Limite inferior deve ser menor que o superior");
    
    const dx = (b - a) / n;
    let soma = (avaliarFuncao(funcao, a) + avaliarFuncao(funcao, b)) / 2;
    
    for (let i = 1; i < n; i++) {
        const xi = a + i * dx;
        soma += avaliarFuncao(funcao, xi);
    }
    return soma * dx;
}

// Função principal para integração numérica - apenas Riemann e Trapézio
function integralNumerica(funcao, a, b, n) {
    return {
        riemannEsquerda: riemann(funcao, a, b, n, 'esquerda'),
        riemannDireita: riemann(funcao, a, b, n, 'direita'),
        riemannPontoMedio: riemann(funcao, a, b, n, 'pontoMedio'),
        trapezio: trapezio(funcao, a, b, n)
    };
}

module.exports = {
    integralNumerica,
    riemann,
    trapezio
};
