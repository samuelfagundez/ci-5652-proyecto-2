class Item {
  weight: number;
  value: number;
  index: number;
  constructor(w: number, v: number, index: number) {
    this.weight = w;
    this.value = v;
    this.index = index;
  }

  getItem = (): {
    weight: Item['weight'];
    value: Item['value'];
    index: Item['index'];
  } => {
    return {
      weight: this.weight,
      value: this.value,
      index: this.index,
    };
  };
}

class Bag {
  size: number;
  itemSet: Item[];
  constructor(maxSize: number, itemSet: Item[]) {
    this.size = maxSize;
    this.itemSet = [...itemSet];
  }

  getItemBasedOnIndex = (itemSet: Item[], index: number): Item | undefined => {
    return itemSet.find((item) => item.index === index);
  };

  getWeightForList = (itemSet: Item[]): number => {
    return itemSet.reduce((acc, item) => acc + item.weight, 0);
  };

  getValueForList = (itemSet: Item[]): number => {
    return itemSet.reduce((acc, item) => acc + item.value, 0);
  };

  checkOverweight = (itemSet: Item[]): boolean => {
    if (this.getWeightForList(itemSet) > this.size) return true;
    else return false;
  };

  getRandomItemFromItemSet = (currentSolution: Item[]): Item | undefined => {
    let temp = getRandomAsInt(0, this.itemSet.length);
    let item = this.getItemBasedOnIndex(this.itemSet, temp);

    while (this.getItemBasedOnIndex(currentSolution, temp) != null) {
      temp = getRandomAsInt(0, this.itemSet.length);
      item = this.getItemBasedOnIndex(this.itemSet, temp);
    }

    return item;
  };

  calculateRemainingSpace = (itemSet: Item[]): number => {
    return this.size - this.getWeightForList(itemSet);
  };
}

function getRandomAsInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + +min);
}

export { Bag, Item };
