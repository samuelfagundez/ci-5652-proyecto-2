import { Item, Bag } from './knapsack';
import { busquedaLocal } from './busquedaLocal';
import { Objeto } from '../models';

class Chromosome {
  bag: Bag;
  genes: number[];
  items: Item[];
  fitness: number;
  totalWeight: number;
  totalBenefit: number;
  constructor(bag: Bag) {
    this.bag = { ...bag };
    this.genes = []; // values of the gene (0,...1)
    this.items = [...bag.itemSet]; // hold current items
    this.fitness = 0; // fitness of this gene
    this.totalWeight = 0; // total weight of gene
    this.totalBenefit = 0; // total benefits by this gene

    // generate this gene randomly
    for (let i = 0; i < this.items.length; i++) {
      this.genes[i] = Math.floor(Math.random() * 2); // Pick 0 or 1 randomly
    }
  }

  calculateFitness = (): number => {
    let totalBenefit = 0;
    let totalWeight = 0;

    for (let i = 0; i < this.genes.length; i++) {
      if (this.genes[i] === 1) {
        totalWeight += this.items[i].weight;
        totalBenefit += this.items[i].value;
      }
    }

    // if the Weight is over remove random element
    while (totalWeight > this.bag.size) {
      let randomIndex = Math.floor(Math.random() * this.items.length);
      while (this.genes[randomIndex] === 0) {
        randomIndex = Math.floor(Math.random() * this.items.length);
      }
      // found element to delete, update gene
      this.genes[randomIndex] = 0;
      totalWeight -= this.items[randomIndex].weight;
      totalBenefit -= this.items[randomIndex].value;
    }
    // update gene totals
    this.totalWeight = totalWeight;
    this.totalBenefit = totalBenefit;
    // calculate final-fitness of the gene
    this.fitness = totalBenefit;
    return this.fitness;
  };

  calculateFitnessWithoutLimit = (): number => {
    let totalBenefit = 0;
    let totalWeight = 0;

    for (let i = 0; i < this.genes.length; i++) {
      if (this.genes[i] === 1) {
        totalWeight += this.items[i].weight;
        totalBenefit += this.items[i].value;
      }
    }
    // update gene totals
    this.totalWeight = totalWeight;
    this.totalBenefit = totalBenefit;
    // calculate final-fitness of the gene
    this.fitness = totalBenefit;
    return this.fitness;
  };

  // Crossover Random
  crossoverUniform = (
    partner1: Chromosome,
    partner2: Chromosome
  ): Chromosome | undefined => {
    // A new child
    let child = new Chromosome(this.bag);
    child = {
      ...child,
      genes: [...new Array(this.genes.length).fill(0)],
    };
    // order permutation
    let genesOrder: number[] = [...new Array(this.genes.length).fill(0)];
    for (let i = 0; i < genesOrder.length; i++) {
      genesOrder[i] = i;
    }
    while (genesOrder.length) {
      const randomIndex = Math.floor(Math.random() * genesOrder.length);
      genesOrder = [
        ...genesOrder.slice(0, randomIndex),
        ...genesOrder.slice(randomIndex + 1),
      ];
      const prob =
        partner1.genes[genesOrder[randomIndex]] +
        partner2.genes[genesOrder[randomIndex]] +
        this.genes[genesOrder[randomIndex]];
      if (Math.random() < prob / 3) {
        child.genes[genesOrder[randomIndex]] = 1;
        child.calculateFitnessWithoutLimit();
        if (child.totalWeight <= child.bag.size) {
          const objetos: Objeto[] = child.items.map(
            (item) =>
              ({
                id: item.index.toString(),
                peso: item.weight,
                valor: item.value,
              } as Objeto)
          );
          child.genes = [
            ...busquedaLocal(child.genes, objetos, child.bag.size),
          ];
          return child;
        }
      }
    }
  };
}

export default Chromosome;
