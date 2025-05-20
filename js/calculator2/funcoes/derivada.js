function derivadaString(termosStr) {
    function derivarTermo(termo, sinal = 1) {
        termo = termo.trim();

        // Polinomial: ax^n
        if (/^-?\d*\.?\d*x\^\d+$/.test(termo)) {
            const match = termo.match(/^(-?\d*\.?\d*)x\^(\d+)$/);
            const coef = sinal * parseFloat(match[1] || (match[1] === '-' ? -1 : 1));
            const exp = parseInt(match[2]);
            const novoCoef = coef * exp;
            const novoExp = exp - 1;

            return novoExp === 0 ? `${novoCoef}` :
                novoExp === 1 ? `${novoCoef}x` :
                `${novoCoef}x^${novoExp}`;

        // Linear: ax
        } else if (/^-?\d*\.?\d*x$/.test(termo)) {
            const coef = sinal * parseFloat(termo.replace('x', '') || (termo.startsWith('-') ? -1 : 1));
            return `${coef}`;

        // Exponencial: ae^x ou ae^(x)
        } else if (/^-?\d*\.?\d*e\^\(?[a-zA-Z0-9+\-*/^]+\)?$/.test(termo)) {
            const match = termo.match(/^(-?\d*\.?\d*)?e\^\(?([^)]+)\)?$/);
            if (!match) return `Não reconhecido: ${termo}`;

            const coefStr = match[1];
            const argumento = match[2];

            let coef = 1;
            if (coefStr === '-') coef = -1;
            else if (coefStr) coef = parseFloat(coefStr);
            coef *= sinal;

            return coef === 1 ? `e^(${argumento})` :
                coef === -1 ? `-e^(${argumento})` :
                `${coef}e^(${argumento})`;

        // Constante: número puro
        } else if (/^-?\d+(\.\d+)?$/.test(termo)) {
            return '0';
        }

        return `Não reconhecido: ${termo}`;
    }

    return termosStr.flatMap((termoOriginal) => {
        let termo = termoOriginal.trim();
        let sinal = 1;

        if (termo.startsWith('+')) {
            termo = termo.slice(1);
        } else if (termo.startsWith('-')) {
            sinal = -1;
            termo = termo.slice(1);
        }

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

            return subTermos.map(sub => derivarTermo(sub.trim(), sinal));
        }

        return [derivarTermo(termo, sinal)];
    });
}

function formatarDerivada(termos) {
    return termos
        .filter(t => t !== '0') // remove termos nulos
        .map((termo, i) => {
            termo = termo.trim();
            if (i === 0) return termo;
            return termo.startsWith('-') ? ` - ${termo.slice(1)}` : ` + ${termo}`;
        })
        .join('')
        .trim();
}

module.exports = {
    derivadaString,
    formatarDerivada
}