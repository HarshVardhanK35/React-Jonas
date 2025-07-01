import { Link, useNavigate } from "react-router-dom";

function LinkButton({ children, to }) {
  const navigate = useNavigate();
  const className =
    "text-xs text-blue-500 hover:text-black hover:ring hover:ring-slate-300 hover:ring-offset-1 rounded-full";

  if (to === "-1")
    return (
      <button
        className={`${className} sm:text-lg `}
        onClick={() => navigate(-1)}
      >
        &larr; Go back
      </button>
    );
  return (
    <Link
      to={to}
      className={`${className} inline-block sm:text-lg
    `}
    >
      {children}
    </Link>
  );
}

export default LinkButton;
