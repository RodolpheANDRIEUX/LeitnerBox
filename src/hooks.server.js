import jwt from "jsonwebtoken";
import { db } from "$lib/db.js";
import { JWT_ACCESS_SECRET } from "$env/static/private";

export const handle = async ({ event, resolve }) => {
  const authCookie = event.cookies.get("AuthorizationToken");

  if (authCookie) {
    const token = authCookie.split(' ')[1];
    if (token === 'undefined') {
      console.log("no token found"); //debug
      return await resolve(event);
    }
    try {
      const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);
      const user = await db.user.findUnique({
        where: {
          id: jwtUser.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      if (user) {
        event.locals.user = user;
      }
    } catch (error) {
      console.log("error handling auth cookie", error);
    }
  }
  return await resolve(event);
};
