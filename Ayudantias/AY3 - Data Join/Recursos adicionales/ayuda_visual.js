const arreglo = ["llave_1", "llave_2", /* ... */, "llave_n"]

let diccionario = Object.fromEntries(arreglo.map(x => [x, []]));
//Entregamos una lista de las tuplas (llave:valor) que queremos para nuestro objeto/diccionario

diccionario = {
    "llave_1": [],
    "llave_2": [],
    /*
    ...
    */
   "llave_n": []
};