import useNotLoggedInRedirect from 'common/providers/useNotLoggedInRedirect'
import { useAuth } from '../common/providers/useAuth'
import { Button } from 'reactstrap'

const SecuredPage = () => {
  useNotLoggedInRedirect()
  const { logout } = useAuth()
  return (
    <div className='container-fluid'>
      Secret page
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  )
}

SecuredPage.displayName = 'SecuredPage'
export default SecuredPage
