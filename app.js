window.addEventListener("DOMContentLoaded", () => {
    obtenerAPOD();
    cargarFavoritos();
});

function obtenerAPOD(fecha = "") {
    let url = `https://api.nasa.gov/planetary/apod?api_key=dpxWyqyYGrYomyUy3vjyjpD7NzV7jkRdfDf90OaE&date=${fecha}`;

    fetch(url)
        .then(response => response.json())
        .then(data => mostrarAPOD(data))
        .catch(err => console.error("Error:", err));
}

function mostrarAPOD(data) {
    document.getElementById("titulo").textContent = data.title;
    document.getElementById("fecha-apod").textContent = data.date;
    document.getElementById("explicacion").textContent = data.explanation;

    const mediaDiv = document.getElementById("media");
    mediaDiv.innerHTML = "";

    if (data.media_type === "image") {
        mediaDiv.innerHTML = `<img src="${data.url}" alt="APOD">`;
    } else if (data.media_type === "video") {
        mediaDiv.innerHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    }

    const btnFavoritos = document.getElementById("btn-favorite");
    btnFavoritos.onclick = () => guardarFavorito(data);
}

document.getElementById("btn-search").addEventListener("click", () => {
    const fecha = document.getElementById("date-input").value;

    if (!fecha) {
        alert("Debes seleccionar una fecha.");
        return;
    }
    obtenerAPOD(fecha);
});

function guardarFavorito(data) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    const existe = favoritos.some(item => item.date === data.date);
    if (existe) {
        alert("Este APOD ya está en favoritos.");
        return;
    }

    favoritos.push({
        title: data.title,
        date: data.date,
        url: data.url,
        explanation: data.explanation
    });

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    cargarFavoritos();
}

// ---------------- FAVORITOS ---------------------

function cargarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const lista = document.getElementById("favorites-list");

    lista.innerHTML = "";

    favoritos.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("fav-item");

        li.innerHTML = `
            <img src="${item.url}" class="fav-thumb" alt="">
            <div class="fav-info">
                <strong>${item.title}</strong>
                <span>${item.date}</span>
            </div>
            <button class="btn-delete" data-date="${item.date}">✖</button>
        `;

        // Cargar APOD al hacer click
        li.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete")) return;
            obtenerAPOD(item.date);
        });

        // Eliminar favorito
        li.querySelector(".btn-delete").addEventListener("click", () => eliminarFavorito(item.date));

        lista.appendChild(li);
    });
}

function eliminarFavorito(date) {
    const confirmar = confirm("¿Seguro que deseas eliminar este favorito?");
    if (!confirmar) return;

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    favoritos = favoritos.filter(item => item.date !== date);

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    cargarFavoritos();
}
