import React, { HTMLAttributes, JSX } from 'react'
import { BiEdit, BiTrash } from 'react-icons/bi'

interface HeaderProps<T> {
  headers: string[]
  keys: (keyof T)[]
}

interface TableProps<T> {
  items: T[]
  headers: HeaderProps<T>
  actions?: ('edit' | 'delete')[]
  handleEdit?: (item: T) => void
  handleDelete?: (item: T) => void
}

function Table<T extends Record<string, any>>({
  items,
  headers: { headers, keys },
  actions,
  handleEdit,
  handleDelete,
}: TableProps<T>): JSX.Element {
  function handleClickOnAction(action: 'edit' | 'delete', item: T) {
    if (action === 'edit' && handleEdit) {
      return handleEdit(item)
    }
    if (action === 'delete' && handleDelete) {
      return handleDelete(item)
    }
  }

  return (
    <table className="w-full table-auto rounded-lg overflow-hidden shadow-md my-2 border">
      <thead className="bg-gradient-to-r from-blue-500 to-blue-400">
        <tr className="text-white">
          {headers.map((header, idx) => (
            <th className="px-4 py-2 text-left" key={idx}>
              <Cell value={header.toString()} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">
        {items.map((item, idx) => (
          <tr key={idx} className={`${idx % 2 === 1 ? 'bg-gray-100' : ''}`}>
            {keys.map((key, idx) => (
              <td className={`px-4 py-2`} key={idx}>
                <Cell value={item[key]} />
              </td>
            ))}
            <td className="px-4 py-2 flex-1 flex items-center justify-center">
              {actions?.map((action, idx) => (
                <Cell
                  key={idx}
                  value={action}
                  action={action}
                  onClick={() => {
                    handleClickOnAction(action, item)
                  }}
                />
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table

interface CellProps extends HTMLAttributes<HTMLButtonElement> {
  value: string | number
  action?: 'edit' | 'delete'
  onClick?: () => void
}

function Cell({ value, action, onClick, ...rest }: CellProps): JSX.Element {
  if (action === 'edit') {
    return (
      <button className="flex-1" onClick={onClick} {...rest}>
        <BiEdit className="text-zinc-700" size={24} />
      </button>
    )
  }

  if (action === 'delete') {
    return (
      <button className="flex-1 mx-2" onClick={onClick} {...rest}>
        <BiTrash className="text-red-500" size={24} />
      </button>
    )
  }

  return <div className="flex-1">{value}</div>
}
