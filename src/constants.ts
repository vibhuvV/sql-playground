import customers from '@/assets/customers.json';
import products from '@/assets/products.json';

export const QUERIES = {
  customerAll: 'select * from customers;',
  productsAll: 'select * from products;',
  customerSome: 'select customerID, companyName, contactName, country from customers;',
};

export const DATA_LIST: Record<string, Record<string, string | number>[]> = {
  [QUERIES.customerAll]: customers,
  [QUERIES.productsAll]: products,
  [QUERIES.customerSome]: customers.map((customer) => {
    const { customerID, companyName, contactName, country } = customer;
    return { customerID, companyName, contactName, country };
  }),
};
