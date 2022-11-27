const inputAdicionar = document.querySelector('[data-inputAdicionar]')
const btnAdicionar = document.querySelector('[data-btnAdicionar]')
const inputPesquisar = document.querySelector('[data-inputPesquisar]')
const btnDeleteAll = document.querySelector('[data-btnDeleteAll]')
const ul = document.querySelector('[data-ul]')
const checkboxEditar = document.querySelector('[data-checkboxEditar]')
const checkboxSelectAll = document.querySelector('[data-checkboxSelectAll]')
const fildsetTexto = document.querySelector('.form__texto')
const checkboxnumero = document.querySelector('[data-checkboxnumero]')
const textarea = document.querySelector('[data-textarea]')
const btnReceber = document.querySelector('[data-btnReceber]')
const btnCopiar = document.querySelector('[data-btnCopiar]')
const btnAbreEnviar = document.querySelector('[data-btnAbreEnviar]')
const btnEnviar = document.querySelector('[data-btnEnviar]')
const btnNavegacao = document.querySelector('[data-btnNavegacao]')
const modal = document.querySelector('[data-modal]')
const btnFechaModal = document.querySelector('[data-btnFechaModal]')
const dados = JSON.parse(localStorage.getItem('dadosLista')) || {
    "itens": []
}
const {
    itens
} = dados
let iniciou = true
let cron = null

const moverParaTopo = (el, offset = 0) => {
    window.scrollTo({
        top: el.offsetTop + offset,
        behavior: 'smooth'
    })
};

const salvaLocalStorage = (nome, item) => {
    localStorage.setItem(nome, JSON.stringify(item))
}

const capitalized = (str) => {
    if (!str) return "kkkkkk"
    return str[0].toUpperCase() + str.substr(1)
}

const criarLista = () => {
    const filtro = itens.filter(item => item.checkado)
    const lista = filtro.reduce((acc, cur, i) => {
        const temNumeros = checkboxnumero.checked ? `${i+1}. ` : ""
        return acc + `${temNumeros}${cur.item}\n`
    }, "")

    textarea.value = lista
}

const atualizaLista = (e, item) => {
    item.checkado = e.target.checked
    salvaLocalStorage("dadosLista", dados)
    criarLista()
    setChekcboxIndefinido()
}

const setChekcboxIndefinido = () => {
    const labelSelectAll = document.querySelector('[data-labelSelectAll]')
    const checkboxSelectAll = document.querySelector('[data-checkboxSelectAll]')
    const checkboxsSelecionar = Array.from(document.querySelectorAll('[data-checkboxSelecionar]'))

    if (checkboxsSelecionar.length === 0) return

    const algumCheckboxMarcado = checkboxsSelecionar.some((checkbox) => {
        return checkbox.checked
    })
    const todosCheckboxMarcados = checkboxsSelecionar.every((checkbox) => {
        return checkbox.checked
    })

    labelSelectAll.classList.remove("form__list-confg--indefinido")
    checkboxSelectAll.checked = false

    if (todosCheckboxMarcados) {
        labelSelectAll.classList.remove("form__list-confg--indefinido")
        checkboxSelectAll.checked = true
        return
    }
    if (algumCheckboxMarcado) {
        labelSelectAll.classList.add("form__list-confg--indefinido")
    }
}

const criar = (e) => {
    e.preventDefault()
    const item = {
        item: capitalized(inputAdicionar.value.toLowerCase().trim()),
        checkado: false
    }
    btnAdicionar.setAttribute("disabled", "")
    inputAdicionar.focus()
    inputAdicionar.value = ""
    itens.push(item)
    salvaLocalStorage('dadosLista', dados)
    ler()
}

