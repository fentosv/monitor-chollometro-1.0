
//A mimir
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


//Compara la propiedad "name" de objeto1 con los elementos de array. Devuelve los objetos que NO coinciden
const filtroBlackList = (array, objeto) =>
    objeto.filter((el1) => !array.some((el2) => el1.title.toLowerCase().includes(el2)));

//Compara la propiedad "name" de objeto1 con los elementos de array. Devuelve los objetos que coinciden
const filtroWhiteList = (array, objeto) =>
    objeto.filter((el1) => array.some((el2) => el1.title.toLowerCase().includes(el2)));




//Compara la propiedad "title" de objeto1 y de objeto2. Devuelve los elementos de objeto2 que no están en objeto1
const filtroRepetidos = (objetoPrevio, objetoActual) => {

    return objetoActual.filter((el1) => !objetoPrevio.some((el2) => el1.title === el2.title));
    // .concat(
    //     arrayActual.filter((el1) => !arrayPrev.some((el2) => el1.title === el2.title)))
}

//Vacía un array hasta la posición 25
const cleanArray = (array) => {
    while (array.length > 25) {
        array.shift();
    }
    // return array;
}



//Transfiere array a arrayNuevo
const transferArray = (array, arrayNuevo) => {
    array.map((element) => arrayNuevo.push(element))
}


exports.filtroRepetidos = filtroRepetidos
exports.sleep = sleep
exports.cleanArray = cleanArray
exports.transferArray = transferArray
exports.filtroBlackList = filtroBlackList
exports.filtroWhiteList = filtroWhiteList

//varios.cleanArray(array)


/*!

//-> En index.js
const saludos = require("./test")

saludos.hola1()
saludos.adios()
*/