function cargarHistorial() {

    fetch("backend/obtener_historial.php")
        .then(r => r.json())
        .then(data => {

            const cont = document.getElementById("historialContainer");

            if (!data || data.length === 0) {
                cont.innerHTML = "<p>No hay pedidos en el historial.</p>";
                return;
            }

            cont.innerHTML = `
                <div class="tabla-cuentas-container">
                    <table class="tabla-cuentas">
                        <thead>
                            <tr>
                                <th>ID Pedido</th>
                                <th>Mesa</th>
                                <th>Fecha Pedido</th>
                                <th>Fecha Listo</th>
                                <th>Total</th>
                                <th>Productos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(h => `
                                <tr>
                                    <td>${h.id_pedido}</td>
                                    <td>${h.id_mesa}</td>
                                    <td>${h.fecha_pedido}</td>
                                    <td>${h.fecha_listo}</td>
                                    <td>$${h.total}</td>
                                    <td>
                                        ${h.detalle.map(d => `
                                            ${d.nombre} x${d.cantidad} → $${d.subtotal}<br>
                                        `).join("")}
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        })
        .catch(err => console.error("Error cargando historial:", err));
}

document.addEventListener("DOMContentLoaded", cargarHistorial);
