import { busquedaLocal } from './busquedaLocal';
import { ILS } from './ILS';
import { solExactaDP } from './solExactaDP';
import { TS } from './tabuSearch';
import { geneticAlgorithm } from './GA/geneticAlgorithm';
import { Objeto } from './models';

const NUMERO_DE_OBJETOS = 500;
const ITEM_MINIMO_VALOR = 10;
const ITEM_MAXIMO_VALOR = 500;
const ITEM_MINIMO_PESO = 15;
const ITEM_MAXIMO_PESO = 64;
const PESO_LIMITE_MOCHILA = 100;

// ILS
const maxIterILS = 10000;
// TS
const maxIterTS = 10000;
//GA
const max_iterations_count: number = 1000;
const generation_size: number = 200;
const mutation_rate: number = 0.01;
const cross_rate = 0.9;

const benchmark = () => {
  // Init
  let t0: number;
  let t1: number;
  let solution: { value: number; weight: number };

  // Crear datos
  const data: Objeto[] = [];
  for (let i = 0; i < NUMERO_DE_OBJETOS; i++) {
    const peso =
      ITEM_MINIMO_PESO +
      Math.floor(Math.random() * (ITEM_MAXIMO_PESO - ITEM_MINIMO_PESO));
    const valor =
      ITEM_MINIMO_VALOR +
      Math.floor(Math.random() * (ITEM_MAXIMO_VALOR - ITEM_MINIMO_VALOR));
    data.push({ id: `objeto-${i}`, peso, valor });
  }

  console.log('Numero de objetos:', NUMERO_DE_OBJETOS);

  // Benchmark

  // Exacta DP
  console.log('Corrida de solucion exacta implementada con DP:');
  t0 = new Date().getTime();
  solution = solExactaDP([...data], PESO_LIMITE_MOCHILA).solution;
  t1 = new Date().getTime();
  console.log('Tiempo (s): ', (t1 - t0) / 1000);
  console.log('Peso: ', solution.weight);
  console.log('Valor: ', solution.value);
  // Local Search
  console.log('Corrida de solucion con busqueda local:');
  t0 = new Date().getTime();
  solution = busquedaLocal([...data], PESO_LIMITE_MOCHILA).solution;
  t1 = new Date().getTime();
  console.log('Tiempo (s): ', (t1 - t0) / 1000);
  console.log('Peso: ', solution.weight);
  console.log('Valor: ', solution.value);
  // ILS
  console.log('Corrida de solucion con ILS:');
  t0 = new Date().getTime();
  solution = ILS([...data], maxIterILS, PESO_LIMITE_MOCHILA).solution;
  t1 = new Date().getTime();
  console.log('Tiempo (s): ', (t1 - t0) / 1000);
  console.log('Peso: ', solution.weight);
  console.log('Valor: ', solution.value);
  // Tabu Search
  console.log('Corrida de solucion con busqueda tabu:');
  t0 = new Date().getTime();
  solution = TS([...data], maxIterTS, PESO_LIMITE_MOCHILA).solution;
  t1 = new Date().getTime();
  console.log('Tiempo (s): ', (t1 - t0) / 1000);
  console.log('Peso: ', solution.weight);
  console.log('Valor: ', solution.value);
  // Genetic Algorithm
  console.log('Corrida de solucion con GA:');
  t0 = new Date().getTime();
  solution = geneticAlgorithm(
    [...data],
    {
      max_iterations_count,
      generation_size,
      mutation_rate,
      cross_rate,
    },
    PESO_LIMITE_MOCHILA
  ).solution;
  t1 = new Date().getTime();
  console.log('Tiempo (s): ', (t1 - t0) / 1000);
  console.log('Peso: ', solution.weight);
  console.log('Valor: ', solution.value);
};

benchmark();
