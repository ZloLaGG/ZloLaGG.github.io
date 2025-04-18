const newsGrid = document.getElementById('newsGrid');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');
const loadMoreBtn = document.getElementById('loadMoreBtn');

const rssFeeds = [
    'https://lenta.ru/rss',
    'https://rssexport.rbc.ru/rbcnews/news/30/full.rss',
    'https://ria.ru/export/rss2/archive/index.xml'
];

let allArticles = [];
let displayedArticles = [];
let articlesPerPage = 24; // Изменено с 12 на 24

async function fetchRSS(feedUrl) {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Ошибка загрузки RSS: ${response.statusText}`);
    }
    return await response.json();
}

async function fetchNews() {
    newsGrid.innerHTML = '';
    loading.style.display = 'block';
    loadMoreBtn.style.display = 'none';
    const query = searchInput.value.toLowerCase().trim();
    allArticles = [];

    try {
        for (const feedUrl of rssFeeds) {
            const feed = await fetchRSS(feedUrl);
            feed.items.forEach(item => {
                allArticles.push({
                    title: item.title || 'Без заголовка',
                    description: item.description || 'Описание отсутствует',
                    url: item.link || '#',
                    image: item.enclosure?.link || 'https://via.placeholder.com/300x200?text=Нет+изображения'
                });
            });
        }

        // Фильтрация по ключевому слову
        if (query) {
            allArticles = allArticles.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.description.toLowerCase().includes(query)
            );
        }

        displayArticles();
    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        newsGrid.innerHTML = '<p>Ошибка при загрузке новостей. Попробуйте позже.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

function displayArticles() {
    newsGrid.innerHTML = '';
    displayedArticles = allArticles.slice(0, articlesPerPage);

    displayedArticles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Читать далее</a>
        `;
        newsGrid.appendChild(card);
    });

    loadMoreBtn.style.display = allArticles.length > displayedArticles.length ? 'block' : 'none';
}

function loadMoreNews() {
    articlesPerPage += 12;
    displayArticles();
}

function clearSearch() {
    searchInput.value = '';
    fetchNews();
}

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

fetchNews();