export type Objeto = {
  id: string;
  peso: number;
  valor: number;
};

export type Mochila = {
  peso_total: number;
  valor_total: number;
  objetos_seleccionados: Set<Objeto>;
  objetos_remanentes: Set<Objeto>;
};

export type Espacio = Mochila[];

export type FuncionVecindad = (m: Mochila) => Mochila | null;

export type FuncionEvaluacion = (m: Mochila) => number;

export type FuncionVecindadAceptable = (
  m1: Mochila,
  m2: Mochila,
  tabu: Espacio
) => boolean;
