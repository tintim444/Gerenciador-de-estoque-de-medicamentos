import { Pool } from "pg"
import { Database } from "./Database"
import { Cliente } from "../entity/Cliente"
import { ClienteMenu } from "../view/CLienteView"

export class ClienteRepository {

    private pool: Pool

    constructor() {
        this.pool = Database.iniciarConexao()
    }

    public async listarClientes(): Promise<Cliente[]> {

        const query = "SELECT * FROM pi.clientes"
        const result = await this.pool.query(query)

        const listaClientes: Cliente[] = []

        for (const row of result.rows) {
            const cliente = new Cliente(row.id, row.nome, row.cpf, row.endereco, row.numero_residencial, row.bairro, row.cidade, row.uf, row.telefone, row.nascimento)
            listaClientes.push(cliente)
        }
        return listaClientes
    }

    public async inserirCliente(nome: string, cpf: string, endereco: string, numero_residencial: string, bairro: string, cidade: string, uf: string, telefone: string, nascimento: Date) {
        let query = 'INSERT INTO pi.clientes (nome, cpf, endereco, numero_residencial, bairro, cidade, uf, telefone, nascimento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
        await this.pool.query(query, [nome, cpf, endereco, numero_residencial, bairro, cidade, uf, telefone, nascimento])
    }

    public async exibirID(nome: string): Promise<number[]> {
        const query = 'SELECT id FROM pi.clientes WHERE nome ilike $1'
        const id = await this.pool.query(query, [nome])

        let lista: number[] = []
        for (const row of id.rows) {
            lista.push(row.id)
        }
        return lista
    }

    public async buscarInformacoes(id: number): Promise<Cliente[]> {
        let query = 'SELECT * FROM pi.clientes WHERE id = $1'
        const busca = await this.pool.query(query, [id])

        const lista: Cliente[] = []
        for (const row of busca.rows) {
            const cliente = new Cliente(row.id, row.nome, row.cpf, row.endereco, row.numero_residencial, row.bairro, row.cidade, row.uf, row.telefone, row.nascimento)
            lista.push(cliente)
        }
        return lista
    }

    public async atualizarCliente(id: number, coluna: string, registro: string): Promise<void> {
        const query = `UPDATE pi.clientes SET ${coluna} = $1 WHERE id = $2`
        const result = await this.pool.query(query, [registro, id])
    }

    public async deletarCliente(id: number) {
        let query = 'DELETE FROM pi.clientes WHERE id = $1'
        const result = await this.pool.query(query, [id])
        return result
    }
}
