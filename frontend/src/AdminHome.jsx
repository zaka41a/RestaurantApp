import { Link } from "react-router-dom";
import Icon from "./components/Icon.jsx";

const actions = [
  {
    to: "/servers",
    title: "Team management",
    description: "Invite, onboard, and support servers to keep the floor running smoothly.",
    icon: "users",
  },
  {
    to: "/admin/tables",
    title: "Table rotation",
    description: "Track dining room turnover , and update (servers,admin) table status in real time ",
    icon: "table",
  },
  {
    to: "/admin/menu",
    title: "Menu builder",
    description: "Publish new dishes, update pricing, and showcase photography instantly.",
    icon: "menu",
  },
  {
    to: "/orders",
    title: "Smart ordering",
    description: "Compose accurate orders and push them to the kitchen in one click.",
    icon: "orders",
  },
];

export default function AdminHome() {
  async function logout() {
    await fetch("http://localhost/RestaurantApp/backend/api/auth/logout.php", {
      credentials: "include",
    });
    window.location.href = "/";
  }

  return (
    <div className="page">
      <section className="hero surface-card">
        <div className="hero__content">
          <span className="eyebrow">Administration • RestaurantApp</span>
          <h1 className="page-title">Run your dining room like a pro.</h1>
          <p className="page-subtitle">
            Align teams, anticipate peak hours, and keep every shift in sync from a single, modern
            control panel.
          </p>
          <div className="hero__actions">
            <Link to="/orders" className="btn btn-primary">
              <Icon name="orders" size={18} />
              <span>Create order</span>
            </Link>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              <Icon name="logout" size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        <div className="hero__stat-area">
          <div className="stat-card">
            <span className="label">Uptime</span>
            <span className="value">24/7</span>
            <p className="page-subtitle">Data stays synced across every service.</p>
          </div>
          <div className="stat-card">
            <span className="label">Current role</span>
            <span className="value">Administrator</span>
            <p className="page-subtitle">
              Full access to configuration, staff, and operational workflows.
            </p>
          </div>
        </div>
      </section>

      <section className="grid">
        <header className="page-header">
          <div className="page-header__info">
            <span className="eyebrow">Quick navigation</span>
            <h2 className="page-title">Reach every operational pillar in one tap.</h2>
            <p className="page-subtitle">
              Open the modules you rely on for pre-shift prep, live service decisions, and
              post-service follow-up.
            </p>
          </div>
        </header>

        <div className="tiles-grid">
          {actions.map((action) => (
            <Link key={action.to} to={action.to} className="tile-card">
              <div className="tile-card__icon">
                <Icon name={action.icon} size={22} />
              </div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <div className="tile-card__footer">
                <span className="badge-neutral badge">Open</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
