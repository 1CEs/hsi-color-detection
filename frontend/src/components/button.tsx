import React, { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
    return <button
        {...props}
        className={`p-2 border-none rounded-lg bg-primary transition duration-100
                    font-bold ${className} hover:bg-secondary active:bg-primary`}>
        {children}
    </button>
}

export default Button