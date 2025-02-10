import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Reserva } from '../reserva/reserva.model';

@Table
export class PlanoTarifacao extends Model<PlanoTarifacao> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descricao: string;

  @Column({
    type: DataType.DATE, // Usar DataType.DATE para o campo de data
    allowNull: false,
    defaultValue: DataType.NOW, // Definir data/hora padrão com o valor atual
  })
  data_vigencia: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  taxa_base: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  taxa_hora: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  taxa_diaria: number;

  @HasMany(() => Reserva)
  reservas: Reserva[];
}
