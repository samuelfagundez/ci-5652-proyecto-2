// Define el valor maximo que puede albergar la mochila
const PESO_LIMITE_MOCHILA: number = 10.5;

/** Tipo de los objetos que puedes ingresar a la mochila */
type Objeto = {
  id: string;
  peso: number;
  valor: number;
};

/** Conjunto de elementos disponibles para ingresar en la mochila. */
const elementosDisponibles: Objeto[] = [
  { id: "sacapuntas", peso: 1, valor: 2.5 },
  { id: "regla_plastico", peso: 1.5, valor: 0.5 },
  { id: "lapiz3", peso: 0.5, valor: 1 },
  { id: "boli", peso: 2, valor: 2 },
  { id: "carpeta", peso: 1, valor: 5 },
  { id: "color", peso: 1.5, valor: 1.5 },
  { id: "lapiz", peso: 1, valor: 1 },
  { id: "regla_metal", peso: 3, valor: 3 },
  { id: "lapiz2", peso: 1, valor: 1 },
  { id: "hojas", peso: 0.2, valor: 0.7 },
  { id: "boli2", peso: 0.8, valor: 2 },
  { id: "borra", peso: 3.5, valor: 1 },
];

/** Instancia inicial de la mochila.
 *
 * Las mochilas serán usadas como estados de la toma de decisiones.
 *
 * peso_total - Es lo que pesa la mochila actualmente.
 * valor_total - Es el valor conjunto de los elementos ingresados en la mochila.
 * objetos_seleccionados - Son los objetos que se han ingresado a la mochila.
 * objetos_remanentes - Son los objetos que no se han ingresado a la mochila.
 *
 */
type Mochila = {
  peso_total: number;
  valor_total: number;
  objetos_seleccionados: Set<Objeto>;
  objetos_remanentes: Set<Objeto>;
};
const mochila: Mochila = {
  peso_total: 0,
  valor_total: 0,
  objetos_seleccionados: new Set(),
  objetos_remanentes: new Set([...elementosDisponibles]),
};

/** Para evitar errores de referencias generamos referencias de objetos_remanentes y objetos_seleccionados
 *  nuevos con los mismos objetos dentro.
 */
