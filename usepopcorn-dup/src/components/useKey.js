import { useEffect } from "react";

export function useKey(key, action) {
  // Globally: listen to "Escape" key
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {          // clean-up: to remove existing event
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
