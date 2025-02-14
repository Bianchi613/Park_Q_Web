import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Usuario } from '../usuario/usuario.model';
import { Vaga } from '../vaga/vaga.model';
import { PlanoTarifacao } from '../plano-tarifacao/plano-tarifacao.model';

@Table
export class Reserva extends Model<Reserva> {
  @Column({
    type: DataType.DATE,
    allowNull: true, // Não obrigatório
    defaultValue: DataType.NOW,
  })
  data_reserva: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true, // Não obrigatório
  })
  data_fim: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  valor: number;

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
