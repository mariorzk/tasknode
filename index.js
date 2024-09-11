// arrays e objetos

let meta = {
    value: 'ler um livro por mês',
    checked: false,
    log: (info) => {
        console.log(info);
        
    }
}
meta.value = 'outra meta'
meta.log(meta.value) //Recriando o console.log para entendimento atributos e métodos

//Arrow function

const criarMeta = () => {}

//Named Function

// function criarMeta () {}