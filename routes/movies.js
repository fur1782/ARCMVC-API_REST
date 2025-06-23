import {Router} from 'express';
import { randomUUID } from 'node:crypto'

import movies from './movies.json' with { type: 'json' }
import { validateMovie, validatePartialMovie } from './schemas/movies.js'

export const moviesRouter = Router();

moviesRouter.get('/', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*')
    const { genre } = req.query
    if(genre){
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
});

moviesRouter.get('/:id', (req, res) => { // path-to-regexp
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({message: 'Movie not found'})
})

moviesRouter.post('/', (req, res) => {
    
    const result = validateMovie(req.body)

    if (result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id: randomUUID(),
        ...result.data
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
})

moviesRouter.delete('/:id', (req, res) => {
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex < 0){
        return res.status(404).json({message: 'Movie not found'})
    }

    movies.splice(movieIndex, 1)

    return res.json({message: 'Movie deleted'})
})

moviesRouter.patch('/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
    
    if (!result.success) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex < 0) return res.status(404).json({message: 'Movie not found'})

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    
    movies[movieIndex] = updateMovie

    return res.json(updateMovie)
})

// app.options('/movies/:id', (req, res) => {
//      const origin = req.header('origin')

//     if(ACCEPTED_ORIGINS.includes(origin) || !origin){
//         res.header('Access-Control-Allow-Origon', origin)
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//     }
//     res.send(200)
// })

