import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Usuario } from '../usuario/usuario.model';

export const OPERACAO_TIPOS = [
  'RESERVA',
  'CANCELAMENTO',
  'PAGAMENTO',
  'VAGA',
  'ESTACIONAMENTO',
  'RELATORIO',
  'USUARIO',
  'SISTEMA',
] as const;

export const OPERACAO_RESULTADOS = ['SUCESSO', 'FALHA'] as const;

export type OperacaoTipo = (typeof OPERACAO_TIPOS)[number];
export type OperacaoResultado = (typeof OPERACAO_RESULTADOS)[number];

@Table
export class Operacao extends Model<Operacao> {
  @Column({
    type: DataType.ENUM(...OPERACAO_TIPOS),
    allowNull: false,
    defaultValue: 'SISTEMA',
  })
  tipo: OperacaoTipo;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  descricao: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  data_hora: Date;

  @Column({
    type: DataType.STRING(80),
    allowNull: true,
  })
  entidade: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  id_entidade: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  dados: Record<string, unknown>;

  @Column({
    type: DataType.ENUM(...OPERACAO_RESULTADOS),
    allowNull: false,
    defaultValue: 'SUCESSO',
  })
  resultado: OperacaoResultado;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_usuario: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;
}
