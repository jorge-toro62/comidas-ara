/* ==========================================
   CARGAR PRODUCTOS DESDE LA BD
========================================== */

let productosDB = [];

fetch("backend/obtener_productos.php")
    .then(r => r.json())
    .then(data => {
        productosDB = data;
        console.log("Productos cargados:", productosDB);
    });

/* ==========================================
   VARIABLES GLOBALES
========================================== */
let mesaActual = null;
let listaMesa = [];

const mesas = document.querySelectorAll(".mesa");
const modal = document.getElementById("mesaModal");
const titulo = document.getElementById("mesaTitulo");
const closeModal = document.getElementById("closeModal");

const productoInput = document.getElementById("productoInput");
const precioInput = document.getElementById("precioInput");
const cantidadInput = document.getElementById("cantidadInput");
const sugerencias = document.getElementById("sugerencias");
const tablaBody = document.querySelector("#tablaProductos tbody");
const totalLabel = document.getElementById("totalLabel");
const guardarCambiosBtn = document.getElementById("guardarCambiosBtn");



/* ==========================================
   ABRIR MESA
========================================== */
function abrirMesa(numMesa) {

    mesaActual = numMesa;
    titulo.textContent = "Mesa " + mesaActual;
    modal.style.display = "flex";

    listaMesa = [];
    actualizarTabla();
    actualizarTotal();
    limpiarCamposModal();

    fetch(`backend/obtener_cuenta_mesa.php?mesa=${numMesa}`)
        .then(r => r.json())
        .then(data => {

            console.log("Respuesta obtener_cuenta_mesa.php:", data);

            // Si el backend no devuelve un array válido, la mesa se abre vacía
            if (!data || !Array.isArray(data.detalle)) {
                console.warn("⚠️ 'detalle' no existe o no es array, se carga mesa vacía");
                listaMesa = [];
                actualizarTabla();
                actualizarTotal();
                return;
            }

            window.idPedidoMesa = data.id_pedido || null;

            listaMesa = data.detalle.map(p => ({
                id_producto: p.id_producto,
                nombre: p.nombre,
                precio: Number(p.precio),
                cantidad: Number(p.cantidad),
                subtotal: Number(p.subtotal)
            }));

            actualizarTabla();
            actualizarTotal();
        })
        .catch(err => console.error("Error al obtener cuenta:", err));


}


/* ==========================================
   LISTENER PARA MESAS
========================================== */
mesas.forEach(mesa => {
    mesa.addEventListener("click", () => {
        abrirMesa(Number(mesa.dataset.mesa));
    });
});


/* ==========================================
   CERRAR MODAL
========================================== */
if (closeModal) {
    closeModal.addEventListener("click", () => modal.style.display = "none");
}

window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});


/* ==========================================
   AUTOCOMPLETE
========================================== */
productoInput?.addEventListener("input", () => {

    const texto = productoInput.value.toLowerCase().trim();
    sugerencias.innerHTML = "";

    if (texto === "") {
        sugerencias.classList.remove("show");
        return;
    }

    const filtrados = productosDB.filter(p =>
        p.nombre.toLowerCase().startsWith(texto)
    );

    if (filtrados.length === 0) {
        sugerencias.classList.remove("show");
        return;
    }

    filtrados.forEach(prod => {
        const div = document.createElement("div");
        div.textContent = prod.nombre;

        div.addEventListener("click", () => {
            productoInput.value = prod.nombre;
            precioInput.value = prod.precio;
            sugerencias.classList.remove("show");
        });

        sugerencias.appendChild(div);
    });

    sugerencias.classList.add("show");
});


/* ==========================================
   AGREGAR PRODUCTO
========================================== */
document.getElementById("agregarBtn")?.addEventListener("click", () => {

    const nombre = productoInput.value;
    const cantidad = Number(cantidadInput.value);

    if (!nombre) return alert("Debe escribir un producto");

    const productoBD = productosDB.find(p => p.nombre === nombre);
    if (!productoBD) return alert("Producto no válido");

    const precio = Math.round(Number(productoBD.precio));
    const subtotal = precio * cantidad;


    listaMesa.push({
        id_producto: productoBD.id_producto,
        nombre,
        precio,
        cantidad,
        subtotal
    });

    actualizarTabla();
    actualizarTotal();
    limpiarCamposModal();
});


