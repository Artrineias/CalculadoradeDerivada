const prompt = require("prompt-sync")();
const { derivadaString, formatarDerivada } = require("./funcoes/derivada.js");
const { integralString, formatarIntegral} = require("./funcoes/integral.js");
const {  
    encontrar_pontos_criticos, 
    classificar_ponto_critico 
} = require("./funcoes/ponto_critico.js");

const tipo = parseInt(prompt("Escolha derivar = 1 ou integrar = 2: "));

if (tipo != 1 && tipo != 2) {
    console.log("Tipo inválido. Digite apenas 1 ou 2 para definir o tipo. ");
    process.exit(1);
}

function nova_funcao() {
    console.log("\nFunção de exemplo: f(x) = x^3 - 3x + 2e^x");
    let funcao = prompt("Entre com a função: f(x) = ");
    funcao = funcao.replace(/\s+/g, ''); // Remove espaços

    let termos = [];
    let inicio = 0;
    let dentro_parenteses = 0;

    for (let i = 1; i < funcao.length; i++) {
        switch (funcao[i]) {
            case '(':
                dentro_parenteses++;
                break;
            case ')':
                dentro_parenteses--;
                break;
            case '+':
            case '-':
                if (dentro_parenteses === 0) {
                    termos.push(funcao.slice(inicio, i));
                    inicio = i;
                }
                break;
        }
    }

    termos.push(funcao.slice(inicio));
    return { termos, funcao };
}

let funcoes = [];
if (tipo === 1) {
    const { termos } = nova_funcao();
    funcoes.push(termos);
    
    console.log(`\n===== Análise da função =====`);
    console.log(`Termos:`, termos);
    
    // Derivadas
    const derivada = derivadaString(termos);
    const derivadaFormatada = formatarDerivada(derivada);
    console.log(`Primeira derivada: f'(x) = ${derivadaFormatada}`);
    
    const segunda_derivada = derivadaString(derivada);
    const segundaDerivadaFormatada = formatarDerivada(segunda_derivada);
    console.log(`Segunda derivada: f''(x) = ${segundaDerivadaFormatada}`);
    
    // Encontrar pontos críticos
    const pontos_criticos = encontrar_pontos_criticos(derivada);
    
    if (pontos_criticos.length === 0) {
        console.log("Nenhum ponto crítico encontrado no intervalo [-10, 10].\n");
    } else {
        console.log(`\nPontos críticos encontrados:`);
        classificar_ponto_critico(termos, pontos_criticos, segunda_derivada);
    }
} else if (tipo === 2) {
    const { termos, funcao } = nova_funcao();
    funcoes.push(termos);
    
    console.log(`\n===== Análise da função =====`);
    console.log(`Termos:`, termos);
    
    // Integral
    const integral = integralString(termos);
    const integralFormatada = formatarIntegral(integral);
    console.log(`Integral primitiva: ∫(${funcao})dx = ${integralFormatada} + C`);
}