import { GalleryItem, Landmark, Review, Amenity } from './types';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'terrace-1',
    category: 'terrace',
    title: 'Rooftop Panoramic Terrace',
    description: 'Sip traditional Turkish coffee with a majestic 180° view of Istanbul skyline and the historic peninsula.',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'living-1',
    category: 'living',
    title: 'Grand Living & Cinema Salon',
    description: 'A 150m² light-filled parlor featuring a 4K home cinema projection system, cozy electric fireplace, and hand-woven kilims.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'bedroom-1',
    category: 'bedroom',
    title: 'Orte Master Suite',
    description: 'A sumptuous master suite dressed in Egyptian cotton linens, featuring a private in-room glass jacuzzi and custom lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'bedroom-2',
    category: 'bedroom',
    title: 'Classic Family Quarters',
    description: 'Perfect for children or guests, with four hand-crafted wood frame beds, local vintage lamps, and private climate control.',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'living-2',
    category: 'living',
    title: 'Double Culinary Kitchen',
    description: 'Equipped with commercial-grade appliances, an Italian espresso machine, and a fully stocked marble spices bar.',
    imageUrl: 'https://images.unsplash.com/photo-1556912177-c54030639a8a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'amenity-1',
    category: 'amenity',
    title: 'Private Hot Tub Oasis',
    description: 'Indulge in a hot soak after a long day of sightseeing, located in our spa-inspired custom ceramic bathroom.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'transit-1',
    category: 'transit',
    title: 'VIP Airport Escort Service',
    description: 'Our luxurious Mercedes-Benz Vito with customized starry sky ceiling, sound system, and soft drinks awaits your arrival.',
    imageUrl: 'https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&q=80&w=1200'
  }
];

export const LANDMARKS: Landmark[] = [
  {
    name: 'Grand Bazaar',
    minutes: '8 mins',
    stops: 3,
    line: 'Tram T1 (Yusufpaşa)',
    description: 'One of the largest and oldest covered markets in the world, with over 4,000 shops selling spices, rugs, and gold.',
    icon: 'Store',
    tag: 'Culture & Shopping'
  },
  {
    name: 'Sultanahmet & Hagia Sophia',
    minutes: '12 mins',
    stops: 4,
    line: 'Tram T1 (Yusufpaşa)',
    description: 'The ancient heart of Byzantium. Visit the legendary Hagia Sophia mosque, Blue Mosque, and Basilica Cistern.',
    icon: 'Compass',
    tag: 'Historic Monuments'
  },
  {
    name: 'Karaköy & Galata Tower',
    minutes: '18 mins',
    stops: 6,
    line: 'Tram T1 (Yusufpaşa)',
    description: 'Trendy harbor district packed with artisan cafes, galleries, and the medieval stone Galata Tower.',
    icon: 'Tower',
    tag: 'Sightseeing & Cafes'
  },
  {
    name: 'Topkapı Palace',
    minutes: '14 mins',
    stops: 5,
    line: 'Tram T1 (Yusufpaşa)',
    description: 'The primary residence of the Ottoman Sultans for nearly 400 years, offering stunning Bosphorus viewpoints.',
    icon: 'Crown',
    tag: 'Palace Museum'
  },
  {
    name: 'Taksim Square & Istiklal Ave',
    minutes: '15 mins',
    stops: 2,
    line: 'Marmaray (Yenikapı) → M2',
    description: 'The vibrant heart of modern Istanbul, offering infinite boutiques, live street music, and local historic streetcars.',
    icon: 'MapPin',
    tag: 'Modern Center'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Sarah Jenkins',
    rating: 5,
    text: 'Absolutely perfect for our family of 8! The terrace views of the historic peninsula are breathtaking at night. The apartment is extremely spacious and quiet, and the VIP Mercedes Vito airport transfer was worth every penny. Will definitely return next year!',
    country: 'United Kingdom 🇬🇧',
    date: 'June 2026',
    avatar: 'SJ'
  },
  {
    id: 'rev-2',
    author: 'Ahmed Al-Rasheed',
    rating: 5,
    text: 'Far superior to booking multiple cramped hotel rooms. Having two full custom kitchens, deep laundry machines, and a huge central dining room allowed us to cook and relax together. Spotless, hotel-grade cleanliness throughout.',
    country: 'Saudi Arabia 🇸🇦',
    date: 'July 2026',
    avatar: 'AA'
  },
  {
    id: 'rev-3',
    author: 'Elena Moretti',
    rating: 5,
    text: 'The private jacuzzi and 120-inch home theater projector were the kids absolute highlights. Direct tram T1 station Yusufpaşa is practically next door, making it super easy to explore. The host’s food recommendations were 10/10!',
    country: 'Italy 🇮🇹',
    date: 'May 2026',
    avatar: 'EM'
  }
];

