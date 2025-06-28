import { Link } from "react-router-dom";

function Button({ children, onDisabled, to, type }) {
  const base =
    "inline-block text-sm rounded-full bg-yellow-400  uppercase font-semibold tracking-wide text-stone-800 hover:bg-yellow-300 transition-colors duration-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-1 disabled:cursor-not-allowed";

  const styles = {
    primary: base + " px-4 py-3 md:px-6 md:py-4",
    small: base + " px-3 py-2 md:px-4 md:py-3 text-xs",
    secondary:
      "inline-block text-sm rounded-full border-2 border-stone-300 uppercase font-semibold tracking-wide text-stone-400 hover:bg-stone-200 hover:text-stone-800 transition-colors duration-300 focus:bg-stone-200 focus:text-stone-800 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-1 disabled:cursor-not-allowed px-4 py-2.5 md:px-6 md:py-3.5",
  };

  if (to) {
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={onDisabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
