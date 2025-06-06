// src/app/models/user.model.ts
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  nr_matricol: string;
  // role: 'ADMIN' | 'USER' | 'EMPLOYEE'; // This might not be directly present from backend in JSON

  // Add authorities property to match backend's UserDetails serialization
  authorities?: { authority: string }[]; // Array of objects with an 'authority' string

  // Add other properties if you need them in the frontend (e.g., enabled, accountNonLocked)
  enabled?: boolean;
  accountNonLocked?: boolean;
  accountNonExpired?: boolean;
  credentialsNonExpired?: boolean;
}
