type Objeto = {
  id: string;
  peso: number;
  valor: number;
};

export function solExactaDP(
  objetos: Objeto[],
  PESO_LIMITE_MOCHILA: number
): {
  solution: { value: number; weight: number };
} {
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
  return { solution: { value: dp[pesoLimite], weight: pesoLimite } }; // returning the maximum value of knapsack
}
