import { setAuthToken } from "../helpers.js";
import { createUser } from "/prisma/user.js";
import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("mail");
    const username = formData.get("username");
    const password = formData.get("password");

    const { error, token } = await createUser(email, username, password);

    if (error) {
      console.log(error);
    }

    setAuthToken({ cookies, token });

    throw  redirect(302, "/");
  },
};
