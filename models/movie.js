import { randomUUID } from 'node:crypto';
import movies from '../movies.json' with { type: 'json' }

export class MovieModel {
    static async getAll({genre}) {
        // res.header('Access-Control-Allow-Origin', '*')
        if (genre) {
            const filteredMovies = movies.filter(
                movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            );
            return filteredMovies;
        }
        return movies;
    }

    static async getById({id}) {
        const movie = movies.find(movie => movie.id === id);
        return movie;
    }

    static async create({movieData}) {
        const newMovie = {
            id: randomUUID(),
            ...movieData
        };
        movies.push(newMovie);
        return newMovie;
    }

    static async delete({id}) {
        const movieIndex = movies.findIndex(movie => movie.id === id);
        if (movieIndex < 0) return false;
        movies.splice(movieIndex, 1)[0];
        return true;
    }

    static async update({id, movieData}) {
        const movieIndex = movies.findIndex(movie => movie.id === id);
        if (movieIndex < 0) return false;
        const updatedMovie = {
            ...movies[movieIndex],
            ...movieData
        };
        movies[movieIndex] = updatedMovie;
        return updatedMovie;
    }
}