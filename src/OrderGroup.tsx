import React, { useEffect, useState } from 'react';

interface IProps {}

interface IContext {
  others: HTMLElement[];
}
export const OrderGroupContext = React.createContext<IContext>({
  others: [],
});

export const elementDataKey = 'orderableElement';

export default function OrderGroup({ children }: React.PropsWithChildren<IProps>) {
  const ref = React.useRef<HTMLDivElement>();
  const [value, setValue] = useState<IContext>({
    others: ref?.current?.childNodes ? Array.from(ref.current.childNodes).map((x) => x as HTMLElement) : [],
  });

  useEffect(() => {
    setValue({
      ...value,
      get others() {
        return Array.from(ref.current.childNodes)
          .map((x) => x as HTMLElement)
          .filter((x) => !!x.dataset[elementDataKey]);
      },
    });
  }, [ref.current]);

  return (
    <OrderGroupContext.Provider value={value}>
      <div ref={ref}>{children}</div>
    </OrderGroupContext.Provider>
  );
}
