import { format, isValid } from "date-fns";

export const formatDate = (dateString: string) => {
  const parsedDate = new Date(dateString);
  return format(parsedDate, "dd/MM/yyyy");
};

export const isValidDateTime = (dateTimeString: string) => {
  const parsedDate = new Date(dateTimeString);
  const regex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
  return isValid(parsedDate) && regex.test(dateTimeString);
};
