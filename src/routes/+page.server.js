import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "$lib/db";

const SECRET_KEY = process.env.SECRET_KEY;

async function checkPassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // true or false
  } catch (err) {
    console.error("Erreur lors de la vérification du mot de passe:", err);
    throw err;
  }
}

export async function load({ cookies }) {
  // set the cookie "visited" on "true" everywhere
  cookies.set("visited", "true", { path: "/" });

  const user = await db.user.findUnique({
    where: {
      id: 1,
    },
  });

  // gets every user 1 cards
  const cards = await db.cards.findMany({ where: { userId: 1 } }); //TODO mettre un userID dynamique

  // return everything we need client-side in "data"
  return {
    props: {
      visited: cookies.get("visited"),
      user,
      cards,
    },
  };
}

function getUserIdFromRequest(request) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1];

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
        question: data.get("question"),
        answer: data.get("answer"),
        userId,
      },
    });
    return { body: { createdCard } };
  },
  login: async (request) => {
    const data = await request.request.formData();
    const mail = data.get("mail");
    const password = data.get("password");

    console.log("mail:", mail);

    const user = await db.user.findUnique({
      where: {
        email: mail,
      },
    });

    if (!user) {
      console.log("user non trouvé");
      return {
        status: 401,
        body: {
          error: "Utilisateur non trouvé",
        },
      };
    } else {
      console.log("user trouvé:", user.name);
    }
    const matchPassword = await checkPassword(password, user.password);

    if (!matchPassword) {
      console.log("mot de passe incorrect");
      return {
        status: 401,
        body: {
          error: "Mot de passe incorrect",
        },
      };
    } else {
      console.log("connexion réussie, user:", user.name);
    }
  },
};
