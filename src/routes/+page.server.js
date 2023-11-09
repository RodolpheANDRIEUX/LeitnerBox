import jwt from "jsonwebtoken";
import { db } from "$lib/db";
import { userLogin } from "./user.js";
import { setAuthToken } from "./helpers.js";

const SECRET_KEY = process.env.JWT_ACCESS_SECRET;

export function createJWT(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );
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
    const data = await request.formData();
    const mail = data.get("mail");
    const password = data.get("password");

    const { error, token } = await userLogin(mail, password);
    if (error) {
      console.log(error);
    }
    setAuthToken({ cookies, token });
  },
};
