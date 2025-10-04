import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.svg";

export default function Header() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Weight", path: "/weight" },
    { name: "Hormones", path: "/hormones" },
    { name: "Dental", path: "/dental" },
    { name: "Heart", path: "/heart" },
    { name: "Mobility", path: "/mobility" },
    { name: "Health Records", path: "/health-records" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="header">
      <nav className="nav-container">

      <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

      </nav>
    </header>
  );
}
