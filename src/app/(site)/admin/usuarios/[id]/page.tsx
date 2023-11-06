"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/components/inputs.component";
import { useRouter } from "next/navigation";
import { useCities } from "@/hooks/useCities";
import { useUser } from "@/hooks/useUser";
import { useUsers } from "@/hooks/useUsers";
import { cpfIsComplete, cpfIsValid } from "@/lib/cpf-validator";
import { DEFAULT_ROLES } from "@/constants/defaultRoles";
import { UserSelectTable } from "@/app/components/UserSelectTable.component";
import { useQuery } from "react-query";
import { http } from "@/lib/http-common";
import Loading from "@/app/components/loading.component";
import { Button } from "@/components/ui/button";

interface EditPageProps {
  params: { id: string };
}

// Define the zod schema
const userSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  state: z.string(),
  city: z.string(),
  clients: z.array(z.object({ id: z.string() })),
  cpf: z
    .string()
    .refine(cpfIsComplete, {
      message: "CPF está incompleto",
    })
    .refine(cpfIsValid, {
      message: "CPF Inválido",
    }),
  role: z.enum(["ADMIN", "CLIENT", "TECHNICIAN", "USER"]),
});

type UpdateUserFormData = z.infer<typeof userSchema>;

export default function EditPage({ params }: EditPageProps) {
  const {
    user,
    isLoading: isLoadingUpdate,
    error,
    updateUser,
  } = useUser(params.id);
  const { fetchUsers } = useUsers();
  const router = useRouter();
  const page = 1; // Set your page dynamically

  const [isLoading, setIsLoading] = useState(false);

  const {
    isLoading: isLoadingUsers,
    isError,
    error: errorUsers,
    data: users,
  } = useQuery(["users", { page, role: "CLIENT" }], fetchUsers, {
    keepPreviousData: true, // Keep old data for smoother pagination transitions
  });

  const methods = useForm<UpdateUserFormData>({
    resolver: zodResolver(userSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = methods;

  const selectedState = watch("state");
  const { cities, states, filterCities } = useCities(selectedState);

  useEffect(() => {
    if (selectedState) {
      filterCities();
    }
  }, [selectedState, filterCities]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      if (user.cpf) setValue("cpf", user.cpf);
      if (user.state) setValue("state", user.state);
      if (user.city) setValue("city", user.city);
      if (user.phone) setValue("phone", user.phone);
      if (user.state) setValue("state", user.state);
      if (user.city) setValue("city", user.city);
      if (user.clients) setValue("clients", user.clients);
      setValue("role", user.role);
    }
  }, [user, states, cities, params, setValue]);

  if (error) return <div>An error has occurred: {error.message}</div>;

  const onSubmit = async (data: UpdateUserFormData) => {
    setIsLoading(true);
    if (data.name && user?.id) {
      // updateUser({ id: user.id, ...data });

      http
        .post(`/users/update/${user.id}`, data)
        .then((response) => {
          console.log(response.data);
        })
        .finally(() => {
          setIsLoading(false);
          router.push("/admin/usuarios");
        });
    }
  };

  const handleChangeSelectedRows = (data: string[]) => {
    const mappedData = data.map((data) => ({ id: data }));
    setValue("clients", mappedData);
  };

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Usuário</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row flex-wrap">
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Nome:</Input.Label>
              <Input.Controller register={register("name")} type="text" />
              <Input.Error>
                {errors.name && <p>{errors.name.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>E-mail:</Input.Label>
              <Input.Controller register={register("email")} type="email" />
              <Input.Error>
                {errors.email && <p>{errors.email.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>

            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Telefone:</Input.Label>
              <Input.MaskedController
                register={register("phone")}
                mask="(99) 99999-9999"
              />
              <Input.Error>
                {errors.phone && <p>{errors.phone.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>CPF:</Input.Label>
              <Input.MaskedController
                register={register("cpf")}
                mask="999.999.999-99"
              />
              <Input.Error>
                {errors.cpf && <p>{errors.cpf.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Estado:</Input.Label>
              <Input.SelectController name="state" options={states} />
              <Input.Error>
                {errors.state && <p>{errors.state.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Cidade:</Input.Label>
              <Input.SelectController name="city" options={cities} />
              <Input.Error>
                {errors.city && <p>{errors.city.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Tipo de usuário:</Input.Label>
              <Input.SelectController name="role" options={DEFAULT_ROLES} />
              <Input.Error>
                {errors.role && <p>{errors.role.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
          </div>
          {user?.role === "TECHNICIAN" && users && (
            <Input.Root className="flex-1 w-full p-3">
              <Input.Label>
                Selecione os clientes atendidos por este técnico:
              </Input.Label>
              {!isLoadingUsers && (
                <UserSelectTable
                  data={users}
                  columns={["select", "name", "email", "state", "city"]}
                  onChangeSelectRow={handleChangeSelectedRows}
                  selectedRows={getValues("clients")}
                />
              )}
            </Input.Root>
          )}
          <div className="py-3 hover:cursor-pointer">
            {isLoading ? (
              <Loading></Loading>
            ) : (
              <Button
                className="bg-blue-500 w-32 text-white "
                variant={"default"}
                type="submit"
              >
                Salvar
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
