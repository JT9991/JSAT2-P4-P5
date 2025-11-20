class Movie {
    constructor(id, title, year, rating) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.rating = rating;
    }
}

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
            new Movie(56, "Braveheart", 1995, 8.3)
        ];
    }

    addMovie(movie) {
        const exists = this.movies.some(m => m.id === movie.id);
        if (exists) return false;
        this.movies.push(movie);
        return true;
    }

    getMovies() {
        return this.movies;
    }

    searchById(id) {
        for (let i = 0; i < this.movies.length; i++) {
        if (this.movies[i].id === id) {
            return this.movies[i];
        }
    }
    return null;
}


    searchByTitle(text) {
        const lower = text.toLowerCase();
        return this.movies.filter(m =>
            m.title.toLowerCase().includes(lower)
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

    deleteMovie(id){
        const index = this.movies.findIndex(m=> m.id === id);
        if (index === -1) return false;

        this.movies.splice(index, 1);
        return true;
    }

    updateMovie(id, newTitle, newYear, newRating){
        const movie = this.movies.find(m=> m.id === id);
        if (!movie) return false;

        movie.title = newTitle;
        movie.year = newYear;
        movie.rating = newRating;
        return true;


    }
}

const movieList = new MovieList();

function renderMovieTable() {
    const tbody = document.querySelector("#movie-table tbody");
    tbody.replaceChildren();

    movieList.getMovies().forEach(movie => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = movie.id;

        const titleCell = document.createElement("td");
        titleCell.textContent = movie.title;

        const yearCell = document.createElement("td");
        yearCell.textContent = movie.year;

        const ratingCell = document.createElement("td");
        ratingCell.textContent = movie.rating;

        const updateCell = document.createElement("td");
        const updateBtn= document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.className = "update-btn";
        updateBtn.addEventListener("click", () => handleUpdate(movie));
        updateCell.appendChild(updateBtn);
        
        const deleteCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => handleDelete(movie.id));
        deleteCell.appendChild(deleteBtn);
        
        row.append(idCell, titleCell, yearCell, ratingCell, updateCell, deleteCell);
        tbody.appendChild(row);
    });
}

function renderSearchResults(results) {
    const container = document.getElementById("search-results");
    container.replaceChildren();

    // Normalize data
    const items = Array.isArray(results) ? results : (results ? [results] : []);

    if (items.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No results found.";
        container.appendChild(p);
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
        rating.textContent = `Rating: ${movie.rating}`;

        card.append(title, id, year, rating);
        container.appendChild(card);
    });
}

function handleDelete(id) {
    const confirmed = confirm("Are you sure you want to delete this movie?");
    if (!confirmed) return;

    movieList.deleteMovie(id);
    renderMovieTable();
}

function handleUpdate(movie) {
    document.getElementById("movie-id").value = movie.id;
    document.getElementById("movie-title").value = movie.title;
    document.getElementById("movie-year").value = movie.year;
    document.getElementById("movie-rating").value = movie.rating;

    const msg = document.getElementById("add-message");
    msg.textContent = "Edit fields and click Add Movie to update.";
    msg.style.color = "#F6A60E";
}


document.addEventListener("DOMContentLoaded", () => {
    renderMovieTable();

    // SEARCH BUTTON
    document.getElementById("search-btn").addEventListener("click", () => {
        const idValue = document.getElementById("search-id").value;
        const titleValue = document.getElementById("search-title").value.trim();

        if (idValue) {
            const result = movieList.searchById(Number(idValue));
            renderSearchResults(result);
            return;
        }

        if (titleValue !== "") {
            const results = movieList.searchByTitle(titleValue);
            renderSearchResults(results);
            return;
        }

        renderSearchResults([]); 
    });

    // CLEAR SEARCH BUTTON — **MOVED OUTSIDE**
    document.getElementById("clear-search-btn").addEventListener("click", () => {
        document.getElementById("search-id").value = "";
        document.getElementById("search-title").value = "";
        document.getElementById("search-results").replaceChildren();
    });

    // CLEAR ADD MOVIE BUTTON 
    document.getElementById("clear-add-btn").addEventListener("click", () => {
    document.getElementById("movie-id").value = "";
    document.getElementById("movie-title").value = "";
    document.getElementById("movie-year").value = "";
    document.getElementById("movie-rating").value = "";

    const msg = document.getElementById("add-message");
    msg.textContent = "";

    document.getElementById("add-movie-btn").textContent = "Add Movie";
});


    // ADD + UPDATE MOVIE BUTTON
    document.getElementById("add-movie-btn").addEventListener("click", () => {
        const id = Number(document.getElementById("movie-id").value);
        const title = document.getElementById("movie-title").value.trim();
        const year = Number(document.getElementById("movie-year").value);
        const rating = Number(document.getElementById("movie-rating").value);

        const msg = document.getElementById("add-message");

        if (!id || !title || !year || isNaN(rating)) {
            msg.textContent = "Please fill all fields correctly.";
            msg.style.color = "red";
            return;
        }

        const exists = movieList.searchById(id);

        if (exists) {
            movieList.updateMovie(id, title, year, rating);
            msg.textContent = "Movie updated successfully!";
        } else {
            movieList.addMovie(new Movie(id, title, year, rating));
            msg.textContent = "Movie added successfully!";
        }

        msg.style.color = "lightgreen";
        renderMovieTable();
    });

    // SORT BUTTONS
    document.getElementById("sort-az-btn").addEventListener("click", () => {
        movieList.sortAZ();
        renderMovieTable();
    });

    document.getElementById("sort-za-btn").addEventListener("click", () => {
        movieList.sortZA();
        renderMovieTable();
    });

    document.getElementById("sort-best-btn").addEventListener("click", () => {
        movieList.sortBest();
        renderMovieTable();
    });

    document.getElementById("refresh-btn").addEventListener("click", renderMovieTable);
});




    document.getElementById("add-movie-btn").addEventListener("click", () => {
    const id = Number(document.getElementById("movie-id").value);
    const title = document.getElementById("movie-title").value.trim();
    const year = Number(document.getElementById("movie-year").value);
    const rating = Number(document.getElementById("movie-rating").value);

    const msg = document.getElementById("add-message");

    if (!id || !title || !year || isNaN(rating)) {
        msg.textContent = "Please fill all fields correctly.";
        msg.style.color = "red";
        return;
    }

    const exists = movieList.searchById(id);

    if (exists) {
        movieList.updateMovie(id, title, year, rating);
        msg.textContent = "Movie updated successfully!";
        msg.style.color = "lightgreen";
    } else {
        movieList.addMovie(new Movie(id, title, year, rating));
        msg.textContent = "Movie added successfully!";
        msg.style.color = "lightgreen";
    }

    renderMovieTable();
});
    
