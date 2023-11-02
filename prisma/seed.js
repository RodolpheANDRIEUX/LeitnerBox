import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    const thomas = await prisma.user.create({
        data: {
            name: 'Thomas',
            email: 'thomas@mail.fr',
            password: '123456',
            cards: {
                create: [
                    {
                        question: 'Quelle est la capitale de la France ?',
                        answer: 'Paris',
                    },
                    {
                        question: 'Combien de continents y a-t-il sur Terre ?',
                        answer: '7',
                    },
                ],
            },
        }
    })
    console.log("new user created: ", thomas);
    const rodolphe = await prisma.user.create({
        data: {
            name: 'Rodolphe',
            email: 'rodolphe@gmail.com',
            password: '123456',
            cards: {
                create: [
                    {
                        question: 'Who s gonna carry the boat ?',
                        answer: 'David Goggins',
                    },

                    {
                        question: 'Quelle est la femelle du lièvre ?',
                        answer: 'La hase',
                    }
                ]
            }
        }
    })
    console.log("new user created: ", rodolphe);
}

seed()
    .catch((e) => {
        console.error(e);
        process.exitCode(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
