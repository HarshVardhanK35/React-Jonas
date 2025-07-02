import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // we used "value" not "watched" and same for setter fn too.. for reusing the custom-hook for other apps also
  // what ever this below fn returns.. will be the value for 'initialState'
  //
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    //
    // sometimes if there were no items inside "localStorage" return initialState that is... []
    return storedValue ? JSON.parse(storedValue) : initialState;
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
