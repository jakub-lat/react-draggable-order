import '../../css/defaultTheme.css';
import { HTMLAttributes } from 'react';
import { IProps as OrderItemProps } from '../OrderItem';

export const item = {
  wrapperClassName: 'rdo-wrapper',
  className: 'rdo-item',
  hoverClassName: 'rdo-hover',
  grabbingClassName: 'rdo-item-grabbing',
} as OrderItemProps;

export const group = {
  className: 'rdo-group',
} as HTMLAttributes<HTMLDivElement>;

export const handle = {
  className: 'rdo-item-handle',
} as HTMLAttributes<HTMLDivElement>;

export const content = {
  className: 'rdo-item-content',
} as HTMLAttributes<HTMLDivElement>;
