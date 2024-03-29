import { busquedaLocal } from './busquedaLocal';
import { ILS } from './ILS';
import { solExactaDP } from './solExactaDP';
import { TS } from './tabuSearch';
import { geneticAlgorithm } from './GA/geneticAlgorithm';
import { memetic } from './memetic/memetic';
import { Objeto } from './models';
import { hormigas } from './hormigas/hormigas';

const NUMERO_DE_OBJETOS = 30;
const ITEM_MINIMO_VALOR = 6;
const ITEM_MAXIMO_VALOR = 30;
const ITEM_MINIMO_PESO = 2;
const ITEM_MAXIMO_PESO = 15;
const PESO_LIMITE_MOCHILA = 50;

// Corrida
const ITERACIONES = 1;

// ILS
const maxIterILS = 10000;
// TS
const maxIterTS = 10000;
//GA & Memetic
/** Cota de iteraciones. */
const max_iterations_count: number = 10000;
/** Tamaño de la poblacion inicial */
const generation_size: number = 500;
/** Indice de cruce */
const cross_rate = 0.9;
//Hormigas
const maxIterHormigas = 4000;
const antsAmount = 100;
const evaporationRate = 0.000005;

const tiemposDP: number[] = [];
const solsDP: number[] = [];
const tiemposLS: number[] = [];
const solsLS: number[] = [];
const tiemposILS: number[] = [];
const tiemposTS: number[] = [];
const solsTS: number[] = [];
const tiemposGA: number[] = [];
const solsGA: number[] = [];
const tiemposMeme: number[] = [];
const solsMeme: number[] = [];
const tiemposHormigas: number[] = [];
const solsHormigas: number[] = [];

const benchmark = () => {
  // Init
  let t0: number;
  let t1: number;
  let solution: { value: number; weight: number };

  for (let i = 0; i < ITERACIONES; i++) {
    // Crear datos
    const data: Objeto[] = [];
    for (let i = 0; i < NUMERO_DE_OBJETOS; i++) {
      const peso =
        ITEM_MINIMO_PESO +
        Math.floor(Math.random() * (ITEM_MAXIMO_PESO - ITEM_MINIMO_PESO));
      const valor =
        ITEM_MINIMO_VALOR +
        Math.floor(Math.random() * (ITEM_MAXIMO_VALOR - ITEM_MINIMO_VALOR));
      data.push({ id: `${i}`, peso, valor });
    }

    console.log('Numero de objetos:', NUMERO_DE_OBJETOS);

    // Benchmark

    // Exacta DP
    console.log('Corrida de solucion exacta implementada con DP:');
    t0 = new Date().getTime();
    solution = solExactaDP([...data], PESO_LIMITE_MOCHILA).solution;
    t1 = new Date().getTime();
    tiemposDP.push((t1 - t0) / 1000);
    solsDP.push(solution.value);
    console.log('Tiempo (s): ', (t1 - t0) / 1000);
    console.log('Peso: ', solution.weight);
    console.log('Valor: ', solution.value);
    // Local Search
    console.log('Corrida de solucion con busqueda local:');
    t0 = new Date().getTime();
    solution = busquedaLocal([...data], PESO_LIMITE_MOCHILA).solution;
    t1 = new Date().getTime();
    tiemposLS.push((t1 - t0) / 1000);
    solsLS.push(solution.value);
    console.log('Tiempo (s): ', (t1 - t0) / 1000);
    console.log('Peso: ', solution.weight);
    console.log('Valor: ', solution.value);
    // ILS
    // console.log('Corrida de solucion con ILS:');
    // t0 = new Date().getTime();
    // solution = ILS([...data], maxIterILS, PESO_LIMITE_MOCHILA).solution;
    // t1 = new Date().getTime();
    // tiemposILS.push((t1 - t0) / 1000);
    // console.log('Tiempo (s): ', (t1 - t0) / 1000);
    // console.log('Peso: ', solution.weight);
    // console.log('Valor: ', solution.value);
    // Tabu Search
    console.log('Corrida de solucion con busqueda tabu:');
    t0 = new Date().getTime();
    solution = TS([...data], maxIterTS, PESO_LIMITE_MOCHILA).solution;
    t1 = new Date().getTime();
    tiemposTS.push((t1 - t0) / 1000);
    solsTS.push(solution.value);
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
        cross_rate,
      },
      PESO_LIMITE_MOCHILA
    ).solution;
    t1 = new Date().getTime();
    tiemposGA.push((t1 - t0) / 1000);
    solsGA.push(solution.value);
    console.log('Tiempo (s): ', (t1 - t0) / 1000);
    console.log('Peso: ', solution.weight);
    console.log('Valor: ', solution.value);
    // Memetic Algorithm
    console.log('Corrida de solucion con Memetic:');
    t0 = new Date().getTime();
    solution = memetic(
      [...data],
      {
        max_iterations_count,
        generation_size,
        cross_rate,
      },
      PESO_LIMITE_MOCHILA
    ).solution;
    t1 = new Date().getTime();
    tiemposMeme.push((t1 - t0) / 1000);
    solsMeme.push(solution.value);
    console.log('Tiempo (s): ', (t1 - t0) / 1000);
    console.log('Peso: ', solution.weight);
    console.log('Valor: ', solution.value);
    // Hormigas
    console.log('Corrida de solucion con Hormigas:');
    t0 = new Date().getTime();
    // Hormigas
    solution = hormigas(
      [...data],
      antsAmount,
      PESO_LIMITE_MOCHILA,
      maxIterHormigas,
      evaporationRate,
      ITEM_MINIMO_VALOR
    ).solution;
    t1 = new Date().getTime();
    tiemposHormigas.push((t1 - t0) / 1000);
    solsHormigas.push(solution.value);
    console.log('Tiempo (s): ', (t1 - t0) / 1000);
    console.log('Peso: ', solution.weight);
    console.log('Valor: ', solution.value);
  }

  console.log('Tiempos DP: ', tiemposDP);
  console.log('Soluciones DP: ', solsDP);
  console.log('Tiempos LS: ', tiemposLS);
  console.log('Soluciones LS: ', solsLS);
  // console.log('Tiempos ILS: ', tiemposILS);
  // console.log('Soluciones ILS: ', solsILS);
  console.log('Tiempos TS: ', tiemposTS);
  console.log('Soluciones TS: ', solsTS);
  console.log('Tiempos GA: ', tiemposGA);
  console.log('Soluciones GA: ', solsGA);
  console.log('Tiempos Memetic: ', tiemposMeme);
  console.log('Soluciones Memetic: ', solsMeme);
  console.log('Tiempos Hormigas: ', tiemposHormigas);
  console.log('Soluciones Hormigas: ', solsHormigas);
};

benchmark();
