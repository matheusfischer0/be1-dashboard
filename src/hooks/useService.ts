import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxiosAuth from "./useAxiosAuth";
import { IService } from "@/interfaces/IService";

export const useService = (serviceId: string) => {
  const http = useAxiosAuth();
  const queryClient = useQueryClient();

  const getService = async (id: string): Promise<IService> => {
    const { data } = await http.get(`/services/${serviceId}`);
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

  const deleteService = async (id: string): Promise<void> => {
    await http.delete(`/services/${id}`);
  };

  const {
    data: service,
    isLoading,
    error,
    refetch: refetchService,
    isRefetching,
  } = useQuery<IService, Error, IService, [string, string]>(
    ["service", serviceId],
    ({ queryKey }) => {
      return getService(queryKey[1]);
    }
  );

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

  return {
    service,
    isLoading: isLoading || isRefetching,
    error,
    refetchService,
    createService: mutationCreate.mutate,
    updateService: mutationUpdate.mutate,
    deleteService: mutationDelete.mutate,
  };
};
