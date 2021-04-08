import React from 'react';
import { OrderGroup, useOrder } from 'react-draggable-order';
import './style.css';

interface IProps {
  index: number;
  data: any;
  onMove: (i: number) => void;
}

function Container({ data, index, onMove }: IProps) {
  const elementRef = React.useRef<HTMLDivElement>();
  const wrapperRef = React.useRef<HTMLDivElement>();

  const { mouseDown, mouseMove, isGrabbing, elementStyle } = useOrder({
    elementRef,
    wrapperRef,
    index,
    onMove,
  });

  return (
    <div ref={wrapperRef} className={'item'}>
      <div
        ref={elementRef}
        style={{
          ...elementStyle,
          boxShadow: isGrabbing ? '0 0 15px 0px rgba(0,0,0,0.2)' : undefined,
        }}
        onMouseMove={mouseMove}
      >
        <div
          style={{
            height: '50px',
            backgroundColor: data,
          }}
        >
          <div
            onMouseDown={mouseDown}
            style={{
              height: '50px',
              width: '100px',
              backgroundColor: 'yellow',
              float: 'left',
              cursor: 'grab',
            }}
          >
            grab me
          </div>
          {data}
        </div>
      </div>
    </div>
  );
}

export function arrayMove<T>(base: T[], from: number, to: number): T[] {
  const arr = [...base];
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
}

function App() {
  const [list, setList] = React.useState(['#ff0000', '#292af8', '#49f119']);

  const sep = (i: number) => <hr className='my-2 condition-separator' key={`${i}_sep`} />;

  return (
    <div style={{ margin: '30px' }}>
      <OrderGroup>
        {list
          .map((x, i) => (
            <Container
              key={x}
              index={i}
              data={x}
              onMove={(to) => {
                setList(arrayMove(list, i, to));
              }}
            />
          ))
          .reduce<React.ReactNodeArray>(
            (acc, x, i) => (!acc ? [sep(i), x] : [...acc, sep(i), x]),
            null,
          )}
      </OrderGroup>
    </div>
  );
}

export default App;
