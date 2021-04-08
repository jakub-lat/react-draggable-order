import React, { useState } from 'react';
import { defaultTheme, OrderGroup, OrderItem, arrayMove } from 'react-draggable-order';

export default function Basic() {
  const [list, setList] = useState(['first', 'second', 'third']);

  return (
    <OrderGroup {...defaultTheme.group} style={{width: '500px', maxWidth: '70vw'}}>
      {list.map((x, i) => (
        <OrderItem key={i}
                   index={i}
                   onMove={(to) => setList(arrayMove(list, i, to))}
                   {...defaultTheme.item}

        >
          <OrderItem.Handle {...defaultTheme.handle}>
            grab me
          </OrderItem.Handle>
          <div {...defaultTheme.content}>
            {x}
          </div>
        </OrderItem>
      ))}
    </OrderGroup>
  );
}
