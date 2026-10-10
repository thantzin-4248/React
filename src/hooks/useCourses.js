
import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../services/courseService";

export default function useCourses() {
  // Courses fetched from the API.
  const [courses, setCourses] = useState([]);

  // Local changes that have not been saved to a backend.
  const [createdCourses, setCreatedCourses] = useState([]);
  const [updatedCourses, setUpdatedCourses] = useState([]);
  const [deletedCourseIds, setDeletedCourseIds] = useState([]);

  // Other course-related state.
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses whenever the search term changes.
  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getCourses(
          search,
          controller.signal
        );

        setCourses(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load courses. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search]);

  // Build the final list from API data and local changes.
  const displayedCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch = (course) => {
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
    };

    const visibleCreatedCourses = createdCourses.filter(
      matchesSearch
    );

    const visibleApiCourses = courses
      .filter(
        (course) =>
          !deletedCourseIds.some(
            (id) => String(id) === String(course.id)
          )
      )
      .map((course) => {
        const updatedCourse = updatedCourses.find(
          (item) => String(item.id) === String(course.id)
        );

        return updatedCourse ?? course;
      })
      .filter(matchesSearch)
      .filter(
        (course) =>
          !createdCourses.some(
            (item) => String(item.id) === String(course.id)
          )
      );

    return [...visibleCreatedCourses, ...visibleApiCourses];
  }, [
    courses,
    createdCourses,
    updatedCourses,
    deletedCourseIds,
    search,
  ]);

  // CREATE
  function handleAddCourse(courseData) {
    setCreatedCourses((previous) => [
      courseData,
      ...previous,
    ]);
  }

  // UPDATE
  function handleUpdateCourse(courseData) {
    const isLocallyCreated = createdCourses.some(
      (course) =>
        String(course.id) === String(courseData.id)
    );

    if (isLocallyCreated) {
      setCreatedCourses((previous) =>
        previous.map((course) =>
          String(course.id) === String(courseData.id)
            ? courseData
            : course
        )
      );

      return;
    }

    setUpdatedCourses((previous) => {
      const alreadyUpdated = previous.some(
        (course) =>
          String(course.id) === String(courseData.id)
      );

      if (alreadyUpdated) {
        return previous.map((course) =>
          String(course.id) === String(courseData.id)
            ? courseData
            : course
        );
      }

      return [...previous, courseData];
    });
  }

  // DELETE
  function handleDeleteCourse(courseId) {
    const course = displayedCourses.find(
      (item) => String(item.id) === String(courseId)
    );

    if (!course) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?`
    );

    if (!confirmed) return;

    setCreatedCourses((previous) =>
      previous.filter(
        (item) => String(item.id) !== String(courseId)
      )
    );

    setUpdatedCourses((previous) =>
      previous.filter(
        (item) => String(item.id) !== String(courseId)
      )
    );

    setDeletedCourseIds((previous) =>
      previous.some((id) => String(id) === String(courseId))
        ? previous
        : [...previous, courseId]
    );

    setEnrolledCourses((previous) =>
      previous.filter(
        (id) => String(id) !== String(courseId)
      )
    );
  }

  // ENROLL
  function handleEnroll(courseId) {
    setEnrolledCourses((previous) =>
      previous.some(
        (id) => String(id) === String(courseId)
      )
        ? previous
        : [...previous, courseId]
    );
  }

  return {
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
  };
}
