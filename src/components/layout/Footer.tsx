
import Newsletter from './Newsletter';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Newsletter Section */}
          <div className="md:col-span-2">
            <Newsletter />
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Contact</h3>
            <div className="space-y-3">
              <a 
                href="mailto:imagebyayobola@gmail.com" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Mail size={18} />
                <span>imagebyayobola@gmail.com</span>
              </a>
              <a 
                href="tel:+2347048089372" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Phone size={18} />
                <span>+234(0) 704 808 9372</span>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 pt-8 border-t border-gray-200">
          <p>© {new Date().getFullYear()} Katherine Akintade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}