
function Header({ enrolledCount }) {
    return (
        <header className="header">
            <div className="container header-content">
                <a className="brand" href="/">
                    LearnHub
                </a>

                <nav aria-label="Main navigation">
                    <a href="#home">Home</a>
                    <a href="#courses">Courses</a>
                    <a href="#about">About</a>
                </nav>

                <div className="my-courses">
                    My Courses:
                    <strong>{enrolledCount}</strong>
                </div>
            </div>
        </header>
    )
}

export default Header
