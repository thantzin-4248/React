
const API_URL = "https://jsonplaceholder.typicode.com/users";

const categories = ["Frontend", "Backend", "Database", "DevOps"];

export async function getCourses(search = "", signal) {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch courses (${response.status}).`);
  }

  const users = await response.json();

  const courses = users.map((user, index) => ({
    id: user.id,
    title: `Introduction to ${user.company.name}`,
    instructor: user.name,
    instructorEmail: user.email,
    description: `${user.company.catchPhrase}. ${user.company.bs}.`,
    category: categories[index % categories.length],
    price: 49.99 + index * 10,
    rating: Number((4 + (index % 10) / 10).toFixed(1)),
    students: (index + 1) * 25,
  }));

  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return courses;
  }

  return courses.filter((course) => {
    const searchableText = [
      course.title,
      course.instructor,
      course.instructorEmail,
      course.category,
      course.description,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
}