/* ==========================================
   TABLA
========================================== */
function actualizarTabla() {
    tablaBody.innerHTML = "";

    listaMesa.forEach((item, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio}</td>
            <td>$${item.subtotal}</td>
            <td>
                <button onclick="editarProducto(${index})">Editar</button>
                <button onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;

        tablaBody.appendChild(fila);
    });
}


/* ==========================================
   ELIMINAR PRODUCTO
========================================== */
function eliminarProducto(i) {
    listaMesa.splice(i, 1);
    actualizarTabla();
    actualizarTotal();
}


/* ==========================================
   EDITAR PRODUCTO
========================================== */
function editarProducto(i) {

    const nuevaCantidad = Number(prompt("Cantidad:", listaMesa[i].cantidad));

    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0)
        return alert("Cantidad inválida");

    listaMesa[i].cantidad = nuevaCantidad;
    listaMesa[i].subtotal = listaMesa[i].precio * nuevaCantidad;

    actualizarTabla();
    actualizarTotal();
}


/* ==========================================
   TOTAL
========================================== */
function actualizarTotal() {
    const total = listaMesa.reduce((s, item) => s + Number(item.subtotal), 0);
    totalLabel.textContent = "Total: $" + Math.round(total);
}

/* ==========================================
   LIMPIAR CAMPOS
========================================== */
function limpiarCamposModal() {
    productoInput.value = "";
    precioInput.value = "";
    cantidadInput.value = 1;
    sugerencias.innerHTML = "";
    sugerencias.classList.remove("show");
}


