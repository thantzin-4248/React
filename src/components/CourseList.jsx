
function CourseList({
  courses,
  enrolledCourses,
  onEnroll,
  onEdit,
  onDelete,
}) {
  if (courses.length === 0) {
    return (
      <section className="container empty-state">
        <h3>No courses found</h3>
        <p>Try another search or add a new course.</p>
      </section>
    );
  }

  return (
    <section className="container course-grid">
      {courses.map((course) => {
        const isEnrolled = enrolledCourses.includes(course.id);

        return (
          <article className="course-card" key={course.id}>
            <div className="course-card-header">
              <span className="category-badge">
                {course.category || "General"}
              </span>
              <span className="course-rating">
                ★ {Number(course.rating ?? 0).toFixed(1)}
              </span>
            </div>

            <h3>{course.title}</h3>
            <p className="course-description">{course.description}</p>

            <div className="course-details">
              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>

              {course.instructorEmail && (
                <p>
                  <strong>Email:</strong> {course.instructorEmail}
                </p>
              )}

              <p>
                <strong>Students:</strong> {course.students ?? 0}
              </p>

              <p className="course-price">
                ${Number(course.price ?? 0).toFixed(2)}
              </p>
            </div>

            <button
              type="button"
              className="enroll-button"
              onClick={() => onEnroll(course.id)}
              disabled={isEnrolled}
            >
              {isEnrolled ? "Enrolled" : "Enroll Now"}
            </button>

            <div className="course-actions">
              <button
                type="button"
                className="edit-button"
                onClick={() => onEdit(course)}
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={() => onDelete(course.id)}
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default CourseList;
