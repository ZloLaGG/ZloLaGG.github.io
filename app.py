from flask import Flask, render_template, request, jsonify
import requests
import pandas as pd
from decouple import config
import os
from datetime import datetime
from flask_babel import Babel, format_datetime

app = Flask(__name__)

# Инициализация Babel
babel = Babel(app)

# Путь к файлу кэша
CACHE_FILE = "news_cache.csv"

def fetch_news(api_key, country="ru", category=None, query=None, page=1, page_size=10):
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "country": country,
        "apiKey": api_key,
        "page": page,
        "pageSize": page_size
    }
    if category:
        params["category"] = category
    if query:
        params["q"] = query
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        articles = data.get("articles", [])
        if not articles:
            print(f"Нет новостей для запроса: category={category}, query={query}, page={page}")
            return load_cached_news()  # Возвращаем кэш, если результат пустой
        df = pd.DataFrame(articles)
        df["source"] = df["source"].apply(lambda x: x if isinstance(x, dict) else {"name": "Unknown"})
        df["cached_at"] = datetime.utcnow()
        # Сохраняем в кэш
        if os.path.exists(CACHE_FILE):
            cached_df = pd.read_csv(CACHE_FILE)
            df = pd.concat([cached_df, df]).drop_duplicates(subset=["url"], keep="last")
        df.to_csv(CACHE_FILE, index=False)
        return df.to_dict("records")
    except requests.RequestException as e:
        print(f"Ошибка при запросе новостей: {e}")
        return load_cached_news()

def load_cached_news():
    if os.path.exists(CACHE_FILE):
        df = pd.read_csv(CACHE_FILE)
        print(f"Загружено {len(df)} новостей из кэша")
        return df.to_dict("records")
    return []

# Регистрация фильтра для форматирования дат
@app.template_filter('date')
def format_date(value, format="d MMMM yyyy"):
    if not value:
        return ""
    try:
        # Преобразуем строку в объект datetime, если это строка
        if isinstance(value, str):
            value = datetime.fromisoformat(value)
        return format_datetime(value, format)
    except ValueError:
        return value

@app.route("/", methods=["GET"])
def news_list():
    # Очищаем кэш при обновлении страницы
    if os.path.exists(CACHE_FILE):
        os.remove(CACHE_FILE)
    
    API_KEY = config("NEWS_API_KEY", default="38fe900f448c46b59e808a0f1e4e84ef")
    category = request.args.get("category")
    query = request.args.get("query")
    print(f"Запрос: category={category}, query={query}")  # Отладка
    news = fetch_news(API_KEY, category=category, query=query)
    categories = ["business", "entertainment", "general", "health", "science", "sports", "technology"]
    return render_template("index.html", news=news, categories=categories, selected_category=category, query=query)

@app.route("/load_more", methods=["GET"])
def load_more():
    API_KEY = config("NEWS_API_KEY", default="38fe900f448c46b59e808a0f1e4e84ef")
    page = int(request.args.get("page", 1))  # Исправлено: int вместо intswick
    category = request.args.get("category", "")
    query = request.args.get("query", "")
    news = fetch_news(API_KEY, category=category, query=query, page=page)
    print(f"Загрузка страницы {page}, категория: {category}, запрос: {query}, новостей: {len(news)}")  # Отладка
    return jsonify(news)

if __name__ == "__main__":
    app.run(debug=True)