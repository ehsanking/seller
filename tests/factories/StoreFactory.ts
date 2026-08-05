/**
 * Seller Enterprise Test Factories
 * Author: EHSANKiNG
 * Description: Strictly-typed model factories for Products, Orders, Users, Coupons, and Variants.
 */

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'manager';
  token: string;
}

export interface ProductAttributes {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  status: 'active' | 'draft' | 'out_of_stock';
}

export interface OrderAttributes {
  id: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  couponCode?: string;
}

export class StoreFactory {
  static createUser(overrides: Partial<UserAttributes> = {}): UserAttributes {
    const id = `usr_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      name: 'Ehsan King Customer',
      email: `customer_${id}@seller.io`,
      role: 'customer',
      token: `bearer_token_${id}`,
      ...overrides,
    };
  }

  static createAdmin(overrides: Partial<UserAttributes> = {}): UserAttributes {
    return this.createUser({
      name: 'Ehsan King Admin',
      email: 'admin@seller.io',
      role: 'admin',
      token: 'bearer_token_admin_secure',
      ...overrides,
    });
  }

  static createProduct(overrides: Partial<ProductAttributes> = {}): ProductAttributes {
    const id = `prod_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      name: 'Ehsan Signature Tech Hoodie',
      price: 89.99,
      compareAtPrice: 119.99,
      stock: 45,
      sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'active',
      ...overrides,
    };
  }

  static outOfStockProduct(overrides: Partial<ProductAttributes> = {}): ProductAttributes {
    return this.createProduct({
      stock: 0,
      status: 'out_of_stock',
      ...overrides,
    });
  }

  static createOrder(overrides: Partial<OrderAttributes> = {}): OrderAttributes {
    const id = `ord_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      userId: 'usr_sample_123',
      items: [
        { productId: 'prod_1', quantity: 2, price: 89.99 }
      ],
      total: 179.98,
      status: 'completed',
      ...overrides,
    };
  }
}
