
/* ==========================================
   PROYECTO: TECNOMENU
   Sistema de restaurante digital
   ========================================== */

// Productos disponibles en el restaurante
const productos = [
    {
        id: 1,
        nombre: "Hamburguesa Clásica",
        categoria: "Hamburguesas",
        precio: 5.50,
        descripcion: "Carne, queso, lechuga, tomate y salsa especial.",
        imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        nombre: "Hamburguesa Doble",
        categoria: "Hamburguesas",
        precio: 7.50,
        descripcion: "Doble carne, doble queso y vegetales frescos.",
        imagen: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        nombre: "Pizza Pepperoni",
        categoria: "Pizzas",
        precio: 8.00,
        descripcion: "Pizza con queso mozzarella y pepperoni.",
        imagen: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        nombre: "Pizza Suprema",
        categoria: "Pizzas",
        precio: 10.00,
        descripcion: "Una combinación de ingredientes y mucho queso.",
        imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        nombre: "Gaseosa",
        categoria: "Bebidas",
        precio: 1.25,
        descripcion: "Bebida fría para acompañar tus platillos.",
        imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        nombre: "Limonada",
        categoria: "Bebidas",
        precio: 1.75,
        descripcion: "Limonada refrescante, ideal para cualquier comida.",
        imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        nombre: "Pastel de Chocolate",
        categoria: "Postres",
        precio: 3.00,
        descripcion: "Pastel dulce con delicioso sabor a chocolate.",
        imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        nombre: "Helado",
        categoria: "Postres",
        precio: 2.00,
        descripcion: "Un postre frío y cremoso para terminar bien.",
        imagen: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"
    }
];

// Recuperar datos guardados en el navegador
function leerDatos(clave, valorInicial) {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : valorInicial;
    } catch (error) {
        console.error("No se pudieron leer los datos:", error);
        return valorInicial;
    }
}

// Guardar información en el navegador
function guardarDatos(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;
    } catch (error) {
        console.error("No se pudieron guardar los datos:", error);
        alert("No se pudieron guardar los datos en este navegador.");
        return false;
    }
}

// Variables principales
let carrito = leerDatos("tecnoMenuCarrito", []);
let usuarios = leerDatos("tecnoMenuUsuarios", []);
let pedidos = leerDatos("tecnoMenuPedidos", []);
let usuarioActual = leerDatos("tecnoMenuSesion", null);
let modoRegistro = false;

// Mostrar precios en dólares
function formatoPrecio(precio) {
    return "$" + precio.toFixed(2);
}

