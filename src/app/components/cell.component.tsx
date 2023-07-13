import { HTMLAttributes, ReactNode } from 'react'

interface CellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Cell = {
  Root: ({ className, children }: CellProps) => (
    <div className={className}>{children}</div>
  ),
  Label: ({ className, children }: CellProps) => (
    <div className={className}>{children}</div>
  ),
  Error: ({ className, children }: CellProps) => (
    <div className={className}>{children}</div>
  ),
  Icon: ({ className, children }: CellProps) => (
    <div className={className}>{children}</div>
  ),
  Text: ({ className, children }: CellProps) => (
    <div className={className}>{children}</div>
  ),
}
