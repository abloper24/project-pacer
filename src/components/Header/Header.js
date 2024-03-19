import "./Header.scss";

function Header() {

    const clickHandler = (event) => {
        event.preventDefault();
        alert("I've been clicked!");
    };

    return (
        <>
            <header>
                <nav>
                    <button onClick={clickHandler}>
                        Timer
                    </button>
                    <button onClick={clickHandler}>
                        Time Entries
                    </button>
                    <button onClick={clickHandler}>
                        Invoices
                    </button>

                </nav>
            </header>
        </>
    )
}

export default Header;