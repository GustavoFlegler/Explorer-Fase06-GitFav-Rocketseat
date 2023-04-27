import { GithubUser } from "./githubUser.js"

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username){
    try{
      const userExists = this.entries.find(entry => entry.login === username)
      if (userExists){
        throw new Error('Usuário já cadastrado')
      }


      const user = await GithubUser.search(username)

      if(user.login === undefined){
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    }catch(error){
      alert(error.message)
    }
  }

  delete(user){
    this.entries = this.entries.filter(entry => entry.login !== user.login)
    this.update()
  }
}

export class FavoritesView extends Favorites {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('#button_search')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('#input_search')

      this.add(value)
    }
  }

  update(){
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector(`.user a`).href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esta linha ?')
        if (isOk) {
          this.delete(user)
        }
      }
      
      this.tbody.append(row)
    })

    
  }

  createRow(){
    const tr = document.createElement(`tr`)

    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/GustavoFlegler.png" alt="imagem de perfil">
          <a href="https://github.com/GustavoFlegler" target="_blank">
            <p>Gustavo Flegler</p>
            <span>/GustavoFlegler</span>
          </a>
        </td>
        
        <td class="repositories">
          123
        </td>

        <td class="followers">
          1234
        </td>

        <td class="remove">
          <button>Remover</button>
        </td>
    `

    return tr
  }

  removeAllTr(){
    this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
  }
}