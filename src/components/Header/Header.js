import "./Header.scss";
import logo from '../../assets/images/logos/logo.svg'
import timer from '../../assets/images/icons/stopwatch-gr.svg'
import invoices from '../../assets/images/icons/invoice-gr.svg'
import entries from '../../assets/images/icons/entries-gr.svg'
import { NavLink } from 'react-router-dom';
function Header() {

    return (
        <header className="header">
           <NavLink to={'/'} className='header__link'>
            <img src={logo} />
            </NavLink>

            <nav className="nav">
                <NavLink to={'/'} className='nav__link'>
                    <button className="nav__btn">
                        Timer <img src={timer} alt="timer icon" />
                    </button>
                </NavLink>

                <NavLink to={'/entries'} className='nav__link'>
                    <button className="nav__btn">
                        Time Entries <img src={entries} alt="entries icon" />
                    </button>
                </NavLink>

                <NavLink to={'/invoices'} className='nav__link'>
                    <button className="nav__btn">
                        Invoices <img src={invoices} alt="invoices icon" />
                    </button>
                </NavLink>

            </nav>
        </header>

    )
}

export default Header;