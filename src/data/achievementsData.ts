export interface Achievement {
  id: string;
  name: string;
  imageUrl: string;
  link?: string;
  category: 'certification' | 'badge' | 'stat';
  certificateUrl?: string;
}

// Add your certifications, badges, and stats here
export const achievements: Achievement[] = [
  
  // Badges

  {
    id: 'pnpt-badge',
    name: 'Practical Network Penetration Tester',
    imageUrl: '/images/badges/pnpt.png',
    link: 'https://certified.tcm-sec.com/eaa34cb4-e4e6-4217-979c-7aec83465ac4#acc.Lt18VWFz',
    category: 'badge',
    certificateUrl: '/images/certifications/pnpt.png'
  },
  {
    id: 'pwpa-badge',
    name: 'Practical Web Pentest Associate',
    imageUrl: '/images/badges/pwpa.png',
    link: 'https://certified.tcm-sec.com/e963ce01-7ef8-4a09-8936-3929cf74fd5b#acc.4ecr1oOJ',
    category: 'badge',
    certificateUrl: '/images/certifications/pwpa.png'
  },
  

  
  // WakaTime Stats

];

// Helper function to get achievements by category
export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return achievements.filter(achievement => achievement.category === category);
}; 