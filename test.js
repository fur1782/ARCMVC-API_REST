const movies = [
    { title: "Movie 1", genres: ["Action", "Drama"] },
    { title: "Movie 2", genres: ["Comedy", "Action"] },
    { title: "Movie 3", genres: ["Drama", "Romance"] },
  ];
  
  // 1. Aplanem tots els arrays de generes
  const allGenres = movies.flatMap(movie => movie.genres)
  
  // 2. Eliminem duplicats amb un Set
  const uniqueGenres = [...new Set(allGenres)];
  
  console.log(uniqueGenres);