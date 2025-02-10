import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Estacionamento } from '../estacionamento/estacionamento.model';
import { Reserva } from '../reserva/reserva.model';

@Table({
  timestamps: true, // Adicionando suporte para timestamps (createdAt e updatedAt)
})
export class Vaga extends Model<Vaga> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  numero: number;

  @ForeignKey(() => Estacionamento)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_estacionamento: number;

  @BelongsTo(() => Estacionamento)
  estacionamento: Estacionamento;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['disponivel', 'ocupada']], // Validação para o status da vaga
    },
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['carro', 'moto']], // Validação para o tipo da vaga
    },
  })
  tipo: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false, // Definindo o valor padrão como false
  })
  reservada: boolean;

  @ForeignKey(() => Reserva) // Relacionamento com Reserva
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  id_reserva: number;

  @BelongsTo(() => Reserva)
  reserva: Reserva;
}
