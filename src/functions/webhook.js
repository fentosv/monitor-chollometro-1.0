require('dotenv').config()


/* Creamos el formato del webhook */
const various = require('./various')
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const PRIVATE_DEPLOY = process.env.PRIVATE_DEPLOY;
const DISCORD_WEBHOOK_URL_PRIVATE_FILTERED = process.env.DISCORD_WEBHOOK_URL_PRIVATE_FILTERED;
const DISCORD_WEBHOOK_URL_PRIVATE_UNFILTERED = process.env.DISCORD_WEBHOOK_URL_PRIVATE_UNFILTERED;
const DISCORD_WEBHOOK_URL_PUBLIC_UNFILTERED = process.env.DISCORD_WEBHOOK_URL_PUBLIC_UNFILTERED;
const DISCORD_WEBHOOK_URL_PUBLIC_FILTERED = process.env.DISCORD_WEBHOOK_URL_PUBLIC_FILTERED;
const DISCORD_WEBHOOK_URL_ERROR = process.env.DISCORD_WEBHOOK_URL_ERROR;

//Privado = true manda los webhooks al canal privado
const linkWebhook_Filtered = (() => {
    if (PRIVATE_DEPLOY === 'true')
        //Privado filtered
        return DISCORD_WEBHOOK_URL_PRIVATE_FILTERED
    else
        //Publico filtered
        return DISCORD_WEBHOOK_URL_PUBLIC_FILTERED
})();

const linkWebhook_Unfiltered = (() => {
    if (privado)
        //Privado unfiltered
        return DISCORD_WEBHOOK_URL_PRIVATE_UNFILTERED
    else
        //Publico unfiltered
        return DISCORD_WEBHOOK_URL_PUBLIC_UNFILTERED
})();


const Webhook_Item = (webhook_Url, title, link, text, price, priceStrikethrough, linkImg) => {

    const hook = new Webhook(webhook_Url);


    const embed = new MessageBuilder()
        .setTitle(title)
        // .setAuthor('BrocolAIO', 'link', 'https://www.google.com')
        .setDescription(price + '  ' + priceStrikethrough)
        .addField('Descripción', text + " [...]", true)


        // .addField('Enlace ', link)

        //Mención a rol Chollometro + " <@&782567458745352192>"


        .setURL(link)
        .setColor('#f27023 ')
        // .setImage(linkImg)
        .setThumbnail(linkImg)
        .setFooter('Chollómetro monitor, by Imago', 'https://i.ibb.co/zxtL34D/pngwing-com.png')
        .setTimestamp();

    hook.setUsername('Chollómetro');
    hook.setAvatar('https://www.tuexpertoapps.com/wp-content/uploads/2018/10/chollometro-1-950x642.jpg.webp')
    try {
        hook.send(embed);

    } catch (error) {
        console.log(error.message);
    }


}



//Función que envía la información al discord
const toDiscord = async (filtradoWhiteList, filtradoRepetidos) => {
    console.log(`Enviando ${filtradoRepetidos.length} items al webhook Unfiltered.`)
    console.log(`Enviando ${filtradoWhiteList.length} items al webhook Filtered.`)
    for (const i in filtradoWhiteList) {

        // webhook_Url, title, link, text, price, priceStrikethrough, linkImg
        Webhook_Item(
            linkWebhook_Filtered,
            filtradoWhiteList[i].title, filtradoWhiteList[i].url, filtradoWhiteList[i].description, filtradoWhiteList[i].currentPrices, filtradoWhiteList[i].previousPrices, filtradoWhiteList[i].imgLink)
        // console.log("print - filtered")
        if ((i - 4) % 5 === 0) {
            // console.log("Dormimos 2 segundos - Filtered")
            await various.sleep(3000)
        }
    }

    for (const i in filtradoRepetidos) {
        Webhook_Item(
            linkWebhook_Unfiltered,
            filtradoRepetidos[i].title, filtradoRepetidos[i].url, filtradoRepetidos[i].description, filtradoRepetidos[i].currentPrices, filtradoRepetidos[i].previousPrices, filtradoRepetidos[i].imgLink)
        // console.log("print - unfiltered")

        if ((i - 4) % 5 === 0) {
            // console.log("Dormimos 2 segundos - Unfiltered")
            await various.sleep(3000)
        }
    }

}


const error = (title, text) => {

    const hook = new Webhook(DISCORD_WEBHOOK_URL_ERROR);


    const embed = new MessageBuilder()
        .setTitle(title)
        // .setAuthor('BrocolAIO', 'link', 'https://www.google.com')
        // .setDescription(price)
        // .addField('Descripción', text + " [...]", true)
        // .addField('Descripción', 'texto', true)
        .setDescription(text)

        .setColor(' #872222')
        // .setImage(linkImg)

        // .setThumbnail('https://www.tuexpertoapps.com/wp-content/uploads/2018/10/chollometro-1-950x642.jpg.webp')
        .setFooter('Chollómetro monitor errors, by Imago', 'https://i.ibb.co/zxtL34D/pngwing-com.png')

        .setTimestamp();

    hook.setUsername('Error Chollómetro');
    hook.setAvatar('https://www.tuexpertoapps.com/wp-content/uploads/2018/10/chollometro-1-950x642.jpg.webp')

    try {
        hook.send(embed);

    } catch (error) {
        console.log(error.message);
    }


}

// module.exports = toDiscord


// error('Monitor Chollómetro', 'Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda parrafada Tremenda')

exports.toDiscord = toDiscord
exports.error = error

