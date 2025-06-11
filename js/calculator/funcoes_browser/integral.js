/**
 * Função auxiliar para avaliar a função em um ponto x usando math.evaluate.
 * @param {string} funcao - Função em formato string.
 * @param {number} x - Valor da variável x.
 * @returns {number} Resultado da avaliação.
 */
function avaliarFuncao(funcao, x) {
    try {
        // Substitui 'e' por Math.E para compatibilidade
        const funcaoProcessada = funcao.replace(/\be\b/g, Math.E.toString());
        return math.evaluate(funcaoProcessada, { x });
    } catch (erro) {
        throw new Error(`Erro ao avaliar a função: ${erro.message}`);
    }
}

/**
 * Método de Riemann (esquerda, direita, ponto médio).
 * @param {string} funcao - Função em string.
 * @param {number} a - Limite inferior.
 * @param {number} b - Limite superior.
 * @param {number} n - Número de subdivisões.
 * @param {string} tipo - Tipo de Riemann ('esquerda', 'direita', 'pontoMedio').
 * @returns {number} Resultado da soma de Riemann.
 */
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

/**
 * Regra dos Trapézios.
 * @param {string} funcao - Função em string.
 * @param {number} a - Limite inferior.
 * @param {number} b - Limite superior.
 * @param {number} n - Número de subdivisões.
 * @returns {number} Resultado da regra dos trapézios.
 */
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

/**
 * Função principal para integração numérica - apenas Riemann e Trapézio.
 * @param {string} funcao - Função em string.
 * @param {number} a - Limite inferior.
 * @param {number} b - Limite superior.
 * @param {number} n - Número de subdivisões.
 * @returns {Object} Resultados das integrais.
 */
function integralNumerica(funcao, a, b, n) {
    return {
        riemannEsquerda: riemann(funcao, a, b, n, 'esquerda'),
        riemannDireita: riemann(funcao, a, b, n, 'direita'),
        riemannPontoMedio: riemann(funcao, a, b, n, 'pontoMedio'),
        trapezio: trapezio(funcao, a, b, n)
    };
}

// Expondo as funções globalmente para uso no navegador
window.avaliarFuncao = avaliarFuncao;
window.riemann = riemann;
window.trapezio = trapezio;
window.integralNumerica = integralNumerica;