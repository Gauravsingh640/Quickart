const products = [

  // ================= APPLE MOBILES =================

  {
    id: 1,

    title: "iPhone 15 Pro",

    category: "mobile",

    brand: "Apple",

    price: 129999,

    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569",

    images: [

      "https://images.unsplash.com/photo-1695048133142-1a20484d2569",

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",

      "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    ],

    description:
      "The iPhone 15 Pro features Apple’s powerful A17 Pro chip, a premium titanium body, and an advanced triple-camera system for professional photography and cinematic video recording. It delivers exceptional battery life, smooth gaming performance, USB-C connectivity, Dynamic Island, and a stunning Super Retina XDR display with ProMotion technology.",
  },

  {
    id: 2,

    title: "iPhone 14",

    category: "mobile",

    brand: "Apple",

    price: 89999,

    image:
      "https://images.unsplash.com/photo-1603899122579-0f4df6c6b3b2",

    images: [

      "https://images.unsplash.com/photo-1603899122579-0f4df6c6b3b2",

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

      "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    ],

    description:
      "iPhone 14 comes with a powerful A15 Bionic chip, excellent dual cameras, crash detection, and long-lasting battery performance. The OLED display provides vibrant colors and sharp visuals, making it ideal for gaming, photography, video streaming, and everyday premium smartphone usage.",
  },

  {
    id: 3,

    title: "iPhone 13",

    category: "mobile",

    brand: "Apple",

    price: 69999,

    image:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5",

    images: [

      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5",

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
    ],

    description:
      "The iPhone 13 delivers powerful performance with the A15 Bionic chip, advanced dual cameras, cinematic mode, and all-day battery life. Its sleek design, durable Ceramic Shield, and vibrant Super Retina display make it one of the best smartphones for photography and entertainment.",
  },

  // ================= SAMSUNG =================

  {
    id: 4,

    title: "Samsung S24 Ultra",

    category: "mobile",

    brand: "Samsung",

    price: 99999,

    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",

    images: [

      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",

      "https://images.unsplash.com/photo-1580910051074-3eb694886505",

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    ],

    description:
      "Samsung Galaxy S24 Ultra features a stunning AMOLED display, flagship Snapdragon processor, S-Pen support, and an incredible 200MP camera system. Built for productivity, gaming, and professional photography, it offers premium performance with AI-powered features and excellent battery backup.",
  },

  {
    id: 5,

    title: "Samsung S23",

    category: "mobile",

    brand: "Samsung",

    price: 79999,

    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",

    images: [

      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

      "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    ],

    description:
      "The Samsung Galaxy S23 offers flagship-level speed, excellent cameras, premium build quality, and smooth AMOLED visuals. It is designed for users who want powerful performance, long battery life, and professional-grade photography in a compact premium smartphone.",
  },

  {
    id: 6,

    title: "Samsung A54",

    category: "mobile",

    brand: "Samsung",

    price: 35999,

    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505",

    images: [

      "https://images.unsplash.com/photo-1580910051074-3eb694886505",

      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    ],

    description:
      "Samsung Galaxy A54 combines stylish design, smooth 120Hz display, reliable performance, and impressive cameras. It is perfect for daily use, gaming, social media, and content consumption while maintaining excellent battery life and Samsung software experience.",
  },

  // ================= ONEPLUS =================

  {
    id: 7,

    title: "OnePlus 12",

    category: "mobile",

    brand: "OnePlus",

    price: 69999,

    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",

    images: [

      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

      "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    ],

    description:
      "OnePlus 12 provides ultra-fast performance, premium design, smooth OxygenOS experience, and flagship-level cameras. With a powerful Snapdragon chipset, fast charging support, and immersive display, it is built for power users and mobile gamers.",
  },

  {
    id: 8,

    title: "OnePlus 11R",

    category: "mobile",

    brand: "OnePlus",

    price: 45999,

    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

    images: [

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",

      "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    ],

    description:
      "OnePlus 11R combines smooth performance, elegant design, fast charging, and a powerful processor for everyday multitasking and gaming. Its AMOLED display and premium camera setup make it a complete flagship-style smartphone experience.",
  },

  // ================= LAPTOPS =================

  {
    id: 9,

    title: "Macbook Air M2",

    category: "laptop",

    brand: "Apple",

    price: 89999,

    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",

    images: [

      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",

      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",

      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",
    ],

    description:
      "MacBook Air M2 delivers exceptional speed, silent performance, incredible battery life, and a lightweight premium design. Perfect for coding, editing, productivity, and students, it combines Apple’s efficient M2 chip with a stunning Retina display.",
  },

  {
    id: 10,

    title: "Macbook Pro M3",

    category: "laptop",

    brand: "Apple",

    price: 169999,

    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",

    images: [

      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",

      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",

      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",
    ],

    description:
      "MacBook Pro M3 is built for professionals who need top-tier performance for video editing, development, 3D rendering, and creative workflows. It offers incredible power efficiency, advanced cooling, and one of the best laptop displays available.",
  },

  {
    id: 11,

    title: "Macbook Air M1",

    category: "laptop",

    brand: "Apple",

    price: 74999,

    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",

    images: [

      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",

      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",

      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    ],

    description:
      "MacBook Air M1 offers excellent performance, long battery life, and smooth multitasking with Apple’s M1 chip. It is lightweight, powerful, and ideal for students, programmers, designers, and office productivity tasks.",
  },

  // ================= HEADPHONES =================

  {
    id: 16,

    title: "Sony WH-1000XM5",

    category: "headphone",

    brand: "Sony",

    price: 29999,

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",

    images: [

      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",

      "https://images.unsplash.com/photo-1484704849700-f032a568e944",

      "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
    ],

    description:
      "Sony WH-1000XM5 delivers industry-leading noise cancellation, crystal-clear sound quality, premium comfort, and exceptional battery life. Perfect for music lovers, travel, gaming, and professional audio experiences.",
  },

  {
    id: 18,

    title: "Boat Rockerz 550",

    category: "headphone",

    brand: "Boat",

    price: 2499,

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",

    images: [

      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",

      "https://images.unsplash.com/photo-1484704849700-f032a568e944",

      "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
    ],

    description:
      "Boat Rockerz 550 provides powerful bass, stylish design, long battery backup, and comfortable ear cushions. Ideal for casual listening, gaming, online classes, and daily entertainment with wireless connectivity support.",
  },
];

export default products;