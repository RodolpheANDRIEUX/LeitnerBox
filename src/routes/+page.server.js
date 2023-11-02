import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {db} from '$lib/db';
import {fail} from "@sveltejs/kit";

const SECRET_KEY = process.env.SECRET_KEY;

export async function load({ cookies }) {

    // set the cookie "visited" on "true" everywhere
    cookies.set('visited', 'true', { path: '/' });

    // gets every user 1 cards
    const cards = await db.cards.findMany({where: {userId: 1}}); //TODO mettre un userID dynamique

    // return everything we need client-side in "data"
    return {
        props: {
            visited: cookies.get('visited'),
            cards
        }
    };
}


function getUserIdFromRequest(request) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded.userId;
    } catch (err) {
        return null;
    }
}

export const actions = {

    createCard: async (request) => {
        const userId = getUserIdFromRequest(request);
        const data = await request.formData();
        const createdCard = await db.cards.create({
            data: {
                question: data.get('question'),
                answer: data.get('answer'),
                userId
            }
        });
        return { body: { createdCard }};
    },

    login: async ({ request }) => {
        const data = await request.body.formData();
        const email = data.get('mail');
        const password = data.get('password');

        console.log(email);
        console.log(password);

        const token = await authenticateUser(email, password, db);

        console.log(token);

        if (token) {
            return fail(401, { message: "Identifiants incorrects" });
        }

        return { success: true };
    }
};

const authenticateUser = async (email, password, db) => {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

};