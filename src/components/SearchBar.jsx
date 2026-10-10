
function SearchBar({ search, onSearchChange }) {
  return (
    <section className="container search-section">
      <label htmlFor="course-search">Find your next course</label>

      <input
        id="course-search"
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by course, instructor, or category..."
      />
    </section>
  );
}

export default SearchBar;
