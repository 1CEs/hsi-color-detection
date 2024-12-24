import React, { HTMLAttributes } from 'react'

type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const CardHeader:React.FC<CardHeaderProps> = ({ children, className, ...props}) => {
  return (
    <div {...props} className={`flex flex-col ${className}`}>
        { children }
    </div>
  )
}

export default CardHeader