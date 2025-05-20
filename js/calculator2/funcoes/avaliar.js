// Função para avaliar um termo matemático
function avaliarTermo(termo, x) {
    // Polinomial: ax^n
    if (/^-?\d*\.?\d*x\^\d+$/.test(termo)) {
        const match = termo.match(/^(-?\d*\.?\d*)x\^(\d+)$/);
        const coef = parseFloat(match[1] || (match[1] === '-' ? -1 : 1));
        const exp = parseInt(match[2]);
        return coef * (x ** exp);

    // Linear: ax
    } else if (/^-?\d*\.?\d*x$/.test(termo)) {
        const coef = parseFloat(termo.replace('x', '') || (termo.startsWith('-') ? -1 : 1));
        return coef * x;

    // Exponencial: ae^x ou ae^(x)
    } else if (/^-?\d*\.?\d*e\^\(?[a-zA-Z0-9+\-*/^]+\)?$/.test(termo)) {
        const match = termo.match(/^(-?\d*\.?\d*)?e\^\(?([^)]+)\)?$/);
        if (!match) return 0;

        const coefStr = match[1];
        let coef = 1;
        if (coefStr === '-') coef = -1;
        else if (coefStr) coef = parseFloat(coefStr);

        // Assumimos que o argumento é apenas x
        return coef * (Math.E ** x);

    // Constante: número puro
    } else if (/^-?\d+(\.\d+)?$/.test(termo)) {
        return parseFloat(termo);
    }

    return 0; // Termo não reconhecido
}

// Função para avaliar uma expressão completa
function avaliar(expressao, x) {
    // Se a expressão for uma string, convertemos para um array de termos
    let termos = Array.isArray(expressao) ? expressao : expressaoParaTermos(expressao);
    
    let resultado = 0;
    
    for (let termoOriginal of termos) {
        let termo = termoOriginal.trim();
        let sinal = 1;

        if (termo.startsWith('+')) {
            termo = termo.slice(1);
        } else if (termo.startsWith('-')) {
            sinal = -1;
            termo = termo.slice(1);
        }

        // Verifica se o termo está entre parênteses
        if (/^\(.*\)$/.test(termo)) {
            termo = termo.slice(1, -1);
            let subTermos = [];
            let buffer = '';

            for (let i = 0; i < termo.length; i++) {
                if ((termo[i] === '+' || termo[i] === '-') && i > 0) {
                    subTermos.push(buffer);
                    buffer = termo[i];
                } else {
                    buffer += termo[i];
                }
            }
            if (buffer) subTermos.push(buffer);

            // Avalia recursivamente os subtermos
            for (let subTermo of subTermos) {
                resultado += sinal * avaliarTermo(subTermo.trim(), x);
            }
        } else {
            resultado += sinal * avaliarTermo(termo, x);
        }
    }

    return resultado;
}

// Função auxiliar para converter uma expressão em string para termos
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

module.exports = {
    avaliar,
    avaliarTermo,
    expressaoParaTermos
}