import "./Header.scss";
import logo from '../../assets/images/logos/logo.svg'
import timer from '../../assets/images/icons/stopwatch.svg'
import invoices from '../../assets/images/icons/invoice.svg'
import entries from '../../assets/images/icons/entries.svg'
import { NavLink } from 'react-router-dom';
function Header() {

    return (
        <>
            <header>
                <img src={logo} />

                <nav>
                    <NavLink to={'/'} alt=''>
                        <button>
                            Timer <img class src={timer} alt="timer icon" />
                        </button>
                    </NavLink>

                    <NavLink to={'/entries'} alt=''>
                        <button>
                            Time Entries <img src={entries} alt="entries icon" />
                        </button>
                    </NavLink>

                    <NavLink to={'/invoices'} alt=''>
                        <button>
                            Invoices <img src={invoices} alt="invoices icon" />
                        </button>
                    </NavLink>

                </nav>
            </header>
        </>
    )
}

export default Header;