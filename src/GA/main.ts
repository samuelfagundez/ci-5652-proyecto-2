import { geneticAlgorithm } from './geneticAlgorithm';
import { Bag, Item } from './knapsack';
import { example1 } from '../data';

const PESO_LIMITE_MOCHILA: number = 30;

const main = () => {
  const dataset = example1.map((obj, i) => new Item(obj.peso, obj.valor, i));
  const bag = new Bag(PESO_LIMITE_MOCHILA, dataset);
  const max_iterations_count: number = 1000;
  const generation_size: number = 200;
  const mutation_rate: number = 0.01;
  const cross_rate = 0.9;

  const { best: solution } = geneticAlgorithm({
    bag,
    max_iterations_count,
    generation_size,
    mutation_rate,
    cross_rate,
  });

  //   const bestSet: Item[] = [];
  if (solution) {
    // for (let i = 0; i < solution.genes.length; i++) {
    //   const gene = solution.genes[i];
    //   if (gene === 1) {
    //     bestSet.push(solution.items[i]);
    //   }
    // }
    console.log('final object', {
      bestWeight: solution.totalWeight,
      bestValue: solution.totalBenefit,
    });
  } else {
    console.log('No solution found.');
  }
};

main();
