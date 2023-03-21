import { Objeto } from '../models';

class Item {
  value: number;
  weight: number;
  constructor(value: number, weight: number) {
    this.value = value;
    this.weight = weight;
  }
}

let pheromones: number[] = [];

class Ant {
  items: Item[];
  capacity: number;
  minItemValue: number;
  constructor(items: Item[], capacity: number, minItemValue: number) {
    this.items = [...items];
    this.capacity = capacity;
    this.minItemValue = minItemValue;
  }

  findSolution(): number[] {
    /** lo que va a tomar en este camino */
    const pickedItems: number[] = new Array(this.items.length).fill(0);

    while (this.capacity >= this.minItemValue) {
      const getRandomIndex = Math.floor(Math.random() * this.items.length);
      if (
        Math.random() <
          pheromones[getRandomIndex] *
            (this.items[getRandomIndex].value /
              this.items[getRandomIndex].weight) &&
        !pickedItems[getRandomIndex]
      ) {
        /** si toma actualiza q tomo y dice cuanto espacio le queda disponible. */
        if (this.capacity - this.items[getRandomIndex].weight >= 0) {
          this.capacity -= this.items[getRandomIndex].weight;
          pickedItems[getRandomIndex] = 1;
        }
      }
    }
    return [...pickedItems];
  }
}

function antColonyOptimization(
  items: Item[],
  capacity: number,
  antsCount: number,
  iterations: number,
  evaporationRate: number,
  minItemValue: number
): number[] {
  // creamos un grupo de hormigas donde cada hormiga puede ver todos los objetos y se le configura la capacidad maxima
  let ants: Ant[] = [];

  for (let i = 0; i < antsCount; i++) {
    ants = [...ants, new Ant([...items], capacity, minItemValue)];
  }

  pheromones = new Array(items.length).fill(0.1);

  let bestSolution: number[] = [];
  let bestValue = 0;

  // Iteramos un numero definido de veces (cota superior)
  for (let iter = 0; iter < iterations; iter++) {
    // Para cada hormiga encontramos la solucion
    const solutions: number[][] = ants.map((ant) => [...ant.findSolution()]);
    if (iter === 3999) {
      console.log(solutions);
    }
    // se itera sobre la solucion de cada hormiga
    for (const solution of solutions) {
      /** se calcula la ganancia de la solucion actual */
      let value = 0;

      for (let i = 0; i < items.length; i++) {
        if (solution[i]) {
          value += items[i].value;
        }
      }

      if (value !== 0) {
        console.log(solution);
      }

      // y la ganancia se mejora
      if (value > bestValue) {
        bestSolution = [...solution];
        bestValue = value;
        for (let i = 0; i < items.length; i++) {
          // Si tomar un objeto es solucion entonces actualizamos la feromona de esa solucion
          if (solution[i]) {
            pheromones[i] += value / bestValue;
          }
        }
      }
    }
    // for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    //   pheromones[itemIndex] -= evaporationRate;
    // }
  }

  return [...bestSolution];
}

export const hormigas = (
  data: Objeto[],
  antsAmount: number,
  PESO_LIMITE_MOCHILA: number,
  iterations: number,
  evaporationRate: number,
  minItemValue: number
): {
  solution: { value: number; weight: number };
} => {
  const items = [...data].map((obj) => new Item(obj.valor, obj.peso));
  const solution = antColonyOptimization(
    items,
    PESO_LIMITE_MOCHILA,
    antsAmount,
    iterations,
    evaporationRate,
    minItemValue
  );
  let valor = 0;
  let peso = 0;
  for (let i = 0; i < data.length; i++) {
    if (solution[i]) {
      valor += data[i].valor;
      peso += data[i].peso;
    }
  }
  console.log('solucion', solution);

  return {
    solution: {
      value: valor,
      weight: peso,
    },
  };
};
