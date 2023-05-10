(function () {
    "use strict";
    const url = "https://light-flax-icebreaker.glitch.me/movies";
    $(document).ready(function () {
        // Display a "loading..." message
        $("#loading").show();
        $("#movies").hide();
        // Function to get all movies and render them
        function getMovies() {
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    // When the initial AJAX request comes back, remove the "loading..." message
                    $("#loading").hide();
                    $("#movies").show();

                    // Replace it with HTML generated from the json response
                    var movies = data;
                    var html = "";

                    movies.forEach((movie) => {
                        html += '<div class="movie">';
                        html += "<h2>" + movie.title + "</h2>";
                        html += "<p>Rating: " + movie.rating + "</p>";
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

                    // Add event listeners for edit and delete buttons
                    $(".edit-movie-btn").click(function () {
                        var movieId = $(this).data("id");

                        // Make an AJAX request to get the movie details
                        $.ajax({
                            method: "GET",
                            url: url + "/" + movieId,
                            success: function (data) {
                                // Populate the edit form with the movie details
                                $("#edit-movie-form input[name='id']").val(data.id);
                                $("#edit-movie-form input[name='title']").val(data.title);
                                $("#edit-movie-form input[name='rating']").val(data.rating);

                                // Show the edit form
                                // $('#edit-movie-modal').modal('show');
                            },
                            error: function () {
                                alert("Error fetching movie details");
                            },
                        });
                    });

                    $(".delete-movie-btn").click(function () {
                        console.log("delete btn clicked");
                        var movieId = $(this).data("id");
                        console.log(movieId);

                        // Confirm that the user wants to delete the movie
                        if (confirm("Are you sure you want to delete this movie?")) {
                            // Make an AJAX request to delete the movie
                            $.ajax({
                                method: "DELETE",
                                url: url + "/" + movieId,
                                success: function () {
                                    // Remove the movie from the UI
                                    $(".movie[data-id='" + movieId + "']").remove();
                                    console.log("success triggered... should be deleted");
                                    // Render all movies again
                                    getMovies();
                                },
                                error: function () {
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
            // Get the movie ID
            // Get the movie data
            var movieId = $(this).closest('.movie').data('id');
            var movieTitle = $(this).closest('.movie').find('.movie-title').text();
            var movieRating = $(this).closest('.movie').find('.movie-rating').text();


            // Get the movie data from the server
            $.ajax({
                method: 'GET',
                url: 'https://light-flax-icebreaker.glitch.me/movies',
                success: function (movie) {
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

                // Send a PUT request to update the movie
                $.ajax({
                    type: 'PUT',
                    url: 'https://light-flax-icebreaker.glitch.me/movies/' + $('#edit-movie-form input[name="id"]').val(),
                    data: formData,
                    success: function () {
                        // Reload the movies list
                        getMovies();

                        // Close the modal
                        $('#editMovieModal').modal('hide');
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            });
        });
        // Add event listener for closing the edit movie modal
        $('#editMovieModal .close').click(function () {
            $('#editMovieModal').modal('hide');
        });
// Add event listener for resetting the edit movie form when the modal is hidden
        $('#editMovieModal').on('hidden.bs.modal', function () {
            $('#editMovieForm')[0].reset();
        });
// Add event listener for the cancel button in the edit movie modal
        $('#editMovieModal #cancel-edited-movie-btn').click(function () {
            // Reset the form
            $('#editMovieForm')[0].reset();
            // Close the modal
            $('#editMovieModal').modal('hide');
        });
        // Add event listener for the add movie button
        $('#add-movie-btn').click(function (e) {
            e.preventDefault();
            console.log('add movie clicked');

            // Show the add movie modal form
            $('#addMovieModal').modal('show');
        });
        // Add event listener for the add movie button
        $('#submit-movie-btn').click(function (e) {
            e.preventDefault();
            console.log('add movie clicked');
            // Get the form data
            var formData = $('#addMovieForm').serialize();

            // Send a POST request to the server to add the movie
            $.ajax({
                type: 'POST',
                url: 'https://light-flax-icebreaker.glitch.me/movies',
                data: formData,
                success: function (response) {
                    // Reload the movies list
                    getMovies();
                    // Close the modal
                    $('#addMovieModal').modal('hide');
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });
        $('.modal-header .close').click(function () {
            $('#addMovieModal').modal('hide');
        });
        $('#addMovieModal').on('hidden.bs.modal', function () {
            $('#addMovieForm')[0].reset();
        });
        // Add event listener for the cancel button
        $('#cancel-movie-btn').click(function () {
            // Reset the form
            $('#addMovieForm')[0].reset();
            // Close the modal
            $('#addMovieModal').modal('hide');
        });
    });
})();