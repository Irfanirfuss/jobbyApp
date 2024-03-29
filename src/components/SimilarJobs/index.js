import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {similarJobData} = props
  const {
    companyLogoUrl,
    employmentType,

    jobDescription,
    location,

    rating,
    title,
  } = similarJobData

  return (
    <li className="similar-job-li-container">
      <div className="img-job-title-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company logo"
        />
        <div className="title-job-rating-container">
          <h1 className="title-job-heading">{title}</h1>
          <div className="title-job-rating-container">
            <AiFillStar className="star-job-icon" />
            <p className="rating-job-text">{rating}</p>
          </div>
        </div>
      </div>
      <div className="second-part-job-container">
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
      <div className="location-job-details-type-container">
        <div className="location-job-icon-location-container">
          <MdLocationOn className="location-job-icon" />
          <p className="location-job">{location}</p>
        </div>
        <div className="employment">
          <p className="job-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
