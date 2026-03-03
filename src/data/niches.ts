export interface Niche {
  label: string;
  skills: string[];
}

export interface CategoryNiches {
  [category: string]: Niche[];
}

export const categoryNiches: CategoryNiches = {
  '📸 Photography': [
    { label: 'Fashion Photographer', skills: ['Lighting', 'Editorial styling sense', 'Posing direction', 'Studio shooting', 'Color grading', 'Model coordination'] },
    { label: 'Product Photographer', skills: ['Product lighting', 'Clean composition', 'Studio setup', 'Retouching', 'E-commerce standards', 'Attention to detail'] },
    { label: 'Food Photographer', skills: ['Food lighting', 'Styling coordination', 'Color correction', 'Fast shooting workflow', 'Composition', 'Lens control'] },
    { label: 'E-commerce Photographer', skills: ['White background shooting', 'Consistency', 'Batch workflow', 'Retouching', 'Speed & efficiency', 'Catalog formatting'] },
    { label: 'Event Photographer', skills: ['Fast reaction', 'Low-light shooting', 'Candid capture', 'Storytelling', 'Quick delivery', 'Client communication'] },
    { label: 'Real Estate Photographer', skills: ['Wide-angle shooting', 'HDR blending', 'Composition', 'Interior lighting', 'Editing workflow', 'Drone basics'] },
    { label: 'Jewelry Photographer', skills: ['Macro photography', 'Detail lighting', 'High-end retouching', 'Reflections control', 'Luxury composition', 'Precision setup'] },
  ],
  '🎥 Videography': [
    { label: 'Wedding Videographer', skills: ['Cinematic storytelling', 'Audio capture', 'Color grading', 'Drone shots', 'Quick turnaround', 'Client management'] },
    { label: 'Commercial Videographer', skills: ['Brand storytelling', 'Lighting setups', 'Script direction', 'Post-production', 'Motion graphics', 'Client briefs'] },
    { label: 'Content Creator', skills: ['Social media formats', 'Quick edits', 'Trend awareness', 'Vertical video', 'Engagement hooks', 'Platform optimization'] },
  ],
  '🎨 Design & Branding': [
    { label: 'Brand Designer', skills: ['Logo design', 'Visual identity', 'Typography', 'Color theory', 'Brand guidelines', 'Presentation design'] },
    { label: 'UI/UX Designer', skills: ['Wireframing', 'Prototyping', 'User research', 'Design systems', 'Figma', 'Responsive design'] },
    { label: 'Packaging Designer', skills: ['Structural design', 'Print production', 'Material knowledge', 'Dieline creation', 'Brand alignment', 'Shelf appeal'] },
  ],
  '✏️ Writing': [
    { label: 'Copywriter', skills: ['Ad copy', 'Brand voice', 'Headlines', 'SEO writing', 'Social media copy', 'CTA optimization'] },
    { label: 'Content Writer', skills: ['Blog writing', 'Research', 'SEO', 'Long-form content', 'Editorial calendar', 'Audience targeting'] },
    { label: 'Script Writer', skills: ['Video scripts', 'Storytelling', 'Dialogue', 'Storyboarding', 'Brand messaging', 'Pacing'] },
  ],
  '📊 Marketing': [
    { label: 'Social Media Manager', skills: ['Content planning', 'Analytics', 'Community management', 'Paid ads', 'Platform strategy', 'Influencer outreach'] },
    { label: 'Performance Marketer', skills: ['Meta Ads', 'Google Ads', 'A/B testing', 'Conversion optimization', 'Budget management', 'Reporting'] },
  ],
  '👗 Fashion & Style': [
    { label: 'Fashion Stylist', skills: ['Wardrobe curation', 'Trend forecasting', 'Editorial styling', 'Client consultation', 'Mood boards', 'Brand alignment'] },
    { label: 'Makeup Artist', skills: ['Bridal makeup', 'Editorial looks', 'Skin prep', 'Color matching', 'HD techniques', 'On-set efficiency'] },
  ],
  '💻 Tech & Digital': [
    { label: 'Web Developer', skills: ['React', 'Responsive design', 'API integration', 'Performance', 'SEO technical', 'CMS setup'] },
    { label: 'Motion Designer', skills: ['After Effects', 'Animation principles', 'Storyboarding', 'Sound design', 'Brand motion', '3D basics'] },
  ],
};
