import { DEFAULT_ROLES } from "../constants/defaultRoles";
export const convertRoleToPortuguese = (role: string) => {
  const roleData = DEFAULT_ROLES.find((item) => item.value === role);
  return roleData?.label ? roleData?.label : "Não encontrado";
};
