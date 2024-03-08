// Mapeamento das cores de cada status, utilizando uma Record para garantir a tipagem
export const statusColors: Record<string, string> = {
  CREATED: "bg-red-500",
  ANALYSING: "bg-orange-500",
  PENDING: "bg-red-500",
  PROCESSING: "bg-yellow-500", // Assumindo que "Em andamento" seja amarelo
  FINISHED: "bg-green-500",
  CLOSED: "bg-black",
};
