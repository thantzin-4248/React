import { useEffect, useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CourseList from "./components/CourseList";
import Footer from "./components/Footer";

import { getCourses } from "./services/courseService";

import "./App.css";

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Lesson 6: debounce the search and cancel outdated requests.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCourses(search, controller.signal);

        setCourses(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 500);

    // Cleanup runs before the effect reruns and on unmount.
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, refreshKey]);

  // Lesson 4: derived data does not need its own state.
  const totalCourses = courses.length;

  // Lesson 3/4: update shared enrollment state in the parent.
  const handleEnroll = (courseId) => {
    setEnrolledCourses((currentCourses) => {
      if (currentCourses.includes(courseId)) {
        return currentCourses;
      }

      return [...currentCourses, courseId];
    });
  };

  return (
    <div className="app">
      <Header enrolledCount={enrolledCourses.length} />

      <main>
        <section className="hero container">
          <p className="eyebrow">WELCOME TO LEARNHUB</p>
          <h2>Build skills for your future.</h2>
          <p>Discover courses and learn from instructors around the world.</p>
        </section>

        <SearchBar search={search} onSearchChange={setSearch} />

        <section className="course-summary container">
          <p>
            {loading
              ? "Searching courses..."
              : `Showing ${courses.length} ${
                  courses.length === 1 ? "course" : "courses"
                }`}
          </p>
        </section>

        {error && (
          <section className="container error-state">
            <h3>Unable to load courses</h3>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              Try again
            </button>
          </section>
        )}

        {!error && loading && (
          <div className="container status-message">Loading courses...</div>
        )}

        {!error && !loading && (
          <CourseList
            courses={courses}
            enrolledCourses={enrolledCourses}
            onEnroll={handleEnroll}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
