
import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  instructor: "",
  instructorEmail: "",
  description: "",
  category: "Frontend",
  price: "",
  rating: "5",
  students: "0",
};

function CourseForm({
  onSubmitCourse,
  editingCourse,
  onCancelEdit,
}) {
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Populate the form when editing, or reset it when creating.
  useEffect(() => {
    if (editingCourse) {
      setForm({
        title: editingCourse.title ?? "",
        instructor: editingCourse.instructor ?? "",
        instructorEmail: editingCourse.instructorEmail ?? "",
        description: editingCourse.description ?? "",
        category: editingCourse.category ?? "Frontend",
        price: String(editingCourse.price ?? ""),
        rating: String(editingCourse.rating ?? 5),
        students: String(editingCourse.students ?? 0),
      });
    } else {
      setForm({ ...initialForm });
    }

    setErrors({});
    setSuccess("");
  }, [editingCourse]);

  // Update a controlled input.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSuccess("");
  }

  // Validate all fields before submitting.
  function validateForm() {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Course title is required.";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!form.instructor.trim()) {
      newErrors.instructor = "Instructor name is required.";
    }

    const email = form.instructorEmail.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.instructorEmail = "Instructor email is required.";
    } else if (!emailPattern.test(email)) {
      newErrors.instructorEmail = "Enter a valid email address.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Course description is required.";
    }

    const price = Number(form.price);

    if (form.price.trim() === "") {
      newErrors.price = "Course price is required.";
    } else if (!Number.isFinite(price) || price < 0) {
      newErrors.price = "Enter a valid non-negative price.";
    }

    const rating = Number(form.rating);

    if (
      form.rating.trim() === "" ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      newErrors.rating = "Rating must be between 0 and 5.";
    }

    const students = Number(form.students);

    if (
      form.students.trim() === "" ||
      !Number.isInteger(students) ||
      students < 0
    ) {
      newErrors.students =
        "Student count must be a non-negative whole number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // Submit either a new course or an updated course.
  function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const courseData = {
      id: editingCourse?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      instructor: form.instructor.trim(),
      instructorEmail: form.instructorEmail.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      rating: Number(form.rating),
      students: Number(form.students),
    };

    onSubmitCourse(courseData);

    // App.jsx closes the modal after a successful submit.
    // This message is useful if the form is used without that behavior.
    setSuccess(
      editingCourse
        ? "Course updated successfully!"
        : "Course created successfully!"
    );
  }

  function handleCancel() {
    setForm({ ...initialForm });
    setErrors({});
    setSuccess("");
    onCancelEdit();
  }

  return (
    <section className="form-section">
      <div className="form-heading">
        <h2 id="course-modal-title">
          {editingCourse ? "Edit Course" : "Create Course"}
        </h2>

        <p>
          {editingCourse
            ? "Update the course details below."
            : "Fill in the details to create a new course."}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Course title */}
        <div className="form-field">
          <label htmlFor="course-title">Course title</label>
          <input
            id="course-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. React for Beginners"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="field-error">
              {errors.title}
            </p>
          )}
        </div>

        {/* Instructor */}
        <div className="form-field">
          <label htmlFor="course-instructor">Instructor</label>
          <input
            id="course-instructor"
            name="instructor"
            type="text"
            value={form.instructor}
            onChange={handleChange}
            placeholder="Enter instructor name"
            aria-invalid={Boolean(errors.instructor)}
            aria-describedby={
              errors.instructor ? "instructor-error" : undefined
            }
          />
          {errors.instructor && (
            <p id="instructor-error" className="field-error">
              {errors.instructor}
            </p>
          )}
        </div>

        {/* Instructor email */}
        <div className="form-field">
          <label htmlFor="course-instructor-email">
            Instructor email
          </label>
          <input
            id="course-instructor-email"
            name="instructorEmail"
            type="email"
            value={form.instructorEmail}
            onChange={handleChange}
            placeholder="instructor@example.com"
            aria-invalid={Boolean(errors.instructorEmail)}
            aria-describedby={
              errors.instructorEmail ? "email-error" : undefined
            }
          />
          {errors.instructorEmail && (
            <p id="email-error" className="field-error">
              {errors.instructorEmail}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="form-field">
          <label htmlFor="course-description">Description</label>
          <textarea
            id="course-description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what students will learn"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <p id="description-error" className="field-error">
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="form-field">
          <label htmlFor="course-category">Category</label>
          <select
            id="course-category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-field">
          <label htmlFor="course-price">Price ($)</label>
          <input
            id="course-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="49.99"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "price-error" : undefined}
          />
          {errors.price && (
            <p id="price-error" className="field-error">
              {errors.price}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="form-field">
          <label htmlFor="course-rating">Rating (0–5)</label>
          <input
            id="course-rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={handleChange}
            aria-invalid={Boolean(errors.rating)}
            aria-describedby={errors.rating ? "rating-error" : undefined}
          />
          {errors.rating && (
            <p id="rating-error" className="field-error">
              {errors.rating}
            </p>
          )}
        </div>

        {/* Student count */}
        <div className="form-field">
          <label htmlFor="course-students">Student count</label>
          <input
            id="course-students"
            name="students"
            type="number"
            min="0"
            step="1"
            value={form.students}
            onChange={handleChange}
            aria-invalid={Boolean(errors.students)}
            aria-describedby={
              errors.students ? "students-error" : undefined
            }
          />
          {errors.students && (
            <p id="students-error" className="field-error">
              {errors.students}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="course-form-actions">
          <button type="submit" className="enroll-button">
            {editingCourse ? "Save Changes" : "Create Course"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>

        {success && (
          <p className="success-message" role="status">
            {success}
          </p>
        )}
      </form>
    </section>
  );
}

export default CourseForm;
