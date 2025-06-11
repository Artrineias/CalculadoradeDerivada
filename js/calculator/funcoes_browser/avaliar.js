/**
 * Avalia uma expressão matemática para um valor x usando math.evaluate do mathjs.
 * @param {string} expressao - A expressão matemática em formato string.
 * @param {number} x - O valor da variável x para avaliação.
 * @returns {number} Resultado da avaliação da expressão.
 */
function avaliar(expressao, x) {
    try {
        // Substitui 'e' por Math.E para compatibilidade
        const expressaoProcessada = expressao.replace(/\be\b/g, Math.E.toString());
        return math.evaluate(expressaoProcessada, { x });
    } catch (erro) {
        console.error(`Erro ao avaliar a expressão: ${erro.message}`);
        return NaN;
    }
}

/**
 * Função auxiliar para converter uma expressão em string para termos.
 * Mantida caso seja necessária para outras funcionalidades.
 * @param {string} expressao - Expressão matemática em formato string.
 * @returns {string[]} Array de termos da expressão.
 */
function expressaoParaTermos(expressao) {
    expressao = expressao.replace(/\s+/g, ''); // Remove espaços
    
    let termos = [];
    let inicio = 0;
    let dentro_parenteses = 0;

    for (let i = 0; i < expressao.length; i++) {
        switch (expressao[i]) {
            case '(':
                dentro_parenteses++;
                break;
            case ')':
                dentro_parenteses--;
                break;
            case '+':
            case '-':
                if (i > 0 && dentro_parenteses === 0) {
                    termos.push(expressao.slice(inicio, i));
                    inicio = i;
                }
                break;
        }
    }

    termos.push(expressao.slice(inicio));
    return termos;
}

// Expondo as funções globalmente para uso no navegador
window.avaliar = avaliar;
window.expressaoParaTermos = expressaoParaTermos;