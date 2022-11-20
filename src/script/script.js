const inputAdicionar = document.querySelector('[data-inputAdicionar]')
const btnAdicionar = document.querySelector('[data-btnAdicionar]')
const tagMain = document.querySelector('main')
const inputPesquisar = document.querySelector('[data-inputPesquisar]')
const btnDeleteAll = document.querySelector('[data-btnDeleteAll]')
const ul = document.querySelector('[data-ul]')
const checkboxEditar = document.querySelector('[data-checkboxEditar]')
const checkboxsSelecionar = Array.from(document.querySelectorAll('[data-checkboxSelecionar]'))
const checkboxSelectAll = document.querySelector('[data-checkboxSelectAll]')
const checkboxnumero = document.querySelector('[data-checkboxnumero]')
const textarea = document.querySelector('[data-textarea]')
const btnAbreEnviar = document.querySelector('[data-btnAbreEnviar]')
const inputTelefone = document.querySelector('[data-inputTelefone]')
const btnEnviar = document.querySelector('[data-btnEnviar]')
const modal = document.querySelector('[data-modal]')
const dados = JSON.parse(localStorage.getItem('dados')) || {
    "itens": [/*{
            "item": "item 1",
            "checkado": false
        },
        {
            "item": "item 2",
            "checkado": false
        },
        {
            "item": "item 3",
            "checkado": false
        },
        {
            "item": "atem 4",
            "checkado": true
        },
        {
            "item": "item 5",
            "checkado": false
        },
        {
            "item": "item 6",
            "checkado": false
        },
        {
            "item": "item 7",
            "checkado": false
        },*/
    ]
}
const {
    itens
} = dados
let iniciou = true
// console.log(item,checkado);

const moverParaTopo = () => {
    window.scrollTo({
        top: tagMain.offsetTop - 12,
        behavior: 'smooth'
    })
};

const salvaLocalStorage = (nome, item) => {
    localStorage.setItem(nome, JSON.stringify(item))
}

const capitalized = (str) => str[0].toUpperCase() + str.substr(1)

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
    salvaLocalStorage("dados", dados)
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
        item: capitalized(inputAdicionar.value.toLocaleLowerCase()),
        checkado: false
    }
    btnAdicionar.setAttribute("disabled", "")
    itens.push(item)
    inputAdicionar.value = ""
    salvaLocalStorage('dados', dados)
    ler()
}

const ler = () => {
    if(itens.length === 0) return
    itens.sort((x, y) => x.item.toLowerCase().localeCompare(y.item.toLowerCase()))
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

        input.addEventListener('change', (e) => atualizaLista(e, item)) //nao ta pronto
        buttonEditar.addEventListener('click', (e) => {
            e.preventDefault()
            const liItem = e.target.parentNode.parentNode
            inputAdicionar.value = item.item

            array.splice(array.indexOf(item), 1)
            salvaLocalStorage("dados", dados)
            liItem.classList.add('tin')
            setTimeout(() => {
                liItem.remove()
            }, 800)
            btnAdicionar.removeAttribute("disabled")
            moverParaTopo()
        })
        buttonApagar.addEventListener('click', (e) => {
            e.preventDefault()
            const liItem = e.target.parentNode.parentNode
            array.splice(array.indexOf(item), 1)
            salvaLocalStorage("dados", dados)
            liItem.classList.add('animaApagar')
            setTimeout(() => {
                liItem.remove()
            }, 300)
        })
    })
    iniciou = false
}

ler()

setChekcboxIndefinido()

inputAdicionar.addEventListener('focus', moverParaTopo)

inputAdicionar.addEventListener('input', (e) => {
    e.preventDefault()
    const item = inputAdicionar.value
    if (!item) {
        btnAdicionar.setAttribute("disabled", "")
        return
    }
    btnAdicionar.removeAttribute("disabled")

})

btnAdicionar.addEventListener('click', (e) => criar(e))

checkboxEditar.addEventListener('change', (e) => {
    e.preventDefault()
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
})

inputPesquisar.addEventListener('input', (e)=>{
    const lis = Array.from(document.querySelectorAll('li'))
    console.log(lis[0].children[0].innerText)
    lis.forEach((li)=>{
        const termoPesquisado = e.target.value.toLowerCase()
        const textoLi = li.children[0].innerText.toLowerCase()

        li.classList.add("display-none")
        
        if (textoLi.includes(termoPesquisado)) {
            li.classList.remove("display-none")
            
        }
    })
})

checkboxnumero.addEventListener('change', criarLista)

btnDeleteAll.addEventListener('click', (e) => {
    e.preventDefault()
    const lis = document.querySelectorAll('li')
    lis.forEach((li, index) => {
        li.style.animationDelay = `.${1+index}s`
        li.classList.add("animaApagar")
        setTimeout(() => {
            li.remove()
        }, 500)
    })
    itens.length = 0
    salvaLocalStorage("dados", dados)
})

btnAbreEnviar.addEventListener('click', (e) => {
    e.preventDefault()
    modal.classList.remove("display-none")
    modal.showModal()
})

btnEnviar.addEventListener('click', (e) => {
    e.preventDefault()
    modal.close()
    modal.classList.add("display-none")
})

checkboxSelectAll.addEventListener('change', () => {
    const labelSelectAll = document.querySelector('[data-labelSelectAll]')
    const checkboxsSelecionar = Array.from(document.querySelectorAll('[data-checkboxSelecionar]'))

    labelSelectAll.classList.remove("form__list-confg--indefinido")

    if (checkboxSelectAll.checked) {
        checkboxsSelecionar.forEach((checkbox) => checkbox.checked = true)
        itens.forEach((item) => item.checkado = true)
        salvaLocalStorage("dados", dados)
        criarLista()
        return
    }

    itens.forEach((item) => item.checkado = false);
    checkboxsSelecionar.forEach((checkbox) => checkbox.checked = false)
    salvaLocalStorage("dados", dados)
    criarLista()
})




/* 
<li class="form__list-li">
    <p>Item 1</p>
    <div>
        <div>
            <label class="checkbox-estilizado form__list-li-checkbox" data-liCheckbox>
                <input type="checkbox" data-checkboxSelecionar>
                <span class="checkmark"></span>
            </label>
        </div>
        <button class="material-symbols-outlined form__list-li-btn form__list-li-btn--editar display-none" data-btnEditar title="Editar">edit_note</button>
        <button class="material-symbols-outlined form__list-li-btn form__list-li-btn--delete display-none" data-btnDelete title="Apagar">delete</button>
    </div>
</li>
*/
