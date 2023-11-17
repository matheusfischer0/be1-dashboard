import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxiosAuth from "./useAxiosAuth";
import { IService, IServiceOption } from "@/interfaces/IService";

export const useServices = () => {
  const http = useAxiosAuth();
  const queryClient = useQueryClient();

  const getServices = async (): Promise<IService[]> => {
    const { data } = await http.post("/services");
    return data;
  };

  const createService = async (
    newService: Partial<IService>
  ): Promise<IService> => {
    const { data } = await http.post("/services/create", newService);
    return data;
  };

  const updateService = async (service: IService): Promise<IService> => {
    const { data } = await http.post(`/services/update/${service.id}`, service);
    return data;
  };

  const deleteServiceOption = async (id: string): Promise<void> => {
    await http.delete(`/services/option/delete/${id}`);
  };

  const deleteService = async (id: string): Promise<void> => {
    await http.delete(`/services/${id}`);
  };

  const {
    data: services,
    isLoading,
    error,
    refetch: refetchServices,
    isRefetching,
  } = useQuery<IService[], Error>("services", getServices);

  const mutationCreate = useMutation<IService, Error, Partial<IService>>(
    createService,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("services");
      },
    }
  );

  const mutationUpdate = useMutation<IService, Error, IService>(updateService, {
    onSuccess: () => {
      queryClient.invalidateQueries("services");
    },
  });

  const mutationDelete = useMutation<void, Error, string>(deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries("services");
    },
  });

  const mutationDeleteOption = useMutation<void, Error, string>(
    deleteServiceOption,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("services");
      },
    }
  );

  return {
    services,
    isLoading: isLoading || isRefetching,
    error,
    refetchServices,
    createService: mutationCreate.mutate,
    updateService: mutationUpdate.mutate,
    deleteService: mutationDelete.mutate,
    deleteServiceOption: mutationDeleteOption.mutate,
  };
};
