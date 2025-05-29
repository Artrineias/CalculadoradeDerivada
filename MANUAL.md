# Manual de Uso do Sistema de Cálculo de Derivadas e Pontos Críticos


## Uso pelo Terminal

1. Certifique-se de ter o Node.js instalado em seu sistema.

2. No terminal, navegue até o diretório do projeto.

3. Execute o comando para rodar o programa:
   ```
   node js/calculator/main.js
   ```

4. Será solicitado que você informe a quantidade de funções a serem avaliadas (de 1 a 10).

5. Para cada função, insira a expressão matemática no formato esperado, por exemplo:
   - Polinômios: `x^3 - 3x + 2`
   - Funções exponenciais: `2e^x + 3x^2`
   - Combinações: `x^3 - 3x + 2e^x`

6. O programa exibirá:
   - Os termos da função.
   - A primeira derivada da função.
   - A segunda derivada da função.
   - Os pontos críticos encontrados no intervalo padrão [-10, 10].
   - A classificação dos pontos críticos (mínimo local, máximo local, ponto de inflexão ou indeterminado).

---

## Uso pelo Site (Interface Web)

1. Abra o arquivo `calculator.html` em um navegador web moderno.

2. Na página, insira o número de funções que deseja analisar (de 1 a 10).

3. Clique no botão "Gerar Campos" para criar os campos de entrada para as funções.

4. Para cada função, insira a expressão matemática no formato esperado, por exemplo:
   - Polinômios: `x^3 - 3x + 2`
   - Funções exponenciais: `2e^x + 3x^2`
   - Combinações: `x^3 - 3x + 2e^x`

5. Clique no botão "Calcular" para obter:
   - A primeira derivada da função.
   - A segunda derivada da função.
   - Os pontos críticos encontrados no intervalo padrão [-10, 10].
   - A classificação dos pontos críticos (mínimo local, máximo local, ponto de inflexão ou indeterminado).

6. Os resultados serão exibidos logo abaixo dos campos de entrada.

---

## Observações

- As funções devem ser inseridas sem espaços ou com espaços que serão automaticamente removidos.
- O sistema suporta funções polinomiais e exponenciais básicas.
- O intervalo para busca de pontos críticos é fixo em [-10, 10], com granularidade padrão de 0.1.
- Para melhores resultados, insira funções dentro do escopo suportado.

---

