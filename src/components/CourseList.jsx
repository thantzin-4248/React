
import CourseCard from './CourseCard'

function CourseList({
    courses,
    enrolledCourses,
    onEnroll,
}) {
    if (courses.length === 0) {
        return (
            <section
                id="courses"
                className="container empty-state"
            >
                <h3>No courses found</h3>
                <p>Try another title, instructor, or category.</p>
            </section>
        )
    }

    return (
        <section
            id="courses"
            className="container courses-section"
        >
            <div className="course-grid">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        isEnrolled={enrolledCourses.includes(
                            course.id
                        )}
                        onEnroll={() => onEnroll(course.id)}
                    />
                ))}
            </div>
        </section>
    )
}

export default CourseList
