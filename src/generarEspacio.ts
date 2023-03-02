import fs from "fs";

const N = 500;

const generarEspacio = () => {
  let ejemplos = ``;
  let ejemplosTypescript = `[`;
  for (let i = 0; i < N; i++) {
    const peso = 15 + Math.floor(Math.random() * 51);
    const valor = 1 + Math.floor(Math.random() * 499);
    ejemplos = ejemplos.concat(`Objeto("ejemplo${i}", ${peso}, ${valor})\n`);
    ejemplosTypescript = ejemplosTypescript.concat(
      `{ id: "ejemplo${i}", peso: ${peso}, valor: ${valor} }${
        i === N - 1 ? "" : ",\n"
      }`
    );
  }
  ejemplosTypescript = ejemplosTypescript.concat("]");
  fs.unlink("./ejemplos.txt", (err) => {
    if (err) console.error(err);
    console.log("Archivo Eliminado Satisfactoriamente");
  });
  fs.unlink("./ejemplosTypescript.txt", (err) => {
    if (err) console.error(err);
    console.log("Archivo Eliminado Satisfactoriamente");
  });
  fs.appendFile("./ejemplos.txt", ejemplos, (err) => {
    if (err) console.error(err);
    console.log("Archivo Creado Satisfactoriamente");
  });
  fs.appendFile("./ejemplosTypescript.txt", ejemplosTypescript, (err) => {
    if (err) console.error(err);
    console.log("Archivo Creado Satisfactoriamente");
  });
};

generarEspacio();
