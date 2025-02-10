import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Usuario } from '../usuario/usuario.model';

@Table
export class Cliente extends Model<Cliente> {
  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.BIGINT, // Alterado para BIGINT se o id_usuario for BIGINT
    allowNull: false,
  })
  id_usuario: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  data_registro: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true, // Se você não quiser permitir null, altere para `false`
  })
  preferencias: string;

  @BelongsTo(() => Usuario)
  usuario: Usuario;
}
