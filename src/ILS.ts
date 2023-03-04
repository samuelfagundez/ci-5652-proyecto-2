import { example1 } from './data';

const PESO_LIMITE_MOCHILA: number = 30;

// This algorithm takes as input the weights and values of each item, the capacity of the knapsack, and
// the maximum number of iterations to run. It returns an object containing the solution with the
// highest total value found during the search.

// The algorithm works by generating a random initial solution and iteratively improving it using
// local search. In each iteration of local search, all possible neighbors are generated by flipping
// one item at a time. The modified solutions are evaluated based on their total weight and total value.
// If a valid neighbor with higher value is found than current solution then it becomes

// The local search process continues until no further improvement can be made or a certain number
// of iterations have passed. The entire process is repeated multiple times with different initial
// solutions to increase the chances of finding a good global solution.

// Overall this algorithm provides a simple but effective way to solve small instances of knapsack
// problem using iterative local search in TypeScript. For larger instances or more complex problems
//  other methods such as dynamic programming or heuristic algorithms may be more appropriate

/**
 * Solves the 0/1 knapsack problem using iterative local search.
 * @param weights The weights of each item.
 * @param values The values of each item.
 * @param maxIter The maximum number of iterations to run.
 */
function ILS(weights: number[], values: number[], maxIter: number) {
  const n = weights.length;
  let bestSolution = new Array(n).fill(0);
  let bestValue = 0;

  for (let i = 0; i < maxIter; i++) {
    // Generate a random initial solution.
    const currentSolution = new Array(n)
      .fill(0)
      .map(() => Math.round(Math.random()));

    // Perform local search on the initial solution with disturbance
    let currentValue = evaluateSolution(currentSolution, weights, values);
    while (true) {
      const neighbors = [];
      for (let j = 0; j < n; j++) {
        const neighbor = currentSolution.slice();
        neighbor[j] = neighbor[j] === 1 ? 0 : 1;
        neighbors.push(neighbor);
      }

      let bestNeighborValue = -1;
      let bestNeighbor;
      for (const neighbor of neighbors) {
        const valueSum = evaluateSolution(neighbor, weights, values);
        if (valueSum > bestNeighborValue) {
          bestNeighborValue = valueSum;
          bestNeighbor = neighbor.slice();
        }
      }

      if (!bestNeighbor || bestNeighborValue <= currentValue) break;

      currentSolution.splice(0, currentSolution.length, ...bestNeighbor);
      currentValue = bestNeighborValue;
    }

    // Update the global solution if necessary.
    if (currentValue > bestValue) {
      bestSolution.splice(0, bestSolution.length, ...currentSolution);
      bestValue = currentValue;
    }

    // Disturbance
    for (let j = 0; j < n; j++) {
      if (Math.random() < 0.5) {
        continue;
      }

      const disturbedSoln = bestSolution.slice();

      disturbedSoln[j] = disturbedSoln[j] === 1 ? 0 : 1;

      const disturbedVal = evaluateSolution(disturbedSoln, weights, values);

      if (disturbedVal > bestValue) {
        return { solution: disturbedSoln, value: disturbedVal };
      }
    }
  }

  return { solution: bestSolution, value: bestValue };
}

/**
 * Evaluates a given solution by computing its total value and checking whether it exceeds the capacity.
 */
function evaluateSolution(
  solution: number[],
  weights: number[],
  values: number[]
): number {
  const weightSum = solution.reduce(
    (sum, val, index) => sum + val * weights[index],
    0
  );

  // If weight exceeds capacity then return -1
  if (weightSum > PESO_LIMITE_MOCHILA) {
    return -1;
  }

  return solution.reduce((sum, val, index) => sum + val * values[index], 0);
}

const main = () => {
  const pesos = example1.map((obj) => obj.peso);
  const ganancias = example1.map((obj) => obj.valor);
  console.log(ILS(pesos, ganancias, 10000));
};

main();
