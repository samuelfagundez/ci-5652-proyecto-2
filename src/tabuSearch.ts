import { example1 } from './data';
import {
  Mochila,
  Espacio,
  FuncionVecindad,
  FuncionVecindadAceptable,
  Objeto,
} from './models';
import { copiarMochila } from './utils/copiarMochila';

const PESO_LIMITE_MOCHILA: number = 30;

// Ready
const funcionVecindad: FuncionVecindad = (m) => {
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

const generarSolucionInicial = (e: Espacio): Mochila | null => {
  const auxMochila = e[0];
  if (auxMochila) {
    const prioridadObjetos = (a: Objeto, b: Objeto): number => {
      if (a.valor > b.valor) {
        return -1;
      } else if (a.valor === b.valor && a.peso < b.peso) {
        return -1;
      } else {
        return 1;
      }
    };
    let objetosRemanentesDeLaMochilaOrdenadosPorPrioridad: Objeto[] = [
      ...auxMochila.objetos_remanentes,
    ].sort(prioridadObjetos);

    while (
      auxMochila.peso_total < PESO_LIMITE_MOCHILA &&
      objetosRemanentesDeLaMochilaOrdenadosPorPrioridad.length
    ) {
      const elementoMasRelevante =
        objetosRemanentesDeLaMochilaOrdenadosPorPrioridad[0];
      if (
        auxMochila.peso_total + elementoMasRelevante.peso <=
        PESO_LIMITE_MOCHILA
      ) {
        auxMochila.objetos_seleccionados.add(elementoMasRelevante);
        auxMochila.objetos_remanentes.delete(elementoMasRelevante);
        auxMochila.peso_total += elementoMasRelevante.peso;
        auxMochila.valor_total += elementoMasRelevante.valor;
      }
      objetosRemanentesDeLaMochilaOrdenadosPorPrioridad = [
        ...objetosRemanentesDeLaMochilaOrdenadosPorPrioridad.slice(1),
      ];
    }
    return copiarMochila(auxMochila);
  } else {
    return null;
  }
};

const mejorElemento = (VA: FuncionVecindad, SCopy: Mochila): Mochila => {
  // Aplicar VA a SCopy y sacar el mejor elemento.
  const vecino = VA(SCopy);
  if (vecino) {
    return vecino;
  } else {
    return SCopy;
  }
};

const funcionMovimientoPermitido: FuncionVecindadAceptable = (m1, m2, tabu) => {
  return true;
};

const actualizarTabu = (
  VA: FuncionVecindad,
  S: Mochila,
  Tabu: Espacio,
  Acc: FuncionVecindadAceptable
): FuncionVecindad => {
  return VA;
};

const TS = (
  E: Espacio,
  V: FuncionVecindad,
  Acc: FuncionVecindadAceptable
): Mochila | null => {
  let S = generarSolucionInicial(E);
  if (S) {
    let SCopy: Mochila = copiarMochila(S);
    let Tabu: Espacio = [];
    let VA: FuncionVecindad = V;
    let repeticionesSinHacerNada = 0;
    while (repeticionesSinHacerNada < 10000) {
      SCopy = mejorElemento(VA, SCopy);
      VA = actualizarTabu(VA, S, Tabu, Acc);
      if (
        SCopy.valor_total > S.valor_total ||
        (SCopy.valor_total === S.valor_total && SCopy.peso_total < S.peso_total)
      ) {
        S = SCopy;
      }
      repeticionesSinHacerNada++;
    }
    return S;
  }
  return null;
};

// ejecucion
const mochila: Mochila = {
  peso_total: 0,
  valor_total: 0,
  objetos_seleccionados: new Set(),
  objetos_remanentes: new Set([...example1]),
};
console.log(
  TS([copiarMochila(mochila)], funcionVecindad, funcionMovimientoPermitido)
);
