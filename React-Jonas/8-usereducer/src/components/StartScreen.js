function StartScreen({numQuestions, dispatch}) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuestions} question to test your React Mastery</h3>
          <button className="btn btn-ui" onClick={() => dispatch({type: "start"})}>Let's start</button>
    </div>
  );
}
export default StartScreen;

/**
 * 'X' questions will be calculated inside App.js at "derived-state"
 *      ... inside App() component
 *      ... calculated data will be then transferred via props 
 * 
 * 'Let's Start'.. 
 *      ... a button, on-click has to start the quiz and set status to "active"
 *      ... we have to receive "dispatch" via props into this component 
 *                  (dispatch returned from useReducer-Hook sent from "App" comp)
 *      ... calling dispatch using "onClick" set to "button - Let's Start"
 * 
 * 
 * 
 * 
 */
