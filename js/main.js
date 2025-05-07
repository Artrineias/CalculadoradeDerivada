const prompt = require("prompt-sync")();
const derivada = require("./funcoes/derivada.js");
const avaliar = require("./funcoes/ponto_Critico.js");
const encontrar_pontos_criticos = require("./funcoes/ponto_Critico.js");

function ler_valores() {
    let tipo = prompt("Tipo de termo (p para polinomial, e para exponencial): ");
    let coef = Number(prompt("Digite o coeficiente: "));
    
    if (isNaN(coef)) {
        console.log("Coeficiente inválido! Usando 0.");
        coef = 0;
    }

    if (tipo === "p") {
        let exp = Number(prompt("Digite o expoente: "));
        if (isNaN(exp)) {
            console.log("Expoente inválido! Usando 1.");
            exp = 1;
        }
        return { tipo: "polinomial", coef, exp };
    } else if (tipo === "e") {
        let base_input = prompt("Digite a base da exponencial (ou 'e' para base natural): ");
        let base = base_input === "e" ? Math.E : Number(base_input);
        if (isNaN(base) || base <= 0) {
            console.log("Base inválida! Usando 1.");
            base = 1;
        }
        return { tipo: "exponencial", coef, base };
    } else {
        console.log("Tipo inválido! Assumindo polinomial com expoente 1.");
        return { tipo: "polinomial", coef, exp: 1 };
    }
}

function imprime_funcao(funcao) {
    funcao.forEach((termo, i) => {
        if (termo.tipo === "polinomial") {
            console.log(`Termo ${i + 1}: ${termo.coef} * x^${termo.exp}`);  
        } else {
            console.log(`Termo ${i + 1}: ${termo.coef.toFixed(4)} * ${termo.base.toFixed(4)}^x`);  
        }
    });
}

let n = Number(prompt("Digite a quantidade de termos: "));
if (n <= 0) {
    console.log("Número de termos deve ser positivo!");
    n = 1;
} else if (isNaN(n)) {
    console.log("Entrada inválida! Usando 1 termo.");
    n = 1;
}

let funcao = [];
for (let i = 0; i < n; i++) {
    funcao.push(ler_valores());
}
console.log("\nFunção original:");
imprime_funcao(funcao);

let primeiraDerivada = derivada(funcao);
console.log("\nPrimeira derivada da função:");
imprime_funcao(primeiraDerivada);

let pontos = encontrar_pontos_criticos(primeiraDerivada);
console.log(`\nPontos críticos encontrados (f'(x) ≈ 0):`);
console.log(pontos.length > 0 ? pontos : "Nenhum ponto crítico encontrado.");

let segundaDerivada = derivada(primeiraDerivada);
console.log("\nSegunda derivada da função:");
imprime_funcao(segundaDerivada);

console.log("\nClassificação dos pontos críticos:");
pontos.forEach((x) => {
    let segunda = avaliar(segundaDerivada, x);
    if (segunda > 0) {
        console.log(`x = ${x}: Mínimo local`);
    } else if (segunda < 0) {
        console.log(`x = ${x}: Máximo local`);
    } else {
        console.log(`x = ${x}: Ponto de inflexão ou indeciso`);
    }
});