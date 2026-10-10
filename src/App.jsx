
import { useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CourseList from "./components/CourseList";
import CourseForm from "./components/CourseForm";
import Footer from "./components/Footer";

import useCourses from "./hooks/useCourses";

import "./App.css";

function App() {
  // Course data and operations come from the custom hook.
  const {
    displayedCourses,
    enrolledCourses,
    search,
    setSearch,
    loading,
    error,
    handleAddCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    handleEnroll,
    retryFetch,
  } = useCourses();

  // UI state: these values control the create/edit modal.
  const [editingCourse, setEditingCourse] = useState(null);
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);

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

  // Save a new course or update an existing one.
  function handleSaveCourse(courseData) {
    if (editingCourse) {
      handleUpdateCourse({
        ...courseData,
        id: editingCourse.id,
      });
    } else {
      handleAddCourse(courseData);
    }

    handleCancelEdit();
  }

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
            <p>
              Discover courses and manage your learning content.
            </p>
          </div>

          <button
            type="button"
            className="create-course-button"
            onClick={handleStartCreate}
          >
            + Create Course
          </button>
        </section>

        {/* Shared create/edit modal */}
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
              onClick={retryFetch}
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
