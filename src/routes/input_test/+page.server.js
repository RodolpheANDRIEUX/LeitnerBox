import {Prisma} from "@prisma/client";
import {db} from '$lib/db';



export const actions = {
    default: async (request) => {
        const data = await request.request.formData();
        try {
            const createdCard = await db.cards.create({
                data: {
                    answer: data.get('answer'),
                    question: data.get('question'),
                    userId: 1
                }
            })
            console.log("Card created", createdCard) //debug

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {
                    status: 400,
                    body: {error: true, message: e.message}
                };
            }
            return {
                status: 500,
                body: {error: true, message: 'An unknown error occurred'}
            };
        }
    }
}
