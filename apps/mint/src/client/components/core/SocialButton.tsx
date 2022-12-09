import Link from 'next/link'

export const SocialButton = ({ children, href }) => {
  return (
    <Link href={href} passHref>
      {children}
    </Link>
  )
}
