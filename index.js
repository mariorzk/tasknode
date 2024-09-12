const {select, input, checkbox} = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}

let metas = [ meta ]

const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite a meta:"})
    
    if(meta.length == 0){
        console.log('A meta não pode ser vazia.');
        return        
    }

    metas.push({value: meta , checked: false})

    console.log("Meta cadastrada com sucesso!");
    
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        console.log('Nenhuma meta selecionada');        
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })

    console.log('Meta(s) marcadas como concluída(s)')
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    if(realizadas.length == 0) {
        console.log('Não existem metas realizadas! :(');
        return        
    }
    await select ({
        message: `Metas Realizadas = ${realizadas.length}`,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true //posso substituir por return !meta.checked
    })
    if(abertas.length == 0) {
        console.log('Não existem metas em aberto! :)')
        return
    }
    await select ({
        message: `Metas Abertas = ${abertas.length}`,
        choices: [...abertas],
    })
}

const start = async () => {

    while(true) {

        const opcao = await select({
            message: "Menu >",
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
            case "sair":
                console.log("Até a próxima")
                return               
        }
    }
}

start()