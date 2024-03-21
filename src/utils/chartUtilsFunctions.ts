export const statusBorderColors: Record<string, string> = {
  CREATED: "border border-cyan-700", // Azul para "Criado", indicando um início fresco
  ANALYSING: "border border-yellow-400", // Amarelo mais claro para "Analisando", para melhor contraste
  PENDING: "border border-orange-600", // Laranja mais escuro para "Pendente", indicando espera/atenção
  PROCESSING: "border border-indigo-700", // Azul claro para "Em processamento", sugerindo progresso
  FINISHED: "border border-green-600", // Verde escuro para "Finalizado", indicando conclusão bem-sucedida
  CLOSED: "border border-gray-800", // Cinza escuro para "Fechado", neutro e final
};

export const textStatusColors: Record<string, string> = {
  CREATED: "text-cyan-700",
  ANALYSING: "text-yellow-500",
  PENDING: "text-orange-600",
  PROCESSING: "text-indigo-700",
  FINISHED: "text-green-700",
  CLOSED: "text-gray-800",
};

export const textStatusPortugueseColors: Record<string, string> = {
  Criado: "text-cyan-700",
  "Em análise": "text-yellow-500",
  Pendente: "text-orange-600",
  "Em andamento": "text-indigo-700",
  Finalizado: "text-green-700",
  Fechado: "text-gray-800",
};

export const statusColorMap: { [key: string]: string } = {
  Criado: "rgb(14, 116, 144)",
  "Em análise": "rgb(253, 224, 71)",
  Pendente: "rgb(234, 88, 12)",
  "Em andamento": "rgb(67, 56, 202)",
  Finalizado: "rgb(22, 163, 74)",
  Fechado: "rgb(55, 65, 81)",
};

export const getTextStatusColor = (status: string) => {
  return textStatusColors[status] || "rgb(55, 65, 81)"; // Cor padrão se o status não estiver mapeado
};

export const getBorderStatusColor = (status: string) => {
  return statusBorderColors[status] || "rgb(201, 203, 207)"; // Cor padrão se o status não estiver mapeado
};

export const getBorderTranslatedColor = (status: string) => {
  return statusColorMap[status] || "rgb(201, 203, 207)"; // Cor padrão se o status não estiver mapeado
};

export const getBackgroundColor = (status: string, opacity = 0.5) => {
  const color = getBorderTranslatedColor(status).match(/\d+/g);
  return color
    ? `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
    : `rgba(201, 203, 207, ${opacity})`;
};