// Mostrar los productos del menú
function mostrarProductos(categoria = "Todos") {
    const lista = document.getElementById("listaProductos");

    const productosFiltrados = categoria === "Todos"
        ? productos
        : productos.filter(producto => producto.categoria === categoria);

    if (productosFiltrados.length === 0) {
        lista.innerHTML = '<p class="sin-productos">No hay productos disponibles.</p>';
        return;
    }

    lista.innerHTML = productosFiltrados.map(producto => `
        <article class="producto">
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://placehold.co/600x400/211b2c/ffffff?text=TecnoMenu'">

            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>

                <div class="producto-pie">
                    <span class="precio">${formatoPrecio(producto.precio)}</span>
                    <button
                        class="btn-agregar"
                        onclick="agregarAlCarrito(${producto.id})">
                        + Agregar
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Filtrar por categoría
function filtrarMenu(categoria, boton) {
    mostrarProductos(categoria);

    document.querySelectorAll(".filtro").forEach(filtro => {
        filtro.classList.remove("activo");
    });

    boton.classList.add("activo");
}

// Mostrar la página de inicio
function mostrarInicio() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Agregar productos al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(item => item.id === id);

    if (!producto) {
        return;
    }

    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarDatos("tecnoMenuCarrito", carrito);
    actualizarCarrito();

    alert(producto.nombre + " se agregó al carrito.");
}

// Calcular el total del carrito
function calcularTotal() {
    return carrito.reduce((total, producto) => {
        return total + producto.precio * producto.cantidad;
    }, 0);
}

// Actualizar el contador y los productos del carrito
function actualizarCarrito() {
    const contador = document.getElementById("contadorCarrito");
    const contenido = document.getElementById("contenidoCarrito");
    const total = document.getElementById("totalCarrito");

    const cantidadTotal = carrito.reduce(
        (cantidad, producto) => cantidad + producto.cantidad, 0
    );

    contador.textContent = cantidadTotal;
    total.textContent = formatoPrecio(calcularTotal());

    if (carrito.length === 0) {
        contenido.innerHTML = `
            <div class="carrito-vacio">
                <p>🛒 Tu carrito está vacío.</p>
                <p>Agrega productos desde nuestro menú.</p>
            </div>
        `;
        return;
    }

    contenido.innerHTML = carrito.map(producto => `
        <div class="item-carrito">
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
                onerror="this.onerror=null;this.src='https://placehold.co/100x100/211b2c/ffffff?text=Comida'">

            <div class="item-detalle">
                <h3>${producto.nombre}</h3>
                <p>${formatoPrecio(producto.precio * producto.cantidad)}</p>
            </div>

            <div class="cantidad">
                <button
                    aria-label="Quitar una unidad"
                    onclick="cambiarCantidad(${producto.id}, -1)">−</button>

                <span>${producto.cantidad}</span>

                <button
                    aria-label="Agregar una unidad"
                    onclick="cambiarCantidad(${producto.id}, 1)">+</button>
            </div>
        </div>
    `).join("");
}

// Cambiar la cantidad de un producto
function cambiarCantidad(id, cambio) {
    const producto = carrito.find(item => item.id === id);

    if (!producto) {
        return;
    }

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        carrito = carrito.filter(item => item.id !== id);
    }

    guardarDatos("tecnoMenuCarrito", carrito);
    actualizarCarrito();
}

// Abrir el carrito
function abrirCarrito() {
    actualizarCarrito();
    document.getElementById("mensajePedido").textContent = "";
    document.getElementById("mensajePedido").className = "mensaje";
    abrirModal("modalCarrito");
}

// Vaciar el carrito
function vaciarCarrito() {
    if (carrito.length === 0) {
        return;
    }

    if (!confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        return;
    }

    carrito = [];

    guardarDatos("tecnoMenuCarrito", carrito);
    actualizarCarrito();

    document.getElementById("mensajePedido").textContent =
        "El carrito se ha vaciado.";
}

// Confirmar y guardar un pedido
function confirmarPedido() {
    const mensaje = document.getElementById("mensajePedido");

    if (!usuarioActual) {
        mensaje.textContent = "Inicia sesión antes de confirmar tu pedido.";
        mensaje.className = "mensaje error";

        setTimeout(() => {
            cerrarModal("modalCarrito");
            abrirLogin();
        }, 1200);

        return;
    }

    if (carrito.length === 0) {
        mensaje.textContent = "Agrega al menos un producto al carrito.";
        mensaje.className = "mensaje error";
        return;
    }

    const nuevoPedido = {
        numero: Date.now(),
        cliente: usuarioActual.nombre,
        correo: usuarioActual.correo,
        productos: carrito.map(producto => ({ ...producto })),
        total: calcularTotal(),
        fecha: new Date().toLocaleString("es-SV"),
        estado: "Pendiente"
    };

    pedidos.push(nuevoPedido);

    // Guardar el pedido antes de vaciar el carrito
    if (!guardarDatos("tecnoMenuPedidos", pedidos)) {
        return;
    }

    carrito = [];

    if (!guardarDatos("tecnoMenuCarrito", carrito)) {
        // El pedido ya está guardado; actualizar la interfaz igualmente.
    }

    actualizarCarrito();

    mensaje.textContent =
        "¡Pedido #" + nuevoPedido.numero +
        " guardado correctamente! Total: " +
        formatoPrecio(nuevoPedido.total);

    mensaje.className = "mensaje exito";
}

// Mostrar u ocultar ventanas
function abrirModal(id) {
    document.getElementById(id).classList.add("visible");
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove("visible");
}

// Abrir inicio de sesión
function abrirLogin() {
    modoRegistro = false;
    actualizarFormularioLogin();

    document.getElementById("mensajeLogin").textContent = "";
    document.getElementById("mensajeLogin").className = "mensaje";

    abrirModal("modalLogin");
}

// Cambiar entre registro e inicio de sesión
function cambiarModoLogin() {
    modoRegistro = !modoRegistro;
    actualizarFormularioLogin();

    document.getElementById("mensajeLogin").textContent = "";
    document.getElementById("mensajeLogin").className = "mensaje";
}

// Actualizar el formulario según el modo
function actualizarFormularioLogin() {
    document.getElementById("tituloLogin").textContent =
        modoRegistro ? "Crear una cuenta" : "¡Bienvenido!";

    document.getElementById("textoLogin").textContent =
        modoRegistro
            ? "Regístrate para realizar tus pedidos."
            : "Inicia sesión para continuar.";

    document.getElementById("campoNombre").classList.toggle(
        "oculto", !modoRegistro
    );

    document.getElementById("nombreUsuario").required = modoRegistro;

    document.getElementById("btnEnviarLogin").textContent =
        modoRegistro ? "Registrarme" : "Iniciar sesión";

    document.getElementById("textoCambiar").textContent =
        modoRegistro ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?";

    document.getElementById("btnCambiarModo").textContent =
        modoRegistro ? "Inicia sesión" : "Regístrate";

    document.getElementById("claveUsuario").autocomplete =
        modoRegistro ? "new-password" : "current-password";
}

// Registrar usuario o iniciar sesión
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreUsuario").value.trim();
    const correo = document.getElementById("correoUsuario").value.trim().toLowerCase();
    const clave = document.getElementById("claveUsuario").value;
    const mensaje = document.getElementById("mensajeLogin");

    if (modoRegistro) {
        if (nombre.length < 2) {
            mostrarMensajeLogin("Escribe tu nombre completo.", false);
            return;
        }

        if (clave.length < 6) {
            mostrarMensajeLogin("La contraseña debe tener al menos 6 caracteres.", false);
            return;
        }

        const existe = usuarios.some(usuario => usuario.correo === correo);

        if (existe) {
            mostrarMensajeLogin("Este correo ya está registrado.", false);
            return;
        }

        const nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            clave: clave
        };

        usuarios.push(nuevoUsuario);

        if (!guardarDatos("tecnoMenuUsuarios", usuarios)) {
            usuarios.pop();
            return;
        }

        mostrarMensajeLogin("Cuenta creada. Ahora puedes iniciar sesión.", true);

        document.getElementById("claveUsuario").value = "";
        modoRegistro = false;
        actualizarFormularioLogin();
        return;
    }

    const usuarioEncontrado = usuarios.find(usuario =>
        usuario.correo === correo && usuario.clave === clave
    );

    if (!usuarioEncontrado) {
        mostrarMensajeLogin("Correo o contraseña incorrectos.", false);
        return;
    }

    usuarioActual = {
        nombre: usuarioEncontrado.nombre,
        correo: usuarioEncontrado.correo
    };

    if (!guardarDatos("tecnoMenuSesion", usuarioActual)) {
        usuarioActual = null;
        return;
    }

    actualizarSesion();

    mensaje.textContent = "¡Bienvenido, " + usuarioActual.nombre + "!";
    mensaje.className = "mensaje exito";

    document.getElementById("formLogin").reset();

    setTimeout(() => {
        cerrarModal("modalLogin");
    }, 1000);
});

// Mostrar mensajes del formulario
function mostrarMensajeLogin(texto, correcto) {
    const mensaje = document.getElementById("mensajeLogin");

    mensaje.textContent = texto;
    mensaje.className = correcto
        ? "mensaje exito"
        : "mensaje error";
}

// Actualizar el botón de sesión
function actualizarSesion() {
    const boton = document.getElementById("btnSesion");

    if (usuarioActual) {
        boton.textContent = "Hola, " + usuarioActual.nombre.split(" ")[0];
        boton.onclick = cerrarSesion;
        boton.title = "Haz clic para cerrar sesión";
    } else {
        boton.textContent = "Iniciar sesión";
        boton.onclick = abrirLogin;
        boton.title = "Iniciar sesión";
    }
}

// Cerrar sesión
function cerrarSesion() {
    if (!confirm("¿Deseas cerrar tu sesión?")) {
        return;
    }

    usuarioActual = null;

    localStorage.removeItem("tecnoMenuSesion");

    actualizarSesion();

    alert("Has cerrado sesión correctamente.");
}

// Cerrar las ventanas al hacer clic fuera de ellas
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.classList.remove("visible");
        }
    });
});

// Cerrar ventanas con la tecla Escape
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.classList.remove("visible");
        });
    }
});

// Inicializar la aplicación
document.getElementById("anio").textContent = new Date().getFullYear();

mostrarProductos();
actualizarCarrito();
actualizarSesion();
