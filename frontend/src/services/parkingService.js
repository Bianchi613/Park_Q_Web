import { estacionamentosApi, vagasApi } from './api';

export const parkingService = {
  ...estacionamentosApi,
  vagas: vagasApi,
};