const ler = () => {
    if (itens.length === 0) return
    itens.sort((x, y) => {
        if (!x.item || !y.item) return
        return x.item.toLowerCase().localeCompare(y.item.toLowerCase())
    })
    ul.innerHTML = ""
    itens.forEach((item, index, array) => {
        const li = document.createElement("li")
        const divConteiner = document.createElement("div")
        const divChekcbox = document.createElement("div")
        const label = document.createElement("label")
        const input = document.createElement("input")
        const span = document.createElement("span")
        const buttonEditar = document.createElement("button")
        const buttonApagar = document.createElement("button")

        li.setAttribute("class", "form__list-li")
        li.setAttribute("data-li", "")
        label.setAttribute("data-allCheckbox", "")
        span.setAttribute("class", "checkmark")
        input.setAttribute("type", "checkbox")
        input.setAttribute("data-checkboxSelecionar", "")
        if (item.checkado) {
            input.checked = true
        }

        if (iniciou) {
            li.classList.add("swashIn")
            li.style.animationDelay = `.${1+index}s`
            setTimeout(() => {
                li.style.animationDelay = `0s`
                li.classList.remove("swashIn")
            }, 1000)
        }
        label.classList.add("form__list-li-checkbox", "checkbox-estilizado")
        buttonEditar.classList.add(
            "material-symbols-outlined",
            "form__list-li-btn",
            "form__list-li-btn--editar",
            "display-none"
        )
        buttonApagar.classList.add(
            "material-symbols-outlined",
            "form__list-li-btn",
            "form__list-li-btn--delete",
            "display-none"
        )
        if (checkboxEditar.checked) {
            label.classList.add("display-none")
            buttonEditar.classList.remove("display-none")
            buttonApagar.classList.remove("display-none")
        }

        buttonEditar.setAttribute("data-btnEditar", "")
        buttonApagar.setAttribute("data-btnDelete", "")
        buttonEditar.setAttribute("title", "Editar")
        buttonApagar.setAttribute("title", "Apagar")

        li.innerHTML = `<p>${item.item}</p>`
        buttonEditar.innerText = "edit_note"
        buttonApagar.innerText = "delete"

        divChekcbox.appendChild(label)
        label.appendChild(input)
        label.appendChild(span)
        divConteiner.appendChild(divChekcbox)
        divConteiner.appendChild(buttonEditar)
        divConteiner.appendChild(buttonApagar)
        li.appendChild(divConteiner)
        ul.appendChild(li)

        input.addEventListener('change', (e) => atualizaLista(e, item))
        buttonEditar.addEventListener('click', (e) => {
            e.preventDefault()
            const tagMain = document.querySelector('main')
            const liItem = e.target.parentNode.parentNode
            inputAdicionar.value = item.item

            array.splice(array.indexOf(item), 1)
            salvaLocalStorage("dadosLista", dados)
            liItem.classList.add('tin')
            setTimeout(() => {
                liItem.remove()
            }, 800)
            btnAdicionar.removeAttribute("disabled")
            moverParaTopo(tagMain, -12)
        })
        buttonApagar.addEventListener('click', (e) => {
            e.preventDefault()
            const liItem = e.target.parentNode.parentNode
            array.splice(array.indexOf(item), 1)
            salvaLocalStorage("dadosLista", dados)
            liItem.classList.add('animaApagar')
            setTimeout(() => {
                liItem.remove()
            }, 300)
        })
    })
    iniciou = false
}

const setDisabledBtnAdicionar = () => {
    const item = inputAdicionar.value
    if (!item) {
        btnAdicionar.setAttribute("disabled", "")
        return
    }
    btnAdicionar.removeAttribute("disabled")

}

const setDisabledBtnReceber = () => {
    if (!textarea.value) {
        btnReceber.style.opacity = .1
        btnReceber.setAttribute("disabled", "")
        return
    }
    btnReceber.removeAttribute("disabled")
    btnReceber.style.opacity = 1
}

const receberLista = (e) => {
    e.preventDefault()
    const novaLista = textarea.value.split(`\n`)

    novaLista.forEach(item => {
        const novoItem = {
            item: capitalized(item.toLowerCase().trim()),
            checkado: false
        }
        if (itens.includes(novoItem)) return
        itens.push(novoItem)
    })
    textarea.value = ""
    salvaLocalStorage('dadosLista', dados)
    ler()
}

