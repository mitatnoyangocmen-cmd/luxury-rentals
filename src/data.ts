import { GalleryItem, Landmark, Review, Amenity } from './types';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'terrace-1',
    category: 'terrace',
    title: 'Rooftop Panoramic Terrace',
    description: 'Sip traditional Turkish coffee with a majestic 180° view of Istanbul skyline and the historic peninsula.',
    imageUrl: '/images/historic-loft/terrace.jpg'
  },
  {
    id: 'cinema',
    category: 'living',
    title: 'Grand Living & Cinema Salon',
    description: 'A 150m² light-filled parlor featuring a 4K home cinema projection system, cozy electric fireplace, and hand-woven kilims.',
    imageUrl: '/images/historic-loft/livingroom-cinema.JPG'
  },
    {
    id: 'bedroom-1',
    category: 'bedroom',
    title: 'Bright and Spacious Double Bedroom',
    description: 'A luxurious bedroom with a king-size bed, a private air conditioner, make up table,and custom lighting for a restful stay.',
    imageUrl: '/images/historic-loft/bedroom-1.jpg'
  },
  {
    id: 'bedroom-2',
    category: 'bedroom',
    title: 'Spacious King Bedroom with a Work Desk',
    description: 'A bright bedroom with a king-size bed, work station, and a cealing fan for a comfortable stay.',
    imageUrl: '/images/historic-loft/bedroom-2.JPG'
  },
    {
    id: 'bedroom-3',
    category: 'bedroom',
    title: 'Twin Bedroom with Vintage Charm',
    description: 'A cozy bedroom with two twin beds, a vintage wardrobe, and a cealing fan for a comfortable stay.',
    imageUrl: '/images/historic-loft/bedroom-3.JPG'
  },
  {
    id: 'bedroom-4',
    category: 'bedroom',
    title: 'Rooftop King Bedroom with a View and Hot Tub',
    description: 'A luxurious bedroom with a king-size bed, a private hot tub, a private air conditioning, and a panoramic view of the city from the rooftop.',
    imageUrl: '/images/historic-loft/bedroom-4_rooftop.JPG'
  },
  {
    id: 'Kitchen-1',
    category: 'living',
    title: 'A Fully Equipped Gourmet Kitchen',
    description: 'A modern kitchen with a gas stove, oven, refrigerator, and all the necessary utensils for a comfortable stay.',
    imageUrl: '/images/historic-loft/kitchen-1.png'
  },
   {
    id: 'Kitchen-2',
    category: 'living',
    title: 'A Fully Equipped Gourmet Kitchen',
    description: 'A modern kitchen with a gas stove, oven, refrigerator, and all the necessary utensils for a comfortable stay.',
    imageUrl: '/images/historic-loft/kitchen-2.jpg'
  },
   {
    id: 'Coffee-Corner',
    category: 'living',
    title: 'A Fully Equipped Gourmet Kitchen',
    description: 'A modern kitchen with a gas stove, oven, refrigerator, and all the necessary utensils for a comfortable stay.',
    imageUrl: '/images/historic-loft/coffee-corner.png'
  },
  {
    id: 'amenity-1',
    category: 'living',
    title: 'Laundry & Dryer & Ironing Station',
    description: 'A private laundry station with a full-size washing machine, dryer, and steam iron for your convenience.',
    imageUrl: '/images/historic-loft/laundry.JPG'
  },
  {
    id: 'characteristic-1',
    category: 'living',
    title: 'Every corner of the apartment is designed with a unique character and charm',
    description: 'You will have a unique experience in the fireplace corner with a cinema projector and a cozy sofa for a comfortable stay.',
    imageUrl: '/images/historic-loft/characteristic-1.JPG'
  },
  {
    id: 'characteristic-2',
    category: 'living',
    title: 'You will be amazed by the unique character and charm of every corner of the apartment.',
    description: 'It will be your home away from home welcoming you with every detail designed for your comfort and convenience.',
    imageUrl: '/images/historic-loft/characteristic-2.jpg'
  },
  {
    id: 'bathroom-1',
    category: 'living',
    title: 'A modern bathroom with all the essentials for a comfortable stay.',
    description: 'From towel to toiletries, ',
    imageUrl: '/images/historic-loft/bathroom-1.jpg'
  },
  {
    id: 'bathroom-2',
    category: 'living',
    title: 'A useful bathroom with everything you need.',
    description: 'Hygienic and clean, with ear buds, make up remover, and other toiletries for your convenience.',
    imageUrl: '/images/historic-loft/bathroom-2.jpg'
  },
  {
    id: 'bathroom-3',
    category: 'living',
    title: 'Everything you need in a bathroom for a comfortable stay.',
    description: 'From shampoo to conditioners and body locions, everything you need for a comfortable stay.',
    imageUrl: '/images/historic-loft/bathroom-3.png'
  },
  {
    id: 'transit-1',
    category: 'transit',
    title: '1',
    description: 'Our luxurious Mercedes-Benz Vito with customized starry sky ceiling, sound system, and soft drinks awaits your arrival.',
    imageUrl: '/images/vip/vip-exterior-1.jpeg'
  },
  {
    id: 'transit-2',
    category: 'transit',
    title: '2',
    description: 'Our luxurious Mercedes-Benz Vito with customized starry sky ceiling, sound system, and soft drinks awaits your arrival.',
    imageUrl: '/images/vip/vip-interior-2.jpeg'
  },
  {
    id: 'transit-3',
    category: 'transit',
    title: '3',
    description: 'Our luxurious Mercedes-Benz Vito with customized starry sky ceiling, sound system, and soft drinks awaits your arrival.',
    imageUrl: '/images/vip/vip-interior-3.jpeg'
  },
  {
    id: 'transit-4',
    category: 'transit',
    title: '4',
    description: 'Our luxurious Mercedes-Benz Vito with customized starry sky ceiling, sound system, and soft drinks awaits your arrival.',
    imageUrl: '/images/vip/vip-interior-4.jpeg'
  },
  {
    id: 'transit-5',
    category: 'transit',
    title: '5',
    description: 'Our luxurious Mercedes-Benz Vito with customized starry sky ceiling, sound system, and soft drinks awaits your arrival.',
    imageUrl: '/images/vip/vip-interior-5.jpeg'
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
    text: 'The private hot tub and 120-inch home theater projector were the kids absolute highlights. Direct tram T1 station Yusufpaşa is practically next door, making it super easy to explore. The host’s food recommendations were 10/10!',
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
    description: 'Private glass-enclosed deep hot tub inside the master suite with color-therapy ambient lighting.'
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
