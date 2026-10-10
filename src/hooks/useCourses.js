
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCourses } from "../services/courseService";

export default function useCourses() {
  // Courses fetched from the API.
  const [courses, setCourses] = useState([]);

  // Frontend-only changes.
  const [createdCourses, setCreatedCourses] = useState([]);
  const [updatedCourses, setUpdatedCourses] = useState([]);
  const [deletedCourseIds, setDeletedCourseIds] = useState([]);

  // Enrollment and page state.
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch courses when search or retry changes.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCourses(search, controller.signal);

        if (!controller.signal.aborted) {
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
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

  // Normalize IDs so numeric and string IDs compare consistently.
  const sameId = (first, second) =>
    String(first) === String(second);

  // Combine API courses with local create, update, and delete changes.
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

    const visibleCreatedCourses = createdCourses.filter(matchesSearch);

    const visibleApiCourses = courses
      .filter(
        (course) =>
          !deletedCourseIds.some((id) => sameId(id, course.id))
      )
      .map((course) => {
        const updatedCourse = updatedCourses.find((item) =>
          sameId(item.id, course.id)
        );

        return updatedCourse ?? course;
      })
      .filter(matchesSearch)
      .filter(
        (course) =>
          !createdCourses.some((item) =>
            sameId(item.id, course.id)
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
  const handleAddCourse = useCallback((newCourse) => {
    setCreatedCourses((current) => [newCourse, ...current]);
  }, []);

  // UPDATE
  const handleUpdateCourse = useCallback(
    (updatedCourse) => {
      const isCreatedCourse = createdCourses.some((course) =>
        sameId(course.id, updatedCourse.id)
      );

      if (isCreatedCourse) {
        setCreatedCourses((current) =>
          current.map((course) =>
            sameId(course.id, updatedCourse.id)
              ? updatedCourse
              : course
          )
        );

        return;
      }

      setUpdatedCourses((current) => {
        const alreadyUpdated = current.some((course) =>
          sameId(course.id, updatedCourse.id)
        );

        if (alreadyUpdated) {
          return current.map((course) =>
            sameId(course.id, updatedCourse.id)
              ? updatedCourse
              : course
          );
        }

        return [...current, updatedCourse];
      });
    },
    [createdCourses]
  );

  // DELETE
  const handleDeleteCourse = useCallback(
    (courseId) => {
      const course = displayedCourses.find((item) =>
        sameId(item.id, courseId)
      );

      if (!course) return;

      const confirmed = window.confirm(
        `Are you sure you want to delete "${course.title}"?`
      );

      if (!confirmed) return;

      setCreatedCourses((current) =>
        current.filter((item) => !sameId(item.id, courseId))
      );

      setUpdatedCourses((current) =>
        current.filter((item) => !sameId(item.id, courseId))
      );

      setDeletedCourseIds((current) =>
        current.some((id) => sameId(id, courseId))
          ? current
          : [...current, courseId]
      );

      setEnrolledCourses((current) =>
        current.filter((id) => !sameId(id, courseId))
      );
    },
    [displayedCourses]
  );

  // ENROLL
  const handleEnroll = useCallback((courseId) => {
    setEnrolledCourses((current) =>
      current.some((id) => sameId(id, courseId))
        ? current
        : [...current, courseId]
    );
  }, []);

  // Retry the API request.
  const retryFetch = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

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
    retryFetch,
  };
}
