import { HTMLAttributes, ReactNode } from 'react'
import {
  Controller,
  UseFormRegisterReturn,
  useFormContext,
} from 'react-hook-form'
import Select, { Props as SelectProps } from 'react-select'
import InputMask from 'react-input-mask'
import Image from 'next/image'
import { Button } from './buttons.component'
import { FiTrash } from 'react-icons/fi'

import FileInput from './Input/FileInput'
import { IFile } from '@/interfaces/IFile'

interface MaskedInputProps extends HTMLAttributes<HTMLDivElement> {
  register: UseFormRegisterReturn
  mask: string
}

interface SelectInputProps extends SelectProps<any> {
  name: string
  options?: { value: string; label: string }[]
}

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface ControllerProps extends HTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn
  type: string
}

interface FileInputProps extends HTMLAttributes<HTMLInputElement> {
  name: string
  multiple?: boolean
  accept?: string
}

interface TextAreaControllerProps extends HTMLAttributes<HTMLTextAreaElement> {
  register: UseFormRegisterReturn
}
interface ImagePreviewProps extends HTMLAttributes<HTMLDivElement> {
  files: IFile[]
  onDelete: (id: string) => void
}

export const Input = {
  Root: ({ className, children }: DivProps) => (
    <div className={className}>{children}</div>
  ),

  Label: ({ className, children }: DivProps) => (
    <div className={className}>{children}</div>
  ),

  Error: ({ className, children }: DivProps) => (
    <div className={className}>{children}</div>
  ),

  Icon: ({ className, children }: DivProps) => (
    <div className={className}>{children}</div>
  ),

  Controller: ({ register, type, className }: ControllerProps) => (
    <input
      className={`w-full border-2 border-gray-200 rounded-md p-2 focus:border-white ${className}`}
      type={type}
      {...register}
    />
  ),

  TextAreaController: ({
    register,
    className,
    ...rest
  }: TextAreaControllerProps) => (
    <textarea
      className={`w-full border-2 border-gray-200 rounded-md p-2 focus:border-white ${className}`}
      rows={3}
      {...register}
      {...rest}
    />
  ),

  MaskedController: ({ register, mask, className }: MaskedInputProps) => {
    return (
      <InputMask
        mask={mask}
        className={`w-full border-2 border-gray-200 rounded-md p-2 focus:border-white ${className}`}
        {...register}
      />
    )
  },

  SelectController: ({ name, options, className }: SelectInputProps) => {
    const { control } = useFormContext()
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name, ref } }) => {
          const activeValueInOptions = options?.find(item => item.value === value)
          return (
            <Select
              ref={ref}
              styles={{ control: () => ({ display: 'flex', border: 'none' }), }}
              name={name}
              options={options}
              value={activeValueInOptions}
              onChange={(val) => onChange(val?.value)}
              className={`w-full border-2 border-gray-200 rounded-md py-[2px] focus:border-white ${className}`}
            />
          )
        }
        }
      />
    )
  },

  FileController: ({ name, multiple }: FileInputProps) => {
    const { control } = useFormContext()
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, onChange } }) => (
          <FileInput
            ref={ref}
            multiple={multiple}
            onFileChange={(files) => onChange(files)}
          />
        )}
      />
    )
  },
  ImagesPreview: ({ className, files, onDelete }: ImagePreviewProps) => {
    return (
      <div className={`w-full ${className}`}>
        {files.map((file, index) => (
          <div key={index} className="relative inline-block">
            <Button
              onClick={() => {
                onDelete(file.id)
              }}
            >
              <FiTrash size={24} className="text-red-600" />
            </Button>
            {file.uri && (
              <Image
                src={file.uri}
                alt={`Image ${index + 1}`}
                className="rounded-md mr-2"
                width={200}
                height={200}
              />
            )}
          </div>
        ))}
      </div>
    )
  },
}
