export interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  description: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  description?: string;
}