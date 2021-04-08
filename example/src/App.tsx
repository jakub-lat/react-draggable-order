import React, { useState } from 'react';
import { defaultTheme, OrderGroup, OrderItem, arrayMove } from 'react-draggable-order';
import 'react-draggable-order/css/defaultTheme.css';
import './style.css';


function Basic() {
  const [list, setList] = useState(['first', 'second', 'third']);

  return (
    <OrderGroup {...defaultTheme.group} style={{width: '500px'}}>
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

function Customized() {
  const [list, setList] = useState(['#ee4343', '#6363f8', '#5cfa63']);

  return <OrderGroup className={'group'}>
    {list.map((x, i) => (
      <OrderItem key={i}
                 index={i}
                 onMove={(to) => setList(arrayMove(list, i, to))}
                 wrapperClassName={'wrapper'}
                 className={'item'}
                 hoverClassName={'hover'}
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

function App() {
  return <div>
    <h1>React draggable order example</h1>
    <h2>Basic</h2>
    <Basic />
    <h2>Customized</h2>
    <Customized />
  </div>;
}

export default App;
