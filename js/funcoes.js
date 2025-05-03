const prompt = require("prompt-sync")();

let n = Number(prompt("Digite a quantidade de termos: "));

function lerValores() {
    let coeficiente = Number(prompt("Digite o coeficiente: "));
    let expoente = Number(prompt("Digite o expoente: "));
    return [coeficiente, expoente];
}

let funcao = [];
for (let i = 0; i < n; i++) {
    funcao.push(lerValores());
}

console.log("\nFunção original:");
funcao.forEach((termo, i) => {
    console.log(`Termo ${i + 1}: coef = ${termo[0]}, exp = ${termo[1]}`);  
});

// Derivada de potencia
function derivada(funcao) {
    return funcao.map(([coef, exp]) => {
        return exp === 0 ? [0, 0] : [coef * exp, exp - 1];
    });
}

let primeiraDerivada = derivada(funcao);

console.log("\nPrimeira derivada da função:");
primeiraDerivada.forEach((termo, i) => {
    console.log(`Termo ${i + 1}: coef = ${termo[0]}, exp = ${termo[1]}`);  
});

let ptoCritico = null;
if (n === 1) { // Se a função tiver apenas um termo 
    let exp = funcao[0][1];
    if (exp === 0) {
        ptoCritico = "Todos os valores de x (função constante)";
    } else if (exp > 0) {
        ptoCritico = 0;
    } else {
        ptoCritico = "Nenhum (derivada nunca zera)";
    }
}
console.log('\nPonto crítico: ${ptoCritico}');

let segundaDerivada = derivada(primeiraDerivada);

console.log("\nSegunda derivada da função:");
segundaDerivada.forEach((termo, i) => {
    console.log(`Termo ${i + 1}: coef = ${termo[0]}, exp = ${termo[1]}`);  
});