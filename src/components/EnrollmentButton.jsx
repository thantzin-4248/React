
function EnrollmentButton({ isEnrolled, onEnroll }) {
    if (isEnrolled) {
        return (
            <button
                type="button"
                className="enrolled-button"
                disabled
            >
                ✓ Enrolled
            </button>
        )
    }

    return (
        <button
            type="button"
            className="enroll-button"
            onClick={onEnroll}
        >
            Enroll Now
        </button>
    )
}

export default EnrollmentButton
