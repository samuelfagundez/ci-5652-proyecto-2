import { Espacio, Mochila, Objeto } from './models';
// import { example1 as data } from './data';

// const PESO_LIMITE_MOCHILA = 30;

// El espacio combinatorio E es son las distintas combinaciones de seleccion de objetos dentro de la mochila
// que respetan que la suma de sus pesos no puede superar el peso maximo.

// La funcion de evaluacion toma una de las selecciones (una mochila) y retorna el valor_total.

// La vecindad es 1-intercambio, tomar uno de los elementos seleccionados y cambiarlo
// El tema de este cambio es que puede abrir espacio para meter otro elemento entonces se debe chequear.

const funcionVecindad = (
  m: Mochila,
  PESO_LIMITE_MOCHILA: number
): Mochila | null => {
  for (const objeto of m.objetos_remanentes) {
    if (objeto.peso + m.peso_total <= PESO_LIMITE_MOCHILA) {
      m.objetos_seleccionados.add(objeto);
      m.objetos_remanentes.delete(objeto);
      m.peso_total += objeto.peso;
      m.valor_total += objeto.valor;
      return m;
    }
  }
  for (const objetoSel of m.objetos_seleccionados) {
    for (const objetoRem of m.objetos_remanentes) {
      if (
        objetoSel.valor < objetoRem.valor &&
        m.peso_total - objetoSel.peso + objetoRem.peso <= PESO_LIMITE_MOCHILA
      ) {
        m.objetos_seleccionados.add(objetoRem);
        m.objetos_remanentes.add(objetoSel);
        m.objetos_remanentes.delete(objetoRem);
        m.objetos_seleccionados.delete(objetoSel);
        m.peso_total -= objetoSel.peso;
        m.peso_total += objetoRem.peso;
        m.valor_total -= objetoSel.valor;
        m.valor_total += objetoRem.valor;
        return m;
      }
    }
  }
  return null;
};

const generarSolucionInicial = (
  e: Espacio,
  PESO_LIMITE_MOCHILA: number
): Mochila | null => {
  const auxMochila = e[0];
  if (auxMochila) {
    for (const objeto of auxMochila.objetos_remanentes) {
      if (auxMochila.peso_total + objeto.peso <= PESO_LIMITE_MOCHILA) {
        auxMochila.objetos_seleccionados.add(objeto);
        auxMochila.objetos_remanentes.delete(objeto);
        auxMochila.peso_total += objeto.peso;
        auxMochila.valor_total += objeto.valor;
      } else {
        break;
      }
    }
    return auxMochila;
  } else {
    return null;
  }
};

export const busquedaLocal = (
  data: Objeto[],
  PESO_LIMITE_MOCHILA: number
): {
  solution: { value: number; weight: number };
} => {
  const espacio: Espacio = [
    {
      peso_total: 0,
      valor_total: 0,
      objetos_seleccionados: new Set(),
      objetos_remanentes: new Set([...data]),
    },
  ];

  /** generar una solucion inicial */
  let X = generarSolucionInicial(espacio, PESO_LIMITE_MOCHILA);
  if (X) {
    /** mientras haya un elemento mejor que X en V(X) entonces */
    let VX = funcionVecindad(X, PESO_LIMITE_MOCHILA);
    if (VX) {
      while (VX) {
        X = VX;
        VX = funcionVecindad(VX, PESO_LIMITE_MOCHILA);
      }
    }
    return {
      solution: { value: X.valor_total, weight: X.peso_total },
    };
  } else {
    return {
      solution: { value: 0, weight: 0 },
    };
  }
};

// const solution = busquedaLocal([...data], PESO_LIMITE_MOCHILA).solution;

// console.log(solution);
