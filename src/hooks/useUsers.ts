import {
  QueryFunctionContext,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import useAxiosAuth from "./useAxiosAuth";
import { IUser } from "@/interfaces/IUser";

interface QueryParams {
  name?: string;
  email?: string;
  role?: string;
}

export const useUsers = () => {
  const http = useAxiosAuth();
  const queryClient = useQueryClient();

  const getUsers = async (): Promise<IUser[]> => {
    const { data } = await http.post("/users");
    return data;
  };

  async function fetchUsers({
    queryKey,
  }: QueryFunctionContext<["users", QueryParams]>) {
    const [_key, { name, email, role }] = queryKey;
    const { data } = await http.post<any>("/users", {
      name,
      email,
      role,
    });
    return data;
  }

  const createUser = async (newUser: Partial<IUser>): Promise<IUser> => {
    const { data } = await http.post("/users/create", newUser);
    return data;
  };

  const updateUser = async (user: IUser): Promise<IUser> => {
    const { data } = await http.post(`/users/update/${user.id}`, user);
    return data;
  };

  const deleteUser = async (id: string): Promise<void> => {
    await http.delete(`/users/${id}`);
  };

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<IUser[], Error>("users", getUsers);

  const mutationCreate = useMutation<IUser, Error, Partial<IUser>>(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  const mutationUpdate = useMutation<IUser, Error, IUser>(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  const mutationDelete = useMutation<void, Error, string>(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser: mutationCreate.mutate,
    updateUser: mutationUpdate.mutate,
    deleteUser: mutationDelete.mutate,
  };
};
