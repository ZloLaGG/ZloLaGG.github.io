# News App

This project is a simple news application built using HTML, CSS, and JavaScript. It fetches news articles from a public API and displays them on a single page without the need for a server-side component. The application is designed to be hosted on GitHub Pages.

## Project Structure

```
news-app
├── assets
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── app.js
├── index.html
└── README.md
```

## Files

- **assets/css/styles.css**: Contains styles for the application, defining the appearance of elements on the page.
  
- **assets/js/app.js**: Contains JavaScript code responsible for the application's functionality. It interacts with the news API to fetch and display news articles.

- **index.html**: The main HTML page of the application. It includes links to the CSS and JavaScript files, as well as the markup for displaying news articles.

## Installation

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/yourusername/news-app.git
   ```

2. Navigate to the project directory:
   ```
   cd news-app
   ```

3. Open `index.html` in your web browser to view the application.

## Usage

- The application will automatically fetch news articles from the API when the page is loaded.
- You can customize the news query by modifying the JavaScript code in `assets/js/app.js`.

## Deployment

To deploy the application on GitHub Pages:

1. Push your code to a GitHub repository.
2. Go to the repository settings.
3. Scroll down to the "GitHub Pages" section.
4. Select the branch you want to use for GitHub Pages (usually `main` or `master`).
5. Save the settings and your application will be live at `https://yourusername.github.io/news-app/`. 

## License

This project is licensed under the MIT License.