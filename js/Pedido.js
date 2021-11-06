class Cantidad {
  constructor(id, cantidad) {
    this.id = id;
    this.cantidad = cantidad;
  }

  sumarCantidad(cantidad) {
    this.cantidad += cantidad;
  }
}

class Subtotal {
  constructor(id, subtotal) {
    this.id = id;
    this.subtotal = subtotal;
  }

  sumarSubtotal(subtotal) {
    this.subtotal += subtotal;
  }
}

class Pedido {
  constructor(id, slug, bread, price, cantidad, subtotal) {
    this.id = id;
    this.slug = slug;
    this.bread = bread;
    this.price = price;
    this.cantidad = cantidad;
    this.subtotal = subtotal;
  }
}

export { Cantidad, Subtotal, Pedido };
