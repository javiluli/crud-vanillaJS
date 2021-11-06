import { panes } from "./constant.js";
import { Cantidad, Subtotal, Pedido } from "./Pedido.js";

const btnAdd = document.getElementById("btnAdd");

const selectPanes = document.getElementById("selectPanes");
const inptPrecio = document.getElementById("inptPrecio");
const inptCantidad = document.getElementById("inptCantidad");
const inptSubtotal = document.getElementById("inptSubtotal");

const arrPedidos = [];

/**
 * Genera cada uno de los elementos dentro del 'select' con los distintos tipos de panes y su precio como 'value'
 */
panes.forEach((pan) => {
  selectPanes.innerHTML += `<option value="${pan.slug}">${pan.bread}</option>`;
});

// Agregar fila a la tabla
const agregarNuevaFila = () => {
  // Obtengo un objeto desde 'panes.js' en funcion de la opcion seleccionada
  const resultado = panes.find((pan) => pan.slug === getOptionSelected(selectPanes));
  const { slug, bread, price } = resultado;

  const cantidad = parseInt(getValueInput(inptCantidad), 10);
  const subtotal = parseFloat(getValueInput(inptSubtotal), 10);

  // Generar UUID
  const UUID_ROW = uuidv4();
  const UUID_CANTIDAD = uuidv4();
  const UUID_SUBTOTAL = uuidv4();

  const row = tbody.insertRow();
  row.setAttribute("id", UUID_ROW);

  // agregamos una nueva fila a la tabla
  row.innerHTML = elementFilaTabla(bread, price, UUID_CANTIDAD, cantidad, UUID_SUBTOTAL, subtotal);

  // a la nueva fila creada, se le agrega un elemento Boton con una funcion anonima
  row.children[4].appendChild(elementBtnDelete(row));

  const datos = {
    rowid: UUID_ROW,
    slug,
    bread,
    price,
    cantidad: new Cantidad(UUID_CANTIDAD, cantidad),
    subtotal: new Subtotal(UUID_SUBTOTAL, subtotal),
  };
  agregarPedido(datos);
};

const actualizarFila = (pedido) => {
  const getCantidad = parseInt(getValueInput(inptCantidad), 10);
  const getSubtotal = parseFloat(getValueInput(inptSubtotal), 10);

  pedido.cantidad.sumarCantidad(getCantidad);
  pedido.subtotal.sumarSubtotal(getSubtotal);

  const { cantidad, subtotal } = pedido;

  const objCantidad = new Cantidad(cantidad.id, cantidad.cantidad);
  const objSubtotal = new Subtotal(subtotal.id, subtotal.subtotal);

  elementSustituir("span", objCantidad.id, objCantidad.cantidad);
  elementSustituir("span", objSubtotal.id, floatFixed(objSubtotal.subtotal));
};

// agregar un pedido al array para su posterior control en la tabla
const agregarPedido = ({ rowid, slug, bread, price, cantidad, subtotal }) => {
  const pedido = new Pedido(rowid, slug, bread, price, cantidad, subtotal);
  arrPedidos.push(pedido);
};

const buscarPedido = (slug) => {
  const pedido = arrPedidos.find((pedido) => pedido.slug === slug);
  if (pedido !== undefined) {
    return pedido;
  } else {
    return null;
  }
};

const updateTotal = () => {
  let cantidad = 0,
    total = 0;
  arrPedidos.forEach((pedido) => {
    cantidad += pedido.cantidad.cantidad;
    total += cantidad * pedido.price;
  });

  elementSustituir("span", "tfoot__tr_cantidad", cantidad);
  elementSustituir("span", "tfoot__tr_total", floatFixed(total));
};

// ##### Funciones #####
const floatFixed = (n) => Number(n).toFixed(2);

// ##### Obtener valores de formularios #####
const getOptionSelected = (select) => select.options[select.selectedIndex].value;

const getValueInput = (input) => input.value;

// ##### Crear elementos HTML #####
const elementFilaTabla = (bread, price, rowidCantidad, cantidad, rowidSubtotal, subtotal) => {
  return `
  <th scope="row">${bread}</th>
  <td>${price}€</td>
  <td>
    <span id=${rowidCantidad}>${cantidad}</span>
  </td>
  <td>
    <span id=${rowidSubtotal}>${subtotal}</span> €
  </td>
  <td></td>
  `;
};

const elementBtnDelete = (row) => {
  const element = document.createElement("button");
  element.classList.add("btn", "btn-danger", "btn-sm");
  element.innerHTML = "<i class='bi bi-trash'></i>";
  element.onclick = function () {
    const rowid = row.getAttribute("id");
    const element = document.getElementById(rowid);
    element.remove();

    // elimina el objeto de array
    for (let i = 0; i < arrPedidos.length; i++) {
      if (arrPedidos[i].id === rowid) {
        arrPedidos.splice(i, 1);
      }
    }

    // se actualizan los totales
    updateTotal();
  };

  return element;
};

// sustituir elemento HTML
const elementSustituir = (htmlElement, id, textNode) => {
  const elementNode = document.createElement(htmlElement);
  elementNode.setAttribute("id", id);
  const elementNode_content = document.createTextNode(textNode);
  elementNode.appendChild(elementNode_content);
  const elementChild = document.getElementById(id);
  const parentDiv = elementChild.parentNode;
  parentDiv.replaceChild(elementNode, elementChild);
};

// ##### EventListener #####
selectPanes.addEventListener("change", (e) => {
  const resultado = panes.find((pan) => pan.slug === e.target.value);
  inptPrecio.value = ""; // valor por defecto

  if (resultado !== undefined) {
    inptPrecio.value = `${resultado.price}`;
  }
  const subtotal = getValueInput(inptPrecio) * getValueInput(inptCantidad);
  inptSubtotal.value = floatFixed(subtotal);
});

inptCantidad.addEventListener("keyup", (e) => {
  const valor = e.target.value;
  const regex = /^[0-9]+$/;
  if (valor.match(regex)) {
    const subtotal = getValueInput(inptPrecio) * e.target.value;
    inptSubtotal.value = floatFixed(subtotal);
  }
});

btnAdd.addEventListener("click", () => {
  const pedido = buscarPedido(getOptionSelected(selectPanes));

  if (pedido === null) {
    agregarNuevaFila();
  } else {
    actualizarFila(pedido);
  }
  updateTotal();
});
