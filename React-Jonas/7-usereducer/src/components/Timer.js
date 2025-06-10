import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      return function () {
        clearInterval(id);
      };
    },
    [dispatch]
  );

  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 ? "0" : ""}
      {seconds}
    </div>
  );
}

export default Timer;

/**
 * ... initializing Timer when this component "mounts"
 *
 * ... we are using logic here.. so that whenever this component on mounts.. will start the timer
 *      ... we are not using "useEffect" to start timer inside App(), cause Timer would start on App() component "mounts"
 *
 * ... the state starts from max-time and then removes a second for each interval
 *
 * there was a problem raised, while building this component..
 *      ... even when that component unmounted timer has not stopped and keeps running
 *      ... so we have to use "clean-up" fn
 * (an amazing example / use-case for "clean-up" fn)
 *
 * ... so store the "id" that was returned from the "setTimeout" fn
 *      ... on every single "Interval": "setInterval" returns a unique "ID"
 * ex:
return function() {
    clearInterval(id);
};
 * 
 * ... we use this ID to clear-interval
 *      ... the above clean-up runs on every re-render and after comp gets un-mounted
 *      ... previously, many timers were running at the same time
 * 
 * 
 * 
 * 
 *
 *
 */
