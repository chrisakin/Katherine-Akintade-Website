import React from 'react';
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

export default function SocialLinks() {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-gray-900">Connect</h3>
      <div className="flex space-x-4">
        <a 
          href="https://instagram.com/identityshaper" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </a>
        <a 
          href="https://x.com/ayobolae" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Twitter"
        >
          <Twitter size={20} />
        </a>
        <a 
          href="https://youtube.com/@katherineoluwaseunakintade7617?si=Q7FHw3zOgpuLslKz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="YouTube"
        >
          <Youtube size={20} />
        </a>
        <a 
          href="https://web.facebook.com/katherine.akintade/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </a>
      </div>
    </div>
  );
}