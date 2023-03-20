import { Objeto } from '../models';
class Item {
  value: number;
  weight: number;
  constructor(value: number, weight: number) {
    this.value = value;
    this.weight = weight;
  }
}

class Ant {
  items: Item[];
  capacity: number;
  constructor(items: Item[], capacity: number) {
    this.items = items;
    this.capacity = capacity;
  }

  findSolution(): number[] {
    const pickedItems: number[] = new Array(this.items.length).fill(0);
    const pheromones: number[] = new Array(this.items.length).fill(1);

    for (let i = 0; i < this.items.length; i++) {
      const decision = Math.random() < pheromones[i] ? 1 : 0;
      if (decision) {
        if (this.capacity - this.items[i].weight >= 0) {
          this.capacity -= this.items[i].weight;
          pickedItems[i] = 1;
        }
      }
    }

    return pickedItems;
  }
}

function antColonyOptimization(
  items: Item[],
  capacity: number,
  antsCount: number,
  iterations: number
): number[] {
  const ants: Ant[] = new Array(antsCount).fill(new Ant(items, capacity));
  const pheromones: number[] = new Array(items.length).fill(1);

  let bestSolution: number[] = [];
  let bestValue = 0;

  for (let iter = 0; iter < iterations; iter++) {
    const solutions: number[][] = ants.map((ant) => ant.findSolution());

    for (const solution of solutions) {
      const value = solution.reduce(
        (acc, curr, index) => acc + (curr ? items[index].value : 0),
        0
      );
      const weight = solution.reduce(
        (acc, curr, index) => acc + (curr ? items[index].weight : 0),
        0
      );

      if (weight <= capacity && value > bestValue) {
        bestSolution = solution;
        bestValue = value;
      }
    }

    for (const solution of solutions) {
      const value = solution.reduce(
        (acc, curr, index) => acc + (curr ? items[index].value : 0),
        0
      );
      const weight = solution.reduce(
        (acc, curr, index) => acc + (curr ? items[index].weight : 0),
        0
      );

      if (weight <= capacity) {
        for (let i = 0; i < items.length; i++) {
          if (solution[i]) {
            pheromones[i] += value / bestValue;
          }
        }
      }
    }
  }

  return bestSolution;
}

export const hormigas = (
  data: Objeto[],
  antsAmount: number,
  PESO_LIMITE_MOCHILA: number,
  iterations: number
): {
  solution: { value: number; weight: number };
} => {
  const items = [...data].map((obj) => new Item(obj.valor, obj.peso));
  const solution = antColonyOptimization(
    items,
    PESO_LIMITE_MOCHILA,
    antsAmount,
    iterations
  );
  let valor = 0;
  let peso = 0;
  for (let i = 0; i < data.length; i++) {
    if (solution[i]) {
      valor += data[i].valor;
      peso += data[i].peso;
    }
  }

  return {
    solution: {
      value: valor,
      weight: peso,
    },
  };
};
