const loadMoreButton = document.getElementById("load-more");
const newsList = document.getElementById("news-list");
const loading = document.getElementById("loading");

if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
        console.log("Кнопка 'Загрузить ещё' нажата");
        const page = parseInt(loadMoreButton.getAttribute("data-page")) + 1;
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get("category") || "";
        const query = urlParams.get("query") || "";

        loading.style.display = "block";
        loadMoreButton.disabled = true;

        console.log(`Запрос: /load_more?page=${page}&category=${category}&query=${query}`);

        fetch(`/load_more?page=${page}&category=${category}&query=${query}`)
            .then(response => {
                if (!response.ok) throw new Error("Ошибка HTTP: " + response.status);
                return response.json();
            })
            .then(data => {
                console.log(`Получено новостей: ${data.length}`);
                if (data.length > 0) {
                    data.forEach(article => {
                        const li = document.createElement("li");
                        li.className = "news-item";
                        li.innerHTML = `
                            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="Изображение новости" class="news-image">` : ""}
                            <div class="news-content">
                                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                                <p class="meta">Источник: ${article.source.name} | Опубликовано: ${article.publishedAt}</p>
                                ${article.description ? `<p>${article.description}</p>` : ""}
                            </div>
                        `;
                        newsList.appendChild(li);
                    });
                    loadMoreButton.setAttribute("data-page", page);
                } else {
                    loadMoreButton.style.display = "none";
                }
                loading.style.display = "none";
                loadMoreButton.disabled = false;
            })
            .catch(error => {
                console.error("Ошибка загрузки новостей:", error);
                loading.style.display = "none";
                loadMoreButton.disabled = false;
            });
    });
}