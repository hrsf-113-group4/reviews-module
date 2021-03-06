import React from "react";
import PropTypes from "prop-types";
import ReportPopUp from "./ReportPopUp.jsx";
import moment from "moment";
import styles from "./Review.css";

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveronHelp: false,
      helpful: false,
      upvoteIcon: this.props.review.is_helpful
        ? "https://s3-us-west-1.amazonaws.com/table.me/redUpvote.png"
        : "https://s3-us-west-1.amazonaws.com/table.me/whiteUpvote.png",
      readMoreClicked: false,
      fullReview: this.props.review.review,
      reviewText: this.props.review.review.slice(0, 150),
      stars: [],
      reportClicked: false,
      reportPopUp: "",
      randomColor: "#ffffff"
    };
  }

  componentDidMount() {
    const { review } = this.props;
    const { fullReview } = this.state;
    this.setStars();
    this.setColor();
    if (review.is_helpful) this.setState({ helpful: true });
    if (fullReview.length > 300)
      this.setState({ reviewText: fullReview.slice(0, 150) + "..." });
  }

  setStars() {
    const { review } = this.props;
    const { stars } = this.state;
    let initialRating = review.overallRating;
    for (let i = 0; i < 5; i++) {
      initialRating > 0.5
        ? stars.push(
            "https://s3-us-west-1.amazonaws.com/review-photos-fec-open-table/redStar.png"
          )
        : stars.push(
            "https://s3-us-west-1.amazonaws.com/review-photos-fec-open-table/greyStar.png"
          );
      initialRating--;
    }
    this.setState({ stars });
  }

  setColor() {
    const circleColors = ["#df4e96", "#bb6acd", "#6c8ae4", "#d86441"];
    this.setState({
      randomColor: circleColors[Math.floor(Math.random() * circleColors.length)]
    });
  }

  setNode(node) {
    this.node = node;
  }

  helpfulClick() {
    const { review } = this.props;
    const { helpful } = this.state;
    this.setState({ helpful: !helpful });
    helpful
      ? this.setState({
          upvoteIcon:
            "https://s3-us-west-1.amazonaws.com/table.me/whiteUpvote.png"
        })
      : this.setState({
          upvoteIcon:
            "https://s3-us-west-1.amazonaws.com/table.me/redUpvote.png"
        });
    review.is_helpful ? (review.is_helpful = 0) : (review.is_helpful = 1);
  }

  readMoreToggle(e) {
    e.preventDefault();
    this.setState(prevState => ({
      readMoreClicked: !prevState.readMoreClicked
    }));
    this.displayReview();
  }

  displayReview() {
    const { fullReview, readMoreClicked } = this.state;
    readMoreClicked
      ? this.setState({ reviewText: fullReview.slice(0, 150) + "..." })
      : this.setState({ reviewText: fullReview });
  }

  toggleReportModal() {
    const { reportClicked } = this.state;
    this.setState({ reportClicked: !reportClicked }, () => this.reportPopUp());
  }

  handleOutsideClick(e) {
    if (this.node && this.node.contains(e.target)) return;
    this.setState({ reportClicked: false }, () => this.reportPopUp());
  }

  reportPopUp() {
    const { reportClicked } = this.state;
    this.setState({
      reportPopUp: reportClicked ? (
        <ReportPopUp
          setNode={this.setNode.bind(this)}
          outsideClick={this.handleOutsideClick.bind(this)}
          toggleReportModal={this.toggleReportModal.bind(this)}
        />
      ) : (
        ""
      )
    });
  }

  render() {
    const { review } = this.props;
    const {
      hoveronHelp,
      readMoreClicked,
      reportPopUp,
      randomColor,
      stars,
      reviewText,
      upvoteIcon,
      helpful
    } = this.state;
    const helpHover = hoveronHelp ? "helpHovered" : "placeholder";
    let readMorePhrase = readMoreClicked ? "- Read less" : "+ Read more";
    if (!readMoreClicked && review.review.length < 150) readMorePhrase = "";
    const reviewPluralCase = review.reviewCount === 1 ? "review" : "reviews";

    return (
      <div id="reviewContainer">
        {reportPopUp}
        <div className="twoHalvesContainer">
          <div className="leftHalf" id="reviewLeftHalf">
            <div id="reviewCircleContainer">
              <div
                className="authorCircle"
                style={{ backgroundColor: randomColor }}
              >
                <div id="reviewInitials">{review.initials}</div>
              </div>
            </div>
            <div id="usernameContainer">
              <span>
                <span id="reviewUsername">{review.username.slice(0, 8)}</span>
              </span>
            </div>
            <span id="userCity">{review.city.slice(0, 11)}</span>
            <div id="userReviewsContainer">
              <span className="commentIcon" />
              <div id="reviewCountText">
                {review.reviewCount} {reviewPluralCase}
              </div>
            </div>
          </div>

          <div className="rightHalf" id="reviewRightHalf">
            <div id="reviewStarsDateRating">
              <div id="reviewStarsDate">
                <div id="reviewStarsContainer">
                  {stars.map(star => (
                    <img className="reviewStar" src={star} alt="Star Icon" />
                  ))}
                </div>
                <span className="reviewRatingDate">
                  &#8226; &nbsp; Dined on{" "}
                  {moment(review.createdAt).format("MMMM Do, YYYY")}
                </span>
              </div>
              <div id="reviewRatingsContainer">
                <span className="reviewRatingCategory">Overall </span>
                <span className="reviewRatingNumber">
                  {review.overallRating} &nbsp;
                </span>
                <span className="reviewRatingCategory">&#8226; Food </span>
                <span className="reviewRatingNumber">
                  {review.foodRating} &nbsp;
                </span>
                <span className="reviewRatingCategory">&#8226; Service </span>
                <span className="reviewRatingNumber">
                  {review.serviceRating} &nbsp;
                </span>
                <span className="reviewRatingCategory">&#8226; Ambiance </span>
                <span className="reviewRatingNumber">
                  {review.ambianceRating}
                </span>
              </div>
            </div>

            <div>
              <p id="reviewText">{reviewText}</p>
            </div>

            <div id="reportHelpful">
              <div>
                <a id="readMore" href="#" onClick={e => this.readMoreToggle(e)}>
                  {readMorePhrase}
                </a>
              </div>
              <div id="subReportHelpful">
                <div
                  className="flexCenter"
                  id="reportContainer"
                  onClick={e => this.toggleReportModal(e)}
                >
                  <img
                    id="flagIcon"
                    src="https://s3-us-west-1.amazonaws.com/table.me/flag.png"
                  />
                  <span className="reportText">Report</span>
                </div>
                <div
                  className="flexCenter"
                  id={helpHover}
                  value={review.is_helpful}
                  onClick={() => this.helpfulClick(review.is_helpful)}
                >
                  <div className="flex">
                    <img id="upvoteIcon" src={upvoteIcon} alt="upvote Icon" />
                  </div>
                  <span className="helpfulText">
                    Helpful {helpful ? "(1)" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Review;

Review.propTypes = {
  review: PropTypes.shape({
    ambianceRating: PropTypes.number.isRequired,
    serviceRating: PropTypes.number.isRequired,
    foodRating: PropTypes.number.isRequired,
    overallRating: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    recommended: PropTypes.number.isRequired,
    noise: PropTypes.number.isRequired,
    review: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    reviewCount: PropTypes.number.isRequired
  }).isRequired
};
