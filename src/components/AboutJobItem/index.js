import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class AboutJobItem extends Component {
  state = {
    jobDataDetails: [],
    similarJobDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }
  // eslint-disable-next-line
  getJobData = async props => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const url = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        skills: each.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: each.title,
      }))

      const updatedSimilar = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        id: each.id,
        jobDescription: each.job_description,
        employmentType: each.employment_type,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDataDetails: updatedData,
        similarJobDetails: updatedSimilar,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobDetails} = this.state
    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        employmentType,
        companyWebsiteUrl,
        // eslint-disable-next-line
        id,
        jobDescription,
        packagePerAnnum,
        lifeAtCompany,
        rating,
        skills,
        title,

        location,
      } = jobDataDetails[0]

      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="company logo"
                />
                <div className="title-rating-container">
                  <h1>{title}</h1>
                  <div className="star-rating-container">
                    <AiFillStar className="star-icon" />
                    <p>{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <div className="location-icon-location-container">
                    <MdLocationOn className="location-icon" />
                    <p>{location}</p>
                  </div>
                  <div className="employment">
                    <p>{employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p>{packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <hr className="hr" />
            <div className="second-part-container">
              <div className="description-visit-container">
                <h1>Description</h1>
                <a href={companyWebsiteUrl} className="visit-container">
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p>{jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul className="ul-job-details-container">
              {skills.map(each => (
                <li className="li-job-details-container" key={each.name}>
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-img"
                  />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
            <div className="company-life-img-container">
              <div className="life-heading-para-container">
                <h1>Life at Company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul className="similar-jobs-ul-container">
            {similarJobDetails.map(each => (
              <SimilarJobs
                key={each.id}
                employmentType={employmentType}
                similarJobData={each}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  onRetryJobDetailsAgain = () => {
    this.getJobData()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong !</h1>
      <p>We Cannot seem to find the page you are looking for</p>
      <div className="btn-container-failure">
        <button type="button" onClick={this.onRetryJobDetailsAgain}>
          retry
        </button>
      </div>
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-view-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}
export default AboutJobItem
