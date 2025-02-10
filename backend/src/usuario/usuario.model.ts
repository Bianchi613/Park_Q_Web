import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Estacionamento } from '../estacionamento/estacionamento.model';
import { Operacao } from '../operacao/operacao.model';
import { Reserva } from '../reserva/reserva.model';

@Table
export class Usuario extends Model<Usuario> {
  @Column({
    type: DataType.STRING, // Alterado de BIGINT para STRING para aceitar CPF formatado ou não
    unique: true,
    allowNull: false,
  })
  CPF: string; // Mudado para string para aceitar CPF como texto (com ou sem formatação)

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nome: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  telefone: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  senha: string;

  @Column({
    type: DataType.ENUM('ADMIN', 'CLIENT', 'VISITOR'),
    allowNull: false,
    defaultValue: 'CLIENT',
  })
  role: string;

  @ForeignKey(() => Estacionamento)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  id_estacionamento: number;

  @BelongsTo(() => Estacionamento)
  estacionamento: Estacionamento;

  @HasMany(() => Reserva)
  reservas: Reserva[];

  @HasMany(() => Operacao)
  operacoes: Operacao[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: Usuario) {
    if (instance.senha) {
      instance.senha = await bcrypt.hash(instance.senha, 10);
    }
  }

  async comparePassword(senha: string): Promise<boolean> {
    return await bcrypt.compare(senha, this.senha);
  }
}
