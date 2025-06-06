function derivadaString(termosStr) {
    function derivarTermo(termo, sinal = 1) {
        termo = termo.trim();

        // Polinomial: ax^n ou x^n (AGORA COM SUPORTE A EXPOENTES NEGATIVOS)
        // O regex foi ajustado para permitir um '-' opcional dentro do grupo de expoente
        // de `/^-?\d*\.?\d*x\^\d+$/` para `/^-?\d*\.?\d*x\^(-?\d+)$/`
        // e o match correspondente.
        if (/^-?\d*\.?\d*x\^(-?\d+)$/.test(termo)) { //
            const match = termo.match(/^(-?\d*\.?\d*)x\^(-?\d+)$/); //
            let coefStr = match[1];

            const coef = parseFloat(
                coefStr === '' || coefStr === '+' ? 1 :
                coefStr === '-' ? -1 :
                coefStr
            );

            const exp = parseInt(match[2]); // expoente agora pode ser negativo
            
            // Se o expoente for 0, a derivada é 0 (constante)
            if (exp === 0) { //
                return '0'; //
            }

            const novoCoef = coef * exp * sinal; //
            const novoExp = exp - 1; //

            return novoExp === 0 ? `${novoCoef}` : // Ex: 5x^1 -> 5
                   novoExp === 1 ? `${novoCoef}x` : // Ex: 5x^2 -> 10x
                   `${novoCoef}x^${novoExp}`; // Ex: 5x^3 -> 15x^2, ou 5x^-2 -> -10x^-3

        // Linear: ax ou x
        } else if (/^-?\d*\.?\d*x$/.test(termo)) {
            let coefStr = termo.replace('x', '');

            const coef = parseFloat(
                coefStr === '' || coefStr === '+' ? 1 :
                coefStr === '-' ? -1 :
                coefStr
            );

            return `${coef * sinal}`;

        // Exponencial: ae^x ou ae^(x)
        } else if (/^-?\d*\.?\d*e\^/.test(termo)) {
            const match = termo.match(/^(-?\d*\.?\d*)e\^(.*)$/);
            if (!match) return `Não reconhecido: ${termo}`;

            const coefStr = match[1];
            let argumento = match[2];

            // Remove parênteses desnecessários se for apenas 'x'
            if (argumento === '(x)') {
                argumento = 'x';
            }

            let coef = 1;
            if (coefStr === '-') coef = -1;
            else if (coefStr && coefStr !== '+') coef = parseFloat(coefStr);
            coef *= sinal;

            // Para e^x, a derivada é simplesmente o coeficiente * e^x
            if (argumento === 'x') {
                return coef === 1 ? `e^x` :
                       coef === -1 ? `-e^x` :
                       `${coef}e^x`;
            } else {
                // Para casos mais complexos como e^(2x), precisaria de regra da cadeia
                return coef === 1 ? `e^(${argumento})` :
                       coef === -1 ? `-e^(${argumento})` :
                       `${coef}e^(${argumento})`;
            }

        // Constante: número puro
        } else if (/^-?\d+(\.\d+)?$/.test(termo)) {
            return '0';
        }

        return `Não reconhecido: ${termo}`;
    }

    function processarSubtermos(expressao, sinalPrincipal = 1) {
        let termos = [];
        let buffer = '';
        let nivel = 0;
        
        for (let i = 0; i < expressao.length; i++) {
            const char = expressao[i];
            
            if (char === '(') {
                nivel++;
                buffer += char;
            } else if (char === ')') {
                nivel--;
                buffer += char;
            } else if ((char === '+' || char === '-') && nivel === 0 && i > 0) {
                if (buffer.trim()) {
                    termos.push(buffer.trim());
                }
                buffer = char;
            } else {
                buffer += char;
            }
        }
        
        if (buffer.trim()) {
            termos.push(buffer.trim());
        }
        
        return termos.map(termo => {
            let sinal = sinalPrincipal;
            let termoLimpo = termo;
            
            if (termo.startsWith('+')) {
                termoLimpo = termo.slice(1);
            } else if (termo.startsWith('-')) {
                sinal *= -1;
                termoLimpo = termo.slice(1);
            }
            
            return derivarTermo(termoLimpo, sinal);
        });
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

        // Verifica se é uma expressão entre parênteses
        if (/^\(.*\)$/.test(termo)) {
            const conteudo = termo.slice(1, -1);
            return processarSubtermos(conteudo, sinal);
        }

        return [derivarTermo(termo, sinal)];
    });
}

function formatarDerivada(termos) {
    const termosValidos = termos.filter(t => t !== '0' && !t.includes('Não reconhecido'));
    
    if (termosValidos.length === 0) {
        return '0';
    }
    
    return termosValidos
        .map((termo, i) => {
            termo = termo.toString().trim();
            
            if (i === 0) {
                return termo;
            }
            
            if (termo.startsWith('-')) {
                return ` - ${termo.slice(1)}`;
            } else {
                return ` + ${termo}`;
            }
        })
        .join('')
        .trim();
}

module.exports = {
    derivadaString,
    formatarDerivada
}