import {Prisma} from "@prisma/client";
import {db} from '$lib/db';

export function load() {
    const cards = db.cards.findMany({where: {userId: 1}})
    return {cards};
}

export const actions = {
    default: async (request) => {
        const data = await request.request.formData();
        const createdCard = await db.cards.create({
            data: {
                answer: data.get('answer'),
                question: data.get('question'),
                userId: 1
            }
        });
    }
}
