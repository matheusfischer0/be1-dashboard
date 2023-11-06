export const DEFAULT_ROLES: Array<{ value: string; label: string }> = [
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "Padrão" },
  { value: "CLIENT", label: "Cliente" },
  { value: "TECHNICIAN", label: "Assistente" },
];

export const ENUM_ROLES = ["ADMIN", "CLIENT", "TECHNICIAN", "USER"];

export type IRole = "ADMIN" | "CLIENT" | "TECHNICIAN" | "USER";
