// Question 4.1 Create a movie class
class Movie{
    constructor(id, title, year, rating){
        this.id = id;
        this.title = title;
        this.year=year;
        this.rating=rating;
    }
}
console.log(Movie);

//  Question 4.2 Create array of movies - unsorted
let movies = [
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

console.log(movies);

// Question 4.3. sort the array using movie id
movies.sort((a, b) => a.id -b.id);
console.log(movies);