const seteModoEditar = () => {
    const allCheckbox = Array.from(document.querySelectorAll('[data-allCheckbox]'))
    const btnsEditar = Array.from(document.querySelectorAll('[data-btnEditar]'))
    const btnsDelete = Array.from(document.querySelectorAll('[data-btnDelete]'))
    const btns = [...btnsEditar, ...btnsDelete]

    if (checkboxEditar.checked) {
        allCheckbox.forEach((Checkbox) => Checkbox.classList.add("display-none"))
        btns.forEach((btn) => btn.classList.remove("display-none"))
        return
    }
    btns.forEach((btn) => btn.classList.add("display-none"))
    allCheckbox.forEach((Checkbox) => Checkbox.classList.remove("display-none"))
}

const mostraElementosPesquisados = (e) => {
    const lis = Array.from(document.querySelectorAll('li'))

    lis.forEach((li) => {
        const termoPesquisado = e.target.value.toLowerCase()
        const textoLi = li.children[0].innerText.toLowerCase()

        li.classList.add("display-none")

        if (textoLi.includes(termoPesquisado)) {
            li.classList.remove("display-none")

        }
    })
}

const apagarTudoOuCancelar = (e) => {
    e.preventDefault()
    let contador = 4

    if (btnDeleteAll.innerText.includes('Cancelar')) {
        ul.classList.remove("triste")

        btnDeleteAll.innerHTML = `
        <span>Apagar tudo</span>
        <i class="material-symbols-outlined">delete</i>
        `

        clearInterval(cron)
        return
    }

    btnDeleteAll.innerHTML = `
        <span>Cancelar... 5</span>
    `

    ul.classList.add("triste")

    cron = setInterval(() => {
        contador--
        btnDeleteAll.innerHTML = `
            <span>Cancelar... ${contador}</span>
        `
        if (contador === -1) {
            clearInterval(cron)
            ul.classList.remove("triste")

            btnDeleteAll.innerHTML = `
            <span>Apagar tudo</span>
            <i class="material-symbols-outlined">delete</i>
            `

            const lis = document.querySelectorAll('li')
            lis.forEach((li, index) => {
                li.style.animationDelay = `.${1+index}s`
                li.classList.add("animaApagar")

                setTimeout(() => {
                    li.remove()
                }, 500)
            })

            itens.length = 0
            salvaLocalStorage("dadosLista", dados)
        }
    }, 1000)
}

const abrirModalEnviar = (e) => {
    e.preventDefault()
    if (!textarea.value) {
        textarea.value = 'Você ainda nao tem uma lista para enviar.'
        setTimeout(() => {
            textarea.value = ''
        }, 5000)
    }
    modal.classList.remove("display-none")
    modal.showModal()
}

const enviarParaWhatsApp = (e) => {
    e.preventDefault()
    const inputTelefone = document.querySelector('[data-inputTelefone]')

    const mostrarMsgErroTel = () => {
        const msgErroTel = document.querySelector('[data-msgErroTel]')

        if (!msgErroTel.classList.contains("display-none")) return
        
        msgErroTel.classList.remove("display-none")
        setTimeout(() => {
            msgErroTel.classList.add("display-none")
        }, 1000)

    }

    const titulo = 'Gera lista\n[̲̅b̲̅y̲̅l̲̅є̲̅σ̲̅]\n\n'
    const linkApi = 'https://api.whatsapp.com/send?phone=55'
    const texto = `&text=${titulo}${textarea.value}`
    const pattern = /^\(?\d{2}\)?[\s-]?[\s9]\d{4}-?\d{4}$/i;

    if (!inputTelefone.value || !inputTelefone.value.match(pattern)) {
        mostrarMsgErroTel()
        return
    }
    
    const telefone = inputTelefone.value.match(pattern)[0]
    const linkCompleto = linkApi + telefone + encodeURI(texto)

    window.open(linkCompleto)

    modal.close()
    modal.classList.add("display-none")
}

