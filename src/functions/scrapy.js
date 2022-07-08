require('dotenv').config()
//Si está en raspberry: true
const RASPBERRY = process.env.RASPBERRY;

const chalk = require('chalk')
const various = require('./various')
const webhook = require('./webhook')

// const filters = require("../../filters.json");
// const filters = require("../../../filters.json"); //En raspberry


const filters = (() => {
    if (RASPBERRY === 'true')
        //Raspberry
        return require("../../../filters.json");
    else
        //Local
        return require("../../filters.json");
})();




const cheerio = require("cheerio");
const axios = require('axios-https-proxy-fix')

const axiosCookieJarSupport = require('axios-cookiejar-support').default;
axiosCookieJarSupport(axios);
const tough = require('tough-cookie');


const num = 0


const arrayPrevio = []
const arrayActual = []


const Scrapy = async (proxy) => {
    if (proxy) {
        console.log(`\nProxy usado: ${proxy.host}\n`)
    }
    const instance = axios.create({
        timeout: 15000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
            'Referer': 'https://www.chollometro.com/',
            'Upgrade-Insecure-Requests': '1',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'TE': 'Trailers'
        },
        jar: new tough.CookieJar(),
        proxy: proxy && proxy,
    });


    //!==============================================================================



    const arrayResultado = instance.get("https://www.chollometro.com/nuevos")

        .then((res) => {

            const $ = cheerio.load(res.data)

            // console.log(res.data);

            const items = $('article[class="thread cept-thread-item thread--type-list thread--deal"]')
                .toArray()
                .map((element) => {
                    const title = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .attr('title')

                    const url = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .attr('href')
                    const currentPrices = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(1) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        // .html()
                        .text()
                    const previousPrices = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(1) //Es igual que Children[0]
                        .children().eq(1) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        // .html()
                        .text()
                    const imgLink = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        // .html()
                        .attr('src')
                    const description = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(3)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        // .html()
                        .text()
                        .replace(/\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tLeer más/gi, "")
                        .trim()


                    // Fixeamos los precios (actual y previo), para que si salen vacíos no aparezcan los caracteres de formato(~~ y ``)
                    const currentPricesFix = (() => {
                        if (currentPrices.length >= 1)
                            return '`` ' + currentPrices + ' ``'
                        else
                            return currentPrices
                    })();

                    const previousPricesFix = (() => {
                        if (previousPrices.includes("€"))
                            return '~~' + previousPrices + '~~'
                        else
                            return previousPrices
                    })();


                    // title, url, currentPricesFix, previousPricesFix, imgLink, description
                    //Devolvemos objeto "items"
                    return {
                        title: title,
                        url: url,
                        currentPrices: currentPricesFix,
                        previousPrices: previousPricesFix,
                        imgLink: imgLink,
                        description: description

                    };
                })


            //! FIN DEL SCRAPER, INICIO PROCESAMIENTO DE INFO

            //Ya tenemos los resultados del scraper almacenados en "items"
            //Los procesamos
            arrayActual.push(items)

            console.log(`Testeando la posición [${num}] de los items...`)
            console.log(`${chalk.hex('#9f33ff').bold('TITLE:')} ${items[num].title}`);

            console.log(`${chalk.hex('#9f33ff').bold('PRODUCT URL:')} ${items[num].url}`);

            console.log(`${chalk.hex('#9f33ff').bold('CURRENT PRICE:')} ${items[num].currentPrices}`);

            console.log(`${chalk.hex('#9f33ff').bold('PREVIOUS PRICE:')} ${items[num].previousPrices}`);

            console.log(`${chalk.hex('#9f33ff').bold('IMG LINK:')} ${items[num].imgLink}`);

            console.log(`${chalk.hex('#9f33ff').bold('DESCRIPTION:')} ${items[num].description} \n`);



            //Total de items que obtenemos del scraping
            // console.log(arrayActual[0].length)

            //FILTROS NEGATIVOS
            //Pasamos el filtro blackList
            const filtradoBlackList = various.filtroBlackList(filters.blackList, arrayActual[0])
            console.log(`${chalk.hex('#e87373')('Elementos eliminados por blackList: ')}${arrayActual[0].length - filtradoBlackList.length}`);


            //Limpiamos el array para que la siguiente lectura lo coja bien, ya que va a la posición [0]
            arrayActual.shift()


            //Filtramos repetidos (con respecto a los items del loop anterior)
            const filtradoRepetidos = various.filtroRepetidos(arrayPrevio, filtradoBlackList)


            console.log(`${chalk.hex('#e87373')('Elementos eliminados por repetición: ')}${filtradoBlackList.length - filtradoRepetidos.length}\n`);

            //Log del número de elementos que pasan los filtros
            console.log(`${chalk.hex('#80cb84')('Elementos finales: ')}${filtradoRepetidos.length}`);

            //Limpiamos arrayPrevio, ya comparado
            //Añadimos los nuevos elementos a arrayPrevio
            if (arrayPrevio.length > 50) {
                console.log(`${chalk.hex('#b80a0a')('Array limpiado.')}`);
                various.cleanArray(arrayPrevio)
            }
            // various.transferArray(filtradoRepetidos, arrayPrevio)

            //Metemos en arrayPrevio los nuevos elementos que no estaban
            various.transferArray(various.filtroRepetidos(arrayPrevio, filtradoRepetidos), arrayPrevio)
            // console.log(arrayPrevio)

            //FILTRO POSITIVO
            //Pasamos el filtro whiteList
            const filtradoWhiteList = various.filtroWhiteList(filters.whiteList, filtradoRepetidos)

            console.log(`${chalk.hex('#e99e4e')('Elementos en whiteList: ')}${filtradoWhiteList.length}\n`);


            // console.log(filtradoRepetidos[0].title)

            //filtradoRepetidos, filtradoWhiteList
            return [filtradoRepetidos, filtradoWhiteList];




        })
        .catch(error => {
            // console.log(`\nProxy usado: ${proxy.host}`)
            console.log(`${chalk.hex('#c20000')('SCRAPY ERROR:')} ${error.message}`);

            //!___---.asdadasd---------------

            webhook.error('Monitor Chollómetro', error.message)

        })


    //arrayResultado = [filtradoRepetidos, filtradoWhiteList];
    return arrayResultado


} //Fin función Scrapy




const Scrapy_test = async (proxy) => {

    const [filtradoRepetidos, filtradoWhiteList] = await Scrapy(proxy);

    console.log(`Enviando: ${filtradoRepetidos.length}\n`)


    // toDiscord(filtradoWhiteList, filtradoRepetidos)
};

// Scrapy_test()



module.exports = Scrapy
// module.exports = Scrapy_Discord
// module.exports = toDiscord

