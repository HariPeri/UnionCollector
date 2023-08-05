import { Link, useLocation } from 'react-router-dom';
import { kebabCase } from 'lodash';
import ComingSoon from '../assets/ComingSoonDownloaded-removebg-preview.png';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext';

function Navbar() {
    // storing current location path
    const location = useLocation();

    const { logout } = useLogout();

    const {
        state: { user },
    } = useAuthContext();

    // function that takes in heading
    const isHeadingActive = (heading: string) => {
        const convHeading = kebabCase(heading); // converts heading text to lowercase & adds hyphens in spaces
        const parts = location.pathname.split('/'); // splits the pathname tring wherever a / is detected
        const activeHeading = parts[1]; // accesses the heading portion of the address
        return convHeading === activeHeading; // returns true or false depending on if on that specific heading page
    };

    // styling for different components
    const linkStyles = 'hover:text-red-200 transition duration-300 p-4'; // navbar menu items when hovered

    const handleClick = () => {
        logout();
    };

    return (
        // div containing entire navbar (using flex for row view)
        <div className="flex h-24 bg-blue-900 text-white">
            {/* YIW + Logo (allocating 1/3 space for div, centered vertically) */}
            <div className="ml-12 flex gap-3 items-center basis-1/3 text-3xl font-bold">
                {/* inserting uva wise logo inside div */}
                <Link to="/"> My Collection </Link>
            </div>
            {/* Menu options (centered vertically, positioned to right) */}
            <div className="flex items-center basis-2/3 justify-end font-bold">
                {/* List of headers (flex for row view, gap between list items with margin on right) */}
                <ul className="flex gap-16 mr-12">
                    {/* changing hover text color with a transition time of 300ms */}
                    <li>
                        <Link
                            className={`${linkStyles} ${
                                isHeadingActive('Collection')
                                    ? 'text-red-300'
                                    : ''
                            } `}
                            to="/collection"
                        >
                            Collection
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`${linkStyles} ${
                                isHeadingActive('Recent Additions')
                                    ? 'text-red-300'
                                    : ''
                            } `}
                            to="/recent-additions"
                        >
                            Recent Additions
                        </Link>
                    </li>
                    <li className="relative ">
                        Wantlist
                        <div className="absolute left-0 -top-6 -rotate-12 h-[100px] w-[100px]  ">
                            <img src={ComingSoon} alt="ComingSoon.png" />
                        </div>
                    </li>
                    <li className="relative ">
                        Tradelist
                        <div className="absolute left-0 -top-6 -rotate-12 h-[100px] w-[100px]  ">
                            <img src={ComingSoon} alt="ComingSoon.png" />
                        </div>
                    </li>
                </ul>
                <div className="flex">
                    <button
                        className="rounded-md bg-union-gold px-4 py-3 my-7 transition duration-300 hover:bg-orange-700 hover:text-white mr-8"
                        type="button"
                    >
                        Contact Me!
                    </button>
                    {!user && (
                        <div className="mr-4 mt-4">
                            <Link to="/login">
                                <div>Login</div>
                            </Link>
                            ------
                            <Link to="/signup">
                                <div>Sign up</div>
                            </Link>
                        </div>
                    )}
                    {user && (
                        <div className="w-[150px] flex flex-col mt-4 mr-6 text-md">
                            <div className="text-xs text-center">
                                {user.email}
                            </div>
                            <div> ---------------- </div>
                            <button type="button" onClick={handleClick}>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// exporting the navbar
export default Navbar;
