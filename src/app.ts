import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from '@bot-whatsapp/bot'
import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys'
import fetch from 'node-fetch';

// Function to call a web API
async function callWebApi(url: string, message: string) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })  // Convert the message object to a JSON string
        };

        const response = await fetch(url, options);

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Failed to fetch data from API:', error);
        return null;
    }
}

const flowBienvenida = addKeyword('hola')
    .addAnswer('Buenas, buenas!')

const flowCarbyne = addKeyword('911-USAMEX')
    .addAction(async(ctx, { flowDynamic }) => {
        const apiResponse = await callWebApi('https://kipcalm.azurewebsites.net/Whatsapp/getWhatsappMessage', ctx.body);

        return flowDynamic(`Tu mensaje es: ${ctx.body }`)
    })

const main = async () => {

    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3002)

    provider.http.server.post('/send-message', handleCtx(async (bot, req, res) => {
        await bot.sendMessage('5218112444112', 'Prueba de mensaje 001', {})
        res.end('Esto es del server gratis')
    }))
    
    await createBot({
        flow: createFlow([flowBienvenida, flowCarbyne]),
        database: new MemoryDB(),
        provider: provider
    })

}

main()
