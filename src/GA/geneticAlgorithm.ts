import Chromosome from './chromosome';
import Population from './population';
import { Bag } from './knapsack';

const generateInitialPopulation = (
  population: Population,
  generation_size: number
): void => {
  for (let i = 0; i < generation_size; i++) {
    population.population[i] = new Chromosome(population.bag);
  }
};

export const geneticAlgorithm = ({
  bag,
  max_iterations_count,
  mutation_rate,
  generation_size,
  cross_rate,
}: {
  bag: Bag;
  max_iterations_count: number;
  mutation_rate: number;
  generation_size: number;
  cross_rate: number;
}): {
  best: Chromosome | null;
} => {
  let population = new Population(bag, mutation_rate, cross_rate);
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
    best: population.best,
  };
};
