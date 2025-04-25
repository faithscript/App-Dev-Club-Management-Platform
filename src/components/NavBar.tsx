import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  Medal,
  UsersRound,
  ChevronDown,
  Menu,
  ListChecks,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Logo from "./Logo";

const NavBar = () => {
  const { logout } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-purple-950 fixed top-0 w-full z-40 border-b border-indigo-100 rounded-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/*Logo/Home Button*/}
          <Link to="/" className="flex items-center space-x-3 group">
            <div>
              <Logo size={3} />
            </div>

            <h1 className="text-xl font-bold text-white">Ctrl-Alt-Elite</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <>
              {/*Bucket List Button*/}
              <Link
                to="/bucketlist"
                className="px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-purple-700 transition duration-200"
              >
                <ListChecks className="size-4 text-white" />
                <span>Bucket List</span>
              </Link>
              {/*Groups Button*/}
              <Link
                to="/groups"
                className="px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-purple-700 transition duration-200"
              >
                <UsersRound className="size-4 text-white" />
                <span>Groups</span>
              </Link>

              {/*Leaderboard Button*/}
              <Link
                to="/leaderboard"
                className="px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-purple-700 transition duration-200"
              >
                <Medal className="size-4 text-white" />
                <span>Leaderboard</span>
              </Link>

              {/*Menu Dropdown*/}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-purple-700 transition duration-200"
                >
                  <Menu className="size-4 text-white" />
                  <span>Menu</span>
                  <ChevronDown className="size-3 text-white" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-purple-950 rounded-md shadow-lg py-1 z-50 border border-indigo-100">
                    {/*Profile Icon*/}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-purple-700 transition duration-200"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-white" />
                        <span>Profile</span>
                      </div>
                    </Link>

                    {/*Logout Button*/}
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-purple-700 transition duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="size-4 text-white" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
