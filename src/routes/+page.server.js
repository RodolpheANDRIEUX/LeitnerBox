import jwt from "jsonwebtoken";
import { db } from "$lib/db";
import {getUserIdFromToken, userLogin} from "/prisma/user.js";
import { setAuthToken } from "$lib/store.js";
import {fail} from "@sveltejs/kit";
import { addDays, addMonths, addYears } from 'date-fns';


export async function load({ locals }) {
  const theme = [
    'https://cdn.discordapp.com/attachments/399312290333327360/1170043802099142676/ADCreHftsZ38XDjg1HNh46SStWXSrvkUhHfjU0_-cYlpnAVXZy3ZKcaz4CP2VkWJo5xOsIcXT-1y7UwqGzM9Nlq7eRZ2ZZZAL0SLNaSzu_5N6voOoGISjW9mfRt4LgeND4oc7zj1_pM1fZp8ajBZA6YCw-KLX1wJGlq5mtq0Rhw2iO-_hhA5ksLz0SmuEP1w3H9BX5A6-Xpy3JZpf4MyWyYE2Wddf78XolXikilv8Fcq0PTuZ04wVWJg_WS_P2bWrOBQ8QqNF_KU9Eum2F6q1NsYOFBdwWHPRRnwi0lsNiPNlpSIN9r4ufPzwgIrB-WWxMZpG2j-d53UtNPUsEFXd1DspuwbE9bnNOau2JLmaYr2q1Cv-SE7r0WJ-KRyH2VPCTP9fjYZ4mOgY6yj2e4oYQpMDrfLw9hgoPjT68ANHo_kEiXx876rVdm4nUrYDLiEZ5EjfSZRv2xGFFeirWytVDyh6nJqzzg8yWRuv6q_xsn4Pds0o4rdUQEHRlKb..png?ex=65579b34&is=65452634&hm=90344b3f38732533236b9780ad7be503b069de822168e0bb9790c03b4a2c566b&',
    'https://cdn.discordapp.com/attachments/399312290333327360/1170028348479643789/image.png?ex=65578cd0&is=654517d0&hm=4c4b918818372636dbe9a9826134033eae48b2390ae868afa6b064f2df1dc057&',
    'https://cdn.discordapp.com/attachments/399312290333327360/1170028496823779368/image.png?ex=65578cf3&is=654517f3&hm=d08dd52c40671fb1b232bdc6d16d41a3a00d1a9e9c4a71508549ba9604eeb4e4&',
    'https://cdn.discordapp.com/attachments/399312290333327360/1170028577190854708/image.png?ex=65578d06&is=65451806&hm=6a9f9f76744d7d01dab661a44aa632572310846adf706aca6d880f5b0135e7dc&',
    'https://cdn.discordapp.com/attachments/399312290333327360/1170028660913348659/image.png?ex=65578d1a&is=6545181a&hm=1c982a5252048821e56a5ed784628b51e2e75ffc2397784a46d0c8926194e9ce&'
  ];
  const user = locals.user;
  let deck = [];

  if (user){
    console.log("User trouvé dans cookies: ", user);
    deck = await getDeckForUser(user.id);

  } else {
    console.log("User non trouvé dans cookies");
    deck.push({
      question: "You have to be logged in to play",
      answer: null,
      answered: false,
      known: false,
      actions: ["log in", "Sign up"]
    });
  }

  console.log("deck: ", deck);
  // return everything we need client-side in "data"
  return {
    theme,
    user,
    deck,
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

    if (!error) {
      setAuthToken({ cookies, token });

      const userId = await getUserIdFromToken(token);
      let deck = await getDeckForUser(userId);

      console.log("deck (by login): ", deck);
      return { deck };
    } else {
      return fail(500, {error});
    }
  },
  updateCardLevel: async ({ request }) => {
    console.log("updateCard action called");
    const cardId = await request.text();
    console.log("card id: ", cardId);

    if (isNaN(parseInt(cardId))) {
      return { status: 400, body: { error: "Invalid card ID" } };
    }

    try {
      const card = await db.cards.findUnique({ where: { id: parseInt(cardId) } });
      const cardLevel = card.level;
      console.log("card level: ", cardLevel);
      const updatedCard = await db.cards.update({
        where: { id: parseInt(cardId) },
        data: { level: { increment: 1 }, displayAt: calculateDisplayAt(cardLevel) }
      });
      console.log("updated card: ", updatedCard);
      return { body: { updatedCard } };
    } catch (error) {
      return { status: 500, body: { error: `Error while updating the card level: ${error.message}` } };
    }
  },
};

async function getDeckForUser(userId) {
  const today = new Date();

  let userCards = await db.cards.findMany({
    where: {
      userId: userId,
      displayAt: {
        lte: today
      }
    }
  });

  return userCards.map(card => ({
    id: card.id,
    question: card.question,
    answer: card.answer,
    answered: false,
    known: false,
    actions: null
  }));
}


function calculateDisplayAt(level) {
  const now = new Date();
  switch (level) {
    case 1:
      return addDays(now, 1);
    case 2:
      return addDays(now, 3);
    case 3:
      return addDays(now, 7);
    case 4:
      return addDays(now, 20);
    case 5:
      return addMonths(now, 2);
    case 6:
      return addMonths(now, 6);
    case 7:
      return addYears(now, 1);
    default:
      return now;
  }
}