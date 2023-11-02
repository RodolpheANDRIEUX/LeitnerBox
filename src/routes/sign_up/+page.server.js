import { db } from "$lib/db";
import bcrypt from "bcrypt";

export const actions = {
  default: async (data) => {
    const formData = await data.request.formData();
    const email = formData.get("mail");
    const username = formData.get("username");
    const password = formData.get("password");
    const saltRounds = 10;

    async function hashPassword(password) {
      try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
      } catch (err) {
        console.error("Erreur lors du hashage du mot de passe:", err);
        throw err;
      }
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email: email,
        name: username,
        password: hashedPassword,
      },
    });

    console.log("new user created: ", user);

    // async function checkPassword(password, hashedPassword) {
    //     try {
    //         const match = await bcrypt.compare(password, hashedPassword);
    //         return match; //returns true or false
    //     } catch (err) {
    //         console.error("Erreur lors de la vérification du mot de passe:", err);
    //         throw err;
    //     }
    // }
  },
};
