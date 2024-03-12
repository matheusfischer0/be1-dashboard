import { useQuery } from "react-query";
import useAxiosAuth from "./useAxiosAuth"; // Ajuste o caminho conforme necessário

// Definindo a nova interface para os dados de assistência mensais
interface IMonthlyAssistanceData {
  status: string;
  month: string;
  count: number;
}

export const useMonthlyAssistanceData = () => {
  const http = useAxiosAuth();

  const getMonthlyAssistanceData = async (): Promise<
    IMonthlyAssistanceData[]
  > => {
    const { data } = await http.post("/assistances/monthly/counters"); // Ajuste a URL conforme necessário
    return data;
  };

  // Utilizando useQuery do React Query para buscar os dados
  const {
    data: monthlyAssistanceData,
    isLoading,
    error,
    refetch: refetchMonthlyAssistanceData,
  } = useQuery<IMonthlyAssistanceData[], Error>(
    "monthlyAssistanceData", // Uma chave única para a query
    getMonthlyAssistanceData // A função que busca os dados
  );

  return {
    monthlyAssistanceData,
    isLoading,
    error,
    refetchMonthlyAssistanceData,
  };
};
