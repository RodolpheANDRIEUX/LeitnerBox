import { createJWT, setAuthToken } from "../helpers.js";
import { createUser } from "../user.js";

export const actions = {
  default: async (data) => {
    const formData = await data.request.formData();
    const email = formData.get("mail");
    const username = formData.get("username");
    const password = formData.get("password");

    const { error, token } = await createUser(email, username, password);

    if (error) {
      console.log(error);
    }

    setAuthToken(token);
    console.log("new user created: ", user);
  },
};
