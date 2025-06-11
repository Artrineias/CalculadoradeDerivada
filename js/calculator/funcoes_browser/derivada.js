/**
 * Calcula a derivada de uma expressão representada por termos em string.
 * @param {string[]} termosStr - Array de termos da expressão.
 * @returns {string[]} Array de termos da derivada.
 */
function derivadaString(termosStr) {
    function derivarTermo(termo, sinal = 1) {
        termo = termo.trim();

        // Polinomial: ax^n ou x^n (AGORA COM SUPORTE A EXPOENTES NEGATIVOS)
        if (/^-?\d*\.?\d*x\^(-?\d+)$/.test(termo)) {
            const match = termo.match(/^(-?\d*\.?\d*)x\^(-?\d+)$/);
            let coefStr = match[1];

            const coef = parseFloat(
                coefStr === '' || coefStr === '+' ? 1 :
                coefStr === '-' ? -1 :
                coefStr
            );

            const exp = parseInt(match[2]);
            
            if (exp === 0) {
                return '0';
            }

            const novoCoef = coef * exp * sinal;
            const novoExp = exp - 1;

            return novoExp === 0 ? `${novoCoef}` :
                   novoExp === 1 ? `${novoCoef}x` :
                   `${novoCoef}x^${novoExp}`;

        } else if (/^-?\d*\.?\d*x$/.test(termo)) {
            let coefStr = termo.replace('x', '');

            const coef = parseFloat(
                coefStr === '' || coefStr === '+' ? 1 :
                coefStr === '-' ? -1 :
                coefStr
            );

            return `${coef * sinal}`;

        } else if (/^-?\d*\.?\d*e\^/.test(termo)) {
            const match = termo.match(/^(-?\d*\.?\d*)e\^(.*)$/);
            if (!match) return `Não reconhecido: ${termo}`;

            const coefStr = match[1];
            let argumento = match[2];

            if (argumento === '(x)') {
                argumento = 'x';
            }

            let coef = 1;
            if (coefStr === '-') coef = -1;
            else if (coefStr && coefStr !== '+') coef = parseFloat(coefStr);
            coef *= sinal;

            if (argumento === 'x') {
                return coef === 1 ? `e^x` :
                       coef === -1 ? `-e^x` :
                       `${coef}e^x`;
            } else {
                return coef === 1 ? `e^(${argumento})` :
                       coef === -1 ? `-e^(${argumento})` :
                       `${coef}e^(${argumento})`;
            }

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

        if (/^\(.*\)$/.test(termo)) {
            const conteudo = termo.slice(1, -1);
            return processarSubtermos(conteudo, sinal);
        }

        return [derivarTermo(termo, sinal)];
    });
}

/**
 * Formata a derivada representada por termos em string para uma string legível.
 * @param {string[]} termos - Array de termos da derivada.
 * @returns {string} Derivada formatada.
 */
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

// Expondo as funções globalmente para uso no navegador
window.derivadaString = derivadaString;
window.formatarDerivada = formatarDerivada;