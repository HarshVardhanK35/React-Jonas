/**
 * ! what is react?
 * - JavaScript Library for building User-Interfaces
 * ? Main goal of react is to keep UI in sync with data/state. 
 * 
 * - actual definition react... 
 *      - declarative, component-based, state-driven JS library for building user-interfaces
 * 
 * * Components:
 * - these are the building blocks of web-apps
 *      - we build multiple and complex components and combine them to make a web-app
 *      - we can re-use them to make complex web-apps
 * 
 * * Declarative:
 * - we describe how components look like and how they work using a declarative syntax called "JSX"
 *      - based on the current data/state  
 *      - React abstracts DOM and it's manipulation.. react manipulates the DOM on behind.. we don't work with DOM as we did using JS
 * 
 * * JSX:
 * - use JSX syntax, which is a combination of HTML, JS, CSS
 * 
 * 
 * * State:
 * - data that changes every minute, so React reacts to state/data change and re-renders the UI
 * 
 * * Library or Framework? 
 * - React is JS library not a framework! 
 *      - using react, many frameworks have been built such as Next.js and Remix
 * 
 * ! Note: 
 * - 1. Every react component is a JS function and has to start with "Upper-Case"
 * - 2. Every JS Functional Component need to return a JSX code!
 * 
 * * Writing Pure React!
 * ---
 * - 1. this involves... including react related script tags, which fetches includes react into "index.html"... this can get from React's official docs [LINK]: "react.dev"
 * - 2. writing component.. App()
 *    - which returns a render-able time component.. which updates on every 1sec
 * - 3. Updating the time component is done with "React.useState()" and "React.useEffect()"
 * 
ex:
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pure React</title>
  </head>
  <body>
    <div id="root"></div>

    <!-- React Core -->
    <script
      src="https://unpkg.com/react@18/umd/react.development.js"     //? --- 1
      crossorigin
    ></script>

    <!-- React DOM -->
    <script
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"     //? --- 1
      crossorigin
    ></script>

    <script>
        function App() {
            // const time = new Date().toLocaleTimeString()
            const [time, setTime] = React.useState(new Date().toLocaleTimeString())
            
            React.useEffect(function() {
                setInterval(() => {
                    setTime(new Date().toLocaleTimeString())
                }, 1000)
            }, [])
            return React.createElement("header", null, `Hello React! it's ${time}`)
        }
        const root = ReactDOM.createRoot(document.getElementById("root"))
        root.render(React.createElement(App))
    </script>
  </body>
</html>
 * 
 * ! Note: 
 * - return React.createElement("header", null, `Hello React! it's ${time}`)
 *  - method "createElement" takes in... 
 *      - 1. component name that we wanted to create that is "header"
 *      - 2. null: which is set in place of "PROPS"
 *      - 3. data that is rendered between created component that is "header"
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */