import React, { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

const Card:React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={`bg-gray-900 flex flex-col gap-y-4 rounded-xl p-4 ${className}`}>
        {children}
    </div>
  )
}

export default Card