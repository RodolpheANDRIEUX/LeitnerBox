import bcrypt from "bcrypt";
import { db } from "$lib/db.js";
import { createJWT } from "./+page.server.js";
async function hashPassword(password) {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error("Erreur lors du hashage du mot de passe:", err);
    throw err;
  }
}

async function checkPassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword); // true or false
  } catch (err) {
    console.error("Erreur lors de la vérification du mot de passe:", err);
    throw err;
  }
}

export async function createUser(email, username, password) {
  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email: email,
      name: username,
      password: hashedPassword,
    },
  });

  const token = createJWT(user);
  return { token };
}

export async function userLogin(email, password) {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { error: "Utilisateur non trouvé" };
    } else {
      console.log("user trouvé:", user.name);
    }
    const matchPassword = await checkPassword(password, user.password);

    if (!matchPassword) {
      return { error: "Mot de passe incorrect" };
    }

    console.log("Utilisateur connecté:", user.name); //debug
    const token = createJWT(user);
    console.log("token:", token); //debug
    return { token };
  } catch (error) {
    console.log(error);
  }
}
