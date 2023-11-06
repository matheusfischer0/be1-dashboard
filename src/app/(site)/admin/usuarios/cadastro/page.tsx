"use client";

import React, { useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/components/inputs.component";
import { useRouter } from "next/navigation";
import { useCities } from "@/hooks/useCities";
import { cpfIsComplete, cpfIsValid } from "@/lib/cpf-validator";
import { DEFAULT_ROLES } from "@/constants/defaultRoles";

interface RegisterPageProps {
  params: {};
}

// Define the zod schema
const userSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  state: z.string(),
  city: z.string(),
  cpf: z
    .string()
    .refine(cpfIsComplete, {
      message: "CPF está incompleto",
    })
    .refine(cpfIsValid, {
      message: "CPF Inválido",
    }),
  role: z.enum(["ADMIN", "CLIENT", "TECHNICIAN", "USER"]),
  password: z.string(),
});

type CreateUserFormData = z.infer<typeof userSchema>;

export default function RegisterPage({ params }: RegisterPageProps) {
  const { createUser, error } = useUsers();

  const router = useRouter();

  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(userSchema),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const selectedState = useWatch({ control, name: "state" });

  const { cities, states, filterCities } = useCities(selectedState);

  useEffect(() => {
    if (selectedState) {
      filterCities();
    }
  }, [selectedState, filterCities]);

  const onSubmit = (data: CreateUserFormData) => {
    if (data.name) {
      createUser(data); // You will need to adjust the createUser function to handle FormData
    }
    router.push("/admin/usuarios");
  };

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Cadastrar Usuário</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col flex-wrap gap-3">
            <Input.Root className="flex-1">
              <Input.Label>Nome:</Input.Label>
              <Input.Controller
                className="w-full max-w-2xl"
                register={register("name")}
                type="text"
              />
              <Input.Error>
                {errors.name && <p>{errors.name.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="flex-1">
              <Input.Label>E-mail:</Input.Label>
              <Input.Controller
                className="w-full max-w-2xl"
                register={register("email")}
                type="email"
              />
              <Input.Error>
                {errors.email && <p>{errors.email.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="flex-1">
              <Input.Label>Telefone:</Input.Label>
              <Input.MaskedController
                className="w-full max-w-2xl"
                register={register("phone")}
                mask="(99) 99999-9999"
              />
              <Input.Error>
                {errors.phone && <p>{errors.phone.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="flex-1">
              <Input.Label>CPF:</Input.Label>
              <Input.MaskedController
                className="w-full max-w-2xl"
                register={register("cpf")}
                mask="999.999.999-99"
              />
              <Input.Error>
                {errors.cpf && <p>{errors.cpf.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root>
              <Input.Label>Estado:</Input.Label>
              <Input.SelectController
                name="state"
                options={states}
                className="w-full max-w-2xl"
              />
              <Input.Error>
                {errors.state && <p>{errors.state.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root>
              <Input.Label>Cidade:</Input.Label>
              <Input.SelectController
                name="city"
                options={cities}
                className="w-full max-w-2xl"
              />
              <Input.Error>
                {errors.city && <p>{errors.city.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root>
              <Input.Label>Tipo de usuário:</Input.Label>
              <Input.SelectController name="role" options={DEFAULT_ROLES} />
              <Input.Error>
                {errors.role && <p>{errors.role.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>

            <Input.Root className="flex-1">
              <Input.Label>Senha:</Input.Label>
              <Input.Controller
                className="w-full max-w-2xl"
                register={register("password")}
                type="password"
                aria-autocomplete="list"
              />
              <Input.Error>
                {errors.password && (
                  <p>{errors.password.message?.toString()}</p>
                )}
              </Input.Error>
            </Input.Root>
          </div>

          <div className="py-3">
            <button
              className="w-36 bg-blue-500 rounded-md p-3 text-white"
              type="submit"
            >
              Salvar
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
