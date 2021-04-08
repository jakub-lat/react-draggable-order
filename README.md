# React Draggable Order

Component for custom orderable list

## Basic usage

```jsx
import { OrderGroup, OrderItem, defaultTheme } from 'react-draggable-order';

// in your component

<OrderGroup {...defaultTheme.group}>
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
```

**See full usage [here](https://github.com/piratehacker/react-draggable-order/tree/master/example)**

