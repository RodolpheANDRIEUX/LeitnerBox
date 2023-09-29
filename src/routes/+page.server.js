// @todo faire une fonction load pour afficher les cards

import {db} from '$lib/db';
import {Prisma} from "@prisma/client";

export const actions = {
    default: async (request) => {
        const data = await request.request.formData();
        const answer = data.get('answer');
        const question = data.get('question');

        try {
            const createdCard = await db.cards.create({
                data: {
                    question: question,
                    answer: answer
                }
            })
            console.log("Card created", createdCard) //debug

        }  catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {
                    status: 400,
                    body: { error: true, message: e.message }
                };
            }
            return {
                status: 500,
                body: { error: true, message: 'An unknown error occurred' }
            };
        }

    }
}