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
                    html += '<button class="edit-movie-btn" data-id="' + movie.id + '">Edit</button>';
                    html += '<button class="delete-movie-btn" data-id="' + movie.id + '">Delete</button>';
                    html += '</div>';
                });
                $('#movies').append(html);

                // Add event listeners for edit and delete buttons
                $('.edit-movie-btn').click(function () {
                    var movieId = $(this).data('id');

                    // Make an AJAX request to get the movie details
                    $.ajax({
                        method: 'GET',
                        url: url + '/' + movieId,
                        success: function (data) {
                            // Populate the edit form with the movie details
                            $('#edit-movie-form input[name="id"]').val(data.id);
                            $('#edit-movie-form input[name="title"]').val(data.title);
                            $('#edit-movie-form input[name="rating"]').val(data.rating);

                            // Show the edit form
                            // $('#edit-movie-modal').modal('show');
                        },
                        error: function () {
                            alert('Error fetching movie details');
                        }
                    });
                });

                $('.delete-movie-btn').click(function () {
                    var movieId = $(this).data('id');

                    // Confirm that the user wants to delete the movie
                    if (confirm('Are you sure you want to delete this movie?')) {
                        // Make an AJAX request to delete the movie
                        $.ajax({
                            method: 'DELETE',
                            url: url + '/' + movieId,
                            success: function () {
                                // Remove the movie from the UI
                                $('.movie[data-id="' + movieId + '"]').remove();

                            },
                            error: function () {
                                alert('Error deleting movie');
                            }
                        });
                    }
                });
            },
        });
    });

        // Handle submit event for edit movie form
    $('#edit-movie-form').click(function (event) {
            event.preventDefault();

            var movieId = $('#edit-movie-form input[name="id"]').val();
            var movieTitle = $('#edit-movie-form input[name="title"]').val();
            var movieRating = $('#edit-movie-form input[name="rating"]').val();

            // Make an AJAX request to update the movie
            $.ajax({
                method: 'PUT',
                url: url + '/' + movieId,
                data: {
                    title: movieTitle,
                    rating: movieRating
                },
                success: function (data) {
                    // Fetch the updated movie data from the server
                    $.ajax({
                        method: 'GET',
                        url: url + '/' + movieId,
                        success: function (movie) {
                            // Update the movie in the UI with the new data
                            $('.movie[data-id="' + movieId + '"] h2').text(movie.title);
                            $('.movie[data-id="' + movieId + '"] .rating').text(movie.rating);
                            $('.movie[data-id="' + movieId + '"] .director').text(movie.director);
                            $('.movie[data-id="' + movieId + '"] .genre').text(movie.genre);

                            var newEdit = $('<div class="movie" data-id="' + movie.id + '">');
                            newEdit.append('<h2>' + movie.title + '</h2>');
                            newEdit.append('<div class="rating">' + movie.rating + '</div>');
                            newEdit.append('<div class="director">' + movie.director + '</div>');
                            newEdit.append('<div class="genre">' + movie.genre + '</div>');

                            // Add the new movie element to the movie list on the page
                            $('#movies').append(newEdit);
                        }
                    });
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
                    <p>${data.id}</p>
                    <button class="edit-movie-btn">Edit</button>
                    <button class="delete-movie-btn">Delete</button>`;
                    $('#movies').append(newMovie);

                })
                .catch(error => {
                    console.error(error);
                });
        });

})();