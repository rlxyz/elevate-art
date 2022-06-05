import Link from 'next/link'

const SocialButton = ({ children, href }) => {
  return (
    <Link href={href}>
      <a href={href} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    </Link>
  )
}

export default SocialButton
