import Link from 'next/link'

const Header = () => (
  <nav className='navbar navbar-fixed-top navbar-light'>
    <ul className='nav justify-content-start'>
      <li className='nav-item'>
        <Link prefetch={false} href='/'>
          <a className='nav-link'>Home</a>
        </Link>
      </li>
      {__DEV__ && (
        <li className='nav-item'>
          <Link prefetch={false} href='/markup'>
            <a target='_blank' className='nav-link'>
              Markup
            </a>
          </Link>
        </li>
      )}
    </ul>
    <ul className='nav justify-content-end'>
      <li className='nav-item' />
    </ul>
  </nav>
)

Header.displayName = 'Header'

export default Header
