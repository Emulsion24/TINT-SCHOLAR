
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config({ path: './path/to/.env' });


const TOKEN ='e6bbe366e85bc7e04856e74f456d023e';

export const Mailtrapclient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "TINT Scholar",
};
