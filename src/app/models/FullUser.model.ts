import { Authority } from "./Authority.model";

  
  export interface FullUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    nr_matricol: string;
    authorities: Authority[];
    enabled: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
  }