import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const socials = [
  {
    icon: <FaFacebook />,
    href: '#',
  },
  {
    icon: <FaInstagram />,
    href: '#',
  },
  {
    icon: <FaTwitter />,
    href: '#',
  },
  {
    icon: <FaYoutube />,
    href: '#',
  },
]

const Footer = () => {
  return (
    <footer className="bg-primary py-[60px] lg:py-[120px]">
        <div className="container mx-auto">
          <div className='flex flex-col lg:flex-row justify-between items-center gap-10'>
            <Link href='/'>
              <Image src='/assets/logo-white.svg' alt="" width={160} height={160} />
            </Link>
            <div className='flex gap-4'>
              {socials.map((item, index) => {
                return (
                  <Link href={item.href} key={index} className='bg-accent hover:bg-accent-hover text-white text-lg w-[38px] h-[38px] flex items-center justify-center rounded-full transition-all'>
                    {item.icon}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
    </footer>
  )
}

export default Footer