import jwt from "jsonwebtoken";
import { db } from "$lib/db";
import { userLogin } from "/prisma/user.js";
import { setAuthToken } from "./helpers.js";
import {fail, redirect} from "@sveltejs/kit";

export async function load({ locals }) {
  const user = locals.user;
  if (user){
    console.log("User trouvé dans cookies: ", user);
  }

  // gets every user 1 cards
  const cards = await db.cards.findMany({ where: { userId: 1 } }); //TODO mettre un userID dynamique

  // return everything we need client-side in "data"
  return {
    user,
    cards,
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
  createCard: async ({ request }) => {
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
  login: async ({ cookies, request }) => {
    console.log("login action called");
    const data = await request.formData();
    const mail = data.get("mail");
    const password = data.get("password");

    const { error, token } = await userLogin(mail, password);
    if (error) {
      return fail(500, {error});
    }

    setAuthToken({ cookies, token });
  },
};
