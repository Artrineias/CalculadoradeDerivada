const math = require('mathjs');

// Função para calcular a integral analítica
function integralString(termos) {
    let integral = [];
    for (let termo of termos) {
        let coeficiente = 1, expoente = 0, variavel = '', base = '';

        // Extrair coeficiente, variável, expoente e outras partes (como e^x, ln(x))
        let match = termo.match(/^([+-]?\d*\.?\d*)\*?([a-zA-Z]+)(\^([+-]?\d*\.?\d*))?|^([+-]?\d*\.?\d*)\*?e\^([a-zA-Z]+)|^([+-]?\d*\.?\d*)\*?ln\(([a-zA-Z]+)\)/);
        
        if (match) {
            if (match[1] !== undefined) { // Forma: ax^n
                coeficiente = match[1] ? parseFloat(match[1]) : 1;
                if (match[1] === '+' || match[1] === '') coeficiente = 1;
                if (match[1] === '-') coeficiente = -1;
                
                variavel = match[2];
                expoente = match[4] ? parseFloat(match[4]) : 1;
                
                // Integração: ∫ax^n dx = (a/(n+1))x^(n+1)
                const novoCoeficiente = coeficiente / (expoente + 1);
                const novoExpoente = expoente + 1;
                integral.push(`${novoCoeficiente}*${variavel}^${novoExpoente}`);
                
            } else if (match[5] !== undefined) { // Forma: ae^x
                coeficiente = match[5] ? parseFloat(match[5]) : 1;
                if (match[5] === '+' || match[5] === '') coeficiente = 1;
                if (match[5] === '-') coeficiente = -1;
                
                base = match[6];
                // Integração: ∫ae^x dx = ae^x
                integral.push(`${coeficiente}*e^${base}`);
                
            } else if (match[7] !== undefined) { // Forma: aln(x)
                coeficiente = match[7] ? parseFloat(match[7]) : 1;
                if (match[7] === '+' || match[7] === '') coeficiente = 1;
                if (match[7] === '-') coeficiente = -1;
                
                variavel = match[8];
                // Integração: ∫aln(x) dx = ax*ln(x) - ax
                integral.push(`${coeficiente}*${variavel}*ln(${variavel})-${coeficiente}*${variavel}`);
            }
        } else if (termo.match(/^[+-]?\d*\.?\d*$/)) { // Constante
            coeficiente = parseFloat(termo) || 0;
            // Integração: ∫a dx = ax
            integral.push(`${coeficiente}*x`);
        }
    }
    return integral;
}

// Função para formatar a integral analítica
function formatarIntegral(integral) {
    if (integral.length === 0) return "0";
    return integral.join(" + ")
        .replace(/\+\s-/g, "- ")
        .replace(/1\*/g, "")
        .replace(/\*1(?!\d)/g, "")
        .replace(/\^1(?!\d)/g, "");
}

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
    integralString,
    formatarIntegral,
    integralNumerica,
    riemann,
    trapezio
};
