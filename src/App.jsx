
import { useEffect, useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CourseList from "./components/CourseList";
import CourseForm from "./components/CourseForm";
import Footer from "./components/Footer";

import { getCourses } from "./services/courseService";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [updatedCourses, setUpdatedCourses] = useState([]);
  const [deletedCourseIds, setDeletedCourseIds] = useState([]);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch courses when the search query changes.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourses(search, controller.signal);
        setCourses(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load courses.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, refreshKey]);

  // Open the form in create mode.
  function handleStartCreate() {
    setEditingCourse(null);
    setIsCourseFormOpen(true);
  }

  // Open the same form in edit mode.
  function handleStartEdit(course) {
    setEditingCourse(course);
    setIsCourseFormOpen(true);
  }

  // Close the form without saving.
  function handleCancelEdit() {
    setIsCourseFormOpen(false);
    setEditingCourse(null);
  }

  // Add a new course.
  function handleAddCourse(newCourse) {
    setCreatedCourses((current) => [newCourse, ...current]);
  }

  // Update a created course or an API course.
  function handleUpdateCourse(updatedCourse) {
    const isCreatedCourse = createdCourses.some(
      (course) => course.id === updatedCourse.id
    );

    if (isCreatedCourse) {
      setCreatedCourses((current) =>
        current.map((course) =>
          course.id === updatedCourse.id
            ? updatedCourse
            : course
        )
      );
      return;
    }

    setUpdatedCourses((current) => {
      const alreadyUpdated = current.some(
        (course) => course.id === updatedCourse.id
      );

      if (alreadyUpdated) {
        return current.map((course) =>
          course.id === updatedCourse.id
            ? updatedCourse
            : course
        );
      }

      return [...current, updatedCourse];
    });
  }

  // Save the form in create or edit mode.
  function handleSaveCourse(courseData) {
    if (editingCourse) {
      handleUpdateCourse({
        ...courseData,
        id: editingCourse.id,
      });
    } else {
      handleAddCourse(courseData);
    }

    // Close the form after saving.
    setIsCourseFormOpen(false);
    setEditingCourse(null);
  }

  // Delete a course after confirmation.
  function handleDeleteCourse(courseId) {
    const course = displayedCourses.find(
      (item) => item.id === courseId
    );

    if (!course) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?`
    );

    if (!confirmed) return;

    setCreatedCourses((current) =>
      current.filter((item) => item.id !== courseId)
    );

    setUpdatedCourses((current) =>
      current.filter((item) => item.id !== courseId)
    );

    setDeletedCourseIds((current) =>
      current.includes(courseId)
        ? current
        : [...current, courseId]
    );

    setEnrolledCourses((current) =>
      current.filter((id) => id !== courseId)
    );

    if (editingCourse?.id === courseId) {
      setEditingCourse(null);
      setIsCourseFormOpen(false);
    }
  }

  // Prevent duplicate enrollment.
  function handleEnroll(courseId) {
    setEnrolledCourses((current) =>
      current.includes(courseId)
        ? current
        : [...current, courseId]
    );
  }

  // Filter locally created courses.
  const normalizedSearch = search.trim().toLowerCase();

  const matchingCreatedCourses = createdCourses.filter((course) => {
    const searchableText = [
      course.title,
      course.instructor,
      course.category,
      course.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  // Hide deleted API courses and avoid duplicate IDs.
  const createdCourseIds = new Set(
    createdCourses.map((course) => course.id)
  );

  const displayedApiCourses = courses
    .filter(
      (course) =>
        !deletedCourseIds.includes(course.id) &&
        !createdCourseIds.has(course.id)
    )
    .map(
      (course) =>
        updatedCourses.find(
          (updatedCourse) => updatedCourse.id === course.id
        ) ?? course
    );

  const displayedCourses = [
    ...matchingCreatedCourses,
    ...displayedApiCourses,
  ];

  return (
    <div className="app">
      <Header enrolledCount={enrolledCourses.length} />

      <main>
        {/* Home page hero */}
        <section className="hero container">
          <p className="eyebrow">WELCOME TO LEARNHUB</p>

          <h2>Build skills for your future.</h2>

          <p>
            Discover courses and learn from instructors around the world.
          </p>
        </section>

        {/* Create Course toolbar */}
        <section className="create-course-section container">
          <div>
            <h2>Explore Courses</h2>
            <p>Discover courses and manage your learning content.</p>
          </div>

          <button
            type="button"
            className="create-course-button"
            onClick={handleStartCreate}
          >
            + Create Course
          </button>
        </section>

        {/* Show the shared form only when requested */}
        {isCourseFormOpen && (
          <div
            className="modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                handleCancelEdit();
              }
            }}
          >
            <div
              className="course-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="course-modal-title"
            >
              <button
                type="button"
                className="modal-close-button"
                onClick={handleCancelEdit}
                aria-label="Close course form"
              >
                ×
              </button>

              <CourseForm
                onSubmitCourse={handleSaveCourse}
                editingCourse={editingCourse}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </div>
        )}

        {/* Search */}
        <SearchBar
          search={search}
          onSearchChange={setSearch}
        />

        {/* Course count */}
        <section className="course-summary container">
          <p>
            {loading
              ? "Searching courses..."
              : `Showing ${displayedCourses.length} ${
                  displayedCourses.length === 1
                    ? "course"
                    : "courses"
                }`}
          </p>
        </section>

        {/* Error state */}
        {error && (
          <section className="container error-state">
            <h3>Unable to load courses</h3>
            <p>{error}</p>

            <button
              type="button"
              className="retry-button"
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              Try Again
            </button>
          </section>
        )}

        {/* Loading state */}
        {!error && loading && (
          <div className="container status-message" role="status">
            Loading courses...
          </div>
        )}

        {/* Course list */}
        {!error && !loading && (
          <CourseList
            courses={displayedCourses}
            enrolledCourses={enrolledCourses}
            onEnroll={handleEnroll}
            onEdit={handleStartEdit}
            onDelete={handleDeleteCourse}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
