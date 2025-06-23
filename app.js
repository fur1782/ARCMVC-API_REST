import express, { json } from 'express'

// movies is a JSON file must be imported with "with" { type: 'json' }
// This is a feature of ES Modules in Node.js
import movies from './movies.json' with { type: 'json' }
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'


// const ACCEPTED_ORIGINS = [
//     'http://127.0.0.1:5500'
// ]

const app = express()
app.use(corsMiddleware())
app.use(json())
//Mostra la tecnologia que s'està utilitzant, deshabilitat per seguretat
app.disable('x-powered-by')

app.get('/', (req, res) =>{
    res.json({message: 'hola, món'})
})

app.get('/genres', (req, res) => {
    const movieGenres = movies.flatMap(movie => movie.genre)

    const filteredGenres = [...new Set(movieGenres)]

    res.json({genres: filteredGenres})
})

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})

