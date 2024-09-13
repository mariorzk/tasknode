const {select, input, checkbox} = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao APP de Metas! :)"

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    };
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite a meta:"})
    
    if(meta.length == 0){
       mensagem = 'A meta não pode ser vazia.';
        return        
    }

    metas.push({value: meta , checked: false})

    mensagem = "Meta cadastrada com sucesso!"
    
}

const listarMetas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas!!'
        return
    }
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
       mensagem = 'Nenhuma meta selecionada';        
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })

    mensagem = "Meta(s) marcadas como concluída(s)"
}

const metasRealizadas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas!!'
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    if(realizadas.length == 0) {
        mensagem = 'Não existem metas realizadas! :(';
        return        
    }
    await select ({
        message: `Metas Realizadas = ${realizadas.length}`,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas!!'
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true //posso substituir por return !meta.checked
    })
    if(abertas.length == 0) {
        mensagem = 'Não existem metas em aberto! :)'
        return
    }
    await select ({
        message: `Metas Abertas = ${abertas.length}`,
        choices: [...abertas],
    })
}

const apagarMetas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas!!'
        return
    }
    const metasDesmarcadas = metas.map((meta)=> {
        return {value: meta.value, checked: false}
    })

    const itemsAApagar = await checkbox({
        message: "Escolha a(s) meta(s) que deseja apagar:",
        choices: [...metasDesmarcadas],
        instructions: false
    })
    if(itemsAApagar.length == 0) {
        mensagem = 'Nenhuma meta foi apagada!';
        return        
    }
    itemsAApagar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    mensagem = 'Meta(s) apagada(s) com sucesso!';    
}

const mostrarMensagem = () => {
    console.clear()

    if (mensagem != "") {
        console.log("");
        console.log(mensagem);
        console.log("");
        mensagem = ""
        
    }
}

const start = async () => {
    await carregarMetas()

    while(true) {
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "<< MENU PRINCIPAL >>",
            choices : [
                {
                    name: "Cadastrar Meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar Metas",
                    value: "listar"
                },
                {
                    name: "Metas Realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas Abertas",
                    value: "abertas"
                },
                {
                    name: "Apagar Metas",
                    value: "apagar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "apagar":
                await apagarMetas()
                break
            case "sair":
                console.log("Até a próxima")
                return               
        }
    }
}

start()