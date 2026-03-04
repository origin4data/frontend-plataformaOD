import { MetricaCard } from "./metricas";
export interface CardsEstatisticasProps {
  metricas: {
    totalLeads: MetricaCard;
    receitaPipeline: MetricaCard;
    totalClientes: MetricaCard;
    clientesAtivos: MetricaCard;
  }
}
