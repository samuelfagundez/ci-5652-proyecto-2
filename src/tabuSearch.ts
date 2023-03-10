import { Objeto } from './models';
// import { example1 as data } from './data';

// const PESO_LIMITE_MOCHILA = 30;

// This algorithm takes as input the weights and values of each item, the capacity of the knapsack,
// and the maximum number of iterations to run. It returns an object containing the solution with the
// highest total value found during the search.

// The algorithm works by starting with an initial solution (all items are not included) and
// iteratively modifying it by flipping one item at a time. The modified solutions are evaluated based
// on their total weight and total value, and the one with the highest value that does not exceed the
// capacity is selected as the next solution.

// To prevent cycling between similar solutions, a tabu list is maintained that keeps track of which
// items have been flipped recently. If an item is on the tabu list, it cannot be flipped again until
// a certain number of iterations have passed.

// Overall, this algorithm provides a simple but effective way to solve small instances of the
// knapsack problem using tabu search in TypeScript. For larger instances or more complex problems, other
// methods such as dynamic programming or heuristic algorithms may be more appropriate[1]

/**
 * Solves the 0/1 knapsack problem using tabu search.
 * @param weights The weights of each item.
 * @param values The values of each item.
 * @param capacity The capacity of the knapsack.
 * @param maxIter The maximum number of iterations to run.
 */
export function TS(
  data: Objeto[],
  maxIter: number,
  PESO_LIMITE_MOCHILA: number
): {
  solution: { value: number; weight: number };
} {
  const weights = data.map((obj) => obj.peso);
  const values = data.map((obj) => obj.valor);
  const n = weights.length;
  let bestValue = 0;
  let bestWeight = 0;
  let currentSolution = new Array(n).fill(0);
  let currentValue = 0;
  let currentWeight = 0;
  let tabuList: number[] = [];

  for (let i = 0; i < maxIter; i++) {
    // Generate all neighbors by flipping one item at a time.
    const neighbors = [];
    for (let j = 0; j < n; j++) {
      if (!tabuList.includes(j)) {
        const neighbor = currentSolution.slice();
        neighbor[j] = neighbor[j] === 1 ? 0 : 1;
        neighbors.push(neighbor);
      }
    }

    // Evaluate all neighbors and select the best one that does not exceed the capacity.
    let bestNeighborValue = -1;
    let bestNeighborWeight = -1;
    let bestNeighbor;
    for (const neighbor of neighbors) {
      const weightSum = neighbor.reduce(
        (sum, val, index) => sum + val * weights[index],
        0
      );
      if (weightSum <= PESO_LIMITE_MOCHILA) {
        const valueSum = neighbor.reduce(
          (sum, val, index) => sum + val * values[index],
          0
        );
        if (valueSum > bestNeighborValue) {
          bestNeighborValue = valueSum;
          bestNeighborWeight = weightSum;
          bestNeighbor = neighbor.slice();
        }
      }
    }

    // If no valid neighbors were found, terminate the search.
    if (!bestNeighbor) break;

    // Update the current solution and add it to the tabu list.
    currentSolution = bestNeighbor.slice();
    currentValue = bestNeighborValue;
    currentWeight = bestNeighborWeight;

    // Update the global solution if necessary.
    if (currentValue > bestValue) {
      bestValue = currentValue;
      bestWeight = currentWeight;
    }

    // Add the flipped item to the tabu list and remove old items from it.
    tabuList.push(bestNeighbor.indexOf(1));
    if (tabuList.length > n / 2) {
      tabuList.shift();
    }
  }
  return { solution: { weight: bestWeight, value: bestValue } };
}

// const solution = TS([...data], 10000, PESO_LIMITE_MOCHILA).solution;

// console.log(solution);