const copiarMochila = (mochila: Mochila) => {
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

// Este es el output
let mochilas_terminadas: Mochila[] = [];

const main = (): void => {
  /** Iniciamos un arreglo de mochilas que será un arreglo
   * de estados para ir tomando las decisiones de ir seleccionando
   * todos los elementos en todas las posibles combinaciones.
   */
  let mochilasQueue: Mochila[];
  /** Iniciamos el arreglo de mochilas con la instancia inicial */
  mochilasQueue = [copiarMochila(mochila)];
  /** Valor minimo encontrado mientras se explora */
  let valor_minimo: number = 0;
  /** Peso minimo encontrado mientras se explora */
  let peso_minimo: number = Infinity;
  /** Mientras hayan estados con los que seguir agregando objetos */
  while (mochilasQueue.length) {
    /** Tomamos la primera mochila del arreglo. */
    const mochilaActual: Mochila = mochilasQueue.shift() as Mochila;
    /** Generamos un estado (mochila) nuevo simulando que se selecciona cada uno
     * de los objetos remanentes para el estado actual
     */
    for (const objeto of mochilaActual.objetos_remanentes.keys()) {
      /** Generamos la copia del estado actual */
      const copiaMochila = copiarMochila(mochilaActual);
      /** Si el peso total de la mochila sumado al peso del objeto seleccionado
       * es igual o menor al peso limite de la mochila entonces
       */
      if (
        copiaMochila.peso_total + objeto.peso <= PESO_LIMITE_MOCHILA &&
        !copiaMochila.objetos_seleccionados.has(objeto)
      ) {
        /** Eliminados el objeto para que ya no pueda volver a ser seleccionado. */
        copiaMochila.objetos_remanentes.delete(objeto);
        /** Agregamos el objeto actual a los objetos seleccionados. */
        copiaMochila.objetos_seleccionados.add(objeto);
        /** Actualizamos los valores de la mochila */
        copiaMochila.peso_total += objeto.peso;
        copiaMochila.valor_total += objeto.valor;
        /** Agregamos el estado al arreglo de estados para que pueda volver a ser usado. */
        mochilasQueue.push({ ...copiaMochila });
        /** Si no se pueden agregar el objeto actual se cierra esa mochila para ese objeto. */
      } else {
        /** Si el estado final encontrado es mejor o igual que el mejor que hayamos encontrado entonces es válido. */
        if (
          copiaMochila.valor_total > valor_minimo ||
          (copiaMochila.valor_total === valor_minimo &&
            copiaMochila.peso_total < peso_minimo)
        ) {
          peso_minimo = copiaMochila.peso_total;
          valor_minimo = copiaMochila.valor_total;
          mochilas_terminadas = [{ ...copiaMochila }];
        } else if (
          copiaMochila.valor_total === valor_minimo &&
          copiaMochila.peso_total === peso_minimo
        ) {
          mochilas_terminadas.push({ ...copiaMochila });
        }
      }
    }
  }

  /**
   * Aqui encontramos todos los estados (mochilas) cuyo valor de valor_total
   * sea máximo y el peso sea mínimo.
   */
  const mochilasDeValorMaximoYPesoMinimo = mochilas_terminadas.reduce(
    /** Revisamos todas las mochilas */
    (mochilasGuardadas: Mochila[], mochilaEnRevision: Mochila) => {
      if (mochilasGuardadas.length) {
        /** Si la mochila actual tiene un valor mas grande que la primera de las mochilas que llevamos guardadas
         * entonces reemplazamos el arreglo para solo contener la nueva mochila con mayor valor
         */
        if (mochilasGuardadas[0].valor_total < mochilaEnRevision.valor_total) {
          mochilasGuardadas = [{ ...mochilaEnRevision }];
          /** Si la mochila actual tiene el mismo valor que la primera mochila de las mochilas que llevamos
           * guardadas y el peso es el mismo entonces la agregamos a lista.
           */
        } else if (
          mochilasGuardadas[0].valor_total === mochilaEnRevision.valor_total &&
          mochilasGuardadas[0].peso_total === mochilaEnRevision.peso_total
        ) {
          mochilasGuardadas = [
            ...mochilasGuardadas.slice(0),
            { ...mochilaEnRevision },
          ];
          /**
           * Si la mochila actual tiene el mismo valor pero un peso menor que la primera mochila de las mochilas
           * que llevamos guardadas entonces encontramos una mejor solucion asi que rehacemos la lista.
           */
        } else if (
          mochilasGuardadas[0].valor_total === mochilaEnRevision.valor_total &&
          mochilasGuardadas[0].peso_total > mochilaEnRevision.peso_total
        ) {
          mochilasGuardadas = [{ ...mochilaEnRevision }];
        }
      } else {
        /** Si no hay mochilas guardadas iniciamos la lista */
        mochilasGuardadas = [{ ...mochilaEnRevision }];
      }
      return mochilasGuardadas;
    },
    []
  );

  /** Valor solucion para las mochilas */
  const valorMaximo = mochilasDeValorMaximoYPesoMinimo[0].valor_total;
  /** Peso solucion para las mochilas */
  const pesoMinimo = mochilasDeValorMaximoYPesoMinimo[0].peso_total;
  /** Objetos a seleccionar para la solucion (repetidos)
   *  Formateados a string para ser impresos
   */
  const soluciones = mochilasDeValorMaximoYPesoMinimo
    .map((mochila) => [...mochila.objetos_seleccionados])
    .map((solucion) =>
      solucion
        .map((objeto) => objeto.id)
        .sort()
        .join(",")
    );
  /** Soluciones sin repetir */
  let solucionesFinales: Set<string> = new Set();
  for (const solucion of soluciones) {
    solucionesFinales.add(solucion);
  }
  // Print resultado
  console.log("Resultado:");
  console.log("Valor máximo:", valorMaximo);
  console.log("Peso mínimo:", pesoMinimo);
  console.log("cantidad de estados finales", mochilas_terminadas.length);
  console.log("objetos finales", [...solucionesFinales]);
};

main();
