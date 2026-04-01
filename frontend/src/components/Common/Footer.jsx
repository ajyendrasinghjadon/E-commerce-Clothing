import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { TbBrandFiverr, TbBrandMeta } from "react-icons/tb"
import { Link } from "react-router-dom"
import { FiPhoneCall } from "react-icons/fi"
import { FaLinkedin } from "react-icons/fa"
const Footer = () => {
  return (
    <footer className="border-t border-[#E5E5E5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
        {/* Newsletter Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[14px] font-medium text-[#000000] uppercase tracking-tight">Newsletter</h3>
          <p className="text-[13px] text-[#777777]">
            Be the first to hear about new products, exclusive events and online offers.
          </p>
          <p className="text-[13px] font-medium text-[#000000]">
            Sign up and get 10% off on your first order.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 lg:gap-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2.5 w-full text-[14px] border border-[#E5E5E5] focus:outline-none focus:border-black transition-all lg:rounded-l rounded-none"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2.5 text-[14px] font-medium hover:opacity-85 transition-all cursor-pointer whitespace-nowrap lg:rounded-r rounded-none"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[14px] font-medium text-[#000000] uppercase tracking-tight">Shop</h3>
          <ul className="flex flex-col space-y-3 text-[13px] text-[#777777]">
            <li>
              <Link to="/collections/all?category=Top+Wear&gender=Men" className="hover:text-black transition-colors">Men's Top Wear</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Top+Wear&gender=Women" className="hover:text-black transition-colors">Women's Top Wear</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Bottom+Wear&gender=Men" className="hover:text-black transition-colors">Men's Bottom Wear</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Bottom+Wear&gender=Women" className="hover:text-black transition-colors">Women's Bottom Wear</Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[14px] font-medium text-[#000000] uppercase tracking-tight">Support</h3>
          <ul className="flex flex-col space-y-3 text-[13px] text-[#777777]">
            <li>
              <Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-black transition-colors">FAQs</Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-black transition-colors">Features</Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[14px] font-medium text-[#000000] uppercase tracking-tight">Follow Us</h3>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.fiverr.com/s/Eg7Q8B0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#777777] hover:text-black transition-colors"
            >
              <TbBrandFiverr className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/_ajyendra?igsh=ZTFvczZuMjZhNHkw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#777777] hover:text-black transition-colors"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/ajyendra-singh-jadon-10789138a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#777777] hover:text-black transition-colors"
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
          </div>
          <div className="pt-2">
            <p className="text-[14px] font-medium text-[#000000] mb-2">Call Us</p>
            <p className="text-[13px] text-[#777777]">
              <a href="tel: +919897278469" className="hover:text-black transition-colors">
                <FiPhoneCall className="inline-block mr-2" />
                +91 98972 - 78469
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-10 pt-6 border-t border-[#E5E5E5]">
        <p className="text-[12px] text-[#777777] text-center tracking-tight">
          &copy; 2026, E-commerce. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer