//Carrito vacio

let carrito = [];
//Titulo

const titulos = document.querySelector(".contenedor-titulos");
titulos.innerText = "Todos los Productos";

/**************************************
FUNCION CARGAR PRODUCTOS
***************************************/

const contenedorProductos = document.querySelector("#contenedor-productos");
function cargarProductos(productos) {

    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {

        const div = document.createElement("div");
        div.innerHTML = `
                    <div class="contenedor-card">
                        <div class="contenedor-card-imagen">
                            <img class="imagen" src="${producto.imagen}" alt="${producto.titulo}">
                        </div>
                        <div class="contenedor-card-informacion">
                            <h3 class="titulo mb-2">${producto.titulo}</h3>
                            <div class="precio mb-2">$${producto.precio}</div>
                            <button type="button" class="btn btn-dark agregar-carrito" data-id="${producto.id}"><i class="bi bi-bag-fill"></i> AGREGAR</button>
                        </div>
                    </div>
                
        `;

        contenedorProductos.append(div);
    });
};

cargarProductos(productos);

/**************************************
FUNCION BUSCAR PRODUCTOS
***************************************/

const botonBuscar = document.querySelector(".btn__mio");


botonBuscar.addEventListener("click", function (e) {
    e.preventDefault();

    const buscar = document.querySelector("#buscarProducto");
    const productoBuscado = buscar.value.toLowerCase();

    const resultados = productos.filter(function (producto) {
        return (producto.titulo.toLowerCase().includes(productoBuscado) || producto.categoria.nombre.toLowerCase().includes(productoBuscado) || producto.categoria.producto.toLowerCase().includes(productoBuscado));
    });

    titulos.innerText = "Resultados de la búsqueda"; //Cambio de título

    if (resultados.length > 0) {
        cargarProductos(resultados); //Reutilizo la función cargarProductos cambiando el parámetro
    } else {
        contenedorProductos.innerHTML =
            `<div class="contenedor__busquedad">
                                        <p class="text-center pt-3">No se encontró "<b>${productoBuscado}</b>"</p>
                                    </div>`;
    }
});

/**************************************
    FUNCION AGREGAR AL CARRITO 
        CON LOCAL STORAGE
***************************************/

function agregarAlCarrito(e) {
    if (e.target.classList.contains("agregar-carrito")) {
        const productoId = e.target.dataset.id;
        const producto = productos.find((p) => p.id === productoId);

        if (producto) {
            const productoEnCarrito = carrito.find((p) => p.id === productoId);

            if (productoEnCarrito) {
                // Si ya tengo el producto subo la cantidad y sumar el precio
                productoEnCarrito.cantidad++;
                productoEnCarrito.precioTotal = productoEnCarrito.precio * productoEnCarrito.cantidad;
            } else {
                // Si no tengo el producto en el carrito suma cantidad 1 y el precio normal
                producto.cantidad = 1;
                producto.precioTotal = producto.precio;
                carrito.push(producto);
            }
            guardarCarritoLS();
            mostrarCarrito();
            actualizarCantidadCarrito();
        }
    }
}

// Función para guardar el carrito en el Local Storage
function guardarCarritoLS() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
// Función para trae el carrito del Local Storage
function TraerCarritoLS() {
    const carritoJS = localStorage.getItem("carrito");
    return carritoJS ? JSON.parse(carritoJS) : [];
}
// Cargo el carrito desde el Local Storage
carrito = TraerCarritoLS();
mostrarCarrito();
actualizarCantidadCarrito();

contenedorProductos.addEventListener("click", agregarAlCarrito);

/**************************************
        MOSTRAR CARRITO 
***************************************/

