
function Header({ enrolledCount = 0 }) {
  return (
    <header className="site-header">
      <div className="container header-content">
        <a className="brand" href="/" aria-label="LearnHub home">
          LearnHub<span>.</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#courses">Courses</a>
          <a href="#add-course">Create Course</a>
        </nav>

        <div className="enrollment-summary">
          Enrolled: <strong>{enrolledCount}</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;
