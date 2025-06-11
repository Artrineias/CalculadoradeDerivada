import { derivadaString, formatarDerivada } from "./funcoes/derivada.js";
import { integralNumerica } from "./funcoes/integral.js";
import { encontrar_pontos_criticos, classificar_ponto_critico } from "./funcoes/ponto_critico.js";
import promptSync from "prompt-sync";
const prompt = promptSync();

const tipo = parseInt(prompt("Escolha derivar = 1 ou integrar = 2: "));

if (tipo !== 1 && tipo !== 2) {
    console.log("Tipo inválido. Digite apenas 1 ou 2 para definir o tipo.");
    process.exit(1);
}

function nova_funcao() {
    console.log("\nFunção de exemplo: f(x) = x^3 - 3x + 2e^x");
    let funcao = prompt("Entre com a função: f(x) = ");
    funcao = funcao.replace(/\s+/g, ''); // Remove espaços

    let termos = [];
    let inicio = 0;
    let dentro_parenteses = 0;
    
    for (let i = 0; i < funcao.length; i++) {
        let char = funcao[i];

        if (char === '(') {
            dentro_parenteses++;
        } else if (char === ')') {
            dentro_parenteses--;
        }
        if (i > 0 && dentro_parenteses === 0) {
            if ((char === '+' || char === '-') && funcao[i-1] !== '^') {
                termos.push(funcao.slice(inicio, i));
                inicio = i;
            }
        }
    }

    termos.push(funcao.slice(inicio));
    
    // Filtra termos vazios que podem surgir de múltiplos sinais ou início de função com sinal
    termos = termos.filter(t => t.trim() !== '');

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
    console.log(`Segunda derivada: f''(x) = ${segundaDerivadaFormatada}\n`);
    
    const inicio = Number(prompt("Entre com o início do intervalo para busca do ponto crítico: "));
    const fim = Number(prompt("Entre com o fim do intervalo para busca do ponto crítico: "));

    if (inicio > fim) {
        console.log("O início do intervalo não pode ser maior que o fim.\n");
        process.exit(1);
    } else if (inicio === fim) {
        console.log("O início do intervalo não pode ser igual ao o fim.\n");
        process.exit(1);
    }

    // Encontrar pontos críticos
    const pontos_criticos = encontrar_pontos_criticos(derivada, inicio, fim);
    
    if (pontos_criticos.length === 0) {
        console.log(`Nenhum ponto crítico encontrado no intervalo [${inicio}, ${fim}].\n`);
    } else {
        console.log(`\nPontos críticos encontrados:`);
        classificar_ponto_critico(termos, pontos_criticos, segunda_derivada);
    }
} else if (tipo === 2) {
    const { termos, funcao } = nova_funcao();
    funcoes.push(termos);
    
    console.log(`\n===== Análise da função =====`);
    console.log(`Termos:`, termos);
    
    // Integração numérica
    const a = parseFloat(prompt("Entre com o limite inferior (a): "));
    const b = parseFloat(prompt("Entre com o limite superior (b): "));
    const n = parseInt(prompt("Entre com o número de intervalos (n): "));
    
    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
        console.log("Entradas inválidas para a, b ou n.");
        process.exit(1);
    }

    try {
        const resultados = integralNumerica(funcao, a, b, n);
        console.log(`\n===== Integrais Numéricas =====`);
        console.log(`Soma de Riemann (esquerda): ${resultados.riemannEsquerda.toFixed(6)}`);
        console.log(`Soma de Riemann (direita): ${resultados.riemannDireita.toFixed(6)}`);
        console.log(`Soma de Riemann (ponto médio): ${resultados.riemannPontoMedio.toFixed(6)}`);
        console.log(`Regra dos Trapézios: ${resultados.trapezio.toFixed(6)}`);
        console.log(`Regra de Simpson: ${resultados.simpson.toFixed(6)}`);
    } catch (error) {
        console.log(`Erro ao calcular integrais numéricas: ${error.message}`);
    }
}