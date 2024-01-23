import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const Home = props => {
  const redirectJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }

  return (
    <>
      <Header />

      <div className="job-container">
        <h1>
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p>
          Millions of People are searching for jobs ,<br /> salary information
          company reviews
          <br /> Find the job that fits your abilities and potential
        </p>
        <Link to="/jobs">
          <button type="button" className="jobs-btn" onClick={redirectJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
