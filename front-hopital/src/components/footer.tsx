
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'; // Example icons

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About/Logo */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Santé+</h3>
            <p className="text-sm leading-relaxed">
              Votre partenaire santé digital, offrant des services médicaux accessibles et de qualité.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-md font-semibold text-white mb-4">Liens Rapides</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm hover:text-white transition-colors">Accueil</Link>
              <Link href="/auth/medecins/liste" className="text-sm hover:text-white transition-colors">Nos Médecins</Link>
              <Link href="/departements" className="text-sm hover:text-white transition-colors">Nos Départements</Link>
              <Link href="/about" className="text-sm hover:text-white transition-colors">À Propos</Link> {/* Placeholder */} 
            </nav>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-md font-semibold text-white mb-4">Légal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">Politique de Confidentialité</Link> {/* Placeholder */} 
              <Link href="/terms" className="text-sm hover:text-white transition-colors">Conditions d'Utilisation</Link> {/* Placeholder */} 
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-md font-semibold text-white mb-4">Contactez-nous</h4>
            <address className="not-italic text-sm">
              <p>123 Rue de la Santé</p>
              <p>75000 Paris, France</p>
              <a href="mailto:contact@santeplus.com" className="flex items-center gap-2 mt-2 hover:text-white transition-colors">
                <Mail size={16} />
                contact@santeplus.com
              </a>
              {/* <a href="tel:+33123456789" className="flex items-center gap-2 mt-1 hover:text-white transition-colors">
                <Phone size={16} />
                +33 1 23 45 67 89
              </a> */}
            </address>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Santé+. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

