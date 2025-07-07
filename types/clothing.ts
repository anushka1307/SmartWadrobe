export type ClothingItem = {
    id: string;
    name: string;
    category: 'top' | 'bottom' | 'shoes' | 'accessory';
    imageUri: string;
    color?: string;
    tags?: string[];
  };
  