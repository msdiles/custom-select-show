class Select {
  constructor({ selector, label, items, ...cb }) {
    if (
      !selector ||
      !(selector instanceof HTMLElement) ||
      !label ||
      !(typeof label === "string") ||
      !items ||
      !(items instanceof Array)
    ) throw new Error("invalid arguments")
      this.selector = selector
    this.label = label
    this.items = items.map((item, id) => ({
      label: item,
      id,
    }))
    this.cb = cb[Object.keys(cb)[0]]
    this.createDomElements()
    this.createEventListeners()
  }

  currentItem = null

  createDomElements() {
    const main = document.createElement("div")
    main.classList.add("selector-main")
    this.selector.appendChild(main)

    const label = document.createElement("p")
    label.classList.add("label")
    label.innerHTML = this.label
    main.appendChild(label)

    const activeItem = document.createElement("p")
    activeItem.classList.add("active-item")
    main.appendChild(activeItem)

    const hideScroll = document.createElement("div")
    hideScroll.classList.add("hide-scroll")
    main.appendChild(hideScroll)

    const list = document.createElement("div")
    list.classList.add("elements-list")
    hideScroll.appendChild(list)

    this.items.forEach((item) => {
      const li = document.createElement("div")
      li.classList.add("element")
      li.dataset.id = item.id
      li.dataset.label = item.label
      list.appendChild(li)
      const pIntoLi = document.createElement("p")
      pIntoLi.innerHTML = item.label.toString()
      li.appendChild(pIntoLi)
    })
    this.listClickHandler = (e) => this.chooseItemOnClick(e)
    list.addEventListener("click", this.listClickHandler)
    this.selectorBody = this.selector.getElementsByClassName("selector-main")[0]
  }

  createEventListeners() {
    this.selectorClickHandler = () => this.checkIsOpen()
    this.selectorBody.addEventListener("click", this.selectorClickHandler)

    this.documentClickHandler = (e) => this.checkIsShouldClose(e)
    document.addEventListener("click", this.documentClickHandler)
  }

  checkIsOpen() {
    this.selectorBody.classList.contains("open")
      ? this.closeSelect()
      : this.openSelect()
  }
  //FIXME
  checkIsShouldClose(e) {
    if (
      !this.selectorBody.contains(e.target) &&
      !e.target.hasAttribute("data-type")
    )
      this.closeSelect()
  }

  openSelect() {
    if (this.selectorBody) this.selectorBody.classList.add("open")
  }

  closeSelect() {
    if (this.selectorBody) this.selectorBody.classList.remove("open")
  }

  chooseItem(index) {
    this.currentItem = this.items[index]
    this.selectorBody.classList.add("chosen")
    if (this.cb) this.cb(this.currentItem)
    this.reRender()
  }

  chooseItemOnClick(e) {
    let item
    if (e.target.nodeName === "P") {
      item = {
        id: e.target.closest(".element").dataset.id,
        label: e.target.closest(".element").dataset.label,
      }
    } else if (e.target.nodeName === "DIV") {
      item = { id: e.target.dataset.id, label: e.target.dataset.label }
    } else return
    this.currentItem = item
    this.selectorBody.classList.add("chosen")
    if (this.cb) this.cb(this.currentItem)
    this.reRender()
  }

  getSelected() {
    return this.currentItem
  }

  clear() {
    this.currentItem = null
    this.selectorBody.classList.remove("chosen")
    this.reRender()
  }

  destroy() {
    this.selector
      .getElementsByClassName("elements-list")[0]
      .removeEventListener("click", this.listClickHandler)
    document.removeEventListener("click", this.documentClickHandler)
    this.selectorBody.removeEventListener("click", this.selectorClickHandler)
    this.selectorBody.remove()
  }

  reRender() {
    if (this.currentItem) {
      this.selector.getElementsByClassName(
        "active-item"
      )[0].innerHTML = this.currentItem.label
      return
    }
    this.selector.getElementsByClassName("active-item")[0].innerHTML = null
  }
}

const select = new Select({
  selector: document.getElementById("select"),
  label: "Выберите вариант",
  items: [1, 2, 3, 4, 5, 6, 7, 8],
  onSelect(selectedItem) {
    console.log(JSON.stringify(selectedItem))
  },
})

const actions = [
  select.openSelect,
  select.closeSelect,
  select.chooseItem,
  select.getSelected,
  select.clear,
  select.destroy,
]
document
  .getElementById("actions")
  .querySelectorAll("[data-type]")
  .forEach((item, idx) => (item.onclick = actions[idx].bind(select, 4)))
