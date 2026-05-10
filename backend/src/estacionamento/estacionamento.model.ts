import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { PlanoTarifacao } from '../plano-tarifacao/plano-tarifacao.model';
import { Usuario } from '../usuario/usuario.model';
import { Vaga } from '../vaga/vaga.model';

@Table({
  timestamps: true,
})
export class Estacionamento extends Model<Estacionamento> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  nome: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  localizacao: string;

  @Column({
    type: DataType.DECIMAL(10, 7),
    allowNull: true,
  })
  latitude: number;

  @Column({
    type: DataType.DECIMAL(10, 7),
    allowNull: true,
  })
  longitude: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacidade: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vagas_disponiveis: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  categoria: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  imagemUrl: string;

  @HasMany(() => Usuario)
  usuarios: Usuario[];

  @HasMany(() => Vaga)
  vagas: Vaga[];

  @HasMany(() => PlanoTarifacao)
  planos: PlanoTarifacao[];
}
