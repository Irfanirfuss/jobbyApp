import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

const apiJobStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class Jobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkBoxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    const data = [await response.json()]
    if (response.ok === true) {
      const updatedData = data.map(each => ({
        name: each.profile_details.name,
        profileImageUrl: each.profile_details.profile_image_url,
        shortBio: each.profile_details.short_bio,
      }))

      this.setState({
        profileData: updatedData,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const {checkBoxInputs, searchInput, radioInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(updatedData)
      this.setState({
        jobsData: updatedData,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  onGetSearchInput = event => {
    const {checkBoxInputs} = this.state
    const filter = checkBoxInputs.filter(each => each === event.target.value)
    if (filter.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.value],
        }),
        this.getJobsData,
      )
    } else {
      const filteredData = checkBoxInputs.filter(
        each => each !== event.target.value,
      )
      this.setState(
        // eslint-disable-next-line
        prevState => ({checkBoxInputs: filteredData}),
        this.getJobsData,
      )
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]

      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-icon" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.getProfileData()
  }

  onRetryJobs = () => {
    this.getJobsData()
  }

  onGetProfileFailureView = () => (
    <div className="profile-button-container">
      <button
        type="button"
        onClick={this.onRetryProfile}
        className="failure-button"
      >
        Retry
      </button>
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()

      case apiJobStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  onGetInputOption = event => {
    const {checkBoxInputs} = this.state
    const filter = checkBoxInputs.filter(each => each === event.target.id)
    if (filter.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.getJobsData,
      )
    } else {
      const filtered = checkBoxInputs.filter(each => each !== event.target.id)
      this.setState(
        // eslint-disable-next-line
        prevState => ({checkBoxInputs: filtered}),
        this.getJobsData,
      )
    }
  }

  onGetCheckBoxViews = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(each => (
        <li className="li-container" key={each.employmentTypeId}>
          <input
            className="input"
            type="checkbox"
            onChange={this.onGetInputOption}
            id={each.employmentTypeId}
          />
          <label className="label" htmlFor={each.employmentTypeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonViews = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId} className="li-container">
          <input
            type="radio"
            name="option"
            className="radio"
            id={each.salaryRangeId}
            onChange={this.onGetRadioOption}
          />
          <label className="label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetJobFailureView = () => (
    <div className="failure-img-button-container">
      <img src={failureViewImg} alt="failure view" className="failure-img" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page You are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onGetJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0

    return noJobs ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No jobs Found</h1>
        <p>We could Not Find any Jobs. Try other filters. </p>
      </div>
    ) : (
      <ul className="ul-job-items-container">
        {jobsData.map(each => (
          <JobItem key={each.id} jobData={each} />
        ))}
      </ul>
    )
  }

  onRenderJobStatus = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.onGetJobsView()
      case apiJobStatusConstants.failure:
        return this.onGetJobFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar-container">
            {this.onRenderProfileStatus()}
            <hr className="hr" />
            <h1>Type of Employment</h1>
            {this.onGetCheckBoxViews()}
            <hr className="hr" />
            <h1>Salary Range</h1>
            {this.onGetRadioButtonViews()}
          </div>
          <div className="jobs-container">
            <div>
              <input
                type="search"
                value={searchInput}
                className="search-input"
                placeholder="search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                data-testId="searchButton"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.onRenderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
