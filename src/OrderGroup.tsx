import React, { useEffect, useRef, useState } from 'react';

interface IContext {
  others: HTMLElement[];
}
export const OrderGroupContext = React.createContext<IContext>({
  others: [],
});

export const elementDataKey = 'orderableElement';

export default function OrderGroup({ children }: React.PropsWithChildren<any>) {
  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const [value, setValue] = useState<IContext>({
    others: ref?.current?.childNodes
      ? Array.from(ref.current.childNodes).map((x) => x as HTMLElement)
      : [],
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
      <div ref={ref}>{children}</div>
    </OrderGroupContext.Provider>
  );
}