const fecharModal = (e) => {
    e.preventDefault()
    modal.close()
    modal.classList.add("display-none")
}

const enviarParaAreaDeTranferencia = (e) => {
    e.preventDefault()
    if (!textarea.value) {
        textarea.value = 'Você ainda nao tem uma lista para copiar.'
        setTimeout(() => {
            textarea.value = ''
        }, 5000)
    }

    const titulo = 'Gera lista\n[̲̅b̲̅y̲̅l̲̅є̲̅σ̲̅]\n\n'
    navigator.clipboard.writeText(titulo + textarea.value)
    textarea.value = 'Lista enviada para area de tranferencia'
    setTimeout(() => {
        textarea.value = ''
    }, 5000)
}

const setSubirOuDescer = (e) => {
    e.preventDefault()
    if (btnNavegacao.children[0].innerText === 'arrow_downward') {
        moverParaTopo(fildsetTexto, 12)
        return
    }
    moverParaTopo(inputPesquisar, -12)
}

const setSetaSubirOuDescer = () => {
    const tamanhoDaTela = window.innerHeight
    const distanciaDoTopo = btnNavegacao.offsetTop

    if (distanciaDoTopo - 150 > tamanhoDaTela) {
        btnNavegacao.children[0].innerText = 'arrow_upward'
        return
    }
    btnNavegacao.children[0].innerText = 'arrow_downward'
}

const setCheckedOuNaoTodosCheckbox = () => {
    const labelSelectAll = document.querySelector('[data-labelSelectAll]')
    const checkboxsSelecionar = Array.from(document.querySelectorAll('[data-checkboxSelecionar]'))

    labelSelectAll.classList.remove("form__list-confg--indefinido")

    if (checkboxSelectAll.checked) {
        checkboxsSelecionar.forEach((checkbox) => checkbox.checked = true)
        itens.forEach((item) => item.checkado = true)
        salvaLocalStorage("dadosLista", dados)
        criarLista()
        return
    }

    itens.forEach((item) => item.checkado = false);
    checkboxsSelecionar.forEach((checkbox) => checkbox.checked = false)
    salvaLocalStorage("dadosLista", dados)
    criarLista()
}

ler()

setChekcboxIndefinido()

inputAdicionar.addEventListener('focus', () => {
    moverParaTopo(inputAdicionar, 4)
})

inputPesquisar.addEventListener('focus', () => {
    moverParaTopo(inputPesquisar, -12)
})

textarea.addEventListener('focus', () => {
    moverParaTopo(fildsetTexto, 12)
})

inputAdicionar.addEventListener('input', setDisabledBtnAdicionar)

textarea.addEventListener('input', setDisabledBtnReceber)

btnReceber.addEventListener('click', e => {
    receberLista(e)
})

btnAdicionar.addEventListener('click', e => criar(e))

checkboxEditar.addEventListener('change', seteModoEditar)

inputPesquisar.addEventListener('input', e => {
    mostraElementosPesquisados(e)
})

checkboxnumero.addEventListener('change', criarLista)

btnDeleteAll.addEventListener('click', e => {
    apagarTudoOuCancelar(e)
})

btnAbreEnviar.addEventListener('click', e => {
    abrirModalEnviar(e)
})

btnEnviar.addEventListener('click', e => {
    enviarParaWhatsApp(e)
})

btnFechaModal.addEventListener('click', e => {
    fecharModal(e)
})

btnCopiar.addEventListener('click', e => {
    enviarParaAreaDeTranferencia(e)
})

btnNavegacao.addEventListener('click', e => {
    setSubirOuDescer(e)
})

window.addEventListener('scroll', setSetaSubirOuDescer)

checkboxSelectAll.addEventListener('change', setCheckedOuNaoTodosCheckbox)