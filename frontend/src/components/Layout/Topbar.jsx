import { TbBrandFiverr } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { FaLinkedin } from 'react-icons/fa'
const Topbar = () => {
    return (<div className="bg-[#ea2e0e] text-white">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
            <div className="hidden md:flex items-center space-x-4">
                <a href="https://www.fiverr.com/s/Eg7Q8B0" className="hover:text-gray-300">
                    <TbBrandFiverr className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/_ajyendra?igsh=ZTFvczZuMjZhNHkw" className="hover:text-gray-300">
                    <IoLogoInstagram className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/in/ajyendra-singh-jadon-10789138a?utm_source=share_via&utm_content=profile&utm_medium=member_android" className="hover:text-gray-300">
                    <FaLinkedin className="h-4 w-4" />
                </a>
            </div>
            <div className="text-sm text-center grow">
                <span>We ship worldwide - Fast and Reliable Shipping!</span>
            </div>
            <div className='text-sm hidden md:block'>
                <a href="tel: +919897278469" className='hover:text-gray-300'>
                    +91 98972 - 78469
                </a>
            </div>
        </div>
    </div>
    )
}

export default Topbar