import { Cliente } from "../entity/Cliente";
import { ICliente } from "../interfaces/ICliente";
import { ClienteRepository } from "../repository/ClienteRepository";

export class ClienteService implements ICliente {
    private repo: ClienteRepository
    id: number
    nome: string
    cpf: string
    endereco: string
    numero_residencial: string
    bairro: string
    cidade: string
    uf: string
    telefone: string
    nascimento: Date

    constructor() {
        this.repo = new ClienteRepository
    }

    public async listarClientes(): Promise<Cliente[]> {
        return await this.repo.listarClientes()
    }

    public async verificaCpf(cpf): Promise<boolean> {

        if (!/^\d{11}$/.test(cpf)) {
            throw new Error("CPF inválido! Deve conter exatamente 11 dígitos numéricos.");
        }

        const lista: Cliente[] = await this.repo.verificaCpf(cpf);
        return lista.length > 0;
    }

    public async inserirCliente(nome: string, cpf: string, endereco: string, numero_residencial: string, bairro: string, cidade: string, uf: string, telefone: string, nascimentoStr: string) {

        const ufValida = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]

        if (!nome.trim()) {
            console.log('Informe o nome do cliente. ')
            return
        }
        const cpfExiste = await this.verificaCpf(cpf);
        if (cpfExiste) {
            throw new Error('O CPF informado já está cadastrado.');
        }
        if (!endereco.trim()) {
            console.log('Informe o endereço do cliente. ')
            return
        }
        if (!numero_residencial.trim()) {
            console.log('Informe o número residencial do cliente. ')
            return
        }
        if (!bairro.trim()) {
            console.log('Informe o bairro do cliente. ')
            return
        }
        if (!cidade.trim()) {
            console.log('Informe a cidade do cliente. ')
            return
        }
        if (uf.length !== 2 || !ufValida.includes(uf.toUpperCase())) {
            console.log("A sigla do estado (UF) deve ser informada e conter 2 caracteres.");
            return;
        }
        if (!/^\d{10,11}$/.test(telefone)) {
            console.log('O telefone deve ser informado e conter 10 ou 11 dígitos numéricos. ')
            return
        }
        if (!/^\d{4}\/\d{2}\/\d{2}$/.test(nascimentoStr)) {
            console.log('Data de nascimento inválida. Use o formato YYYY/MM/DD.');
            return;
        }

        const nascimento = new Date(nascimentoStr.replace(/\//g, '-'))

        if (isNaN(nascimento.getTime())) {
            console.log('Data de nascimento inválida. Certifique-se de que a data inserida é válida.');
            return;
        }

        const hoje = new Date();
        if (nascimento > hoje) {
            console.log('A data de nascimento não pode ser maior que a data de hoje.');
            return;
        }

        await this.repo.inserirCliente(nome, cpf, endereco, numero_residencial, bairro, cidade, uf, telefone, nascimento);
        console.log('Cliente inserido com sucesso! ');
    }


    public async buscarInformacoes(cpf: string) {

        const cpfExiste = await this.verificaCpf(cpf)

        if (!cpfExiste) {
            console.log(`O CPF informado não está cadastrado.`)
            return
        } else {
            console.table(await this.repo.buscarInformacoes(cpf))
        }
    }

    public async atualizarCliente(cpf: string, coluna: string, registro: string): Promise<void> {

        const colunaValida = ['nome', 'cpf', 'endereco', 'numero_residencial', 'bairro', 'cidade', 'uf', 'telefone', 'nascimento']
        const ufValida = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]

        if (!colunaValida.includes(coluna)) {
            console.log("Coluna inválida ou não permitida!");
            return
        }

        const cpfExiste = await this.verificaCpf(cpf);
        if (!cpfExiste) {
            return;
        } else {

            switch (coluna) {
                case 'nome':
                    if (!registro.trim()) {
                        console.log('O nome não pode ser deixado vazio. ')
                        return
                    }
                    break;

                case 'cpf':
                    const cpfExiste = await this.verificaCpf(registro);
                    if (cpfExiste) {
                        return;
                    }
                    break;

                case 'endereco':
                    if (!registro.trim()) {
                        console.log('O endereço é um campo obrigatório. ')
                        return
                    }
                    break;

                case 'numero_resisdencial':
                    if (!registro.trim()) {
                        console.log('O número residencial não pode ser deixado vazio. ')
                        return
                    }
                    break;

                case 'bairro':
                    if (!registro.trim()) {
                        console.log('O bairro é um campo obrigatório.')
                        return
                    }
                    break;

                case 'cidade':
                    if (!registro.trim()) {
                        console.log('A cidade inválida! Deve conter pelo menos 3 caracteres! ')
                        return
                    }
                    break;

                case 'uf':
                    if (registro.length !== 2 || !ufValida.includes(registro.toUpperCase())) {
                        console.log("A sigla do estado (UF) deve ser válida e conter 2 caracteres.");
                        return;
                    }
                    break;

                case 'telefone':
                    if (!/^\d{10,11}$/.test(registro)) {
                        console.log('O telefone deve conter 10 ou 11 dígitos numéricos. ')
                        return
                    }
                    break;

                case 'nascimento':
                    let dataNasc: Date;
                    if (typeof registro === 'string') {
                        const [dia, mes, ano] = registro.split('/');

                        dataNasc = new Date(`${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`);
                    } else if (Object.prototype.toString.call(registro) === '[object Date]') {
                        dataNasc = registro;
                    } else {
                        console.log('A data de nascimento é inválida.');
                        return;
                    }

                    if (isNaN(dataNasc.getTime())) {
                        console.log('A data de nascimento é inválida.');
                        return;
                    }

                    const dataHoje = new Date();
                    if (dataNasc > dataHoje) {
                        console.log('A data de nascimento não pode ser maior que a data de hoje.');
                        return;
                    }
            }
        }
        await this.repo.atualizarCliente(cpf, coluna, registro);
        console.log('Cliente atualizado com sucesso');
    }

    public async deletarCliente(cpf: string): Promise<void> {

        const cpfExiste = await this.verificaCpf(cpf)

        if (!cpfExiste) {
            return
        } else {
            await this.repo.deletarCliente(cpf)
            console.log('Cliente deletado com sucesso! ')
        }
    }
}
