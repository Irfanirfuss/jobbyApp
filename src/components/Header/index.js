import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-menu">
      <ul className="nav-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li className="job">
          <Link to="/">
            <h1>Home</h1>
          </Link>
          <Link to="/jobs">
            <h1>Jobs</h1>
          </Link>
        </li>
        <li>
          <button type="button" className="button" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
