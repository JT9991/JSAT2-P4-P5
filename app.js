// ===============================
// Movie Class
// ===============================
class Movie {
    constructor(id, title, year, rating) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.rating = rating;
    }
}

// ===============================
// Movie List Class
// ===============================
class MovieList {
    constructor() {
        this.movies = [
            new Movie(37, "The Matrix", 1999, 8.7),
            new Movie(12, "Inception", 2010, 8.8),
            new Movie(90, "Interstellar", 2014, 8.6),
            new Movie(5, "Jurassic Park", 1993, 8.1),
            new Movie(63, "Avatar", 2009, 7.8),
            new Movie(28, "Titanic", 1997, 7.9),
            new Movie(44, "Iron Man", 2008, 7.9),
            new Movie(81, "The Dark Knight", 2008, 9.0),
            new Movie(19, "Gladiator", 2000, 8.5),
            new Movie(56, "Braveheart", 1995, 8.3),
            new Movie(99, "The Lord of the Rings", 2001, 8.9),
            new Movie(89, "The Lord of the Rings: The Two Towers", 2002, 8.8)
        ];
    }

    addMovie(movie) {
        if (this.movies.some(m => m.id === movie.id)) return false;
        this.movies.push(movie);
        return true;
    }

    getMovies() {
        return this.movies;
    }

    searchById(id) {
        return this.movies.find(m => m.id === id) || null;
    }

    searchByTitle(text) {
        return this.movies.filter(m =>
            m.title.toLowerCase().includes(text.toLowerCase())
        );
    }

    sortAZ() {
        this.movies.sort((a, b) => a.title.localeCompare(b.title));
    }

    sortZA() {
        this.movies.sort((a, b) => b.title.localeCompare(a.title));
    }

    sortBest() {
        this.movies.sort((a, b) => b.rating - a.rating);
    }

    deleteMovie(id) {
        const index = this.movies.findIndex(m => m.id === id);
        if (index === -1) return false;
        this.movies.splice(index, 1);
        return true;
    }

    updateMovie(id, title, year, rating) {
        const movie = this.movies.find(m => m.id === id);
        if (!movie) return false;
        movie.title = title;
        movie.year = year;
        movie.rating = rating;
        return true;
    }
}

const movieList = new MovieList();

// ===============================
// Render Movie List
// ===============================
function renderMovieList(movies = movieList.getMovies()) {
    const list = document.getElementById("movie-list");
    list.replaceChildren();

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-box";

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const id = document.createElement("p");
        id.textContent = `ID: ${movie.id}`;

        const year = document.createElement("p");
        year.textContent = `Year: ${movie.year}`;

        const rating = document.createElement("p");
        rating.textContent = `Rating: ⭐ ${movie.rating}`;

        card.append(title, id, year, rating);
        list.appendChild(card);
    });
}


// ===============================
// Render Search Results (Only in search section)
// ===============================
function renderSearchResults(results) {
    const container = document.getElementById("search-results");
    container.replaceChildren();

    const items = Array.isArray(results) ? results : (results ? [results] : []);

    if (items.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No results found.";
        container.appendChild(msg);
        return;
    }

    items.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const id = document.createElement("p");
        id.textContent = `ID: ${movie.id}`;

        const year = document.createElement("p");
        year.textContent = `Year: ${movie.year}`;

        const rating = document.createElement("p");
        rating.textContent = `Rating: ⭐ ${movie.rating}`;

        card.append(title, id, year, rating);
        container.appendChild(card);
    });
}