function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
                                    <div class="carrito__vacio">
                                    <p> Su carrito esta vacío </p>
                                    <a href="#buscarProducto"><button type="button" class="btn btn-dark btn-lg p-2">Ir a comprar</button></a>
                                    </div>`
    } else {
        contenedorCarrito.innerHTML = "";

        // Creo los productos del carrito
        carrito.forEach((producto) => {
            const mostrarProductos = document.createElement("div");
            mostrarProductos.innerHTML = `
                                    <div class="producto-carrito">
                                    <img class= "imagen-carrito" src="${producto.imagen}" alt="${producto.titulo}">
                                    <h4 class="m-0 p-1">${producto.titulo}</h4>
                                    <p class="m-0 p-1">Precio: $${producto.precio}</p>
                                    <p class="m-0 p-1">Cantidad: ${producto.cantidad}</p>
                                    <p class="m-0 p-1">Subtotal: $${producto.precioTotal}</p>
                                    <button type="button" class="botones__carrito" data-id="${producto.id}"><i class="bi bi-trash3"></i></button>
                                    </div>`;

            contenedorCarrito.append(mostrarProductos); // Agregar los productos al carrito
            calcularTotal();
            // Evento para eliminar un producto del carrito
            const botonesEliminar = document.querySelectorAll(".botones__carrito");
            botonesEliminar.forEach((btn) => {
                btn.addEventListener("click", eliminarProducto);
            });
        });
    }
}

/**************************************
        VACIAR CARRITO  
***************************************/

const contenedorVaciar = document.getElementById("contenedor-vaciar");
contenedorVaciar.innerHTML = `
                        <button type="button" class="btn-vaciar btn btn-dark btn-lg p-2">Vaciar Carrito</button>`;

contenedorVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    carrito = [];
    guardarCarritoLS();
    mostrarCarrito();
    calcularTotal();
    actualizarCantidadCarrito();
}

/**************************************
        FUNCION TOTAL CARRITO 
***************************************/

function calcularTotal() {
    const total = carrito.reduce((accum, producto) => {
        return accum + producto.precio * producto.cantidad;
    }, 0);

    const contenedorTotal = document.getElementById("total-carrito");

    if (total > 0) {
        contenedorTotal.innerHTML = `
            <p class="text-end me-5"><span class="st__total">Total: $${total}</span></p>`;
    } else {
        contenedorTotal.innerHTML = "";
    }
}


/**************************************
        FUNCION ELIMINAR
***************************************/

function eliminarProducto(e) {
    const productoId = e.currentTarget.dataset.id;
    const productoEnCarrito = carrito.find((p) => p.id == productoId);
    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad--;
            productoEnCarrito.precioTotal = productoEnCarrito.precio * productoEnCarrito.cantidad;
        } else {
            const index = carrito.indexOf(productoEnCarrito);
            carrito.splice(index, 1);
        }

        guardarCarritoLS();
        mostrarCarrito();
        calcularTotal();
        actualizarCantidadCarrito();
    }
}

//Actualizar numero carrito

function actualizarCantidadCarrito() {
    const numeroCarrito = document.getElementById("numero-carrito");
    let numeroTotalCarrito = 0;

    carrito.forEach((producto) => {
        numeroTotalCarrito += producto.cantidad;
    });

    if (numeroTotalCarrito > 0) {
        numeroCarrito.innerHTML = `<span class="numerito">${numeroTotalCarrito.toString()}</span></div>`;
    } else {
        numeroCarrito.innerHTML = "";
    }
}

/**************************************
        FILTRAR POR RANGO DE PRECIOS
***************************************/

function filtrarProductos() {
    // Obtener los valores del rango de precios y la marca seleccionada
    const precioMinimo = parseInt(document.getElementById("precioMinimo").value);
    const precioMaximo = parseInt(document.getElementById("precioMaximo").value);
    const marcaSeleccionada = document.getElementById("marca").value;

    // Filtrar los productos según el rango de precios y la marca
    const productosFiltrados = productos.filter(producto => {
        // Obtener el precio del producto
        const precioProducto = parseInt(producto.precio);

        // Verificar si el producto cumple con el filtro de precios
        const cumpleFiltroPrecio = isNaN(precioMinimo) || isNaN(precioMaximo) || (precioProducto >= precioMinimo && precioProducto <= precioMaximo);

        // Verificar si el producto cumple con el filtro de marca
        const cumpleFiltroMarca = marcaSeleccionada === "" || producto.marca.toLowerCase().includes(marcaSeleccionada.toLowerCase());

        // Combinar las condiciones de filtro de precios y marca
        return cumpleFiltroPrecio && cumpleFiltroMarca;
    });

    // Cargar los productos filtrados en el contenedor
    cargarProductos(productosFiltrados);

    // Mostrar el total de resultados
    const totalResultados = productosFiltrados.length;
    document.getElementById("totalResultados").textContent = `Total de resultados: ${totalResultados}`;
}

function limpiarFiltro() {
    // Limpiar los campos de rango de precios
    document.getElementById("precioMinimo").value = "";
    document.getElementById("precioMaximo").value = "";

    // Cargar todos los productos en el contenedor
    cargarProductos(productos);

    // Mostrar el total de resultados
    const totalResultados = productos.length;
    document.getElementById("totalResultados").textContent = `Total de resultados: ${totalResultados}`;
}

// Asignar eventos a los botones de filtrar y limpiar
document.getElementById("filtrarBtn").addEventListener("click", filtrarProductos);
document.getElementById("limpiarBtn").addEventListener("click", limpiarFiltro);
