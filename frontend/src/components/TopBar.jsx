import { useNavigate } from "react-router-dom";
import logoMark from "../assets/logo-mark.svg";
import Icon from "./Icon.jsx";

export default function TopBar({ title, onLogout, right, backTo }) {
  const nav = useNavigate();

  return (
    <header className="surface-card topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="topbar__back"
          onClick={() => (backTo ? nav(backTo) : nav(-1))}
        >
          <Icon name="arrowLeft" size={18} />
          <span>Back</span>
        </button>

        <div className="topbar__brand">
          <img src={logoMark} alt="RestaurantApp" />
          <div className="topbar__title">
            <span className="eyebrow">RestaurantApp</span>
            <h1>{title}</h1>
          </div>
        </div>
      </div>

      <div className="topbar__right">
        {right}
        <button type="button" className="btn btn-ghost" onClick={onLogout}>
          <Icon name="logout" size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
