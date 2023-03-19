import Chromosome from './chromosome';
import { Bag } from './knapsack';

class Population {
  population: Chromosome[];
  crossRate: number;
  bag: Bag;
  totalBenefit: number;
  best: Chromosome | null;

  constructor(bag: Bag, cross_rate: number) {
    this.population = []; // Array to hold the current population
    this.crossRate = cross_rate;
    this.bag = bag;
    this.totalBenefit = 0;
    this.best = null;
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
    for (; i < this.population.length; i++) {
      if (Math.random() <= this.crossRate) {
        let partnerA = this.naturalSelection();
        let partnerB = this.naturalSelection();
        // do cross over
        if (partnerA && partnerB) {
          let child = partnerA.crossoverRandom(partnerB);
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
    let dupsCount: number[] = [];
    let nintyPercentCount: number = this.population.length * 0.9;

    for (const element of this.population) {
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
    let index = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > worldrecord1) {
        worldrecord2 = worldrecord1;
        index = i;
        worldrecord1 = this.population[i].fitness;
      } else if (this.population[i].fitness > worldrecord2) {
        worldrecord2 = this.population[i].fitness;
      }
    }
    this.best = this.population[index];
  };
}

export default Population;
