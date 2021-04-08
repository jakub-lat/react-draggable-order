import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';

export interface OrderGroupConfig {
  /*
  over - to move an element, you need to drag it over another
  between - to move an element, you need to drag it between others
   */
  mode: 'over' | 'between';
}

interface IContext {
  others: HTMLElement[];
  hoveredIndex?: number;
  setHoveredIndex: (i: number | undefined) => void;
  config: OrderGroupConfig;
}

export const OrderGroupContext = React.createContext<IContext>({
  others: [],
  setHoveredIndex: () => null,
  config: {
    mode: 'between',
  },
});

export const elementDataKey = 'orderableElement';

export type Props = HTMLAttributes<HTMLDivElement> & OrderGroupConfig;

export default function OrderGroup({
  children,
  mode = 'between',
  ...props
}: React.PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const [value, setValue] = useState<IContext>({
    others: ref?.current?.childNodes
      ? Array.from(ref.current.childNodes).map((x) => x as HTMLElement)
      : [],
    setHoveredIndex: (i) => setValue((p) => ({ ...p, hoveredIndex: i })),
    config: {
      mode,
    },
  });

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      others: Array.from(ref?.current?.childNodes || [])
        .map((x) => x as HTMLElement)
        .filter((x) => !!x.dataset[elementDataKey]),
    }));
  }, [children]);

  return (
    <OrderGroupContext.Provider value={value}>
      <div ref={ref} {...props}>
        {children}
      </div>
    </OrderGroupContext.Provider>
  );
}
