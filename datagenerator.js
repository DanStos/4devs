const fetch = require('node-fetch')
const FormData = require('form-data')
const jsdom = require('jsdom')
const {JSDOM} = jsdom

let multipart = function (data){
let formData = new FormData()
    for(item in data){
        formData.append(item,data[item])
    }
    return formData
}

/**
 * @param {Object} body O objeto a ser usado para criação de um ou mais itens (baseado na ação)
 * @param {string} body.acao - Ação a ser consultada
 * @param {string} body.pontuacao - S/N - (Sim/Não)
 * @param {string} body.sexo - H/M/I - (Homem / Mulher / Aleatório)
 * @param {number} [body.idade=0] - Idade
 * @param {string} [body.cep_estado=""] - CEP Estado (SP,MG,etc...)
 * @param {string} [body.cep_cidade=""] - CEP cidade (São Paulo,Ouro Branco, etc...)
 * @param {number} [body.txt_qtde=1] - Quantidade de pessoas
 * @returns {(Object|Array)} retorna um ou mais itens (baseado na ação)
 */
async function getPeople(body){
    return await fetch("https://www.4devs.com.br/ferramentas_online.php",
	{
		method:"POST",
		body:multipart(body)
})
    .then(res=>res.json()
            .then(data=>{return data}))
    }


/**
     * @param {Object} body O objeto a ser usado para coleta de um cartão de crédito
     * @param {string} body.acao - Ação a ser consultada
     * @param {string} body.pontuacao - S/N - (Sim/Não)
     * @param {string} body.bandeira - Bandeira do cartão de crédito - visa deve ser descrito como "visa16"
     * @returns {Object} retorna um item
 */
async function getCreditCard(body){
    return await fetch("https://www.4devs.com.br/ferramentas_online.php",
	{
		method:"POST",
		body:multipart(body)
})
.then(res=>res.text()
        .then(text=>{
            let ccData = []
            const htmlDocument = new JSDOM(text);
            htmlDocument.window.document.querySelectorAll('#cartao_numero, #data_validade, #codigo_seguranca').forEach(elem=>ccData.push(elem.textContent))
            return {
                "cartao_credito": ccData[0],
                "validade": ccData[1],
                "ccv": ccData[2]
            }
        }))
}

/**
     * @param {Object} body O objeto a ser usado para coleta de um cartão de crédito
     * @param {string} body.acao - Ação a ser consultada
     * @param {string} body.pontuacao - S/N - (Sim/Não)
     * @param {string} [body.cpf_estado] - Estado no qual o CPF será gerado (SP, MG, etc...)
     * @returns {Object} retorna um item
 */
async function getCPF(body){
    return await fetch("https://www.4devs.com.br/ferramentas_online.php",
	{
		method:"POST",
		body:multipart(body)
    })
    .then(res=>res.text()
            .then(text=>{
                return{
                    "cpf":text
                }
            }))
}


module.exports={
    getPeople,
    getCPF,
    getCreditCard
}

