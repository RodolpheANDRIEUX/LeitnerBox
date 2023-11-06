import { db } from "$lib/db";
import bcrypt from "bcrypt";
async function hashPassword(password) {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error("Erreur lors du hashage du mot de passe:", err);
    throw err;
  }
}

export const actions = {
  default: async (data) => {
    const formData = await data.request.formData();
    const email = formData.get("mail");
    const username = formData.get("username");
    const password = formData.get("password");

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email: email,
        name: username,
        password: hashedPassword,
      },
    });

    console.log("new user created: ", user);
  },
};
