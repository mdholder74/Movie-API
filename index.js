// Titles: https://omdbapi.com/?s=thor&page=1&apikey=c0b6ccf2
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96



// Get references to the DOM elements
const movieSearchBox = document.getElementById('movie-search-input'); // Input box where the user types the movie name
const movieSearchList = document.getElementById('search-list'); // Container for displaying the search results
const movieResultInfo = document.getElementById('movie-result-area'); // Container for displaying detailed information about the selected movie

// GET/SAVE DATA
// Function to fetch movie data from the API based on the search term
async function fetchMovies(nameOfMovie) {
    try {
        const URL = `https://omdbapi.com/?s=${nameOfMovie}&page=1&apikey=c0b6ccf2`; // Stores the URL of the API with the search term and API key
        const res = await fetch(`${URL}`); // The await keyword is used to wait for the fetch request to complete from the API
        const movieData = await res.json(); // The await keyword is used to wait for the JSON response to be parsed from the API
        // Check if the API response is successful
        if (movieData.Response == "True") { // Check if the API JSON response has a key named Response with a value of True. If true, the search was successful if false, the search was unsuccessful
            renderMoviesList(movieData.Search); // If successful, calls the renderMoviesList function from the API JSON response data and passes the search results
        }
    } catch(error) {
        console.log("Error fetching movies:", error);
    }
}

//GENERATE HTML FOR MOVIE SEARCHBOX LIST
movieSearchBox.addEventListener('input', searchForMovies); // Add an event listener to the input box to call the searchForMovies function when the user types

// Function to search user input and search for movies titles
function searchForMovies() {
    let nameOfMovie = (movieSearchBox.value).trim(); // Get the user value(text) entered into the search input box and trim any extra spaces to ensure clean search terms
    if (nameOfMovie.length > 0) {// Check if the input is not empty
        movieSearchList.classList.remove('hide-search-list'); // Remove the hide-search-list class that is set to display:none. This will display the movies results list in the search bar
        fetchMovies(nameOfMovie); // Pass the movie title to the fetchMovies function to fetch the movie data matching the search term
    } else {
        movieSearchList.classList.add('hide-search-list'); // Hide the search list if input is empty
    }
}

// Function to display the list of movies returned by the API on the webpage
function renderMoviesList(movies) {
    movieSearchList.innerHTML = ""; // Clear the current content of the search list
    for (let i = 0; i < movies.length; i++) {
        let movieListItem = document.createElement('div'); // Create a new div for each movie
        movieListItem.dataset.id = movies[i].imdbID; // Store the IMDb ID in a data attribute
        movieListItem.classList.add('search-list-item'); // Add a the class name search-list-item to each movie item
        let moviePoster = (movies[i].Poster != "N/A") ? movies[i].Poster : "image_not_found.png"; // Check if the movie has a poster; if not, use the not found placeholder image

        // Set the movielistitem innerHTML to the movie poster and movie title and year. This will generate the movie poster, title, and year in the search list
        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[i].Title}</h3>
                <p>${movies[i].Year}</p>
            </div>
        `;
        movieSearchList.appendChild(movieListItem); // Append the movie item to the search list
    }
    fetchMovieDetails(); // Add event listeners to each movie item for loading details
}
// GET/SAVE DATA
// Function to fetch detailed information about the selected movie
function fetchMovieDetails() {
    const searchResultMovies = movieSearchList.querySelectorAll('.search-list-item'); // Select all movie items from the search list
    searchResultMovies.forEach(movie => { // Loop through each movie item and adds a click event listener to each
        movie.addEventListener('click', async () => { 
            movieSearchList.classList.add('hide-search-list'); // Once a movie is clicked/selected by the user, then the rest of the search list will be hidden
            movieSearchBox.value = ""; // Next, the search box will be cleared for the next search
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`); // Fetch the information of the selected movie using the IMDb ID
            const movieDetails = await result.json(); // Parse the JSON response
            renderMovieDetails(movieDetails); // Display the movie details
        });
    });
}

//GENERATE HTML FOR MOVIE DETAILS
// Function to render the movie info about the clicked/selected movie on the webpage
function renderMovieDetails(details) {
    movieResultInfo.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}">
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
    `; 
}

// Event listener to hide the search list when clicking outside of the input box
window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") { // Check if the click is outside the input box
        movieSearchList.classList.add('hide-search-list'); // Hide the search list
    }
});

