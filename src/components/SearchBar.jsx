
function SearchBar({ search, onSearchChange }) {
    return (
        <section className="search-section">
            <div className="container">
                <label htmlFor="course-search">
                    Search courses
                </label>

                <div className="search-wrapper">
                    <input
                        id="course-search"
                        type="search"
                        placeholder="Title, instructor, or category..."
                        value={search}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => onSearchChange('')}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default SearchBar
