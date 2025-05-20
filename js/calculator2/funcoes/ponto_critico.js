const { avaliar } = require("./avaliar");

// Encontra um ponto crítico usando o método da bissecção
function encontrar_ponto_critico_bissecao(expressao, inicio, fim, tolerancia = 1e-8, max_iteracoes = 100) {
    let a = inicio;
    let b = fim;
    let fa = avaliar(expressao, a);
    let fb = avaliar(expressao, b);
    
    // Verificamos se há mudança de sinal no intervalo
    if (fa * fb > 0) {
        return null;
    }
    
    let iteracao = 0;
    while ((b - a) > tolerancia && iteracao < max_iteracoes) {
        let c = (a + b) / 2;
        let fc = avaliar(expressao, c);
        
        // Se encontrarmos um valor próximo de zero, é um ponto crítico
        if (Math.abs(fc) < tolerancia) {
            return Number(c.toFixed(6));
        }
        
        // Verificamos em qual subintervalo está a mudança de sinal
        if (fa * fc < 0) {
            // O ponto crítico está entre a e c
            b = c;
            fb = fc;
        } else {
            // O ponto crítico está entre c e b
            a = c;
            fa = fc;
        }
        
        iteracao++;
    }
    
    // Retornamos o ponto médio do intervalo final
    return Number(((a + b) / 2).toFixed(6));
}

// Encontra todos os pontos críticos em um intervalo
function encontrar_pontos_criticos(expressao, inicio = -10, fim = 10, granularidade = 0.1, tolerancia = 1e-8) {
    let pontos_criticos = [];
    
    // Percorremos o intervalo completo em passos de tamanho granularidade
    for (let i = inicio; i < fim; i += granularidade) {
        let subInicio = i;
        let subFim = i + granularidade;
        
        // Avaliamos a expressão nos extremos do subintervalo
        let valorInicio = avaliar(expressao, subInicio);
        let valorFim = avaliar(expressao, subFim);
        
        // Verificamos se há potencial ponto crítico neste subintervalo
        if (valorInicio * valorFim <= 0 || Math.abs(valorInicio) < tolerancia || Math.abs(valorFim) < tolerancia) {
            // Aplicamos bissecção para encontrar o ponto crítico precisamente
            let ponto = encontrar_ponto_critico_bissecao(expressao, subInicio, subFim, tolerancia);
            
            // Se encontramos um ponto crítico válido
            if (ponto !== null) {
                // Verificamos se este ponto já não foi encontrado (com tolerância)
                if (!pontos_criticos.some(p => Math.abs(p - ponto) < tolerancia * 10)) {
                    pontos_criticos.push(ponto);
                }
            }
        }
    }
    
    // Retornamos os pontos críticos em ordem crescente
    return pontos_criticos.sort((a, b) => a - b);
}

// Classifica os pontos críticos
function classificar_ponto_critico(funcaoOriginal, pontosCriticos, segundaDerivada) {
    let resultado = [];
    
    for (let ponto of pontosCriticos) {
        // Avaliamos a segunda derivada no ponto crítico
        let valor_segunda_derivada = avaliar(segundaDerivada, ponto);
        let valor_funcao = avaliar(funcaoOriginal, ponto);
        
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