import React, { MutableRefObject, useRef, useState } from 'react';
import { arrayMove, OrderGroup, useOrder } from 'react-draggable-order';

interface IProps {
  index: number;
  data: string;
  onMove: (to: number) => void;
}

function Item({ data, index, onMove }: IProps) {
  const elementRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
  const wrapperRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  const { mouseDown, mouseMove, touchStart, touchMove, isGrabbing, elementStyle } = useOrder({
    elementRef,
    wrapperRef,
    index,
    onMove,
    hoverClassName: 'hover',
  });

  return (
    <div ref={wrapperRef} className={'wrapper'}>
      <div
        ref={elementRef}
        className={'item' + (isGrabbing ? ' grabbing' : '')}
        style={{
          ...elementStyle,
          backgroundColor: data,
        }}
        onMouseMove={mouseMove}
        onTouchMove={touchMove}
      >
        <div className={'handle'} onMouseDown={mouseDown} onTouchStart={touchStart}>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24'
               stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8h16M4 16h16' />
          </svg>
        </div>
        <div className={'content'}>
          {data}
        </div>
      </div>
    </div>
  );
}

export default function Advanced() {
  const [list, setList] = useState(['#ee4343', '#6363f8', '#5cfa63']);

  return <OrderGroup>
    {list.map((x, i) =>
      <Item key={i} index={i} data={x} onMove={(to) => setList(arrayMove(list, i, to))} />,
    )}
  </OrderGroup>;
}