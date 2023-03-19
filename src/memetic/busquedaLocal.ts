import { Mochila, Objeto } from '../models';

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

export const busquedaLocal = (
  solucionInicial: number[],
  objetos: Objeto[],
  PESO_LIMITE_MOCHILA: number
): number[] => {
  const newObjetosSeleccionados: Set<Objeto> = new Set();
  const newObjetosRemanentes: Set<Objeto> = new Set();
  for (let i = 0; i < solucionInicial.length; i++) {
    if (solucionInicial[i]) {
      newObjetosSeleccionados.add(objetos[i]);
    } else {
      newObjetosRemanentes.add(objetos[i]);
    }
  }

  let auxSolucionInicial: Mochila = {
    peso_total: 0,
    valor_total: 0,
    objetos_seleccionados: newObjetosSeleccionados,
    objetos_remanentes: newObjetosRemanentes,
  };

  let VX = funcionVecindad(auxSolucionInicial, PESO_LIMITE_MOCHILA);
  if (VX) {
    while (VX) {
      auxSolucionInicial = VX;
      VX = funcionVecindad(VX, PESO_LIMITE_MOCHILA);
    }
  }
  const solution = [...new Array(solucionInicial.length).fill(0)];
  for (const objetoSel of auxSolucionInicial.objetos_seleccionados) {
    solution[parseInt(objetoSel.id)] = 1;
  }
  return solution;
};
