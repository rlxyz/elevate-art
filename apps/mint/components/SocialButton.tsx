import Link from 'next/link'

export const SocialButton = ({ children, href }) => {
  return (
    <Link href={href} passHref>
      <a target="_blank" rel="noreferrer noopener" className="w-3/4">
        {children}
      </a>
    </Link>
  )
}
