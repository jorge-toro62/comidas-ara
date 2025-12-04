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

function exportarExcelFiltrado() {

    const inicio = document.getElementById("fechaInicio").value;
    const fin = document.getElementById("fechaFin").value;

    if (!inicio || !fin) {
        alert("Debe seleccionar una fecha inicio y una fecha fin");
        return;
    }

    const payload = { inicio, fin };

    fetch("backend/obtener_historial_filtrado.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {

        if (!data || data.length === 0) {
            alert("No hay cuentas registradas en ese rango de fechas");
            return;
        }

        const filas = data.map(c => {

            const productos = c.detalle.length > 0
                ? c.detalle.map(p => `${p.nombre} x${p.cantidad}`).join(", ")
                : "Sin productos";

            return {
                Mesa: c.id_mesa,
                Fecha: c.fecha,
                Estado: c.estado,
                Productos: productos,
                Total: c.total
            };
        });

        const ws = XLSX.utils.json_to_sheet(filas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Historial Filtrado");

        XLSX.writeFile(wb, `historial_${inicio}_a_${fin}.xlsx`);

        alert("¡Historial filtrado exportado correctamente!");
    })
    .catch(err => console.error("Error al generar Excel filtrado:", err));
}
