export interface IPlan {
  id: string;
  price: number;
  currency: string;
  tax_mode: string;
  name: string;
  description: string;
  billing_frequency: number;
  billing_interval: string;
  trial_frequency: null;
  trial_interval: null;
  quantity_minimum: number;
  quantity_maximum: number;
  product_id: string;
  createdAt: string;
  updatedAt: string;
  product: IProduct;
}

interface IProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  application_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubscription {
  id: string;
  customer_id: string;
  unique_identifier: string;
  status: string;
  paused_at: null;
  canceled_at: null;
  scheduled_change: null;
  next_billed_at: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
  applicationId: string;
  product: ISubscriptionProduct;
  price: ISubscriptionPrice;
}

interface ISubscriptionProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface ISubscriptionPrice {
  id: string;
  name: string;
  description: string;
  product_id: string;
  billing_frequency: number;
  billing_interval: string;
  trial_frequency: number;
  trial_interval: string;
  currency: string;
  price: number;
}

export interface IManagementUrl {
  customerPortal: string;
  cancelSubscription: string;
  updatePaymentMethod: string;
}

export interface IProration {
  currencyCode: string;
  proratedCharge: number;
  creditAmount: number;
  subTotal: number;
  tax: number;
  discount: number;
  creditApplied: number;
  grandTotal: number;
}

export interface IUpdatePlan {
  id: string;
  status: string;
}
