export interface Creative {
  id: string;
  emoji: string;
  name: string;
  role: string;
  niche: string;
  category: string;
  price: string;
  unit: string;
  rating: string;
  jobs: string;
  avail: string;
  bg: string;
}

export const allCreatives: Creative[] = [
  // 📸 Photography — Fashion Photographer
  { id: 'nour', emoji: '👩‍🎨', name: 'Nour Makram', role: 'Fashion & Editorial Photographer', niche: 'Fashion Photographer', category: '📸 Photography', price: 'from 2,000 EGP', unit: '/ half day', rating: '4.9', jobs: '127 jobs', avail: 'Available now', bg: 'from-[#2a2a2a] to-[#555]' },
  { id: 'yasmin-f', emoji: '📸', name: 'Yasmin Fathi', role: 'Fashion Photographer', niche: 'Fashion Photographer', category: '📸 Photography', price: 'from 2,500 EGP', unit: '/ half day', rating: '4.8', jobs: '94 jobs', avail: 'Available now', bg: 'from-[#3a1a2a] to-[#5a3a4a]' },
  { id: 'mariam-k', emoji: '🌟', name: 'Mariam Khaled', role: 'Editorial & Runway Photographer', niche: 'Fashion Photographer', category: '📸 Photography', price: 'from 3,000 EGP', unit: '/ day', rating: '5.0', jobs: '61 jobs', avail: 'Next week', bg: 'from-[#1a1a2a] to-[#3a3a5a]' },
  { id: 'ziad-m', emoji: '📷', name: 'Ziad Mostafa', role: 'High Fashion Photographer', niche: 'Fashion Photographer', category: '📸 Photography', price: 'from 3,500 EGP', unit: '/ day', rating: '4.7', jobs: '82 jobs', avail: 'Available now', bg: 'from-[#2a1a1a] to-[#4a2a2a]' },

  // 📸 Photography — Product Photographer
  { id: 'hana-s', emoji: '📦', name: 'Hana Samir', role: 'Product & Catalog Photographer', niche: 'Product Photographer', category: '📸 Photography', price: 'from 1,800 EGP', unit: '/ session', rating: '4.9', jobs: '156 jobs', avail: 'Available now', bg: 'from-[#1a2a1a] to-[#3a4a3a]' },
  { id: 'khaled-r', emoji: '🎯', name: 'Khaled Ramzy', role: 'Product Photographer', niche: 'Product Photographer', category: '📸 Photography', price: 'from 2,000 EGP', unit: '/ session', rating: '4.6', jobs: '73 jobs', avail: 'Available now', bg: 'from-[#2a2a1a] to-[#4a4a3a]' },
  { id: 'nada-h', emoji: '✨', name: 'Nada Hassan', role: 'Still Life & Product Photographer', niche: 'Product Photographer', category: '📸 Photography', price: 'from 2,200 EGP', unit: '/ half day', rating: '4.8', jobs: '88 jobs', avail: 'Next week', bg: 'from-[#1a1a3a] to-[#2a2a5a]' },

  // 📸 Photography — Food Photographer
  { id: 'amira-n', emoji: '🍽️', name: 'Amira Nabil', role: 'Food & Beverage Photographer', niche: 'Food Photographer', category: '📸 Photography', price: 'from 1,500 EGP', unit: '/ session', rating: '4.9', jobs: '134 jobs', avail: 'Available now', bg: 'from-[#3a2a1a] to-[#5a4a3a]' },
  { id: 'waleed-a', emoji: '🍕', name: 'Waleed Ali', role: 'Food Photographer & Stylist', niche: 'Food Photographer', category: '📸 Photography', price: 'from 1,800 EGP', unit: '/ session', rating: '4.7', jobs: '67 jobs', avail: 'Available now', bg: 'from-[#2a1a0a] to-[#4a3a2a]' },
  { id: 'reem-g', emoji: '🥗', name: 'Reem Gamal', role: 'Restaurant & Menu Photographer', niche: 'Food Photographer', category: '📸 Photography', price: 'from 2,000 EGP', unit: '/ half day', rating: '4.8', jobs: '91 jobs', avail: 'Next week', bg: 'from-[#1a2a2a] to-[#3a4a4a]' },

  // 📸 Photography — E-commerce Photographer
  { id: 'ali-w', emoji: '🛒', name: 'Ali Waheed', role: 'E-commerce & White BG Specialist', niche: 'E-commerce Photographer', category: '📸 Photography', price: 'from 1,200 EGP', unit: '/ batch', rating: '4.6', jobs: '210 jobs', avail: 'Available now', bg: 'from-[#2a2a2a] to-[#444]' },
  { id: 'maya-t', emoji: '🏪', name: 'Maya Tarek', role: 'E-commerce Photographer', niche: 'E-commerce Photographer', category: '📸 Photography', price: 'from 1,500 EGP', unit: '/ batch', rating: '4.8', jobs: '145 jobs', avail: 'Available now', bg: 'from-[#1a2a3a] to-[#3a4a5a]' },

  // 📸 Photography — Event Photographer
  { id: 'tarek', emoji: '🎪', name: 'Tarek Saad', role: 'Event & Conference Photographer', niche: 'Event Photographer', category: '📸 Photography', price: 'from 6,000 EGP', unit: '/ event', rating: '4.8', jobs: '67 jobs', avail: 'Available now', bg: 'from-[#2a2a4a] to-[#3a3a6a]' },
  { id: 'mona-f', emoji: '🎉', name: 'Mona Fawzy', role: 'Event & Party Photographer', niche: 'Event Photographer', category: '📸 Photography', price: 'from 3,500 EGP', unit: '/ event', rating: '4.7', jobs: '98 jobs', avail: 'Available now', bg: 'from-[#3a1a3a] to-[#5a3a5a]' },
  { id: 'youssef-b', emoji: '📸', name: 'Youssef Bahaa', role: 'Corporate Event Photographer', niche: 'Event Photographer', category: '📸 Photography', price: 'from 4,000 EGP', unit: '/ event', rating: '4.9', jobs: '55 jobs', avail: 'Next week', bg: 'from-[#1a3a1a] to-[#3a5a3a]' },

  // 📸 Photography — Real Estate Photographer
  { id: 'sherif-k', emoji: '🏠', name: 'Sherif Kamal', role: 'Real Estate & Architecture Photographer', niche: 'Real Estate Photographer', category: '📸 Photography', price: 'from 2,500 EGP', unit: '/ property', rating: '4.8', jobs: '76 jobs', avail: 'Available now', bg: 'from-[#2a3a2a] to-[#4a5a4a]' },
  { id: 'dalia-m', emoji: '🏢', name: 'Dalia Mansour', role: 'Interior & Real Estate Photographer', niche: 'Real Estate Photographer', category: '📸 Photography', price: 'from 3,000 EGP', unit: '/ property', rating: '4.9', jobs: '43 jobs', avail: 'Available now', bg: 'from-[#3a3a1a] to-[#5a5a3a]' },

  // 📸 Photography — Jewelry Photographer
  { id: 'lina-s', emoji: '💎', name: 'Lina Saeed', role: 'Jewelry & Luxury Product Photographer', niche: 'Jewelry Photographer', category: '📸 Photography', price: 'from 2,500 EGP', unit: '/ session', rating: '5.0', jobs: '38 jobs', avail: 'Available now', bg: 'from-[#2a1a3a] to-[#4a3a5a]' },
  { id: 'omar-z', emoji: '💍', name: 'Omar Zaki', role: 'Macro & Jewelry Photographer', niche: 'Jewelry Photographer', category: '📸 Photography', price: 'from 3,000 EGP', unit: '/ session', rating: '4.8', jobs: '29 jobs', avail: 'Next week', bg: 'from-[#1a1a1a] to-[#3a3a3a]' },

  // 🎥 Videography — Wedding Videographer
  { id: 'hesham-w', emoji: '💒', name: 'Hesham Wagdy', role: 'Cinematic Wedding Videographer', niche: 'Wedding Videographer', category: '🎥 Videography', price: 'from 8,000 EGP', unit: '/ event', rating: '4.9', jobs: '89 jobs', avail: 'Available now', bg: 'from-[#3a1a2a] to-[#6a3a5a]' },
  { id: 'noura-a', emoji: '💐', name: 'Noura Adel', role: 'Wedding Film Director', niche: 'Wedding Videographer', category: '🎥 Videography', price: 'from 10,000 EGP', unit: '/ event', rating: '5.0', jobs: '52 jobs', avail: 'Next week', bg: 'from-[#2a1a2a] to-[#4a3a4a]' },
  { id: 'mostafa-s', emoji: '🎬', name: 'Mostafa Salem', role: 'Wedding & Engagement Videographer', niche: 'Wedding Videographer', category: '🎥 Videography', price: 'from 6,000 EGP', unit: '/ event', rating: '4.7', jobs: '110 jobs', avail: 'Available now', bg: 'from-[#1a2a2a] to-[#3a4a4a]' },

  // 🎥 Videography — Commercial Videographer
  { id: 'omar', emoji: '🎥', name: 'Omar Hassan', role: 'Cinematographer & Editor', niche: 'Commercial Videographer', category: '🎥 Videography', price: 'from 4,000 EGP', unit: '/ day', rating: '4.7', jobs: '203 jobs', avail: 'Available now', bg: 'from-[#3a1a5c] to-[#5a2d8c]' },
  { id: 'dina', emoji: '🎬', name: 'Dina Youssef', role: 'Creative Director & Filmmaker', niche: 'Commercial Videographer', category: '🎥 Videography', price: 'from 5,000 EGP', unit: '/ project', rating: '4.9', jobs: '112 jobs', avail: 'Next week', bg: 'from-[#4a2a1a] to-[#6a4a2a]' },
  { id: 'bassem-l', emoji: '🎞️', name: 'Bassem Lotfy', role: 'Commercial Director', niche: 'Commercial Videographer', category: '🎥 Videography', price: 'from 7,000 EGP', unit: '/ project', rating: '4.8', jobs: '74 jobs', avail: 'Available now', bg: 'from-[#2a2a3a] to-[#4a4a5a]' },

  // 🎥 Videography — Content Creator
  { id: 'farida-e', emoji: '📱', name: 'Farida Ehab', role: 'Social Content Creator & Editor', niche: 'Content Creator', category: '🎥 Videography', price: 'from 1,500 EGP', unit: '/ reel', rating: '4.6', jobs: '188 jobs', avail: 'Available now', bg: 'from-[#2a1a3a] to-[#4a2a5a]' },
  { id: 'adam-r', emoji: '🎬', name: 'Adam Raouf', role: 'TikTok & Reels Creator', niche: 'Content Creator', category: '🎥 Videography', price: 'from 1,200 EGP', unit: '/ reel', rating: '4.5', jobs: '234 jobs', avail: 'Available now', bg: 'from-[#1a3a2a] to-[#2a5a3a]' },
  { id: 'salma-y', emoji: '✂️', name: 'Salma Yehia', role: 'Video Editor & Content Producer', niche: 'Content Creator', category: '🎥 Videography', price: 'from 2,000 EGP', unit: '/ project', rating: '4.8', jobs: '99 jobs', avail: 'Next week', bg: 'from-[#3a2a2a] to-[#5a4a4a]' },

  // 🎨 Design & Branding — Brand Designer
  { id: 'sara', emoji: '🎨', name: 'Sara Ahmed', role: 'Brand Identity Designer', niche: 'Brand Designer', category: '🎨 Design & Branding', price: 'from 3,000 EGP', unit: '/ project', rating: '5.0', jobs: '54 jobs', avail: 'Next week', bg: 'from-[#5c1a3a] to-[#8c2d5a]' },
  { id: 'hazem-n', emoji: '🖌️', name: 'Hazem Nour', role: 'Brand & Visual Identity Designer', niche: 'Brand Designer', category: '🎨 Design & Branding', price: 'from 4,000 EGP', unit: '/ project', rating: '4.9', jobs: '67 jobs', avail: 'Available now', bg: 'from-[#1a3a3a] to-[#2a5a5a]' },
  { id: 'rana-w', emoji: '🎯', name: 'Rana Wael', role: 'Logo & Brand Designer', niche: 'Brand Designer', category: '🎨 Design & Branding', price: 'from 2,500 EGP', unit: '/ project', rating: '4.7', jobs: '82 jobs', avail: 'Available now', bg: 'from-[#2a2a1a] to-[#4a4a3a]' },

  // 🎨 Design & Branding — UI/UX Designer
  { id: 'tamer-g', emoji: '💻', name: 'Tamer Gamal', role: 'UI/UX & Product Designer', niche: 'UI/UX Designer', category: '🎨 Design & Branding', price: 'from 5,000 EGP', unit: '/ project', rating: '4.9', jobs: '45 jobs', avail: 'Available now', bg: 'from-[#1a1a3a] to-[#3a3a6a]' },
  { id: 'heba-a', emoji: '🖥️', name: 'Heba Ashraf', role: 'UX Researcher & Designer', niche: 'UI/UX Designer', category: '🎨 Design & Branding', price: 'from 4,500 EGP', unit: '/ project', rating: '4.8', jobs: '38 jobs', avail: 'Next week', bg: 'from-[#2a1a2a] to-[#4a3a4a]' },

  // 🎨 Design & Branding — Packaging Designer
  { id: 'aya-m', emoji: '📦', name: 'Aya Mohamed', role: 'Packaging & Print Designer', niche: 'Packaging Designer', category: '🎨 Design & Branding', price: 'from 3,500 EGP', unit: '/ project', rating: '4.8', jobs: '41 jobs', avail: 'Available now', bg: 'from-[#3a2a1a] to-[#5a3a2a]' },
  { id: 'kareem-s', emoji: '🎁', name: 'Kareem Sherif', role: 'Structural & Packaging Designer', niche: 'Packaging Designer', category: '🎨 Design & Branding', price: 'from 4,000 EGP', unit: '/ project', rating: '4.7', jobs: '33 jobs', avail: 'Available now', bg: 'from-[#1a2a1a] to-[#3a5a3a]' },

  // ✏️ Writing — Copywriter
  { id: 'karim', emoji: '✏️', name: 'Karim Samy', role: 'Copywriter & Brand Voice Specialist', niche: 'Copywriter', category: '✏️ Writing', price: 'from 1,500 EGP', unit: '/ project', rating: '4.8', jobs: '89 jobs', avail: 'Available now', bg: 'from-[#1a3a5c] to-[#2d5a8c]' },
  { id: 'nadine-h', emoji: '✍️', name: 'Nadine Hossam', role: 'Ad Copywriter', niche: 'Copywriter', category: '✏️ Writing', price: 'from 1,200 EGP', unit: '/ project', rating: '4.7', jobs: '112 jobs', avail: 'Available now', bg: 'from-[#2a2a3a] to-[#3a3a5a]' },
  { id: 'mahmoud-r', emoji: '📝', name: 'Mahmoud Reda', role: 'Creative Copywriter', niche: 'Copywriter', category: '✏️ Writing', price: 'from 1,800 EGP', unit: '/ project', rating: '4.9', jobs: '76 jobs', avail: 'Next week', bg: 'from-[#3a1a1a] to-[#5a3a3a]' },

  // ✏️ Writing — Content Writer
  { id: 'sarah-m', emoji: '📖', name: 'Sarah Magdy', role: 'Blog & Content Writer', niche: 'Content Writer', category: '✏️ Writing', price: 'from 1,000 EGP', unit: '/ article', rating: '4.6', jobs: '156 jobs', avail: 'Available now', bg: 'from-[#1a2a2a] to-[#3a4a4a]' },
  { id: 'ahmed-y', emoji: '📰', name: 'Ahmed Yasser', role: 'SEO Content Writer', niche: 'Content Writer', category: '✏️ Writing', price: 'from 800 EGP', unit: '/ article', rating: '4.5', jobs: '201 jobs', avail: 'Available now', bg: 'from-[#2a1a2a] to-[#4a3a4a]' },

  // ✏️ Writing — Script Writer
  { id: 'amr-e', emoji: '🎭', name: 'Amr Essam', role: 'Video Script Writer', niche: 'Script Writer', category: '✏️ Writing', price: 'from 1,500 EGP', unit: '/ script', rating: '4.8', jobs: '64 jobs', avail: 'Available now', bg: 'from-[#1a1a2a] to-[#3a3a5a]' },
  { id: 'yasmine-d', emoji: '🎬', name: 'Yasmine Dawoud', role: 'Screenwriter & Script Doctor', niche: 'Script Writer', category: '✏️ Writing', price: 'from 2,000 EGP', unit: '/ script', rating: '4.9', jobs: '47 jobs', avail: 'Next week', bg: 'from-[#2a2a1a] to-[#4a4a2a]' },

  // 📊 Marketing — Social Media Manager
  { id: 'ahmed', emoji: '📱', name: 'Ahmed Karim', role: 'Social Media Manager', niche: 'Social Media Manager', category: '📊 Marketing', price: 'from 2,500 EGP', unit: '/ month', rating: '4.5', jobs: '45 jobs', avail: 'Available now', bg: 'from-[#1a5c3a] to-[#2d8c5a]' },
  { id: 'nourhan-f', emoji: '📊', name: 'Nourhan Farid', role: 'Social Media Strategist', niche: 'Social Media Manager', category: '📊 Marketing', price: 'from 3,000 EGP', unit: '/ month', rating: '4.7', jobs: '58 jobs', avail: 'Available now', bg: 'from-[#2a3a1a] to-[#4a5a3a]' },
  { id: 'sandra-b', emoji: '📈', name: 'Sandra Bahgat', role: 'Content & Social Manager', niche: 'Social Media Manager', category: '📊 Marketing', price: 'from 2,800 EGP', unit: '/ month', rating: '4.8', jobs: '39 jobs', avail: 'Next week', bg: 'from-[#1a2a3a] to-[#2a4a5a]' },

  // 📊 Marketing — Performance Marketer
  { id: 'mohamed-k', emoji: '🎯', name: 'Mohamed Kamal', role: 'Meta & Google Ads Specialist', niche: 'Performance Marketer', category: '📊 Marketing', price: 'from 3,500 EGP', unit: '/ month', rating: '4.9', jobs: '72 jobs', avail: 'Available now', bg: 'from-[#3a2a2a] to-[#5a3a3a]' },
  { id: 'ola-s', emoji: '💰', name: 'Ola Sameh', role: 'Performance Marketing Manager', niche: 'Performance Marketer', category: '📊 Marketing', price: 'from 4,000 EGP', unit: '/ month', rating: '4.8', jobs: '51 jobs', avail: 'Available now', bg: 'from-[#2a1a3a] to-[#3a2a5a]' },

  // 👗 Fashion & Style — Fashion Stylist
  { id: 'rania-t', emoji: '👗', name: 'Rania Tarek', role: 'Fashion Stylist & Consultant', niche: 'Fashion Stylist', category: '👗 Fashion & Style', price: 'from 2,000 EGP', unit: '/ session', rating: '4.8', jobs: '63 jobs', avail: 'Available now', bg: 'from-[#3a1a2a] to-[#5a2a3a]' },
  { id: 'mai-h', emoji: '👠', name: 'Mai Helmy', role: 'Celebrity & Editorial Stylist', niche: 'Fashion Stylist', category: '👗 Fashion & Style', price: 'from 3,500 EGP', unit: '/ shoot', rating: '5.0', jobs: '41 jobs', avail: 'Next week', bg: 'from-[#2a1a1a] to-[#5a3a3a]' },

  // 👗 Fashion & Style — Makeup Artist
  { id: 'layla', emoji: '💄', name: 'Layla Nabil', role: 'MUA & Stylist', niche: 'Makeup Artist', category: '👗 Fashion & Style', price: 'from 1,200 EGP', unit: '/ session', rating: '4.6', jobs: '78 jobs', avail: 'Available now', bg: 'from-[#5c3a1a] to-[#8c5a2d]' },
  { id: 'gigi-a', emoji: '💋', name: 'Gigi Ashour', role: 'Bridal & Editorial MUA', niche: 'Makeup Artist', category: '👗 Fashion & Style', price: 'from 1,800 EGP', unit: '/ session', rating: '4.9', jobs: '95 jobs', avail: 'Available now', bg: 'from-[#3a1a1a] to-[#6a3a3a]' },
  { id: 'nour-m', emoji: '🌸', name: 'Nour Magdi', role: 'Makeup Artist & Skin Specialist', niche: 'Makeup Artist', category: '👗 Fashion & Style', price: 'from 1,500 EGP', unit: '/ session', rating: '4.7', jobs: '66 jobs', avail: 'Next week', bg: 'from-[#2a2a2a] to-[#4a3a3a]' },

  // 💻 Tech & Digital — Web Developer
  { id: 'hassan-b', emoji: '🖥️', name: 'Hassan Bahaa', role: 'Full-Stack Web Developer', niche: 'Web Developer', category: '💻 Tech & Digital', price: 'from 5,000 EGP', unit: '/ project', rating: '4.9', jobs: '34 jobs', avail: 'Available now', bg: 'from-[#1a1a2a] to-[#2a2a4a]' },
  { id: 'fatma-z', emoji: '💻', name: 'Fatma Zein', role: 'Frontend Developer & Designer', niche: 'Web Developer', category: '💻 Tech & Digital', price: 'from 4,000 EGP', unit: '/ project', rating: '4.7', jobs: '28 jobs', avail: 'Available now', bg: 'from-[#1a2a1a] to-[#2a4a2a]' },

  // 💻 Tech & Digital — Motion Designer
  { id: 'seif-a', emoji: '🎨', name: 'Seif Abdallah', role: 'Motion Graphics Designer', niche: 'Motion Designer', category: '💻 Tech & Digital', price: 'from 3,000 EGP', unit: '/ project', rating: '4.8', jobs: '57 jobs', avail: 'Available now', bg: 'from-[#2a1a3a] to-[#4a2a5a]' },
  { id: 'lara-k', emoji: '✨', name: 'Lara Khattab', role: '2D/3D Motion Designer', niche: 'Motion Designer', category: '💻 Tech & Digital', price: 'from 3,500 EGP', unit: '/ project', rating: '4.9', jobs: '43 jobs', avail: 'Next week', bg: 'from-[#3a3a1a] to-[#5a5a2a]' },
];

// Get unique categories
export const categories = ['All', ...Array.from(new Set(allCreatives.map(c => c.category)))];

// Get featured creatives (top rated from each category)
export const getFeaturedCreatives = (): Creative[] => {
  const featured: Creative[] = [];
  const cats = Array.from(new Set(allCreatives.map(c => c.category)));
  cats.forEach(cat => {
    const catCreatives = allCreatives.filter(c => c.category === cat);
    featured.push(...catCreatives.slice(0, 2));
  });
  return featured;
};

// Group creatives by niche within a category
export const getCreativesByNiche = (category: string): Record<string, Creative[]> => {
  const catCreatives = allCreatives.filter(c => c.category === category);
  const grouped: Record<string, Creative[]> = {};
  catCreatives.forEach(c => {
    if (!grouped[c.niche]) grouped[c.niche] = [];
    grouped[c.niche].push(c);
  });
  return grouped;
};
