const { avaliar } = require("./avaliar");

function encontrar_ponto_critico_bissecao(expressao, inicio, fim, tolerancia = 1e-8, max_iteracoes = 100) {
    let a = inicio;
    let b = fim;
    let fa = avaliar(expressao, a);
    let fb = avaliar(expressao, b);
    
    // Verifica valores infinitos ou NaN
    if (!isFinite(fa) || !isFinite(fb) || isNaN(fa) || isNaN(fb)) {
        return null;
    }
    
    // Verificamos se há mudança de sinal no intervalo
    if (fa * fb > 0) {
        return null;
    }
    
    let iteracao = 0;
    while ((b - a) > tolerancia && iteracao < max_iteracoes) {
        let c = (a + b) / 2;
        let fc = avaliar(expressao, c);
        
        // Verifica se fc é finito
        if (!isFinite(fc) || isNaN(fc) || Math.abs(fc) > 1e10) {
            return null;
        }
        
        // Se encontrarmos um valor próximo de zero, é um ponto crítico
        if (Math.abs(fc) < tolerancia) {
            return Number(c.toFixed(6));
        }
        
        // Verificamos em qual subintervalo está a mudança de sinal
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

// Encontra todos os pontos críticos em um intervalo
function encontrar_pontos_criticos(expressao, inicio, fim, granularidade = 0.01, tolerancia = 1e-8) {
    let pontos_criticos = [];
    
    for (let i = inicio; i < fim; i += granularidade) {
        let subInicio = i;
        let subFim = i + granularidade;
        
        // Evita testar muito próximo de zero para funções com descontinuidades
        if (Math.abs(subInicio) < 1e-6 || Math.abs(subFim) < 1e-6) {
            continue;
        }
        
        let valorInicio = avaliar(expressao, subInicio);
        let valorFim = avaliar(expressao, subFim);
        
        // Verifica se os valores são finitos
        if (!isFinite(valorInicio) || !isFinite(valorFim) || 
            isNaN(valorInicio) || isNaN(valorFim) ||
            Math.abs(valorInicio) > 1e10 || Math.abs(valorFim) > 1e10) {
            continue;
        }
        
        // Verificamos se há potencial ponto crítico neste subintervalo
        if (valorInicio * valorFim <= 0 || Math.abs(valorInicio) < tolerancia || Math.abs(valorFim) < tolerancia) {
            let ponto = encontrar_ponto_critico_bissecao(expressao, subInicio, subFim, tolerancia);
            
            if (ponto !== null) {
                // Verifica se o ponto encontrado é realmente um ponto crítico
                let valor_no_ponto = avaliar(expressao, ponto);
                
                if (isFinite(valor_no_ponto) && Math.abs(valor_no_ponto) < 1e-3) {
                    // Verifica se este ponto já não foi encontrado
                    if (!pontos_criticos.some(p => Math.abs(p - ponto) < tolerancia * 10)) {
                        pontos_criticos.push(ponto);
                    }
                }
            }
        }
    }
    
    return pontos_criticos.sort((a, b) => a - b);
}

function classificar_ponto_critico(funcaoOriginal, pontosCriticos, segundaDerivada) {
    let resultado = [];
    
    for (let ponto of pontosCriticos) {
        let valor_funcao = avaliar(funcaoOriginal, ponto);
        let valor_segunda_derivada = avaliar(segundaDerivada, ponto);
        
        // Verifica se a função tem descontinuidade neste ponto
        if (!isFinite(valor_funcao) || isNaN(valor_funcao) || Math.abs(valor_funcao) > 1e10) {
            console.log(`x = ${ponto.toFixed(6)} é uma descontinuidade (f(x) = ${valor_funcao})`);
            continue;
        }
        
        // Verifica se a segunda derivada é finita
        if (!isFinite(valor_segunda_derivada) || isNaN(valor_segunda_derivada)) {
            console.log(`x = ${ponto.toFixed(6)} é um ponto crítico indefinido (f''(x) = ${valor_segunda_derivada})`);
            continue;
        }
        
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

module.exports = {
    encontrar_pontos_criticos,
    encontrar_ponto_critico_bissecao,
    classificar_ponto_critico,
};
