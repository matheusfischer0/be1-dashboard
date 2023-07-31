import { HTMLAttributes, ReactNode } from 'react'
import {
  Controller,
  UseFormRegisterReturn,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import Select, { Props as SelectProps } from 'react-select'
import InputMask from 'react-input-mask'
import Image from 'next/image'
import { Button } from './buttons.component'
import { FiTrash } from 'react-icons/fi'
import { RiPagesLine } from 'react-icons/ri'

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
      className={twMerge('w-full border-2 border-gray-200 rounded-md p-2 focus:border-white', className)}
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
      className={twMerge('w-full border-2 border-gray-200 rounded-md p-2 focus:border-white', className)}
      rows={3}
      {...register}
      {...rest}
    />
  ),

  MaskedController: ({ register, mask, className }: MaskedInputProps) => {
    return (
      <InputMask
        mask={mask}
        className={twMerge('w-full border-2 border-gray-200 rounded-md p-2 focus:border-white', className)}
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
              className={twMerge('w-full border-2 border-gray-200 rounded-md p-2 focus:border-white', className)}
            />
          )
        }
        }
      />
    )
  },

  FileController: ({ name, multiple, ...props }: FileInputProps) => {
    const { control } = useFormContext()
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, onChange } }) => (
          <FileInput
            ref={ref}
            onFileChange={(files) => onChange(files)}
            multiple={multiple}
            {...props}
          />
        )}
      />
    )
  },

  ImagesPreview: ({ className, files, onDelete }: ImagePreviewProps) => {
    return (
      <div className={twMerge('flex flex-wrap gap-x-4 gap-y-8 w-full mt-4', className)}>
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-center w-36 h-32 relative">
            <Button
              className='flex items-center justify-center absolute bottom-[-10px] right-[-5px] border border-zinc-100 bg-zinc-50 rounded-full h-auto p-2'
              onClick={() => {
                onDelete(file.id)
              }}
            >
              <FiTrash size={16} className="text-red-600" />
            </Button>
            {file.uri && (
              <Image
                src={file.uri}
                alt={`Image ${file.uri}`}
                className="rounded-xl shadow-md"
                width={144}
                height={128}
              />
            )}
          </div>
        ))}
      </div>
    )
  },
  FilesPreview: ({ className, files, onDelete }: ImagePreviewProps) => {
    return (
      <div className={twMerge('w-full mt-4', className)}>
        {files.map((file, index) => (
          <div key={index} className="flex items-center p-3 w-full relative rounded-xl border border-zinc-100 shadow-md">
            <Button
              className='flex items-center justify-center absolute bottom-[-5px] right-[-5px] border border-zinc-100 bg-zinc-50 rounded-full h-auto p-2'
              onClick={() => {
                onDelete(file.id)
              }}
            >
              <FiTrash size={16} className="text-red-600" />
            </Button>
            <div className="flex flex-row items-center">
              {file.uri && (
                <RiPagesLine size={36}
                  className="text-zinc-600"
                />
              )}
              {file.originalName && <span className='pl-2 text-xs'>
                {file.originalName}
              </span>}
            </div>
          </div>
        ))}
      </div>
    )
  },
}
