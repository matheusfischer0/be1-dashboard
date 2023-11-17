import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { IServiceOption } from "@/interfaces/IService";

interface EditableCellProps {
  row: {
    getValue: (columnName: string) => string;
    id: string;
    original: { id?: string };
  };
  onChangeRow: (serviceOption: IServiceOption) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ row, onChangeRow }) => {
  const [value, setValue] = useState(row.getValue("description"));

  const handleBlur = () => {
    onChangeRow && onChangeRow({ id: row.original.id, description: value });
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

export default EditableCell;
