// +page.server.js
import { PrismaClient } from '@prisma/client';

export async function saveCards(request) {
    const prisma = new PrismaClient();
    const { question, answer } = JSON.parse(request.body);

    try {
        const savedData = await prisma.cards.create({
            data: {
                answer: answer,
                question: question,
            },
        });

        return {
            status: 200,
            body: JSON.stringify(savedData),
        };
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des données :', error);

        return {
            status: 500,
            console: error,
            body: JSON.stringify({ message: 'Erreur lors de l\'enregistrement des données' }),
        };
    } finally {
        await prisma.$disconnect();
    }
}
