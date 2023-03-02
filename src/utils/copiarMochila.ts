import { Mochila, Objeto } from "../models";

export const copiarMochila = (mochila: Mochila) => {
  const nuevosObjetosRemanentes: Set<Objeto> = new Set();
  const nuevosObjetosSeleccionados: Set<Objeto> = new Set();
  for (const objeto of mochila.objetos_remanentes.values()) {
    nuevosObjetosRemanentes.add(objeto);
  }
  for (const objeto of mochila.objetos_seleccionados.values()) {
    nuevosObjetosSeleccionados.add(objeto);
  }
  return {
    ...mochila,
    objetos_remanentes: nuevosObjetosRemanentes,
    objetos_seleccionados: nuevosObjetosSeleccionados,
  } as Mochila;
};
