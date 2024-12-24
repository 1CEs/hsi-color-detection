import React, { HTMLAttributes } from 'react'

type CardBodyProps = HTMLAttributes<HTMLDivElement>

const CardBody:React.FC<CardBodyProps> = ({ children,className, ...props}) => {
  return (
    <div {...props} className={`flex flex-col ${className}`}>
        { children }
    </div>
  )
}

export default CardBody