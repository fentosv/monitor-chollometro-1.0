// const loop = require('./loop.js')
const ProxyJSON = require('./src/functions/proxy')
const Scrapy = require('./src/functions/scrapy')
const webhook = require('./src/functions/webhook')
const chalk = require('chalk')

const delayProxy = 50000
const delayNoProxy = 90000



let index = 0;
//Itera sobre el objeto array y vuelve a empezar, con delay
const loop = async (array, time) => {
    const arrayLength = array.length;

    //Usamos el scrapper cada X segundos
    if (arrayLength > 0) {

        //Cada elemento del array proxyList tiene esta estructura
        // const proxy = {
        //     host: ip,
        //     port: port,
        //     auth: {
        //         username: user,
        //         password: pass
        //     }
        // }

        // console.log(`${index} es ${array[index].host}\n`)

        //Este bloque try es necesario, pues si el proxy falla, los arrays del scrapy no serán iterables y dará error.
        try {
            //Esperamos a obtener los arrays que obtiene el Scrapy, y los mandamos a Discord
            const [filtradoRepetidos, filtradoWhiteList] = await Scrapy(array[index])
            webhook.toDiscord(filtradoWhiteList, filtradoRepetidos)
        } catch (error) {
            console.log(`${chalk.hex('#c20000')('PARSING ERROR:')} ${error.message}`);
        }

        console.log(`${chalk.hex('#7e628d').bold(`\nEsperando ${delayProxy / 1000} segundos...`)}`);

        //Esta es la línea que hace que index vaya de 0 a array.length
        index = (index + 1) % arrayLength;

    } else {
        // console.log(`${index} es IP local\n`)

        try {
            //Esperamos a obtener los arrays que obtiene el Scrapy, y los mandamos a Discord
            const [filtradoRepetidos, filtradoWhiteList] = await Scrapy(undefined)
            webhook.toDiscord(filtradoWhiteList, filtradoRepetidos)
        } catch (error) {
            console.log(`${chalk.hex('#c20000')('PARSING ERROR:')} ${error.message}`);
        }

        console.log(`${chalk.hex('#7e628d').bold(`\nEsperando ${delayNoProxy / 1000} segundos...`)}`);
        //Aquí no rotamos index porque no estamos iterando un array

    }

    console.log(`${chalk.hex('#404040').bold('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')}`);
    setTimeout(loop, time, array, time);
}



const resolve = async () => {

    console.log("\nChollometro's Imago scraper running...")
    const proxyList = await ProxyJSON()
    console.log(`${proxyList.length} proxies cargados.`)

    if (proxyList.length === 0) {
        console.log("\nEl programa se ejecuturá sin proxies.\n")
        await loop(proxyList, delayNoProxy)

    } else {
        //Recorremos los proxies y ejecutamos el scraper dentro
        await loop(proxyList, delayProxy)

    }
}





resolve()

//node index.js >> test.txt












