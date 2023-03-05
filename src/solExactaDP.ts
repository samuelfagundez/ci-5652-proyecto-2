import { example1 } from './data';
const PESO_LIMITE_MOCHILA: number = 30;

type Objeto = {
  id: string;
  peso: number;
  valor: number;
};

function knapSack(objetos: Objeto[]) {
  const beneficio = objetos.map((obj) => obj.valor);
  const pesos = objetos.map((obj) => obj.peso);
  const pesoLimite = Math.floor(PESO_LIMITE_MOCHILA);
  // making and initializing dp array
  let dp = Array(pesoLimite + 1).fill(0);

  for (let i = 1; i < objetos.length + 1; i++) {
    for (let w = pesoLimite; w >= 0; w--) {
      if (pesos[i - 1] <= w)
        // finding the maximum value
        dp[w] = Math.max(dp[w], dp[w - pesos[i - 1]] + beneficio[i - 1]);
    }
  }
  return dp[pesoLimite]; // returning the maximum value of knapsack
}

console.log(knapSack(example1));
