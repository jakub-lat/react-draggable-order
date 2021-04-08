# React Draggable Order

Component for custom orderable list

## Demo

Take a look [here](https://piratehacker.github.io/react-draggable-order) for a working demo.

## Basic usage

```jsx
import { OrderGroup, OrderItem, defaultTheme } from 'react-draggable-order';

// in your component

<OrderGroup {...defaultTheme.group}>
  {list.map((x, i) => (
    <OrderItem key={i}
               index={i}
               onMove={(to) => setList(arrayMove(list, i, to))}
               {...defaultTheme.item}>
      <OrderItem.Handle {...defaultTheme.handle}>
        grab me
      </OrderItem.Handle>
      <div {...defaultTheme.content}>
        {x}
      </div>
    </OrderItem>
  ))}
</OrderGroup>
```

## How to style

[React component](https://github.com/piratehacker/react-draggable-order/blob/master/example/Customized.tsx)

[Example CSS](https://github.com/piratehacker/react-draggable-order/blob/master/example/customStyle.css)

## Advanced usage (using useOrder hook)

[See here](https://github.com/piratehacker/react-draggable-order/tree/master/example)

## Full example code

[See here](https://github.com/piratehacker/react-draggable-order/tree/master/example)
