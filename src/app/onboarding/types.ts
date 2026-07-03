export type AdminSetup = {
  name: string;
  email: string;
  password: string;
};

export type GymSetup = {
  name: string;
  address: string;
  phone: string;
};

export type BrandSetup = {
  primary: string;
  secondary: string;
  background: string;
};

export type MachineSetup = {
  id: string;
  name: string;
  category: string;
  selected: boolean;
  imagePreview?: string;
  imageName?: string;
  imageFile?: File;
};
