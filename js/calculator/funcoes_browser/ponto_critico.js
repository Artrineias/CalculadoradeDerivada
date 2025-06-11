/**
 * Encontra um ponto crítico usando o método da bissecção.
 * @param {string} expressao - Expressão matemática em string.
 * @param {number} inicio - Início do intervalo.
 * @param {number} fim - Fim do intervalo.
 * @param {number} tolerancia - Tolerância para o critério de parada.
 * @param {number} max_iteracoes - Número máximo de iterações.
 * @returns {number|null} Ponto crítico encontrado ou null se não houver mudança de sinal.
 */
function encontrar_ponto_critico_bissecao(expressao, inicio, fim, tolerancia = 1e-8, max_iteracoes = 100) {
    let a = inicio;
    let b = fim;
    let fa = window.avaliar(expressao, a);
    let fb = window.avaliar(expressao, b);
    
    if (fa * fb > 0) {
        return null;
    }
    
    let iteracao = 0;
    while ((b - a) > tolerancia && iteracao < max_iteracoes) {
        let c = (a + b) / 2;
        let fc = window.avaliar(expressao, c);
        
        if (Math.abs(fc) < tolerancia) {
            return Number(c.toFixed(6));
        }
        
        if (fa * fc < 0) {
            b = c;
            fb = fc;
        } else {
            a = c;
            fa = fc;
        }
        
        iteracao++;
    }
    
    return Number(((a + b) / 2).toFixed(6));
}

/**
 * Encontra todos os pontos críticos em um intervalo.
 * @param {string} expressao - Expressão matemática em string.
 * @param {number} inicio - Início do intervalo.
 * @param {number} fim - Fim do intervalo.
 * @param {number} granularidade - Passo para varredura do intervalo.
 * @param {number} tolerancia - Tolerância para o critério de parada.
 * @returns {number[]} Array de pontos críticos encontrados.
 */
function encontrar_pontos_criticos(expressao, inicio = -10, fim = 10, granularidade = 0.1, tolerancia = 1e-8) {
    let pontos_criticos = [];
    
    for (let i = inicio; i < fim; i += granularidade) {
        let subInicio = i;
        let subFim = i + granularidade;
        
        let valorInicio = window.avaliar(expressao, subInicio);
        let valorFim = window.avaliar(expressao, subFim);
        
        if (valorInicio * valorFim <= 0 || Math.abs(valorInicio) < tolerancia || Math.abs(valorFim) < tolerancia) {
            let ponto = encontrar_ponto_critico_bissecao(expressao, subInicio, subFim, tolerancia);
            
            if (ponto !== null) {
                if (!pontos_criticos.some(p => Math.abs(p - ponto) < tolerancia * 10)) {
                    pontos_criticos.push(ponto);
                }
            }
        }
    }
    
    return pontos_criticos.sort((a, b) => a - b);
}

/**
 * Classifica pontos críticos com base na segunda derivada.
 * @param {string} funcaoOriginal - Função original em string.
 * @param {number[]} pontosCriticos - Array de pontos críticos.
 * @param {string} segundaDerivada - Segunda derivada da função em string.
 * @returns {Object[]} Array de objetos com ponto, tipo e valor.
 */
function classificar_ponto_critico(funcaoOriginal, pontosCriticos, segundaDerivada) {
    let resultado = [];
    
    for (let ponto of pontosCriticos) {
        let valor_segunda_derivada = window.avaliar(segundaDerivada, ponto);
        let valor_funcao = window.avaliar(funcaoOriginal, ponto);
        
        let tipo;
        if (Math.abs(valor_segunda_derivada) < 1e-8) {
            tipo = "Ponto de inflexão ou indeterminado";
        } else if (valor_segunda_derivada > 0) {
            tipo = "Mínimo local";
        } else {
            tipo = "Máximo local";
        }
        
        resultado.push({
            ponto,
            tipo,
            valor: valor_funcao
        });
        
        console.log(`x = ${ponto.toFixed(6)} (${tipo}), f(${ponto.toFixed(6)}) = ${valor_funcao.toFixed(6)}`);
    }
    
    return resultado;
}

// Expondo as funções globalmente para uso no navegador
window.encontrar_ponto_critico_bissecao = encontrar_ponto_critico_bissecao;
window.encontrar_pontos_criticos = encontrar_pontos_criticos;
window.classificar_ponto_critico = classificar_ponto_critico;