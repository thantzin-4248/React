
const API_URL = 'https://jsonplaceholder.typicode.com/users'

export async function getCourses(search = '', signal) {
    const response = await fetch(API_URL, {
        signal,
    })

    // fetch does not automatically reject HTTP 404/500 responses.
    if (!response.ok) {
        throw new Error(
            `Failed to load courses. HTTP ${response.status}`
        )
    }

    const users = await response.json()

    // Transform API users into LearnHub course objects.
    const courses = users.map((user) => ({
        id: user.id,
        title: `${user.name} Development`,
        instructor: user.name,
        instructorEmail: user.email,
        description: `Learn development concepts with ${user.name}.`,
        students: user.id * 250,
        price: user.id * 10 + 19,
        category: user.id % 2 === 0
            ? 'Backend'
            : 'Frontend',
        rating: Number((4.5 + user.id / 10).toFixed(1)),
    }))

    // The demo API does not support a real course-search endpoint.
    // Filter the transformed data locally for this exercise.
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) {
        return courses
    }

    return courses.filter((course) => (
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.category.toLowerCase().includes(normalizedSearch) ||
        course.instructor.toLowerCase().includes(normalizedSearch)
    ))
}
