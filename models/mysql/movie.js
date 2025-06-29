import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'moviesdb',
}

const connection = await mysql.createConnection(config);


export class MovieModel {
    static async getAll({genre}) {

        if(genre){
            const [genres, table] = await connection.query(
                `select bin_to_uuid(m.id) as "id", m.title, m.year, m.director, m.duration, m.poster, m.rate 
                from movie m 
                inner join movie_genres mg on m.id = mg.movie_id 
                inner join genre g on mg.genre_id = g.id 
                where LOWER(g.name) = ?;`, [genre.toLowerCase()]
            )
            console.log(genres);
            return genres;
        }

        const [movies,table] = await connection.query(
            `select bin_to_uuid(id) as "id", 
            title, 
            year, 
            director, 
            duration, 
            poster, 
            rate from movie;`
        )

        return movies;
    }

    static async getById({id}) {
        const [movie, table] = await connection.query(
            `select 
            bin_to_uuid(id) as "id", 
            title, 
            year,
            director, 
            duration, 
            poster, 
            rate 
            from movie where bin_to_uuid(id) = ?;`, [id]
        )

        if (movie.length === 0) {
            return null; 
        }

        return movie;
    }

    static async create({movieData}) {
        const {
            title,
            year,
            director,
            duration,
            poster,
            rate,
            genre
        } = movieData

        const [uuidResult] = await connection.query(
            `SELECT UUID() as uuid;`
        );
        const [{uuid}] = uuidResult;

        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
                    VALUES (UUID_TO_BIN(?),?, ?, ?, ?, ?, ?);`,
                [uuid, title, year, director, duration, poster, rate]
            )
        } catch (error) {
            throw new Error('Error creating movie');
        }

        genre.forEach( async (genre) => {
            try {
                await connection.query(
                    `INSERT INTO movie_genres (movie_id, genre_id) values 
                    (UUID_TO_BIN(?), (select id from genre where name = ?)) `, [uuid, genre]
                );
                
            } catch (error) {
                throw new Error('Error creating movie and genre connection');         
            }
        })

        const [movie] = await connection.query(
            `select bin_to_uuid(id) as "id", 
            title, 
            year, 
            director, 
            duration, 
            poster, 
            rate from movie where id = UUID_TO_BIN(?);`, [uuid]
        )

        return movie[0];
        
    }

    static async delete({id}) {

        const result = await connection.query(
            `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
        );

        if (result[0].affectedRows === 0) {
            return false; // No movie found with the given ID
        }

        await connection.query(
            `DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);`, [id]
        );

        return true; // Movie deleted successfully


    }

    static async update({id, movieData}) {

        const [movie] = await connection.query(
            `select bin_to_uuid(id) as "id", 
            title, 
            year, 
            director, 
            duration, 
            poster, 
            rate from movie where id = UUID_TO_BIN(?);`, [id]
        )
        if (movie.length === 0) {
            return false; // No movie found with the given ID
        }

        const updatedMovie = {
            ...movie[0],
            ...movieData
        }
        
        const {
            title,
            year,
            director,
            duration,
            poster,
            rate,
        } = updatedMovie;

        try {
            await connection.query(
                `UPDATE movie SET 
                    title = ?, 
                    year = ?, 
                    director = ?, 
                    duration = ?, 
                    poster = ?, 
                    rate = ? 
                WHERE id = UUID_TO_BIN(?);`, 
                [title, year, director, duration, poster, rate, id]
            );
            
        } catch (error) {
            throw new Error('Error updating movie');
        }


        return updatedMovie;
    }
}