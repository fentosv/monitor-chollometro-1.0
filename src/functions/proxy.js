const fs = require('fs');
const path = require('path')


class Auth {
    constructor(user, pass) {
        this.user = user
        this.pass = pass
    }
}

class Proxy {
    constructor(ip, port, auth) {
        this.ip = ip
        this.port = port
        this.auth = auth

    }
    bookInfo() {
        return `${this.title} es un libro de ${this.gender} escrito por ${this.author} en el año ${this.year}`;
    }
}


//Devuelve proxyList (json proxies) o error
const ProxyJson = async () => {

    //Al estar en src/functions tenemos que subir 2 niveles
    const url = path.join(__dirname, "../../proxies.txt")
    // console.log(url)

    try {

        //Array de objetos que almacenará los proxies
        const proxyList = []

        //Leemos el txt (es un string)
        const datos = fs.readFileSync(url, 'utf-8').trim()

        //Separamos por líneas
        const lineas = datos.trim().split('\n')
            //Filtramos los que tienen espacios en blanco
            .filter(entry => entry.trim() != '')
        // console.log(lineas);

        for (const linea of lineas) {

            const elemento = linea.split(':')
            // console.log(elemento.length);

            //Para proxies con auth (user:pass)
            if (elemento.length === 4) {

                // console.log("Este es ip:port:user:pass");

                const ip = (elemento[0].trim())
                const port = (elemento[1].trim())
                const user = (elemento[2].trim())
                const pass = (elemento[3].trim())

                // const ProxyFinal = new Proxy(ip, port, new Auth(user, pass))

                const ProxyFinal = {
                    host: ip,
                    port: port,
                    auth: {
                        username: user,
                        password: pass
                    }
                }
                proxyList.push(ProxyFinal)

                //Para proxies que sean sin auth
            } else if (elemento.length === 2) {

                // console.log("Este es ip:port");

                const ip = (elemento[0].trim())
                const port = (elemento[1].trim())

                // const ProxyFinal = new Proxy(ip, new Number(port), new Auth(false, false))

                const ProxyFinal = {
                    host: ip,
                    port: port,
                    auth: {
                        username: false,
                        password: false
                    }
                }
                proxyList.push(ProxyFinal)

            }
        }

        return proxyList


    } catch (error) {

        //Si no encuentra el archivo proxies.txt, finaliza programa
        if (error.code === "ENOENT") {
            console.log("ERROR: el archivo proxies.txt no existe. Por favor, créalo en la carpeta raíz y ejecuta de nuevo.")
            // throw new Error("El archivo proxies.txt no existe. Por favor créalo en la carpeta raíz y ejecuta de nuevo.")
            // throw new CustomError()
            process.exit(0)

        } else {
            console.log(error.message)
        }


    }

    //Pasarlo a .json
    // const data = JSON.stringify(proxyList);

    //Escribirlo en un archivo.json
    // fs.writeFileSync("./proxy.json", data);

}

// (async () => {


//     const proxy = await ProxyJson()
//     console.log(proxy[1])

// })();


module.exports = ProxyJson






