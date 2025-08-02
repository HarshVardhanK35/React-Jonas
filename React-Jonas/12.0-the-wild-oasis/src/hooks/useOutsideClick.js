import { useEffect, useRef } from "react";

function useOutsideClick(closeHandler, listenCapturing = true) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          closeHandler();
        }
      } // this lies here to remove immediately
      document.addEventListener("click", handleClick, listenCapturing);

      return function () {
        document.removeEventListener("click", handleClick, listenCapturing);
      }; // when comp "un-mounts" remove "handleClick" function
    },
    [closeHandler, listenCapturing]
  );
  return { ref };
}

export default useOutsideClick;
