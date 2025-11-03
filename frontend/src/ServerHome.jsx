import { Link } from "react-router-dom";
import Icon from "./components/Icon.jsx";

export default function ServerHome() {
  async function logout() {
    await fetch("http://localhost/RestaurantApp/backend/api/auth/logout.php", {
      credentials: "include",
    });
    window.location.href = "/";
  }

  return (
    <div className="server-home">
      <div className="server-home__panel surface-card">
        <span className="eyebrow">Server workspace</span>
        <h1 className="page-title">Deliver a flawless guest journey.</h1>
        <p className="page-subtitle">
          Jump straight into the tasks that matter most—capture orders, coordinate tables, and keep
          the menu at your fingertips.
        </p>

        <div className="action-links">
          <Link to="/server/orders" className="action-link">
            <span className="action-link__icon">
              <Icon name="orders" size={20} />
            </span>
            <div>
              <span className="action-link__title">Create a new order</span>
              <span className="action-link__subtitle">
                Build the ticket and send it to the kitchen in one go.
              </span>
            </div>
          </Link>

          <Link to="/server/tables" className="action-link">
            <span className="action-link__icon">
              <Icon name="table" size={20} />
            </span>
            <div>
              <span className="action-link__title">Monitor table rotation</span>
              <span className="action-link__subtitle">
                Check availability, flip status, and keep guests moving.
              </span>
            </div>
          </Link>

          <Link to="/server/menu" className="action-link">
            <span className="action-link__icon">
              <Icon name="menu" size={20} />
            </span>
            <div>
              <span className="action-link__title">Review the live menu</span>
              <span className="action-link__subtitle">
                Share dish highlights, pricing, and chef notes instantly.
              </span>
            </div>
          </Link>
        </div>

        <div className="server-home__footer">
          <button type="button" className="btn btn-ghost" onClick={logout}>
            <Icon name="logout" size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
