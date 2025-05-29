# Calculadora de Máximos e Mínimos de Funções (Polinomiais e Exponenciais)

Este projeto tem como objetivo desenvolver, em **JavaScript**, uma calculadora para encontrar os **pontos de máximo e mínimo** de funções **polinomiais** e **exponenciais**, com entrada via terminal (`prompt`, `console.log`) e também via uma interface web (HTML + CSS).

---

## 📌 Parte 1: Funções Polinomiais

### Representação Geral

Uma função polinomial é dada por:

$$
f(x) = a_n x^n + a_{n-1} x^{n-1} + \cdots + a_2 x^2 + a_1 x + a_0
$$

Ou:

$$
f(x) = a(n) \cdot x^n + a(n-1) \cdot x^{n-1} + \cdots + a(1) \cdot x + a(0)
$$

- O usuário fornece os coeficientes \( a_i \) e os expoentes correspondentes \( i \).
- A calculadora deve:
  - Exibir a **primeira derivada** \( f'(x) \)
  - Exibir a **segunda derivada** \( f''(x) \)

---

## 📌 Parte 2: Funções Exponenciais

### Representação Geral

Para funções exponenciais:

$$
f(x) = a^x \quad \text{com} \quad a \in \mathbb{R}, \ 0 < a \ne 1, \ f: \mathbb{R} \rightarrow \mathbb{R}_{+}^{*}
$$

A forma usada é:

$$
f(x) = a^x
$$

### Derivadas

- Primeira derivada:

$$
\frac{d}{dx} f(x) = a^x \ln a
$$

- Segunda derivada:

$$
\frac{d^2}{dx^2} a^x = a^x (\ln a)^2
$$

---

## 📌 Parte 3: Função Exponencial Natural

A função exponencial natural \( e^x \) é definida como:

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots = \lim_{n \to \infty} \left(1 + \frac{x}{n} \right)^n
$$

---

## 💡 Requisitos Técnicos

- A entrada e saída devem funcionar:
  - Via `prompt` e `console.log` no navegador
  - Via interface web (HTML + CSS)
- A lógica principal será desenvolvida em **JavaScript**
- O conteúdo teórico está sendo desenvolvido na disciplina de **Cálculo**
- Discussões relevantes serão feitas nesta disciplina para apoiar o desenvolvimento

---

## ✔️ Sugestões de Extensões Futuras

- Gráficos das funções e derivadas com Canvas ou Chart.js
- Identificação automática dos pontos de máximo e mínimo
- Suporte a funções mistas (exponenciais + polinomiais)
