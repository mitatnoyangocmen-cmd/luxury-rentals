export interface GalleryItem {
  id: string;
  category: 'all' | 'terrace' | 'living' | 'bedroom' | 'amenity' | 'transit';
  title: string;
  description: string;
  imageUrl: string;
}

export interface Landmark {
  name: string;
  minutes: string;
  stops: number;
  line: string;
  description: string;
  icon: string;
  tag: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  country: string;
  date: string;
  avatar: string;
} /* MNG*/

export interface Amenity {
  name: string;
  category: 'relaxation' | 'tech' | 'culinary' | 'climate' | 'convenience';
  iconName: string;
  description: string;
}

export interface BookingEstimate {
  checkIn: string;
  checkOut: string;
  guests: number;
  addons: { [key: string]: boolean };
  nights: number;
  basePrice: number;
  addonPrice: number;
  totalPrice: number;
}
