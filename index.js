// Titles: https://omdbapi.com/?s=thor&page=1&apikey=c0b6ccf2
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

// Get references to the DOM elements
const movieSearchBox = document.getElementById('movie-search-box'); // Input box where the user types the movie name
const searchList = document.getElementById('search-list'); // Container for displaying the search results
const resultInfo = document.getElementById('result-info'); // Container for displaying detailed information about the selected movie

// Function to fetch movie data from the API based on a search term
async function getMovies(movieTitle) {
    const URL = `https://omdbapi.com/?s=${movieTitle}&page=1&apikey=c0b6ccf2`; // Construct the API URL with the movieTitle and API key
    const res = await fetch(`${URL}`); // The await keyword is used to wait for the fetch request to complete from the API
    const data = await res.json(); // The await keyword is used to wait for the JSON response to be parsed from the API
    // Check if the API response is successful
    if (data.Response == "True") { // Check if the Response key in the JSON response is True
        showMovieList(data.Search); // If successful, calls the showMovieList function with the search results

    } 
}

// Function to handle user input and search for movies
function findMovies() {
    let movieTitle = (movieSearchBox.value).trim(); // Get the user input and trim any extra spaces
    if (movieTitle.length > 0) {
        searchList.classList.remove('hide-search-list'); // Show the search results list
        getMovies(movieTitle); // Fetch movies matching the search term
    } else {
        searchList.classList.add('hide-search-list'); // Hide the search list if input is empty
    }
}

// Function to display the list of movies returned by the API
function showMovieList(movies) {
    searchList.innerHTML = ""; // Clear the current content of the search list
    for (let i = 0; i < movies.length; i++) {
        let movieListItem = document.createElement('div'); // Create a new div for each movie
        movieListItem.dataset.id = movies[i].imdbID; // Store the IMDb ID in a data attribute
        movieListItem.classList.add('search-list-item'); // Add a class for styling

        // Check if the movie has a valid poster; if not, use a placeholder
        let moviePoster = (movies[i].Poster != "N/A") ? movies[i].Poster : "image_not_found.png";

        // Set the inner HTML of the movie list item with thumbnail and movie info
        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[i].Title}</h3>
                <p>${movies[i].Year}</p>
            </div>
        `;
        searchList.appendChild(movieListItem); // Append the movie item to the search list
    }
    loadMovieDetails(); // Add event listeners to each movie item for loading details
}

// Function to load detailed information for a movie when clicked
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item'); // Select all movie items in the search list
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => { // Add a click event listener to each movie
            searchList.classList.add('hide-search-list'); // Hide the search list
            movieSearchBox.value = ""; // Clear the input box
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`); // Fetch detailed data using the IMDb ID
            const movieDetails = await result.json(); // Parse the JSON response
            displayMovieDetails(movieDetails); // Display the movie details
        });
    });
}

// Function to display detailed information about the selected movie
function displayMovieDetails(details) {
    resultInfo.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `; // Populate the result grid with movie details including poster, title, year, genre, actors, etc.
}

// Event listener to hide the search list when clicking outside of the input box
window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") { // Check if the click is outside the input box
        searchList.classList.add('hide-search-list'); // Hide the search list
    }
});


