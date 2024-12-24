import React, { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input:React.FC<InputProps> = ({ className, ...props}) => {
  return <input {...props} className={`p-2 rounded-md bg-gray-950 ${className}`}/>
}

export default Input