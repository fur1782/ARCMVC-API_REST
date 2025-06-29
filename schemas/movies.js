import { z } from 'zod';

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title required.'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(["Drama","Action","Crime","Adventure","Sci-Fi","Romance","Animation","Biography","Fantasy"]),

    )
})

export function validateMovie (object) {
    return movieSchema.safeParse(object)
}

export function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}
