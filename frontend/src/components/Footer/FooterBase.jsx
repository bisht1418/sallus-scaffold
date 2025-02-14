import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"

export default function FooterBase() {
  return (
    <footer className="relative bg-[#0072bb] text-white pt-20 pb-6 mt-20">
      <div className="absolute top-0 left-0 right-0  bg-[#0072bb]">
        <div className="absolute -top-16 left-0 right-0 h-16 bg-[#0072bb] rounded-t-[50px]" />
      </div>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5  gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Salus Scaffold</h3>
            <p className="text-white mb-6">Social networks of the Salus Scaffold </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/people/Salus-Scaffold/61560883563967/" blank="_">
                <Facebook className="w-5 h-5 text-white hover:text-gray-200  cursor-pointer" />
              </a>
              <a href="https://www.linkedin.com/company/salus-scaffold/" blank="_">
                <Linkedin className="w-5 h-5 text-white hover:text-gray-200  cursor-pointer" />
              </a>
            
              <Instagram className="w-5 h-5 text-white hover:text-gray-200  cursor-pointer" />
              <Twitter className="w-5 h-5 text-white hover:text-gray-200  cursor-pointer" />
              <Youtube className="w-5 h-5 text-white:text-white hover:text-gray-200 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Our District</h4>
            <ul className="space-y-2 text-white ">
              <li className="hover:text-gray-200">Information</li>
              <li className="hover:text-gray-200">Board of Trustees</li>
              <li className="hover:text-gray-200">Executive Leadership</li>
              <li className="hover:text-gray-200">Legislative Report</li>
              <li className="hover:text-gray-200">Newsroom</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Construction</h4>
            <ul className="space-y-2 text-white ">
              <li className="hover:text-gray-200">Flex</li>
              <li className="hover:text-gray-200">Full Time</li>
              <li className="hover:text-gray-200">Global</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white ">
              <li className="hover:text-gray-200">
                <Link to="/about-us">About</Link>
              </li>
              <li className="hover:text-gray-200">
                <Link to="/about-us">FAQ</Link>
              </li>
              <li className="hover:text-gray-200">
                <Link to="/contact-us">Contact us</Link>
              </li>
              <li className="hover:text-gray-200">
                <Link to="/services">Services</Link>
              </li>
              <li className="hover:text-gray-200">
                <Link to="/support">Support</Link>
              </li>

            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 text-sm text-white ">
            <Link to="#" className="hover:text-gray-200 text-white">
              Privacy policy
            </Link>
            <Link to="/terms-and-conditions-summary" className="hover:text-gray-200 text-white">
              Terms of conditions
            </Link>
            <Link to="#" className="hover:text-gray-200 text-white">
              Cookies policy
            </Link>
          </div>
          <div className="text-sm text-white hover:text-gray-400">© 2024 Salus Scaffold. All rights reserved</div>
          <div className="flex gap-4 text-sm text-gray-400">
            <button className="hover:text-gray-400 text-white">English</button>
            <button className="hover:text-gray-400 text-white">Norwegian</button>
          </div>
        </div>

      </div>
    </footer>
  )
}

