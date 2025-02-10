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
export class Operacao extends Model<Operacao> {
  @Column({
    type: DataType.STRING(255), // Ajuste para refletir o tipo do campo "descricao"
    allowNull: false,
  })
  descricao: string;

  @Column({
    type: DataType.DATE, // Usar DataType.DATE para garantir compatibilidade com TIMESTAMP no Sequelize
    allowNull: false,
    defaultValue: DataType.NOW, // Definir o valor default como a data e hora atuais
  })
  data_hora: Date;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_usuario: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;
}
