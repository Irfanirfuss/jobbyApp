import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  usernameValue = event => {
    this.setState({username: event.target.value})
  }

  passwordValue = event => {
    this.setState({password: event.target.value})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  submitError = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitError(data.error_msg)
    }
  }

  render() {
    const {showErrorMsg, errorMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label htmlFor="username">USERNAME</label>
          <br />
          <input
            type="text"
            onChange={this.usernameValue}
            value={username}
            id="username"
            placeholder="UserName"
            className="input-form"
          />
          <br />
          <br />
          <label htmlFor="password">PASSWORD</label>
          <input
            className="input-form"
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={this.passwordValue}
          />
          <br />
          <br />
          <button type="submit" className="button">
            Login
          </button>

          {showErrorMsg && <p className="error">* {errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
