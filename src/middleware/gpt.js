import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();



export const recommandArtist = async (data) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.GPT_KEY
        });

        const assistant = await openai.beta.assistants.retrieve(
            process.env.GPT_ARTIST_ASSI
        )

        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: data
        });

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            instructions: "",
        });

        await checkRunStatus(openai, thread.id, run.id);
        const message = await openai.beta.threads.messages.list(thread.id);
        const contents = message.body.data[0].content[0].text.value;

        async function checkRunStatus(client, threadId, runId) {
            let run = await client.beta.threads.runs.retrieve(threadId, runId);

            while (run.status !== "completed") {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
                run = await client.beta.threads.runs.retrieve(threadId, runId);
            }
        }
        const result = [JSON.parse(contents).artist1, JSON.parse(contents).artist2, JSON.parse(contents).artist3, JSON.parse(contents).artist4, JSON.parse(contents).artist5];
        return result
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const recommandGerne = async (data) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.GPT_KEY
        });

        const assistant = await openai.beta.assistants.retrieve(
            process.env.GPT_MUSIC_GERNE
        )

        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: data
        });

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            instructions: "",
        });

        await checkRunStatus(openai, thread.id, run.id);
        const message = await openai.beta.threads.messages.list(thread.id);
        const contents = message.body.data[0].content[0].text.value;

        async function checkRunStatus(client, threadId, runId) {
            let run = await client.beta.threads.runs.retrieve(threadId, runId);

            while (run.status !== "completed") {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
                run = await client.beta.threads.runs.retrieve(threadId, runId);
            }
        }
        const result = JSON.parse(contents).gerne;
        return result
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const recommandCuration = async (data) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.GPT_KEY
        });

        const assistant = await openai.beta.assistants.retrieve(
            process.env.GPT_CURATION
        )

        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: data
        });

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            instructions: "",
        });

        await checkRunStatus(openai, thread.id, run.id);
        const message = await openai.beta.threads.messages.list(thread.id);
        const contents = message.body.data[0].content[0].text.value;

        async function checkRunStatus(client, threadId, runId) {
            let run = await client.beta.threads.runs.retrieve(threadId, runId);

            while (run.status !== "completed") {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
                run = await client.beta.threads.runs.retrieve(threadId, runId);
            }
        }
        const result = JSON.parse(contents).curation;
        return result
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}
