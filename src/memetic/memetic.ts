import Chromosome from './chromosome';
import Population from './population';
import { Bag, Item } from './knapsack';
import { Objeto } from '../models';

const generateInitialPopulation = (
  population: Population,
  generation_size: number
): void => {
  for (let i = 0; i < generation_size; i++) {
    population.population[i] = new Chromosome(population.bag);
  }
};

export const memetic = (
  data: Objeto[],
  {
    max_iterations_count,
    generation_size,
    cross_rate,
  }: {
    max_iterations_count: number;
    generation_size: number;
    cross_rate: number;
  },
  PESO_LIMITE_MOCHILA: number
): {
  solution: { value: number; weight: number };
} => {
  const dataset = data.map((obj, i) => new Item(obj.peso, obj.valor, i));
  const bag = new Bag(PESO_LIMITE_MOCHILA, dataset);
  let population = new Population(bag, cross_rate);
  generateInitialPopulation(population, generation_size);
  population.calculateFitness();
  let nb_generations: number = 0;

  while (
    nb_generations < max_iterations_count &&
    !population.isNintyPercentTheSame()
  ) {
    population.generate();
    nb_generations++;
    population.calculateFitness();
    population.evaluate();
  }

  return {
    solution: {
      weight: population.best?.totalWeight || 0,
      value: population.best?.totalBenefit || 0,
    },
  };
};
