import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from '@bot-whatsapp/bot'
import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys'

const flowBienvenida = addKeyword('hola').addAnswer('Buenas, buenas!')

const main = async () => {

    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3002)

    provider.http.server.post('/send-message', handleCtx(async (bot, req, res) => {
        await bot.sendMessage('5218112444112', 'Prueba de mensaje 001', {})
        res.end('Esto es del server gratis')
    }))
    
    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider: provider
    })

}

main()
