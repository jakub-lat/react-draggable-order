import '../../css/defaultTheme.css';
import { HTMLAttributes } from 'react';
import { IProps as OrderItemProps } from '../OrderItem';
import { Props as OrderGroupProps } from '../OrderGroup';

export const item = {
  wrapperClassName: 'rdo-wrapper',
  wrapperHoverClassName: 'rdo-hover',

  className: 'rdo-item',
  grabbingClassName: 'rdo-item-grabbing',
} as OrderItemProps;

export const group = {
  className: 'rdo-group',
  mode: 'between',
} as OrderGroupProps;

export const handle = {
  className: 'rdo-item-handle',
} as HTMLAttributes<HTMLDivElement>;

export const content = {
  className: 'rdo-item-content',
} as HTMLAttributes<HTMLDivElement>;
