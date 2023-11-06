import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxiosAuth from "./useAxiosAuth";
import { IUser } from "@/interfaces/IUser";

export const useUser = (userId?: string) => {
  const http = useAxiosAuth();
  const queryClient = useQueryClient();

  const getUser = async (): Promise<IUser> => {
    const { data } = await http.get(`/users/${userId}`);
    return data;
  };

  const createUser = async (newUser: Partial<IUser>): Promise<IUser> => {
    const { data } = await http.post("/users/create", newUser);
    return data;
  };

  const updateUser = async (user: Partial<IUser>): Promise<IUser> => {
    const { data } = await http.post(`/users/update/${user.id}`, user);
    return data;
  };

  const deleteUser = async (id: string): Promise<void> => {
    await http.delete(`/users/${id}`);
  };

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<IUser, Error>("user", getUser);

  const mutationCreate = useMutation<IUser, Error, Partial<IUser>>(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("users");
    },
  });

  const { mutate: mutationUpdate, isLoading: isMutating } = useMutation<
    IUser,
    Error,
    IUser
  >(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("users");
    },
  });

  const mutationDelete = useMutation<void, Error, string>(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("users");
    },
  });

  return {
    user,
    isLoading: isLoading || isMutating,
    error,
    createUser: mutationCreate.mutate,
    updateUser: mutationUpdate,
    deleteUser: mutationDelete.mutate,
  };
};
