import {Prisma} from "@prisma/client";
import {db} from '$lib/db';

export const actions = {
    default: async (data) => {
        const formData = await data.request.formData();
        const email = formData.get('mail');
        const username = formData.get('username');
        const password = formData.get('password');
        const passwordConfirmation = formData.get('confirm password');

        //@todo: check if email is valid
        //@todo: check if passwordConfirmation is the same as password


        const user = await db.user.create({
            data: {
                email: email,
                name: username,
                password: password,
            },
        });

        console.log("new user created: ", user);
   }
};