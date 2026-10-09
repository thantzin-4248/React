
import EnrollmentButton from './EnrollmentButton'

function CourseCard({ course, isEnrolled, onEnroll }) {
    return (
        <article className="course-card">
            <span className="course-category">
                {course.category}
            </span>

            <h3>{course.title}</h3>

            <p className="course-description">
                {course.description}
            </p>

            <div className="course-details">
                <p>
                    <strong>Instructor:</strong>{' '}
                    {course.instructor}
                </p>

                <p>
                    <strong>Email:</strong>{' '}
                    {course.instructorEmail}
                </p>

                <p>
                    <strong>Students:</strong>{' '}
                    {course.students.toLocaleString()}
                </p>

                <p>
                    <strong>Rating:</strong> ⭐ {course.rating}
                </p>

                <p className="course-price">
                    ${course.price}
                </p>
            </div>

            <EnrollmentButton
                isEnrolled={isEnrolled}
                onEnroll={onEnroll}
            />
        </article>
    )
}

export default CourseCard
