import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">E-Shop</h3>
            <p className="text-slate-400 text-sm">
              Your modern e-commerce platform for quality products and exceptional service.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/products" className="hover:text-slate-100 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="hover:text-slate-100 transition">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="hover:text-slate-100 transition">
                  Clothing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-slate-100 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-100 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-slate-100 transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-slate-100 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-100 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-slate-100 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-400">
            © {currentYear} E-Shop. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-100 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.05c0-2.76 1.69-4.27 4.16-4.27 1.18 0 2.2.09 2.49.13v2.88h-1.71c-1.34 0-1.6.64-1.6 1.57v2.06h3.21l-.42 3.54h-2.79V20" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-100 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.851 1.244 3.974 3.976.048 1.056.06 1.37.06 4.043 0 2.672-.01 2.986-.06 4.04-.123 2.73-1.264 3.85-3.974 3.974-1.055.048-1.37.06-4.042.06-2.67 0-2.986-.01-4.04-.06-2.717-.123-3.851-1.244-3.974-3.976-.048-1.056-.06-1.37-.06-4.04 0-2.672.01-2.986.06-4.042.123-2.73 1.264-3.85 3.974-3.974 1.056-.048 1.37-.06 4.04-.06zm0-1.802C7.082 0 6.737.013 5.67.065 2.156.272.273 2.176.065 5.67-.013 6.736 0 7.081 0 10c0 2.917.013 3.263.065 4.33.207 3.514 2.09 5.396 5.584 5.605 1.067.052 1.41.065 4.35.065 2.942 0 3.285-.013 4.35-.065 3.516-.209 5.396-2.091 5.605-5.585.052-1.067.065-1.41.065-4.35 0-2.942-.013-3.285-.065-4.35-.209-3.516-2.091-5.396-5.605-5.605C13.263.013 12.92 0 10 0z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-100 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.278-1.387-2.278-1.389 0-1.601 1.084-1.601 2.205v4.251h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.703 0 3.203 1.778 3.203 4.092v4.713zM5.005 8.505a1.547 1.547 0 11-.002-3.094 1.547 1.547 0 01.002 3.094zm1.336 7.833H3.67V9.75H6.34v6.588zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
