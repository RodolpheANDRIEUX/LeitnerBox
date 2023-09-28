import {saveCards} from "../src/routes/+page.server.js";

export async function post(request) {
    return saveCards(request);
}