// Cuando se carga el DOM (HTML), entonces...
document.addEventListener("DOMContentLoaded", () => {

    // Cuando se hace click en el botón de favoritos, entonces...
    document.getElementById("btn-favorite").addEventListener("click", (event) => {
        agregarAFavoritos(event.target);
    });
});

export let favoritos = JSON.parse(localStorage.getItem("favoritosJSON")) || [];
console.info("Favoritos Local Storage: ", favoritos)

export const agregarAFavoritos = (item) => {

    const title = item.getAttribute("data-title");
    const date = item.getAttribute("data-date");
    const url = item.getAttribute("data-url");
    const explanation = item.getAttribute("data-explanation");

    const existe = favoritos.find((itemFav) => itemFav.date == date);

    // Si el item no existe en favoritos, entonces...
    if (!existe) {
        favoritos.push({ date, title, url, explanation });
        localStorage.setItem("favoritosJSON", JSON.stringify(favoritos));

        mostrarFavoritos();
    }
};

export const mostrarFavoritos = () => {
    const contenedor = document.getElementById("favorites-list");

    contenedor.innerHTML = "";

    if (favoritos.length === 0) {
        contenedor.innerHTML = "<p>Aún no tienes favoritos.</p>";
        return;
    }

    favoritos.forEach((item) => {
        contenedor.innerHTML += `
        <li class="list-group-item bg-azull text-light d-flex justify-content-between align-items-center border-light rounded mb-3" style="border-top-width: 1px;">
            <div><p class="mb-1 fw-bold" style="cursor: pointer" data-date="${item.date}">${item.date}</p></div>
            <img 
                src="${item.url}" 
                alt="${item.title}" 
                class="img-thumbnail" 
                style="width: 170px; height: auto; max-height:250px; border-radius: 8px;">
        </li>
    `;

    });

    const dateLabels = contenedor.querySelectorAll("p[data-date]");
    dateLabels.forEach((label) => {
        label.addEventListener("click", () => {
            eliminarDeFavoritos(label);
        });
    });
};

export const eliminarDeFavoritos = (item) => {
    console.log("clickeado")
    const date = item.getAttribute("data-date");
    favoritos = favoritos.filter((item) => item.date != date);
    localStorage.setItem("favoritosJSON", JSON.stringify(favoritos));
    mostrarFavoritos();
};

mostrarFavoritos()