// ===============================
// DOM LOADED
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    renderMovieList();

    // ===============================
    // SEARCH
    // ===============================
    document.getElementById("search-btn").addEventListener("click", () => {
        const id = Number(document.getElementById("search-id").value);
        const title = document.getElementById("search-title").value.trim();

        let results = [];

        if (id) {
            const movie = movieList.searchById(id);
            results = movie ? [movie] : [];
        } else if (title) {
            results = movieList.searchByTitle(title);
        }

        renderMovieList(results); // NOW print in movie list section ONLY
    });

    document.getElementById("clear-search-btn").addEventListener("click", () => {
        document.getElementById("search-id").value = "";
        document.getElementById("search-title").value = "";
        document.getElementById("search-results").replaceChildren();
    });

    // ===============================
    // SORT + REFRESH
    // ===============================
    document.getElementById("sort-az-btn").addEventListener("click", () => {
        movieList.sortAZ();
        renderMovieList();
    });

    document.getElementById("sort-za-btn").addEventListener("click", () => {
        movieList.sortZA();
        renderMovieList();
    });

    document.getElementById("sort-best-btn").addEventListener("click", () => {
        movieList.sortBest();
        renderMovieList();
    });

    // ALWAYS show full list again
    document.getElementById("refresh-btn").addEventListener("click", () => {
        renderMovieList();
    });

    // ===============================
    // MANAGE MOVIES
    // ===============================
    document.getElementById("manage-update-btn").addEventListener("click", () => {
        const id = Number(document.getElementById("manage-id").value);
        const msg = document.getElementById("manage-message");

        const movie = movieList.searchById(id);
        if (!movie) {
            msg.textContent = "Movie ID not found.";
            msg.style.color = "red";
            return;
        }

        msg.textContent = `Loaded: ${movie.title}. Open Add Movie popup to edit.`;
        msg.style.color = "var(--gold)";

        document.getElementById("movie-id").value = movie.id;
        document.getElementById("movie-title").value = movie.title;
        document.getElementById("movie-year").value = movie.year;
        document.getElementById("movie-rating").value = movie.rating;
    });

    document.getElementById("manage-delete-btn").addEventListener("click", () => {
        const id = Number(document.getElementById("manage-id").value);
        const msg = document.getElementById("manage-message");

        if (!id) {
            msg.textContent = "Enter a valid ID.";
            msg.style.color = "red";
            return;
        }

        if (!confirm("Delete this movie?")) return;

        const ok = movieList.deleteMovie(id);
        if (!ok) {
            msg.textContent = "Movie ID not found.";
            msg.style.color = "red";
            return;
        }

        msg.textContent = "Movie deleted.";
        msg.style.color = "lightgreen";

        renderMovieList();
    });

    document.getElementById("manage-clear-btn").addEventListener("click", () => {
        document.getElementById("manage-id").value = "";
        document.getElementById("manage-message").textContent = "";
    });

    // ===============================
    // MODAL
    // ===============================
    const modal = document.getElementById("add-modal");
    const open = document.getElementById("open-add-modal-btn");
    const close = document.getElementById("close-add-modal-btn");
    const save = document.getElementById("add-movie-btn");

    open.addEventListener("click", () => {
        modal.classList.remove("hidden");
        document.getElementById("add-message").textContent = "";
        document.getElementById("modal-extra").replaceChildren();

        document.getElementById("movie-id").value = "";
        document.getElementById("movie-title").value = "";
        document.getElementById("movie-year").value = "";
        document.getElementById("movie-rating").value = "";
    });

    close.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // SAVE MOVIE
    save.addEventListener("click", () => {
        const id = Number(document.getElementById("movie-id").value);
        const title = document.getElementById("movie-title").value.trim();
        const year = Number(document.getElementById("movie-year").value);
        const rating = Number(document.getElementById("movie-rating").value);

        const message = document.getElementById("add-message");
        const extra = document.getElementById("modal-extra");

        message.textContent = "";
        extra.replaceChildren();

        if (!id || !title || !year || isNaN(rating)) {
            message.textContent = "Please fill all fields.";
            message.style.color = "red";
            return;
        }

        const exists = movieList.searchById(id);

        if (exists) {
            movieList.updateMovie(id, title, year, rating);
            message.textContent = "Movie updated!";
        } else {
            movieList.addMovie(new Movie(id, title, year, rating));
            message.textContent = "Movie added!";
        }

        message.style.color = "lightgreen";
        renderMovieList();

        // Done button
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "Done";
        doneBtn.className = "clear-btn";

        doneBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
            extra.replaceChildren();
            message.textContent = "";
        });

        extra.appendChild(doneBtn);
    });

});
