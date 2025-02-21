import { MedicamentoService } from "../services/MedicamentoService"
import promptSync from "prompt-sync"

export class MedicamentoMenu {
    private medicamento: MedicamentoService
    private prompt: promptSync

    constructor() {
        this.medicamento = new MedicamentoService
        this.prompt = promptSync()
    }

    public async medicamentoMenu() {

        let opcao: string

        console.log("");
        console.log("Menu de medicamentos ");
        console.log("");
        console.log("Selecione a opção desejada ");
        console.log("");
        console.log("1 - Listar medicamentos ");
        console.log("2 - Cadastrar medicamentos ");
        console.log("3 - Buscar ID do medicamento ");
        console.log("4 - Buscar informações do medicamento ");
        console.log("5 - Atualizar medicamento ");
        console.log("6 - Deletar medicamento ")
        console.log("7 - Retornar ao menu principal ");
        console.log("");
        opcao = await this.prompt("Qual opção deseja? ")
        console.log("");

        switch (opcao) {
            case '1':
                console.table(await this.medicamento.listarMedicamentos())
                return this.medicamentoMenu()

            case '2':
                let nome = await this.prompt('Qual o nome do medicamento? ')
                let embalagem = await this.prompt('Qual as informações de embalagem do medicamento? ')
                let saldo = await this.prompt('Qual o saldo do medicamento? ')
                let validade = await this.prompt('Qual a data de validade do medicamento? ')
                await this.medicamento.inserirMedicamento(nome, embalagem, saldo, validade)
                console.log('Medicamento inserido com sucesso! ')
                return this.medicamentoMenu()

            case '3':
                let exibirPorNome = await this.prompt('Qual o nome do medicamento que deseja procurar? ')
                console.log(await this.medicamento.exibirID(exibirPorNome))
                return this.medicamentoMenu()

            case '4':
                let procurarPorNome = await this.prompt('Qual o nome do medicamento que deseja procurar? ')
                let procurarPorID = await this.medicamento.exibirID(procurarPorNome)
                console.table(await this.medicamento.buscarInformacoes(procurarPorID[0]))
                return this.medicamentoMenu()

            case '5':
                let atualizarPorNome = await this.prompt('Qual o nome do medicamento que deseja atualizar? ')
                let atualizarPorID = await this.medicamento.exibirID(atualizarPorNome)
                let coluna = await this.prompt("O que deseja atualizar? ")
                let registro = await this.prompt("Para o que desejar atualizar? ")
                await this.medicamento.atualizarMedicamento(atualizarPorID[0], coluna, registro)
                console.log('Medicamento atualizado com sucesso')
                return this.medicamentoMenu()

            case '6':
                let deletarPorNome = await this.prompt('Qual o nome do medicamento que deseja deletar? ')
                let deletarPorID = await this.medicamento.exibirID(deletarPorNome)
                await this.medicamento.deletarMedicamento(deletarPorID[0])
                console.log('Usuário deletado com sucesso! ')
                return this.medicamentoMenu()

            case '7':
                console.log("Você saiu do sistema!");
                break;

            default:
                console.log("Opção inválida! Tente novamente.");
                return this.medicamentoMenu()
        }
    }
}