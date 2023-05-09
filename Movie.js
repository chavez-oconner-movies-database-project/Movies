(function () {
    "use strict"
    const url = 'https://light-flax-icebreaker.glitch.me/movies';

    $(document).ready(function () {
        // Display a "loading..." message
        $('#loading').show();
        $('#movies').hide();
        // Make an AJAX request to get a listing of all the movies
        $.ajax({
            method: 'GET',
            url: url,
            success: function (data) {
                // When the initial AJAX request comes back, remove the "loading..." message
                $('#loading').hide();
                $('#movies').show();

                // Replace it with HTML generated from the json response
                var movies = data;
                var html = '';
                $.each(movies, function (index, movie) {
                    html += '<div class="movie">';
                    html += '<h2>' + movie.title + '</h2>';
                    html += '<p>Rating: ' + movie.rating + '</p>';
                    html += '</div>';
                });
                $('#movies').html(html);
            },
            error: function () {
                alert('Error fetching movies');
            }
        });
    });
    // allow users to add New Movies:
    const addMovie = document.getElementById('add-movie');

    addMovie.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const director = document.getElementById('director').value;
        const rating = document.getElementById('rating').value;
        const genre = document.getElementById('genre').value;
        const id = document.getElementById('id').value;

        const data = {title, director, rating, genre, id};

        fetch('https://light-flax-icebreaker.glitch.me/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const newMovie = document.createElement('div');
                newMovie.innerHTML =
                    `<h2>${data.title}</h2>
                    <p>${data.rating}</p>
                    <p>${data.director}</p>
                    <p>${data.genre}</p>
                    <p>${data.id}</p>`;
                movies.appendChild(newMovie);
            })
            .catch(error => {
                console.error(error);
            });
    });
})();