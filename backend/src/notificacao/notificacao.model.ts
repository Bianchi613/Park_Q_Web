import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Reserva } from '../reserva/reserva.model';
import { Usuario } from '../usuario/usuario.model';

export const NOTIFICACAO_TIPOS = [
  'CADASTRO',
  'RESERVA',
  'PAGAMENTO',
  'CANCELAMENTO',
  'EXPIRACAO',
  'SISTEMA',
] as const;

export type NotificacaoTipo = (typeof NOTIFICACAO_TIPOS)[number];

@Table
export class Notificacao extends Model<Notificacao> {
  @Column({
    type: DataType.ENUM(...NOTIFICACAO_TIPOS),
    allowNull: false,
    defaultValue: 'SISTEMA',
  })
  tipo: NotificacaoTipo;

  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  titulo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  mensagem: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  lida: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  data_hora: Date;

  @Column({
    type: DataType.STRING(120),
    allowNull: true,
    unique: true,
  })
  chave: string;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_usuario: number;

  @ForeignKey(() => Reserva)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  id_reserva: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;

  @BelongsTo(() => Reserva)
  reserva: Reserva;
}
