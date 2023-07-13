import {
  useState,
  ChangeEvent,
  DragEvent,
  HTMLAttributes,
  forwardRef,
} from 'react'

interface FileInputProps extends HTMLAttributes<HTMLInputElement> {
  onFileChange: (files: FileList) => void
  multiple?: boolean
  accept?: string
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onFileChange, multiple = false, accept, ...rest }, ref) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const files = e.dataTransfer.files
      onFileChange(files)
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const files = e.target.files
      if (files) {
        onFileChange(files)
      }
    }

    return (
      <div
        className={`p-4 border-2 border-gray-200 rounded-md
          ${isDragging ? 'bg-gray-100' : 'bg-white'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <label className="text-gray-600">
          Arraste os arquivos aqui ou
          <span className="ml-1 underline cursor-pointer">procure</span>
          <input
            ref={ref}
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            multiple={multiple}
            accept={accept}
            {...rest}
          />
        </label>
      </div>
    )
  },
)

FileInput.displayName = 'FileInput'

export default FileInput
