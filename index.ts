import { App } from "@slack/bolt";
import { randomInt } from "crypto";
import fs from "fs";
import "dotenv/config";

const MESSAGE_START = `someone should be along to help you soon but in the mean time i suggest you read the faq here to make sure your question hasn't already been answered. if it has been, please hit the button below to mark it as resolved :D`;
const COMPLAINTS = fs.readFileSync("complaints.txt", "utf-8").split('\n');
const DONE = `i get it now`;
const MESSAGE_END = `oh, oh! it looks like this post has been marked as resolved by <@$USER_ID>! if you have any more questions, please make a new post in <#${process.env.CHANNEL_ID}> and someone'll be happy to help you out! not me though, i'm just a silly racoon ^-^`;

const app = new App({
    token: process.env.SLACK_BOT_TOKEN!,
    clientId: process.env.SLACK_CLIENT_ID!,
    clientSecret: process.env.SLACK_CLIENT_SECRET!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});

app.event("message", async ({ client, message }) => {
    client.reactions.add({
        channel: message.channel,
        name: "thinking_face",
        timestamp: message.ts
    });
    client.chat.postMessage({
        channel: message.channel,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: MESSAGE_START
                }
            }, {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: DONE
                        },
                        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    }
                ]
            }
        ]
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const i = randomInt(COMPLAINTS.length);
    const complaint = COMPLAINTS[i];
    client.chat.postMessage({
        channel: message.channel,
        text: complaint,
        icon_url: process.env.IMAGE_URL,
        username: "Evil Workspace Admin"
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const user = message.subtype === undefined ? message.user : "";
    
    client.chat.postMessage({
        channel: message.channel,
        text: MESSAGE_END.replace("$USER_ID", user)
    });
    client.reactions.remove({
        channel: message.channel,
        name: "thinking_face",
        timestamp: message.ts
    });
    client.reactions.add({
        channel: message.channel,
        name: "white_check_mark",
        timestamp: message.ts
    });
});