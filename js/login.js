/* ==========================================
   CONTROL DE NAVBAR SEGÚN ROL
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const rol = localStorage.getItem("rol");

    if (!rol) return; // si no hay rol, no hacer nada

    // Si NO es admin → ocultar Mesas y Cuentas
    if (rol === "cocinero") {
        const mesasLink = document.querySelector('a[href="mesas.html"]');
        const cuentasLink = document.querySelector('a[href="cuentas.html"]');

        if (mesasLink) mesasLink.style.display = "none";
        if (cuentasLink) cuentasLink.style.display = "none";
    }
});


function login() {
    const username = document.getElementById("user").value.trim();
    const password = document.getElementById("pass").value.trim();

    if (username === "" || password === "") {
        alert("Debe llenar todos los campos");
        return;
    }

    fetch("backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(r => r.json())
    .then(res => {

        if (!res.ok) {
            alert("Usuario o contraseña incorrectos");
            return;
        }

        // guardar rol
        localStorage.setItem("rol", res.rol);

        if (res.rol === "admin") {
            window.location.href = "mesas.html";
        } else if (res.rol === "cocinero") {
            window.location.href = "pedido_cocinero.html";
        }
    })
    .catch(err => console.error("Error login:", err));
}
