import React, { useState } from 'react';
import { OrderGroup, OrderItem, arrayMove } from 'react-draggable-order';
import './customStyle.css';

export default function MoveOver() {
  const [list, setList] = useState(['#ee4343', '#6363f8', '#5cfa63']);

  return <OrderGroup className={'group'} mode={'over'}>
    {list.map((x, i) => (
      <OrderItem key={i}
                 index={i}
                 onMove={(to) => setList(arrayMove(list, i, to))}
                 wrapperClassName={'wrapper'}
                 wrapperHoverStyle={{
                   boxShadow: '0 0 0 2px #333'
                 }}
                 className={'item'}
                 grabbingClassName={'grabbing'}
                 style={{ backgroundColor: x }}
      >
        <OrderItem.Handle className={'handle'}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </OrderItem.Handle>
        <div className={'content'}>
          {x}
        </div>
      </OrderItem>
    ))}
  </OrderGroup>;
}
