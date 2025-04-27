import type React from "react"
import type { SelectHTMLAttributes } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  children: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({ className = "", children, ...props }) => {
  return (
    <select className={`select ${className}`} {...props}>
      {children}
    </select>
  )
}
