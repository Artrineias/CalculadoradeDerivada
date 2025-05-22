const prompt = require("prompt-sync")();
const { derivadaString, formatarDerivada } = require("./funcoes/derivada.js");
const {  
    encontrar_pontos_criticos, 
    classificar_ponto_critico 
} = require("./funcoes/ponto_critico.js");

let qtdFuncao = parseInt(prompt("Digite a quantidade de funções a serem avaliadas: "));

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
    return termos;
}

let funcoes = [];
for (let i = 0; i < qtdFuncao; i++) {
    const termos = nova_funcao();
    funcoes.push(termos);

    console.log(`\n===== Análise da ${i + 1}º função =====`);
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
}