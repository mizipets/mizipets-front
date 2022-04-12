export class Address {
  street?: string;
  apartment?: string;
  zip?: number;
  city?: string;
  country?: string;
}

export class Preferences {
  lang?: string;
  darkMode?: boolean;
  notifications?: boolean;
  update?: boolean;
}

export class Shelter {
  name?: string;
}

export enum Roles {
  ADMIN = 'ADMIN',
  PRO = 'PRO'
}

export class UserModel {
  id?: number;
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  photoUrl?: string | null;
  address?: Address;
  preferences?: Preferences;
  shelter?: Shelter;
  role?: Roles;
  // createDate: Date;
  // closeDate: Date;
  // animals: Animal[];
  // favorites: Favorites[];
  // rooms: Room[];
}
