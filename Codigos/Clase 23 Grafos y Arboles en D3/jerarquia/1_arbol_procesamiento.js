d3.json("jerarquia_anidada.json")
  .then((datos) => {
    console.log("jerarquia_anidada")
    console.log("Datos originales:", datos);

    const raiz = d3.hierarchy(datos, (d) => d.hijos);
    console.log(raiz);

    console.log("Nodos:", raiz.descendants());
    console.log("Enlaces:", raiz.links());
    console.log("Hojas:", raiz.leaves());
  })
  .catch((error) => {
    console.log(error);
  });

d3.csv("jerarquia_tabular.csv", d3.autoType)
  .then((datos) => {
    console.log("jerarquia_tabular")
    console.log("Datos originales:", datos);

    const stratify = d3
      .stratify()
      .id((d) => d.nombre)
      .parentId((d) => d.padre);

    const raiz = stratify(datos);
    console.log(raiz);

    console.log("Nodos:", raiz.descendants());
    console.log("Enlaces:", raiz.links());
    console.log("Hojas:", raiz.leaves());
  })
  .catch((error) => {
    console.log(error);
  });