/* ==========================================
   GUARDAR CAMBIOS
========================================== */
guardarCambiosBtn?.addEventListener("click", () => {

    const payload = {
        mesa: mesaActual,
        payload: id_pedido = window.idPedidoMesa || null,
        items: listaMesa.map(p => ({
            id_producto: p.id_producto,
            cantidad: p.cantidad,
            precio: p.precio
        }))
    };

    fetch("backend/guardar_detalle_mesa.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(r => r.text())   // <-- leer texto bruto
        .then(texto => {

            console.log("🔥 Respuesta cruda guardar_detalle_mesa.php:");
            console.log(texto);

            let res;

            try {
                res = JSON.parse(texto);
            } catch (e) {
                console.error("❌ ERROR: El servidor NO devolvió JSON válido");
                console.error("Contenido recibido:", texto);
                alert("Error en el servidor (revisa la consola)");
                return;
            }

            if (res.ok) {
                alert("Cambios guardados correctamente");
                window.location.href = "mesas.html";
            } else {
                alert("Error al guardar: " + res.error);
            }
        })
        .catch(err => console.error("Error:", err));

});



/* ==========================================
   CARGAR CUENTAS EN cuentas.html
========================================== */
function cargarCuentas() {

    const cont = document.getElementById("contenedorCuentas");
    if (!cont) return;

    fetch("backend/obtener_cuentas.php")
        .then(r => r.json())
        .then(data => {

            // Filtrar cuentas que NO estén vacías
            const cuentasValidas = data.filter(c =>
                Number(c.total) > 0 || (c.detalle && c.detalle.length > 0)
            );

            const cont = document.getElementById("contenedorCuentas");

            // Si no hay cuentas válidas
            if (cuentasValidas.length === 0) {
                cont.innerHTML = `
                <div class="tabla-cuentas-container">
                    <table class="tabla-cuentas">
                        <thead>
                            <tr>
                                <th>Mesa</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Productos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5" style="text-align:center; padding:20px;">
                                    No hay cuentas registradas
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
                return;
            }

            // Construcción de la tabla con cuentas válidas
            cont.innerHTML = `
            <div class="tabla-cuentas-container">
                <table class="tabla-cuentas">
                    <thead>
                        <tr>
                            <th>Mesa</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>Productos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cuentasValidas.map(c => `
                            <tr>
                                <td>${c.id_mesa}</td>
                                <td>${c.fecha}</td>
                                <td>${c.estado}</td>
                                <td>$${c.total}</td>
                                <td>
                                    <button onclick="verDetalle(${c.id_cuenta})" class="btn-detalle">
                                        Ver detalle
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
        });
}

function verDetalle(idCuenta) {
    fetch("backend/obtener_cuentas.php")
        .then(r => r.json())
        .then(data => {
            const cuenta = data.find(c => c.id_cuenta == idCuenta);

            if (!cuenta) return;

            let mensaje = `Mesa ${cuenta.id_mesa}\n\n`;

            if (cuenta.detalle.length === 0) {
                mensaje += "No hay productos.";
            } else {
                cuenta.detalle.forEach(p => {
                    mensaje += `${p.nombre} x${p.cantidad} → $${p.subtotal}\n`;
                });
            }

            mensaje += `\nTOTAL: $${cuenta.total}`;
            alert(mensaje);
        });
}

console.log("Script cargado correctamente");

function exportarExcel() {

    fetch("backend/obtener_cuentas.php")
        .then(r => r.json())
        .then(data => {

            if (!data || data.length === 0) {
                alert("No hay cuentas para exportar");
                return;
            }

            // Crear arreglo final para exportación
            const filas = data.map(c => {

                // Unir productos en una sola cadena
                const productosTexto = c.detalle.length > 0
                    ? c.detalle.map(p => `${p.nombre} x${p.cantidad}`).join(", ")
                    : "Sin productos";

                return {
                    Mesa: c.id_mesa,
                    Productos: productosTexto,
                    Fecha: c.fecha,
                    Total: c.total
                };
            });

            // Crear hoja y workbook
            const ws = XLSX.utils.json_to_sheet(filas);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Cuentas");

            // Exportar archivo
            XLSX.writeFile(wb, "cuentas_resumen.xlsx");

            alert("¡Archivo Excel generado correctamente!");
        })
        .catch(err => console.error("Error al generar Excel:", err));
}

// Seleccionar el botón "Limpiar Mesa" basado en su texto
const limpiarMesaBtn = Array.from(document.querySelectorAll(".btn-eliminar"))
    .find(btn => btn.textContent.trim() === "Limpiar Mesa");

if (limpiarMesaBtn) {
    limpiarMesaBtn.addEventListener("click", () => {

        if (!confirm("¿Seguro que deseas limpiar la mesa?")) return;

        fetch("backend/limpiar_mesa.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mesa: mesaActual })
        })
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    listaMesa = [];
                    actualizarTabla();
                    actualizarTotal();
                    alert("Mesa limpiada correctamente.");
                } else {
                    alert("Error al limpiar: " + res.error);
                }
            })
            .catch(err => console.error("Error al limpiar:", err));
    });
}

/*Botono para generar el pedido en cocina */

const generarPedidoBtn = document.getElementById("generarPedidoBtn");

if (generarPedidoBtn) {
    generarPedidoBtn.addEventListener("click", () => {

        if (listaMesa.length === 0) {
            alert("No hay productos agregados");
            return;
        }

        // SOLO abrir el modal — no enviar nada todavía
        abrirModalCocina();
    });
}


function cargarPedidos() {

    const cont = document.getElementById("contenedorPedidos");
    if (!cont) return;

    fetch("backend/obtener_pedidos.php")
        .then(r => r.json())
        .then(data => {

            // Si no hay pedidos
            if (!data || data.length === 0) {
                cont.innerHTML = `
                    <div class="tabla-pedidos-container">
                        <table class="tabla-pedidos">
                            <thead>
                                <tr>
                                    <th>Mesa</th>
                                    <th>Productos</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="5" style="text-align:center; padding:20px;">
                                        No hay pedidos registrados.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                return;
            }

            // Construcción cuando EXISTEN pedidos
            cont.innerHTML = `
                <div class="tabla-pedidos-container">
                    <table class="tabla-pedidos">
                        <thead>
                            <tr>
                                <th>Mesa</th>
                                <th>Productos</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(p => {

                const nombres = p.detalle.length > 0
                    ? p.detalle.map(d => d.nombre).join("<br>")
                    : "Sin productos";

                const cantidades = p.detalle.length > 0
                    ? p.detalle.map(d => d.cantidad).join("<br>")
                    : "-";

                return `
                    <tr id="pedido-${p.id_pedido}">
                        <td>${p.id_mesa}</td>
                        <td>${nombres}</td>
                        <td>${cantidades}</td>
                        <td>$${p.total}</td>
                        <td>
                            <button class="btn-listo" onclick="pedidoListo(${p.id_pedido})">
                                Listo
                            </button>
                        </td>
                    </tr>
                `;


            }).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        })
        .catch(err => console.error("Error cargando pedidos:", err));
}


function limpiarPedidos() {

    if (!confirm("¿Seguro que deseas limpiar todos los pedidos?")) return;

    fetch("backend/limpiar_pedidos.php")
        .then(r => r.json())
        .then(res => {
            if (res.ok) {
                alert("Pedidos eliminados correctamente.");
                cargarPedidos(); // recargar tabla
            } else {
                alert("Error al eliminar: " + res.error);
            }
        })
        .catch(err => console.error("Error al limpiar pedidos:", err));
}

function verDetallePedido(idPedido) {

    fetch("backend/obtener_pedidos.php")
        .then(r => r.json())
        .then(data => {

            const p = data.find(x => x.id_pedido == idPedido);
            if (!p) return;

            let mensaje = `Mesa ${p.id_mesa}\n\n`;

            if (p.detalle.length === 0) {
                mensaje += "Sin productos.";
            } else {
                p.detalle.forEach(d => {
                    mensaje += `${d.nombre} x${d.cantidad} → $${d.subtotal}\n`;
                });
            }

            mensaje += `\nTOTAL: $${p.total}`;

            alert(mensaje);
        });
}

function logout() {
    localStorage.removeItem("rol");
    window.location.href = "index.html";
}

const actualizarBtn = document.getElementById("actualizarPedidosBtn");

if (window.location.pathname.includes("pedido_cocinero.html")) {
    setInterval(() => cargarPedidos(), 15000); // cada 15 segundos
}

function pedidoListo(idPedido) {

    if (!confirm("¿Marcar este pedido como listo?")) return;

    fetch("backend/pedido_listo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_pedido: idPedido })
    })
        .then(r => r.json())
        .then(res => {
            if (res.ok) {

                // 🟩 Eliminar la fila de la tabla directamente
                const fila = document.getElementById(`pedido-${idPedido}`);
                if (fila) fila.remove();

                alert("Pedido marcado como listo");

                // 🟥 Si ya no hay filas, mostrar mensaje vacío
                const filasRestantes = document.querySelectorAll("#contenedorPedidos tbody tr");
                if (filasRestantes.length === 0) {
                    document.getElementById("contenedorPedidos").innerHTML = `
                    <div class="tabla-pedidos-container">
                        <table class="tabla-pedidos">
                            <thead>
                                <tr>
                                    <th>Mesa</th>
                                    <th>Productos</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td colspan="5" style="text-align:center; padding:20px;">No hay pedidos registrados</td></tr>
                            </tbody>
                        </table>
                    </div>
                `;
                }

            } else {
                alert("Error: " + res.error);
            }
        })
        .catch(err => console.error("Error pedido listo:", err));
}

function mostrarModalSeleccion() {
    const modal = document.getElementById("modalSeleccionCocina");
    const lista = document.getElementById("listaSeleccionCocina");

    lista.innerHTML = "";

    listaMesa.forEach((item, i) => {
        lista.innerHTML += `
            <label style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>${item.nombre} (x${item.cantidad})</span>
                <input type="checkbox" data-index="${i}">
            </label>
        `;
    });

    modal.style.display = "flex";
}

// ===========================================
// EVENTOS DEL MODAL DE SELECCIÓN DE PRODUCTOS
// ===========================================

const btnCancelarSeleccion = document.getElementById("btnCancelarSeleccion");
if (btnCancelarSeleccion) {
    btnCancelarSeleccion.addEventListener("click", () => {
        document.getElementById("modalSeleccionCocina").style.display = "none";
    });
}

const btnConfirmarSeleccion = document.getElementById("btnConfirmarSeleccion");
if (btnConfirmarSeleccion) {
    btnConfirmarSeleccion.addEventListener("click", () => {
        const checks = document.querySelectorAll("#listaSeleccionCocina input[type='checkbox']");
        const seleccionados = [];

        checks.forEach(chk => {
            if (chk.checked) {
                const index = chk.getAttribute("data-index");
                seleccionados.push(listaMesa[index]);
            }
        });

        if (seleccionados.length === 0) {
            alert("Debe seleccionar al menos un producto");
            return;
        }

        generarPedido(seleccionados);
    });
}

const btnEnviarCocina = document.getElementById("btnEnviarCocina");
if (btnEnviarCocina) {
    btnEnviarCocina.addEventListener("click", () => {
        const seleccionados = [];

        document.querySelectorAll(".checkProductoCocina").forEach(chk => {
            if (chk.checked) {
                seleccionados.push({
                    id_producto: chk.dataset.id,
                    cantidad: chk.dataset.cantidad,
                    precio: chk.dataset.precio
                });
            }
        });

        if (seleccionados.length === 0) {
            alert("Debe seleccionar al menos un producto");
            return;
        }

        const payload = {
            mesa: mesaActual,
            items: seleccionados
        };

        fetch("backend/generar_pedido.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    alert("Pedido enviado a cocina correctamente");

                    // Cerrar modal de cocina
                    document.getElementById("modalCocina").style.display = "none";

                    // Volver a abrir el modal de mesa
                    document.getElementById("mesaModal").style.display = "flex";
                }
                if (res.ok) {
                    alert("Pedido enviado a cocina correctamente");

                    // Cerrar modal de cocina
                    document.getElementById("modalCocina").style.display = "none";

                    // Volver a abrir el modal de mesa
                    document.getElementById("mesaModal").style.display = "flex";
                }

                else {
                    alert("Error: " + res.error);
                }
            });
    });
}


function generarPedido(itemsSeleccionados) {

    const payload = {
        mesa: mesaActual,
        items: itemsSeleccionados.map(p => ({
            id_producto: p.id_producto,
            cantidad: p.cantidad,
            precio: p.precio
        }))
    };

    fetch("backend/generar_pedido.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(r => r.json())
        .then(res => {
            if (res.ok) {
                alert("Pedido enviado a cocina");

                // Cerrar modal de cocina
                document.getElementById("modalCocina").style.display = "none";

                // Volver a mostrar el modal original de la mesa
                document.getElementById("mesaModal").style.display = "flex";
            }

            else {
                alert("Error al generar pedido: " + res.error);
            }
        })
        .catch(err => console.error("Error:", err));
}


function abrirModalCocina() {
    const modal = document.getElementById("modalCocina");
    const contenedor = document.getElementById("listaProductosCocina");

    if (!modal || !contenedor) {
        console.warn("⚠️ Modal de cocina o contenedor NO existen en esta página");
        return;
    }

    contenedor.innerHTML = "";

    listaMesa.forEach(p => {
        contenedor.innerHTML += `
            <label>
                <input type="checkbox" class="checkProductoCocina"
                    data-id="${p.id_producto}"
                    data-cantidad="${p.cantidad}"
                    data-precio="${p.precio}">
                ${p.nombre} (x${p.cantidad})
            </label>
        `;
    });

    modal.style.display = "flex";
}

function cerrarModalCocina() {
    const modal = document.getElementById("modalCocina");
    if (modal) modal.style.display = "none";
}












