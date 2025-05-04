const prompt = require("prompt-sync")();

let n = Number(prompt("Digite a quantidade de termos: "));

function lerValores() {
    let tipo = prompt("Tipo de termo (p para polinomial, e para exponencial): ");
    let coef = Number(prompt("Digite o coeficiente: "));
    
    if (tipo === "p") {
        let exp = Number(prompt("Digite o expoente: "));
        return { tipo: "polinomial", coef, exp };
    } else if (tipo === "e") {
        let base = Number(prompt("Digite a base da exponencial: "));
        return { tipo: "exponencial", coef, base };
    } else {
        console.log("Tipo inválido! Assumindo polinomial com expoente 1.");
        return { tipo: "polinomial", coef, exp: 1 };
    }
}

let funcao = [];
for (let i = 0; i < n; i++) {
    funcao.push(lerValores());
}

function imprimeFuncao(funcao) {
    funcao.forEach((termo, i) => {
        if (termo.tipo === "polinomial") {
            console.log(`Termo ${i + 1}: ${termo.coef} * x^${termo.exp}`);  
        } else {
            console.log(`Termo ${i + 1}: ${termo.coef.toFixed(4)} * ${termo.base}^x`);  
        }
    });
}

console.log("\nFunção original:");
imprimeFuncao(funcao);

function derivada(funcao) {
    return funcao.map((termo) => {
        if (termo.tipo === "polinomial") {
            return termo.exp === 0 
                ? { tipo: "polinomial", coef: 0, exp: 0 }
                : { tipo: "polinomial", coef: termo.coef * termo.exp, exp: termo.exp - 1 };
        } else if (termo.tipo === "exponencial") {
            return {
                tipo: "exponencial",
                coef: termo.coef * Math.log(termo.base),
                base: termo.base
            }
        }
    });
}

let primeiraDerivada = derivada(funcao);

console.log("\nPrimeira derivada da função:");
imprimeFuncao(primeiraDerivada);

let ptoCritico = null;
if (n === 1) { // Se a função tiver apenas um termo 
    let termo = funcao[0];
    if (termo.tipo === "polinomial") {
        if (termo.exp === 0) {
            ptoCritico = "Todos os valores de x (função constante)";
        } else {
            ptoCritico = 0;
        }
    } else {
        ptoCritico = "Nenhum (função exponencial nunca zera a derivada)";
    }
}
console.log(`\nPonto crítico: ${ptoCritico}`);

let segundaDerivada = derivada(primeiraDerivada);

console.log("\nSegunda derivada da função:");
imprimeFuncao(segundaDerivada);
