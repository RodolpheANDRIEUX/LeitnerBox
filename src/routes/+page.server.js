// // +page.server.js
// import { PrismaClient } from '@prisma/client';
//
// export async function post(request) {
//     const prisma = new PrismaClient();
//     const { data } = JSON.parse(request.body);
//
//     try {
//         const savedData = await prisma.cards.create({
//             data: {
//                 answer: data, // Remplacez champDeDonnees par le nom de votre champ dans le modèle
//                 question: data, // Remplacez champDeDonnees par le nom de votre champ dans le modèle
//             },
//         });
//
//         return {
//             status: 200,
//             body: JSON.stringify(savedData),
//         };
//     } catch (error) {
//         console.error('Erreur lors de l\'enregistrement des données :', error);
//
//         return {
//             status: 500,
//             console: error,
//             body: JSON.stringify({ message: 'Erreur lors de l\'enregistrement des données' }),
//         };
//     } finally {
//         await prisma.$disconnect();
//     }
// }