export const AMENITIES: Amenity[] = [
  {
    name: 'In-Room Hot Tub',
    category: 'relaxation',
    iconName: 'Bath',
    description: 'Private glass-enclosed deep jacuzzi tub inside the master suite with color-therapy ambient lighting.'
  },
  {
    name: 'Rooftop Panoramic Terrace',
    category: 'relaxation',
    iconName: 'Sunset',
    description: 'Elevated outdoor lounge overlooking the Blue Mosque, Galata Tower, and distant Bosphorus lines.'
  },
  {
    name: 'Home Cinema Theatre',
    category: 'tech',
    iconName: 'Tv',
    description: 'High-definition 120-inch dropdown screen paired with a premium surround sound system and streaming apps.'
  },
  {
    name: 'High-Speed Wi-Fi 6',
    category: 'tech',
    iconName: 'Wifi',
    description: 'Symmetric 200 Mbps network with full coverage, perfect for video conferencing, streaming, or remote work.'
  },
  {
    name: '2 Full Custom Kitchens',
    category: 'culinary',
    iconName: 'Utensils',
    description: 'Dual fully stocked culinary hubs featuring gas cooktops, refrigerators, and large prep marble islands.'
  },
  {
    name: 'Barista Espresso Station',
    category: 'culinary',
    iconName: 'Coffee',
    description: 'Top-tier coffee maker with fresh Turkish coffee packs, Italian espresso beans, and a selection of local teas.'
  },
  {
    name: 'Full Climate Control',
    category: 'climate',
    iconName: 'Wind',
    description: 'Three powerful modern AC units and custom central electric fireplace for comfortable multi-season stays.'
  },
  {
    name: 'Washer & Professional Iron',
    category: 'convenience',
    iconName: 'Shirt',
    description: 'Private full-size washing machine, clothes dryer, detergent, and steam-press iron in dedicated laundry closet.'
  },
  {
    name: 'Luxury Hotel Linens & Toiletries',
    category: 'convenience',
    iconName: 'Sparkles',
    description: 'Equipped with hypoallergenic feather duvets, cotton slippers, plush bathrobes, and local organic olive soaps.'
  }
];

export const FAQS = [
  {
    question: 'Where is the apartment located and how do we check in?',
    answer: 'The apartment is in the safe, family-friendly Fatih district in the historic center. We offer a seamless contactless self check-in system using a secure digital door code. Your unique code will be provided 24 hours prior to arrival, allowing flexible check-in at any hour of the night.'
  },
  {
    question: 'How does the VIP Airport Transfer service work?',
    answer: 'We provide an exclusive chauffeured Mercedes-Benz Vito (space for 10 people with bags) directly from Istanbul Airport (IST) or Sabiha Gökçen Airport (SAW). Our professional driver will meet you right outside the arrivals gate with a name sign, assist with luggage, and bring you directly to the apartment doorstep.'
  },
  {
    question: 'Is the terrace entirely private?',
    answer: 'Yes! The rooftop terrace is 100% private and reserved exclusively for you and your group. There are absolutely no shared areas in the apartment, giving you total peace, quiet, and security.'
  },
  {
    question: 'What is the bed layout for the 10 guests?',
    answer: 'The 150m² home features 4 private bedrooms. The layout consists of: Master Bedroom 1 (1 King Bed + private hot tub), Bedroom 2 (1 Queen Bed), Bedroom 3 (2 Twin Beds), and Bedroom 4 (1 Twin bunk bed + premium convertible sofa bed in the lounge), sleeping up to 10 guests comfortably with luxury linens.'
  },
  {
    question: 'What public transport is nearby?',
    answer: 'The Yusufpaşa Tram Station (T1 Line) is just a 2-minute walk away, providing direct access to the Grand Bazaar (8 mins), Sultanahmet (12 mins), and Karaköy/Galata (18 mins). The Yenikapı Marmaray & Metro Hub is a 5-minute walk, letting you reach Taksim, the Asian Side, and all other metro lines instantly.'
  },
  {
    question: 'What are the house rules?',
    answer: 'We maintain a highly pristine family atmosphere: strictly no smoking inside (allowed on the open rooftop terrace), no loud parties or massive external events, and no pets. Standard check-in is at 3:00 PM and check-out is at 11:00 AM, though we accommodate early luggage drop-off whenever possible!'
  }
];
