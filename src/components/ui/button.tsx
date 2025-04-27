import type React from "react"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ className = "", children, ...props }) => {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  )
}
