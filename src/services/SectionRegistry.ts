import React from 'react';
import { StoreSection } from '../types';

export interface SectionRendererProps {
  sections: StoreSection[];
  onUpdateSections: (sections: StoreSection[]) => void;
}

export class SectionRegistryService {
  static getDefaultSections(): StoreSection[] {
    return [
      { id: 'sec_1', type: 'announcement', name: 'Announcement Bar', enabled: true, settings: { text: 'Free Shipping over $75 • Use EHSAN20' } },
      { id: 'sec_2', type: 'header', name: 'Header & Mega Menu', enabled: true, settings: { sticky: true } },
      { id: 'sec_3', type: 'hero', name: 'Hero Banner Slider', enabled: true, settings: { title: 'Modern Storefront Architecture' } },
      { id: 'sec_4', type: 'categories', name: 'Category Grid', enabled: true, settings: { layout: 'minimal' } },
      { id: 'sec_5', type: 'products', name: 'Featured Products Grid', enabled: true, settings: { limit: 8 } },
      { id: 'sec_6', type: 'promo', name: 'Promotional Banner & Countdown', enabled: true, settings: { discount: '20%' } },
      { id: 'sec_7', type: 'testimonials', name: 'Customer Testimonials', enabled: true, settings: {} },
      { id: 'sec_8', type: 'faq', name: 'FAQ Accordions', enabled: true, settings: {} },
      { id: 'sec_9', type: 'footer', name: 'Multi-column Footer', enabled: true, settings: {} },
    ];
  }
}
