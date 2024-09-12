export interface IOrderItem {
  _id: string;
  price: string;
}

export const paymentMethods = ['card', 'online'] as const;
export type paymentMethodsType = typeof paymentMethods[number]

export interface IOrder {
  payment: paymentMethodsType;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: [IOrderItem];
}
