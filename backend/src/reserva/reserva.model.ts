import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { PlanoTarifacao } from '../plano-tarifacao/plano-tarifacao.model';
import { Usuario } from '../usuario/usuario.model';
import { Vaga } from '../vaga/vaga.model';

@Table
export class Reserva extends Model<Reserva> {
  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  data_reserva: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  data_fim: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  valor: number;

  @Column({
    type: DataType.ENUM('ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'),
    allowNull: false,
    defaultValue: 'ATIVA',
  })
  status: string;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_usuario: number;

  @ForeignKey(() => Vaga)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_vaga: number;

  @ForeignKey(() => PlanoTarifacao)
  @Column({ type: DataType.INTEGER, allowNull: true })
  id_plano: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;

  @BelongsTo(() => Vaga)
  vaga: Vaga;

  @BelongsTo(() => PlanoTarifacao)
  plano: PlanoTarifacao;
}
