(function () {
    "use strict";
    const url = "https://light-flax-icebreaker.glitch.me/movies";

    function getTMDbMovieData(title, callback) {
        var apiKey = "e4dbb2805cd59997c3c244610a56fc61";
        var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + encodeURIComponent(title);

        $.ajax({
            method: "GET",
            url: apiUrl,
            success: function (data) {
                if (data.results && data.results.length > 0) {
                    callback(null, data.results[0]);
                } else {
                    callback("No movie data found.");
                }
            },
            error: function () {
                callback("Error fetching movie data.");
            }
        });
    }


    // Main function to execute when the document is ready
    $(document).ready(function () {
        // Display a "loading..." message and hide the movie list
        $("#loading").show();
        $("#movies").hide();

        // Function to get all movies and render them
        function getMovies() {
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    // Hide the "loading..." message and show the movie list
                    $("#loading").hide();
                    $("#movies").show();

                    // Generate the HTML for the movie list
                    var movies = data;
                    var html = "";

                    movies.forEach((movie) => {
                        html += '<div class="movie" data-id="' + movie.id + '">';
                        html += "<h2>" + movie.title + "</h2>";
                        html += "<p>Rating: " + movie.rating + "</p>";
                        html += "<p>Genre: " + movie.genre + "</p>";
                        html += '<img src="" class="movie-poster" alt="Movie Poster" />';

                        // Get the movie data from the TMDb API and set the poster
                        getTMDbMovieData(movie.title, function (err, tmdbMovieData) {
                            if (!err) {
                                var posterPath = "https://image.tmdb.org/t/p/w500" + tmdbMovieData.poster_path;
                                $('.movie[data-id="' + movie.id + '"] .movie-poster').attr("src", posterPath);
                            } else {
                                console.error("Error fetching TMDb movie data:", err);
                            }
                        });

                        html +=
                            '<button class="edit-movie-btn" data-id="' +
                            movie.id +
                            '">Edit</button>';
                        html +=
                            '<button class="delete-movie-btn" data-id="' +
                            movie.id +
                            '">Delete</button>';
                        html += "</div>";
                    });
                    $("#movies").html(html);

                    // Add click event listener for delete movie button
                    $(".delete-movie-btn").click(function () {
                        var movieId = $(this).data("id");

                        // Confirm that the user wants to delete the movie
                        if (confirm("Are you sure you want to delete this movie?")) {
                            // Make an AJAX request to delete the movie
                            // Disable the delete button
                            $(this).prop("disabled", true);
                            $.ajax({
                                method: "DELETE",
                                url: url + "/" + movieId,
                                success: function () {
                                    // Re-enable the delete button
                                    $(this).prop("disabled", false);
                                    // Remove the movie from the UI
                                    $(".movie[data-id='" + movieId + "']").remove();
                                    // Render all movies again
                                    getMovies();
                                },
                                error: function () {
                                    // Re-enable the delete button
                                    $(this).prop("disabled", false);
                                    alert("Error deleting movie");
                                },
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error fetching movies:", error);
                });
        }

        // Call the function to get and render all movies
        getMovies();

        // Add click event listener for edit movie button
        $(document).on('click', '.edit-movie-btn', function () {
            // Disable the edit button
            $(this).prop("disabled", true);

            // Get the movie ID
            var movieId = $(this).data('id');

            // Get the movie data from the server
            $.ajax({
                method: 'GET',
                url: url + '/' + movieId,
                success: function (movie) {
                    // Enable the edit button
                    $(this).prop("disabled", false);
                    // Set the form values
                    $('#edit-movie-id').val(movie.id);
                    $('#edit-movie-title').val(movie.title);
                    $('#edit-movie-rating').val(movie.rating);

                    // Show the edit movie modal dialog
                    $('#editMovieModal').modal('show');
                }
            });

            // Add click event listener for save edited movie button
            $('#save-edited-movie-btn').click(function () {
                // Get the form data
                var formData = $('#editMovieForm').serialize();
                console.log(formData);

                // Send a PUT request to update the movie
                $.ajax({
                    type: 'PUT',
                    url: 'https://light-flax-icebreaker.glitch.me/movies/' + $('#editMovieForm input[name="id"]').val(),
                    data: formData,
                    success: function () {
                        // Get the movie data from the TMDb API and set the poster
                        getTMDbMovieData($('#addMovieForm input[name="title"]').val(), function (err, tmdbMovieData) {
                            if (!err) {
                                var posterPath = "https://image.tmdb.org/t/p/w500" + tmdbMovieData.poster_path;
                                movie.poster = posterPath;
                            } else {
                                console.error("Error fetching TMDb movie data:", err);
                            }

                            // Reload the movies list
                            getMovies();
                        });

                        // Close the modal
                        $('#editMovieModal').modal('hide');
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            });
        });

        // Add event listener for closing the edit movie modal and enable the edit movie button
        $('#editMovieModal .close').click(function () {
            $('#editMovieModal').modal('hide');
            $('.edit-movie-btn').prop("disabled", false);
        });

        // Add event listener for resetting the edit movie form when the modal is hidden
        $('#editMovieModal').on('hidden.bs.modal', function () {
            $('#editMovieForm')[0].reset();
            $('.edit-movie-btn').prop("disabled", false);
        });

        // Add event listener for the cancel button in the edit movie modal
        $('#editMovieModal #cancel-edited-movie-btn').click(function () {
            // Reset the form
            $('#editMovieForm')[0].reset();
            // Close the modal
            $('#editMovieModal').modal('hide');
            $('.edit-movie-btn').prop("disabled", false);
        });

        // Add event listener for the add movie button
        $('#add-movie-btn').click(function (e) {
            e.preventDefault();
            // Disable the submit button
            $(this).prop("disabled", true);
            console.log('add movie clicked');
            // Show the add movie modal form
            $('#addMovieModal').modal('show');
        });

        // Add event listener for the add movie button
        $('#submit-movie-btn').click(function (e) {
            e.preventDefault();
            // Disable the submit button
            $(this).prop("disabled", true);
            console.log('submit movie clicked');
            // Get the form data
            var formData = $('#addMovieForm').serialize();

            // Send a POST request to the server to add the movie
            $.ajax({
                type: 'POST',
                url: 'https://light-flax-icebreaker.glitch.me/movies',
                data: formData,
                success: function (response) {
                    // Enable the submit button
                    $(this).prop("disabled", false);
                    // Enable the add button
                    $('#add-movie-btn').prop("disabled", false);
                    // Reload the movies list
                    getMovies();
                    // Close the modal
                    $('#addMovieModal').modal('hide');
                },
                error: function (error) {
                    // Enable the submit button
                    $(this).prop("disabled", false);
                    // Enable the add button
                    $('#add-movie-btn').prop("disabled", false);
                    console.log(error);
                }
            });
        });
        // Add event listener for closing the add movie modal
        $('.modal-header .close').click(function () {
            $('#addMovieModal').modal('hide');
            // Enable the submit button
            $('#submit-movie-btn').prop("disabled", false);
            // Enable the add button
            $('#add-movie-btn').prop("disabled", false);
        });

        // Add event listener for resetting the add movie form when the modal is hidden
        $('#addMovieModal').on('hidden.bs.modal', function () {
            $('#addMovieForm')[0].reset();
            // Enable the submit button
            $('#submit-movie-btn').prop("disabled", false);
            // Enable the add button
            $('#add-movie-btn').prop("disabled", false);
        });

        // Add event listener for the cancel button in the add movie modal
        $('#cancel-movie-btn').click(function () {
            // Reset the form
            $('#addMovieForm')[0].reset();
            // Close the modal
            $('#addMovieModal').modal('hide');
            // Enable the submit button
            $('#submit-movie-btn').prop("disabled", false);
            // Enable the add button
            $('#add-movie-btn').prop("disabled", false);
        });
    });
})();