import { Pool } from "pg"
import { Medicamento } from "../entity/Medicamento.ts"
import { Database } from "./Database"

export class MedicamentoRepository {

    private pool: Pool

    constructor() {
        this.pool = Database.iniciarConexao()
    }

    public async listarMedicamentos(): Promise<Medicamento[]> {

        const query = 'SELECT * FROM pi.medicamentos ORDER BY id ASC'
        const result = await this.pool.query(query)

        const listaMedicamento: Medicamento[] = []

        for (const row of result.rows) {
            const medicamento = new Medicamento(row.id, row.nome, row.embalagem, row.saldo, row.validade)
            listaMedicamento.push(medicamento)
        }
        return listaMedicamento
    }

    public async entradaMedicamento(nome: string, quantidade: number) {
        const query = `UPDATE pi.medicamentos SET saldo = saldo + $1 WHERE nome ilike $2`
        const result = await this.pool.query(query,[quantidade, nome])
    }

    public async verificaRetorno(nome) {
        let query = 'SELECT * FROM pi.medicamentos WHERE nome = $1'
        const busca = await this.pool.query(query, [nome])

        const lista: Medicamento[] = []
        for (const row of busca.rows) {
            const medicamento = new Medicamento(row.id, row.nome, row.embalagem, row.saldo, row.validade)
            lista.push(medicamento)
        }
        return lista
    }

    public async verificaSaldo(nome) {
        let query = 'SELECT m.saldo FROM pi.medicamentos m WHERE nome = $1'
        const saldo = await this.pool.query(query, [nome])

        let lista: number[] = []
        for (const row of saldo.rows) {
            lista.push(row.saldo)
        }
        return lista
    }

    public async exibirID(nome: string): Promise<number[]> {
        const query = 'SELECT id FROM pi.medicamentos WHERE nome ilike $1'
        const id = await this.pool.query(query, [nome])

        let lista: number[] = []
        for (const row of id.rows) {
            lista.push(row.id)
        }
        return lista
    }

    public async inserirMedicamento(nome: string, embalagem: string, saldo: number, validade: Date) {
        let query = 'INSERT INTO pi.medicamentos (nome, embalagem, saldo, validade) VALUES ($1, $2, $3, $4)'
        await this.pool.query(query, [nome, embalagem, saldo, validade])
    }

    public async buscarInformacoes(nome: string): Promise<Medicamento[] | null> {
        let query = 'SELECT * FROM pi.medicamentos WHERE nome = $1'
        const busca = await this.pool.query(query, [nome])

        const lista: Medicamento[] = []
        for (const row of busca.rows) {
            const medicamento = new Medicamento(row.id, row.nome, row.embalagem, row.saldo, row.validade)
            lista.push(medicamento)
        }
        return lista
    }

    public async atualizarMedicamento(nome: string, coluna: string, registro: string): Promise<void> {
        const query = `UPDATE pi.medicamentos SET ${coluna} = $1 WHERE nome = $2`
        const result = await this.pool.query(query, [registro, nome])
    }

    public async deletarMedicamento(nome: string) {
        let query = 'DELETE FROM pi.medicamentos WHERE nome = $1'
        const result = await this.pool.query(query, [nome])
        return result
    }
}

