import { get } from "http"
import { ClienteService } from "../services/ClienteService"
import promptSync from "prompt-sync"

export class ClienteMenu {

    private cliente: ClienteService
    private prompt: promptSync

    constructor() {

        this.cliente = new ClienteService
        this.prompt = promptSync()
    }

    public async clienteMenu() {

        let opcao: string

        console.log(`
 Menu de clientes

 1: Listar clientes
 2: Cadastrar cliente
 3: Buscar ID do cliente
 4: Buscar informações do cliente
 5: Atualizar clientes
 6: Deletar clientes
 7: Retornar ao menu principal
`)

        opcao = await this.prompt("Qual opção deseja? ")

        console.log("");

        switch (opcao) {

            case '1':

                console.table(await this.cliente.listarClientes())

                return this.clienteMenu()

            case '2':

                let nome = await this.prompt('Qual o nome do cliente? ')
                let cpf = await this.prompt('Qual o cpf do cliente? ')
                let endereco = await this.prompt('Qual o endereço do cliente? ')
                let numero_residencial = await this.prompt('Qual o número residencial do cliente? ')
                let bairro = await this.prompt('Qual o bairro do cliente? ')
                let cidade = await this.prompt('Qual a cidade do cliente? ')
                let uf = (await this.prompt('Qual a UF do cliente? ')).toUpperCase();
                let telefone = await this.prompt('Qual o telefone do cliente? ')
                let nascimento = await this.prompt('Qual a data de nascimento do cliente? ')

                await this.cliente.inserirCliente(nome, cpf, endereco, numero_residencial, bairro, cidade, uf, telefone, nascimento)

                return this.clienteMenu()

            case '3':

                let exibirPorCpf = await this.prompt('Qual o CPF do cliente que deseja o ID? ')

                console.log(await this.cliente.exibirID(exibirPorCpf))

                return this.clienteMenu()

            case '4':

                let procurarPorCpf = await this.prompt('Qual o cpf do cliente que deseja procurar? ')

                await this.cliente.buscarInformacoes(procurarPorCpf)

                return this.clienteMenu()

            case '5':
                let atualizarPorCpf = await this.prompt('Qual o cpf do cliente que deseja atualizar? ')

                console.log(`

 Escolha o campo que deseja atualizar:

 1 - nome
 2 - cpf
 3 - endereco
 4 - numero_residencial
 5 - bairro
 6 - cidade
 7 - uf
 8 - telefone
 9 - nascimento
`);

                let coluna = await this.prompt("O que deseja atualizar? ")
                let registro = await this.prompt("Para o que desejar atualizar? ")

                await this.cliente.atualizarCliente(atualizarPorCpf, coluna, registro)

                return this.clienteMenu()

            case '6':
                let getCpf = await this.prompt('Qual o cpf do cliente que deseja deletar? ')

                await this.cliente.deletarCliente(getCpf)

                return this.clienteMenu()

            default:
                console.log("Opção inválida! Tente novamente.");

                return this.clienteMenu()
        }
    }
}