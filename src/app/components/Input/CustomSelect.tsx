import React from "react";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface OptionType {
  label: string;
  value: string;
}

interface CustomSelectProps {
  name: string;
  options: OptionType[];
  className?: string;
}

const CustomSelect = ({ name, options, className }: CustomSelectProps) => {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value, name, ref } }) => {
        const activeValueInOptions = options?.find(
          (item) => item.value === value
        );
        return (
          <Select
            ref={ref}
            styles={{
              control: () => ({
                display: "flex",
                border: "none",
                padding: 0,
              }),
            }}
            name={name}
            options={options}
            value={activeValueInOptions}
            onChange={(val) => onChange(val?.value)}
            className={twMerge(
              "w-full border border-gray-200 rounded-md py-0.5 px-2 focus:border-white text-black",
              className
            )}
          />
        );
      }}
    />
  );
};

export default CustomSelect;
