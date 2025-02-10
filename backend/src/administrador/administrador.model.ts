import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Usuario } from '../usuario/usuario.model';

@Table({ tableName: 'administradores' })
export class Administrador extends Model<Administrador> {
  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_usuario: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  cargo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  privilegios: string;
}
