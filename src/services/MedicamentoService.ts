import { Medicamento } from "../entity/Medicamento";
import { IMedicamento } from "../interfaces/IMedicamento";
import { MedicamentoRepository } from "../repository/MedicamentoRepository";

export class MedicamentoService implements IMedicamento {

    private repo: MedicamentoRepository
    id: number
    nome: string
    embalagem: string
    saldo: number
    validade: Date

    constructor() {
        this.repo = new MedicamentoRepository

    }

    public async listarMedicamentos(): Promise<Medicamento[]> {
        return await this.repo.listarMedicamentos()
    }

    public async verificaRetorno(nome): Promise<Boolean> {

        let lista: Medicamento[] = await this.repo.verificaRetorno(nome)
        return lista.length > 0
    }

    public async exibirID(nome: string): Promise<number[] | void> {

        if (!nome.trim()) {
            console.log('Informe o nome do cliente. ')
            return
        }
        let id = await this.repo.exibirID(nome)
        console.log(id)
        return id

    }

    public async inserirMedicamento(nome: string, embalagem: string, saldo: number, validadeStr: string) {

        if (!nome.trim()) {
            console.log('Informe o nome do medicamento. ')
            return
        }

        if (!embalagem.trim()) {
            console.log('As informações sobre a embalagem não podem ser deixadas vazias. ')
            return
        }
        if (typeof saldo !== "number" || isNaN(saldo)) {
            console.log('O saldo não pode estar vazio e/ou deve ser um número válido.');
            return;
        }

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(validadeStr)) {
            console.log('Data de nascimento inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        const [dia, mes, ano] = validadeStr.split('/');
        const validadeFormatado = `${ano}-${mes}-${dia}`;

        const validade = new Date(validadeFormatado);

        if (isNaN(validade.getTime())) {
            console.log('Data de validade inválida. Certifique-se de que a data inserida é válida.');
            return;
        }
        const hoje = new Date();
        const doisMesesDepois = new Date(hoje.getFullYear(), hoje.getMonth() + 2, hoje.getDate());

        if (validade < doisMesesDepois) {
            console.log('O medicamento deve ter pelo menos 2 meses antes do vencimento.');
            return;
        }
        await this.repo.inserirMedicamento(nome, embalagem, saldo, validade)
        console.log('Medicamento inserido com sucesso! ')
    }

    public async buscarInformacoes(nome: string) {

        if (!nome.trim()) {
            console.log('Informe o nome do medicamento. ')
            return
        }

        const nomeExiste = await this.verificaRetorno(nome)

        if (!nomeExiste) {
            console.log(`O medicamento informado não está cadastrado.`)
            return
        } else {
            console.table(await this.repo.buscarInformacoes(nome))
        }
    }

    public async atualizarMedicamento(nome: string, coluna: string, registro: any): Promise<void> {

        const colunaValida = ['nome', 'embalagem', 'saldo', 'validade']

        const nomeExiste = await this.verificaRetorno(nome)

        if (!nomeExiste) {
            console.log(`O medicamento informado não está cadastrado.`)
            return
        } else {

            if (!colunaValida.includes(coluna)) {
                console.log("Coluna inválida ou não permitida!");
                return
            } else
                switch (coluna) {
                    case 'nome':
                        if (!registro.trim()) {
                            console.log('Informe o nome do medicamento. ')
                            return
                        }
                        break

                    case 'embalagem':
                        if (!registro.trim()) {
                            console.log('As informações sobre a embalagem não podem ser deixadas vazias. ')
                            return
                        }
                        break

                    case 'saldo':

                        const saldoConvertido = Number(registro)
                        if (typeof saldoConvertido !== "number" || isNaN(saldoConvertido)) {
                            console.log('O saldo não pode estar vazio e/ou deve ser um número válido.');
                            return;
                        }
                        break

                    case 'validade':
                        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(registro)) {
                            console.log('Data de nascimento inválida. Use o formato DD/MM/AAAA.');
                            return;
                        }

                        const [dia, mes, ano] = registro.split('/');
                        const validadeFormatado = `${ano}-${mes}-${dia}`;

                        const validade = new Date(validadeFormatado);

                        if (isNaN(validade.getTime())) {
                            console.log('Data de validade inválida. Certifique-se de que a data inserida é válida.');
                            return;
                        }
                        const hoje = new Date();
                        const doisMesesDepois = new Date(hoje.getFullYear(), hoje.getMonth() + 2, hoje.getDate());

                        if (validade < doisMesesDepois) {
                            console.log('O medicamento deve ter pelo menos 2 meses antes do vencimento.');
                            return;
                        }
                        break
                }
        }
        await this.repo.atualizarMedicamento(nome, coluna, registro)
        console.log('Medicamento atualizado com sucesso')
    }

    public async deletarMedicamento(nome: string): Promise<void> {

        if (!nome.trim()) {
            console.log('O nome não pode ser deixado vazio. ')
            return
        }

        const nomeExiste = await this.verificaRetorno(nome)

        if (!nomeExiste) {
            console.log(`O medicamento informado não está cadastrado.`);
        } else {
            await this.repo.deletarMedicamento(nome);
            console.log('Medicamento deletado com sucesso!')
        }
    }
}