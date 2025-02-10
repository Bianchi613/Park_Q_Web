import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Reserva } from '../reserva/reserva.model';

@Table
export class Pagamento extends Model<Pagamento> {
  @ForeignKey(() => Reserva)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_reserva: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['cartao_credito', 'PIX', 'boleto']], // Validação para garantir que o campo contenha um dos valores
    },
  })
  metodo_pagamento: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  valor_pago: number;

  @Column({
    type: DataType.DATE, // Usar DataType.DATE para garantir compatibilidade com TIMESTAMP no Sequelize
    allowNull: false,
    defaultValue: DataType.NOW, // Definir o valor padrão para a data/hora atual
  })
  data_hora: Date;

  @BelongsTo(() => Reserva)
  reserva: Reserva;
}
