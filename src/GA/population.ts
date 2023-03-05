import Chromosome from './chromosome';
import { Bag } from './knapsack';

class Population {
  population: Chromosome[];
  mutationRate: number;
  crossRate: number;
  bag: Bag;
  totalBenefit: number;
  best: Chromosome | null;
  secondBest: Chromosome | null;

  constructor(bag: Bag, mutation_rate: number, cross_rate: number) {
    this.population = []; // Array to hold the current population
    this.mutationRate = mutation_rate;
    this.crossRate = cross_rate;
    this.bag = bag;
    this.totalBenefit = 0;
    this.best = null;
    this.secondBest = null;
  }

  // Fill our fitness array with a value for every member of the population
  calculateFitness = (): void => {
    this.totalBenefit = 0;
    for (const element of this.population) {
      let benefet = element.calculateFitness();
      this.totalBenefit += benefet;
    }
  };

  // select a random parent randomly
  naturalSelection = (): Chromosome | undefined => {
    let rand = Math.random() * this.totalBenefit;
    for (const element of this.population) {
      let chromosome = element;
      if (rand < chromosome.fitness) {
        return chromosome;
      }
      rand -= chromosome.fitness;
    }
  };

  generate = (): void => {
    let newPopulation: Chromosome[] = [];
    let i: number = 0;
    // Refill the population with children from the mating pool
    for (; i < this.population.length; i++) {
      if (Math.random() <= this.crossRate) {
        let partnerA = this.naturalSelection();
        let partnerB = this.naturalSelection();
        // do cross over
        if (partnerA && partnerB) {
          let child = partnerA.crossoverRandom(partnerB);
          // do mutation
          child.mutate(this.mutationRate);
          // add obtained child
          newPopulation[i] = child;
        }
      } else {
        newPopulation[i] = this.population[i];
      }
    }
    // update the new generation
    this.population = newPopulation;
  };

  isNintyPercentTheSame = () => {
    let arr: Chromosome[] = this.population;
    let dupsCount: number[] = [];
    let nintyPercentCount: number = arr.length * 0.9;

    for (const element of arr) {
      if (typeof dupsCount[element.fitness] === 'undefined') {
        dupsCount[element.fitness] = 0;
      } else {
        dupsCount[element.fitness]++;
      }
    }

    for (let key in dupsCount) {
      if (dupsCount[key] > nintyPercentCount) {
        return true;
      }
    }
    return false;
  };

  evaluate = () => {
    let worldrecord1 = 0;
    let worldrecord2 = 0;
    let index1 = 0;
    let index2 = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > worldrecord1) {
        worldrecord2 = worldrecord1;
        index2 = index1;
        index1 = i;
        worldrecord1 = this.population[i].fitness;
      } else if (this.population[i].fitness > worldrecord2) {
        index2 = i;
        worldrecord2 = this.population[i].fitness;
      }
    }
    this.best = this.population[index1];
    this.secondBest = this.population[index2];
  };
}

export default Population;
