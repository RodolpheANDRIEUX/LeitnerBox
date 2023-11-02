import {Prisma} from "@prisma/client";
import {db} from '$lib/db';

export const actions = {
    default: async (data) => {
        const formData = await data.request.formData();
        const email = formData.get('mail');
        const username = formData.get('username');
        const password = formData.get('password');
        const passwordConfirmation = formData.get('confirm password');

        console.log(username);
        console.log(email);
        console.log(password);
        console.log(passwordConfirmation);
    }};