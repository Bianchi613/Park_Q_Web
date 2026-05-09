import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Notificacao,
  NOTIFICACAO_TIPOS,
  NotificacaoTipo,
} from './notificacao.model';
import {
  NotificacaoFilters,
  NotificacaoRepository,
} from './notificacao.repository';

export interface CriarNotificacaoInput {
  tipo?: NotificacaoTipo;
  titulo: string;
  mensagem: string;
  id_usuario: number;
  id_reserva?: number;
  chave?: string;
}

@Injectable()
export class NotificacaoService {
  constructor(private readonly notificacaoRepository: NotificacaoRepository) {}

  async criar(data: CriarNotificacaoInput): Promise<Notificacao> {
    this.validar(data);

    return this.notificacaoRepository.create({
      tipo: data.tipo ?? 'SISTEMA',
      titulo: data.titulo.trim(),
      mensagem: data.mensagem.trim(),
      id_usuario: data.id_usuario,
      id_reserva: data.id_reserva,
      chave: data.chave,
      lida: false,
      data_hora: new Date(),
    });
  }

  async criarSeNaoExistir(
    data: CriarNotificacaoInput,
  ): Promise<Notificacao | null> {
    if (data.chave) {
      const existing = await this.notificacaoRepository.findByChave(data.chave);
      if (existing) {
        return null;
      }
    }

    return this.criar(data);
  }

  async listar(filters: NotificacaoFilters = {}): Promise<Notificacao[]> {
    return this.notificacaoRepository.findAll(filters);
  }

  async listarPorUsuario(idUsuario: number): Promise<Notificacao[]> {
    return this.notificacaoRepository.findAll({ id_usuario: idUsuario });
  }

  async marcarComoLida(id: number): Promise<Notificacao> {
    return this.notificacaoRepository.marcarComoLida(id);
  }

  async marcarComoLidaAutorizada(
    id: number,
    usuario: { id: number; role: string },
  ): Promise<Notificacao> {
    const notificacao = await this.notificacaoRepository.findById(id);
    this.ensureOwnerOrAdmin(notificacao.id_usuario, usuario);
    return this.notificacaoRepository.marcarComoLida(id);
  }

  async marcarTodasComoLidas(idUsuario: number): Promise<{ message: string }> {
    await this.notificacaoRepository.marcarTodasComoLidas(idUsuario);
    return { message: 'Notificacoes marcadas como lidas.' };
  }

  async marcarTodasComoLidasAutorizada(
    idUsuario: number,
    usuario: { id: number; role: string },
  ): Promise<{ message: string }> {
    this.ensureOwnerOrAdmin(idUsuario, usuario);
    return this.marcarTodasComoLidas(idUsuario);
  }

  async remove(id: number): Promise<void> {
    return this.notificacaoRepository.remove(id);
  }

  async notificarCadastro(usuario: {
    id: number;
    nome?: string;
  }): Promise<Notificacao> {
    return this.criar({
      tipo: 'CADASTRO',
      titulo: 'Cadastro realizado',
      mensagem: `Ola${usuario.nome ? `, ${usuario.nome}` : ''}. Seu cadastro no ParkQ foi realizado com sucesso.`,
      id_usuario: usuario.id,
      chave: `cadastro:${usuario.id}`,
    });
  }

  async notificarReservaCriada(reserva: {
    id: number;
    id_usuario: number;
    id_vaga: number;
    data_fim?: Date;
  }): Promise<Notificacao> {
    return this.criar({
      tipo: 'RESERVA',
      titulo: 'Reserva confirmada',
      mensagem: `Sua reserva ${reserva.id} para a vaga ${reserva.id_vaga} foi confirmada.`,
      id_usuario: reserva.id_usuario,
      id_reserva: reserva.id,
      chave: `reserva-criada:${reserva.id}`,
    });
  }

  async notificarReservaCancelada(reserva: {
    id: number;
    id_usuario: number;
  }): Promise<Notificacao> {
    return this.criar({
      tipo: 'CANCELAMENTO',
      titulo: 'Reserva cancelada',
      mensagem: `Sua reserva ${reserva.id} foi cancelada.`,
      id_usuario: reserva.id_usuario,
      id_reserva: reserva.id,
      chave: `reserva-cancelada:${reserva.id}`,
    });
  }

  async notificarPagamentoConfirmado(data: {
    id_pagamento: number;
    id_reserva: number;
    id_usuario: number;
    valor_pago: number;
  }): Promise<Notificacao> {
    return this.criar({
      tipo: 'PAGAMENTO',
      titulo: 'Pagamento confirmado',
      mensagem: `Pagamento de R$ ${data.valor_pago.toFixed(2)} confirmado para a reserva ${data.id_reserva}.`,
      id_usuario: data.id_usuario,
      id_reserva: data.id_reserva,
      chave: `pagamento:${data.id_pagamento}`,
    });
  }

  async notificarReservaExpirando(reserva: {
    id: number;
    id_usuario: number;
    minutosRestantes: number;
  }): Promise<Notificacao | null> {
    return this.criarSeNaoExistir({
      tipo: 'EXPIRACAO',
      titulo: 'Reserva perto do fim',
      mensagem: `Sua reserva ${reserva.id} termina em aproximadamente ${reserva.minutosRestantes} minutos.`,
      id_usuario: reserva.id_usuario,
      id_reserva: reserva.id,
      chave: `reserva-expirando:${reserva.id}`,
    });
  }

  async notificarReservaExpirada(reserva: {
    id: number;
    id_usuario: number;
  }): Promise<Notificacao | null> {
    return this.criarSeNaoExistir({
      tipo: 'EXPIRACAO',
      titulo: 'Reserva expirada',
      mensagem: `Sua reserva ${reserva.id} expirou.`,
      id_usuario: reserva.id_usuario,
      id_reserva: reserva.id,
      chave: `reserva-expirada:${reserva.id}`,
    });
  }

  private validar(data: CriarNotificacaoInput): void {
    if (!data.id_usuario) {
      throw new BadRequestException('id_usuario e obrigatorio.');
    }

    if (!data.titulo?.trim()) {
      throw new BadRequestException('titulo e obrigatorio.');
    }

    if (!data.mensagem?.trim()) {
      throw new BadRequestException('mensagem e obrigatoria.');
    }

    if (data.tipo && !NOTIFICACAO_TIPOS.includes(data.tipo)) {
      throw new BadRequestException('tipo de notificacao invalido.');
    }
  }

  private ensureOwnerOrAdmin(
    idUsuario: number,
    usuario: { id: number; role: string },
  ): void {
    if (usuario?.role === 'ADMIN' || usuario?.id === idUsuario) {
      return;
    }

    throw new ForbiddenException('Acesso negado para estas notificacoes.');
  }
}
