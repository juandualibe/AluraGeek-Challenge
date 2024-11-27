// Seleccionamos los elementos del DOM
const formularioProducto = document.getElementById('formularioProducto');
const nombreProductoInput = document.getElementById('nombreProducto');
const precioProductoInput = document.getElementById('precioProducto');
const productosContainer = document.getElementById('productos-container');

// URL base de tu json-server
const API_URL = 'http://localhost:3000/productos';

// Cargar los productos existentes desde el servidor al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);

// Event listener para el formulario
formularioProducto.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenimos que se recargue la página

    const nombreProducto = nombreProductoInput.value;
    const precioProducto = precioProductoInput.value;

    if (nombreProducto && precioProducto) {
        agregarProducto(nombreProducto, precioProducto); // Agregamos el producto
        nombreProductoInput.value = ''; // Limpiamos los campos
        precioProductoInput.value = '';
    }
});

// Función para agregar un producto
function agregarProducto(nombre, precio) {
    const nuevoProducto = {
        nombre: nombre,
        precio: precio
    };

    console.log('Nuevo Producto:', nuevoProducto);  // Verificamos que los datos son correctos

    // Usamos fetch para hacer una solicitud POST al servidor
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto) // Convertimos el objeto a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud POST');
        }
        return response.json();
    })
    .then(productoGuardado => {
        // Al guardar el producto, lo mostramos inmediatamente en la interfaz
        mostrarProductoEnTarjeta(productoGuardado);
    })
    .catch(error => {
        console.error('Error al guardar el producto:', error);
    });
}

// Función para mostrar el producto en una tarjeta
function mostrarProductoEnTarjeta(producto) {
    const tarjetaProducto = document.createElement('div');
    tarjetaProducto.classList.add('producto-card');

    tarjetaProducto.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <button id="eliminar-${producto.id}">Eliminar</button>
    `;

    productosContainer.appendChild(tarjetaProducto); // Añadimos la tarjeta al contenedor

    // Agregar el evento de eliminación al botón después de agregarlo al DOM
    const botonEliminar = tarjetaProducto.querySelector(`#eliminar-${producto.id}`);
    botonEliminar.addEventListener('click', () => eliminarProducto(producto.id, botonEliminar));
}

// Función para cargar los productos desde el servidor
function cargarProductos() {
    fetch(API_URL)
        .then(response => response.json())
        .then(productos => {
            productos.forEach(producto => {
                mostrarProductoEnTarjeta(producto); // Mostramos todos los productos al cargar
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

// Función para eliminar un producto
function eliminarProducto(id, button) {
    // Usamos fetch para hacer una solicitud DELETE al servidor
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        const tarjeta = button.parentElement;
        tarjeta.remove(); // Eliminamos la tarjeta del DOM
    })
    .catch(error => {
        console.error('Error al eliminar el producto:', error);
    });
}
