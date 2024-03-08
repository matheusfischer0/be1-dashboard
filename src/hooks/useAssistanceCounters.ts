import { useQuery } from "react-query";
import useAxiosAuth from "./useAxiosAuth";
import { IAssistanceCounter } from "@/dtos/IAssistanceCounter";

export const useAssistanceCounters = () => {
  const http = useAxiosAuth();

  const getAssistanceCounters = async (): Promise<IAssistanceCounter> => {
    const { data } = await http.post("/assistances/counters");
    return data;
  };

  const {
    data: assistanceCounters,
    isLoading,
    error,
    refetch: refetchAssistanceCounters,
  } = useQuery<IAssistanceCounter, Error>(
    "assistanceCounters",
    getAssistanceCounters
  );

  return {
    assistanceCounters,
    isLoading,
    error,
    refetchAssistanceCounters,
  };
};
