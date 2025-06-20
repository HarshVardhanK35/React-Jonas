// ! React Router: Building Single Page Applications (SPA)
// -------------------------------------------------------
/**
 * ! 1. Creating Our First App With Vite: "WorldWise"
 * 
 * * we are using "VITE" to create a react app
 * ---------------------------------------------
 * #1 terminal 
 *    => npm create vite@latest 
 * 
 * - then it asks for a confirmation, project-name, selection of framework and variant
 * 
 * - "cd" into created folder
 * #2 after INSTALLATION:
 *      - vite only sets up the necessary packages and we must install them, use...
 *          => "npm install"
 *      - to start the application, we have to use..
 *          => "npm run dev"
 * 
 * #3 we have to manually open the application with 'URL' provided after installation
 * 
 * $ NOTE:
 * - we used "npm start" for apps created with "npx create-react-app my-react-app"
 * - but here we have to use "npm run dev" 
 *      - according to "dev" script inside - "package.json"
 * 
- package.json
--------------
"scripts": {
    "dev": "vite",            // - this is why it is: "npm run dev"
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
},
 * 
 * * Manual Configuration of "ESLint"
 * -----------------------------------
 * - inside apps created with "npm create-react-app" 
 *      - the ESLint is automatically configured
 * 
 * - whereas inside "vite" apps the "ESLint" is not configured and we have to configure it manually
 *      - so, we need to install few more NPM packages
 * 
 * => npm install eslint vite-plugin-eslint eslint-config-react-app --save-dev
 *      - install them as dev-dependencies
 * 
 * - create a new file: ".eslintrc.json" inside main app folder
 *      - here config the behavior of "eslint" 
 *      - extend the default rules of "eslint" with react rules that we installed
{
    "extends": "react-app"
}
 * 
 * - inside "vite.config.js"..
 *      - we need to modify this to configure eslint
 * 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
 * 
 * - modified:
 * 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from "vite-plugin-eslint"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
})
 * 
 * - but I have used "chatGPT" to configure eslint manually 
 * 
 * #1 install ESLint and required plugins
 * - npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
 * 
 * #2 for Vite + JSX + ES modules support (recommended + OPTIONAL):
 * - npm install -D @eslint/js
 * 
 * #3 manually create ".eslintrc.json"
 * - and copy paste the following..
 * 
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["react", "react-hooks"],
  "rules": {},
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}

 *  
 * #4 Add a lint script in package.json: (OPTIONAL)
"scripts": {
  "lint": "eslint . --ext .js,.jsx"
} 
 * 
 * # OPTIONALS
 * - 1. npm install -D prettier eslint-config-prettier
 * 
 * - 2. update ESLint config:
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',
  'prettier'
],
 * 
 * ! 2. Routing and Single-Page Applications (SPAs)
 * 
 * * Routing:
 * -----------
 * - with "ROUTING", we match different URLs to different UI views (which are react components) => ROUTING
 *    - when one of those URLs visited, corresponding react component will be rendered!
 * 
 * - ex: 
 *    - "/"       =>  "home-page" 
 *    - "/login"  =>  "login-page"  
 * 
 * - this enables users to navigate between different application screens, using browser URL 
 * 
 * >>> in REACT, we use 3rd party package to handle "routing" 
 *    => React Router
 * 
 * >>> Routing is fundamental to build "Single-Page Applications"
 * 
 *  * Single Page Apps (SPA)
 * ---------------------------
 * - these are the web-apps executed entirely on "client-side" 
 *    - so these "rely" on routes
 * 
 * >>> Routes: different URLs correspond to different views or components
 * 
 * - whenever a user clicks on links provided by Router, URL on browser changes
 *    - in case of React, this is done with "React-Router" 
 * 
 * - changing the URL, trigger the update inside DOM as a result 
 *    - JS (react) code updates the DOM
 * 
 * >>> DOM Update:
 * - so normally, page re-loading happens when user clicks on a link
 *    - but with react, DOM will be "updated" 
 * 
 * (react component corresponding to that URL is rendered)
 * - So no page will be reloaded, only updates are done with "REACT"
 *    - that is // => an entire app in one page
 * 
 * ! 3. Implementing Main Pages and Routes
 * 
 * >>> installation: 
 *    => "npm install react-router-dom"
 * 
 * - but according to lecture and follow up, use: // => npm i react-router-dom@6
 *    - install version: 06
 * 
 * - create some pages that we want to update the render on specific routes
 *    - "/"         => "homepage"
 *    - "/product"  => "product"
 *    - "/pricing"  => "pricing" pages
 * 
 * - we use declarative approach and traditional way to define routes and implement "routing"
 * 
 * >>> Implementation:
 * - create above three page-files in root folder or inside separate "pages- folder"
 *    - "homepage", "product", "pricing"
 * ex:
 * ---
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNoteFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        //
        <Route path="*" element={<PageNoteFound />} />    // - works for all other routes, other than above specified routes 
      </Routes>
    </BrowserRouter>
  );
}
export default App;
 * 
 * >>> route with path "*" (path='*') 
 * - this works for all other routes other than specified with "/", "product", "pricing"
 * - when other URLs that does not match with already specified ones!
 *  
 * ex:
 * ---
<Route path = "*" element={ <PageNotFound /> } />
 * 
 * $ NOTE:
 * - we are passing on the complete element like.. 
 *    - <Product /> into element={<Product />}
 * - so that we can pass in props into that element 
 * 
 * - till now..
 *    - with this set-up.. we are routing through components by manually changing URLs
 * 
 * >>> but we need single-page app, so we need links (linking pages)
 *    - gonna learn this in next topic 
 * 
 * ! 4. Linking Between Routes With <Link /> and <NavLink />
 * 
 * >>> Traditional Way:
 * 
 * - setting up anchor tags 
 *    => <a href="/product"> Product </a>
 * 
 * - we need movement from one page to other, by simply replacing DOM content
 *    - but if we followed this.. we see a hard-reload happening while clicking on those links
 * 
 * >>> Modern way:
 * 
 * - so we use "link" that was provided by same react-router-dom
 * ex:
 * ---
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      HomePage
      <Link to="/product">Product</Link>
    </div>
  );
}   
 * 
 * $ NOTE:
 * - inside "to" prop of "Link".. 
 *    - specify the slash before the page, so it starts from "root/product"
 * 
 * - this makes single-page-application
 *    - we can see that there were no hard-reloading and moving one to another with replacement of DOM
 *    
 * - with the above implementation we can only move from "Homepage" to "/Product" 
 *    - so we implement a "page-navigation"... so that we can use in other pages as well 
 * 
 * ex:
 * ---
PageNav.jsx (a reusable component)
------------
import { Link } from "react-router-dom";

function PageNav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/product">Product</Link>
        </li>
        <li>
          <Link to="/pricing">Pricing</Link>
        </li>
      </ul>
    </nav>
  );
}
export default PageNav;
 *  
 * - include "PageNav" component inside every page that we created like..
 * ex:
 * ---
import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";

export default function HomePage() {
  return (
    <div>
      <PageNav />   // - "PageNav" a re-usable component
      <h1>HomePage</h1>
      <Link to="/product">Product</Link>
    </div>
  );
}
 * 
 * - to highlight the page that we recently visited 
 *    - we have to use "NavLink" tool provided by react-router-dom
 * 
 * - instead of using "Link" we use "NavLink"
 * ex:
 * ---
import { Link, NavLink } from "react-router-dom";

function PageNav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        ... other links ...
      </ul>
    </nav>
  ); 
}

export default PageNav;
 * 
 * - by using this "NavLink".. we get a CSS class attached to every element
 *    - whenever we are on that page.. that page gets class and it will be assigned to "active"
 *    => class="active"
 * 
 * - all other links will not get "active" as class-value
 *    - so now we can simply style that "active" class
 * 
 * ! 5. Styling Options For React Applications
 * 
 * - until now we used external CSS files and provided values to the "classNames" 
 *    - but now we use "CSS Modules"
 * 
 * >>> Styling Options in React:
 * ---
 * #1 in-line CSS
 *    - How => using "style" props || Where => at JSX elements || Scope => to that JSX element
 * 
 * #2 External CSS or Sass File
 *    - How => "className" as prop || Where => External file || Scope => Entire application
 * 
 * $ NOTE:
 * - this can raise problems, as we don't know which components uses which classes  
 *    - in above, as 'scope' is spread across entire application
 * - so, in professional dev, CSS is never global
 * 
 * #3 CSS modules:
 *    - How => "className" prop || Where => one external file per comp || Scope => component specific 
 * 
 * #4 CSS-in-JS (a styled components): 
 *    - How => creates new component || Where => external or component file || Scope => component || based on => JavaScript
 * 
 * $ NOTE:
 * - writing CSS inside a JS file, in the same file where we define our components
 *    - this allows us to create react components, where styles are directly applied to them 
 * 
 * #5 Utility 1st CSS-Framework (tailwind-css):
 *    - How => "className" props || Where => JSX elements || Scope => JSX elements
 * 
 * ! 6. Using CSS Modules
 * 
 * - no need to install external packages
 *    - CSS modules comes with installation of vite app
 * 
 * - we need to create one external css file per component
 *    - if we want to create CSS file for /components/PageNav.js then..
 * 
 * - CSS file shall follow the same component name convention "PageNav"
 *    - create "PageNav.module.css" in same /component folder (where we created "PageNav")
 * 
 * - CSS file shall include or follow the following rules only.. 
 * #1
 *    - we only need to define "classes" but not to insert "element-name" 
 * ex:
 * ---
// - (.nav) is a class
.nav {
  display: flex;
}
// - not like this (ul => element)
ul {
  list-style: none;
}
 * 
 * - import it into "PageNav.jsx" with..
 *    - import styles from "<file-path>"
 * EX:
 * ---
import { Link, NavLink } from "react-router-dom";
import styles from "./PageNav.module.css"           //- Imported here

function PageNav() {
  return (
      <nav className={styles.nav}>
      <ul>
      ...

STYLES
------
.nav ul {               // - selected "ul" inside ".nav"
  display: flex;
  justify-content: space-between;
  list-style: none;
}
 * 
 * - when we include two components into a single file, where each having their own CSS files 
 *    - if we check their classes.. 
 *      - they get "unique" class names
 * 
 * - even though we defined with same name ".nav"
 * ex:
AppNav - CSS:
---
.nav {
    background-color: rebeccapurple;
}

PageNav - CSS: 
---
.nav {
  background-color: aqua;
}
 * 
 * - if we include the main components where we used above styles.. into single component
 * ex:
 * ---
import PageNav from "../components/PageNav";
import AppNav from "../components/AppNav";

export default function HomePage() {
  return (
    <div>
      <PageNav />
      <AppNav />
      ...
 * 
 * - we get unique classes that applied to each component classes
 * 
 * >>> Advantage:
 * - so even we have same component like "nav"
 *    - and each has their CSS applied with same ".nav" classes in their CSS files
 * 
 * ! 7. Nested Routes and Index Route
 * 
 * * NESTED rotes
 * ---------------
 * - when we need nested routes.. 
 *    - when we want a part of UI controlled by a part of URL
 * 
 * - nested routes.. 
 *    - when we want to render a part of UI based on some part of URL 
 * 
 * - idea:
 *    - /app/cities and
 *    - /app/countries
 * ex:
 * ---
<Route path="app" element={<AppLayout />}>
  <Route path="cities" element={<p>List of cities</p>} />
  <Route path="countries" element={<p>Countries</p>} />
</Route>
 * 
 * - inside "path" props (path description)
 *    - we don't have to include parent path that is: /app
 * 
 * - react-router combines both parent (app) and children (cities, countries) automatically
 * 
 * ? How elements are going to display in the UI ? 
 * ? How to render one component inside another component ?
 * - elements like: 
 *    - <p>List of cities</p>
 *    - <p>countries</p>
 * 
 * - that we given to the element prop inside the "children" routes
 * 
 * >>> we use "OUTLET" component (provided by react-router)
 * ex:
 * ---
import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav /> 
      <Outlet />              // >>> element inside child route is rendered with <Outlet />
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWise Inc.
        </p>
      </footer>
    </div>
  );
}
export default Sidebar;
 * 
 * - similar to "children" props functionality 
 * 
 * * INDEX route
 * --------------
 * - Default Child Route
 * 
 * 
 * - when none of the children routes match to the URL /app/cities..
 *    - then index-route will be executed and rendered
 * 
 * >>> best use-case...
 * - index routes are useful when we define a path to "/" >>> home
 *    - whenever user opens "/" it renders the "Homepage" component
 * ex:
 * ---
<Route index element={<HomePage />} />
 * 
 * >>> index for "/app"
 * ex:
 * ----
<Route path="app" element={<AppLayout />}>
  <Route index element={<p>List of cities</p>} />
  <Route path="cities" element={<p>List of cities</p>} />
  <Route path="countries" element={<p>Countries</p>} />
  <Route path="form" element={<p>Form</p>} />
</Route>
 * 
 * - whenever we visit URL: "/app/cities" and visit back to "/app" only
 *    - then we need a default route.. so we set up /app to render cities also on default
 * 
 * - so we used "AppNav" inside Sidebar.jsx
 * ex:
 * ---
import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";
function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="cities">Cities</NavLink>
        </li>
        <li>
          <NavLink to="countries">Countries</NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default AppNav;
 * 
 * - this will render a tab component 
 * 
 * $ NOTE:
 * - the path we specify "to" prop inside "NavLink" has to match exactly..
 *    - the "path" prop that we specify inside "Route" 
 * ex:
 * ---
NavLink:
<li>
  <NavLink to="cities">Cities</NavLink>
</li>

Route:
<Route path="cities" element={<p>List of cities</p>} />
 * 
 * - as we can do the same with useState that is active-tabs 
 *    - when a tab gets activated.. renders that specific content 
 * 
 * - similarly, we use react-router and URL to store the state of active tab
 * 
 * - this is "sub-navigation" with "<Outlet />" 
 *    - as "Outlet" that is provided with react-router-dom
 * 
 * ! 8. Storing State in the URL
 * 
 * ? Storing GLOBAL state in URL ???
 *    ? don't we actually use "useState- Hook" to manage state ?
 * 
 * - that's true most of the time 
 *    - but URL is also a best place to store GLOBAL - state (especially the UI state)
 
* >>> UI State: 
 *    - state that affects the UI appearance (UI looks like) 
 * 
 * - URL is an excellent place to store UI state and alternative to useState 
 *    - ex: open/closed panels, current selected list item, list sorting order, applied list filters
 * 
 * - these examples of state are best to be stored in URL 
 *    - managed by URL with "react-router"
 * 
 * ? why should do so ?
 *  
 * - it is an easy way to store state in "global-place", accessible to all components in the application (all elements inside element-tree)
 *    
 * $ REMEMBER:
 * - we used to store state inside parent and then pass it to all it's children 
 *    - using "props"
 * 
 * >>> Movement of "STATE-MANAGEMENT" from REACT-LOGIC to app's URL
 * 
 * - if we do place state in URL, 
 * #1 we can read the value from there.. wherever the component is present in the component tree.
 * 
 * #2 good way to "pass-data" from one page into the next
 *    - without having to store the data temporarily inside App() component
 * 
 * #3 to "Bookmark and share" the page with exact UI state.. it had at that time (while marking)  
 *    - if we applied filter to an online shop app, when we share that to someone 
 *      - then, other users can also view same filters that we applied 
 * 
 * ? How can we do this with "React-Router" ?
 * ex:
www.example.com/app/cities/lisbon?lat=38.724$lang=-9.141
 * 
 * - from the above URL, 
 *    - /app/cities => consider this part as state (it corresponds to the component that is being rendered)
 *      - but this is not useful for state-management 
 * 
 * >>> to store state in URL..
 * * we use params or query string
 * #1 params: parameters 
 *    - these are very useful to pass data to next page
 *    
 * #2 query-string:
 *    - this is useful to store global state.. that should be accessible from everywhere
 * ex:
 * ---
www.example.com/app/cities/lisbon?lat=38.724$lang=-9.141
 * 
 * $ NOTE:
 * - from the above example, 
 *    - the loaded page will be based on params,
 *    - we also store "lat" "lng" inside query-string, each city has unique location
 *      - that location is reflected in the URL
 * 
 * - from this example, 
 *    - demonstrated power of URL to manage state by reading city name and GPS location from the URL instead of application state from react
 * 
 * ! 9. Dynamic Routes With URL Parameters
 * 
 * - now use react-router params in order to pass data between pages
 *    - to use prams... 
 * 
 * - we have three steps ---
 * #1 create a new route >>> (inside App.js)
 * ex:
 * ---
<Route path="cities/:id" element={<City />} />    // - "id" is parameter name
 * 
 * - :id will be the city-id
 * 
 * - "/cities/:id" similar to "/cities/2099643"
 * - when we console.log(id) in 3rd step >>> we get "2099643"
 * 
 * #2 link that route: 
 * ex:
 * ---
<Link className={styles.cityItem} to={`${id}`}>   // - with "to" prop
  <span className={styles.emoji}>{emoji}</span>
  <h3 className={styles.name}>{cityName}</h3>
  <time className={styles.date} >
    ({formatDate(date)})
  </time>
  <button className={styles.deleteBtn}>&times; </button>
</Link>
 * 
 * - the "to" prop is assigned with "id" that was destructured from "city" inside "CityItem.jsx"
 *    - const { cityName, date, emoji, id } = city;
 * 
 * $ NOTE: 
 * - the URL has to be "/app/cities/id" but not "/app/id"
 * 
 * * useParams() Hook
 * -------------------
 * #3 in that route, we read state from URL
 * 
 * - inside "City.jsx" use "useParams" hook from react-router and get that state: ID that is stored inside URL
 * ex:
 * ---
const x = useParams()
console.log(x)
 * 
 * - we can use destructuring
 * ex:
 * ---
const { id } = useParams();
console.log(id);
 * 
 * ! 10. Reading and Setting a Query String
 * 
 * - second way of storing state inside URL with Query-String 
 * 
 * - syntax:
 * >>> ?varName1={value}&varName2={value}
 * 
 * $ NOTE:
 * * everything that is there inside URL is global state, we can use with in every component which gets access to that URL
 * 
 * ex:
function CityItem({ city }) {
  const { cityName, date, emoji, id, position } = city;   // - destructured city here
  const { lat, lng } = position;      // - destructured position here
  console.log(lat);

  return (
    <li>
      <Link className={styles.cityItem} to={`${id}?lat=${lat}&lng=${lng}`}>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn}>&times; </button>
      </Link>
    </li>
  );
}
 * 
 * - the "TO" prop and it's value
 *    - value: `${id}?lat=${lat}&lng=${lng}`
 * 
 * >>> Reading the values from query-strings
 * - we use "useSearchParams()" hook from "react-router"
 * 
 * * useSearchParams()
 * --------------------
 * - this is similar to useState-Hook & returns an array of current state and setter fn
 *    - destructure them into an array
 * ex:
const [searchParams, setSearchParams] = useSearchParams()
 *  
 * $ DEFINITION (ACTUAL):
 * - Returns a tuple of the current URL's URLSearchParams and a function to update them. Setting the search params causes a navigation.
 * 
 * - whatever the data that is stored inside "searchParams" is not directly accessible
 *    - so we have to use .get("") on the current-state that is "searchParams" that was returned
 * ex:
 * ---
const [searchParams, setSearchParams] = useSearchParams();
const lat = searchParams.get("lat");
console.log(lat);
 * 
 * >>> Updating the Query String:
 * - use "setSearchParams" function returned from "useSearchParams()"
 * ex:
 * ---
import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  // - useSearchParams here..
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return (
    <div className={styles.mapContainer}>
      <h1>Map</h1>
      <h1>
        Position: {lat}, {lng}
      </h1>
      <button
        onClick={() => {
          setSearchParams({ lat: 23, lng: 50 });
        }}
      >
        Change position
      </button>
    </div>
  );
}
export default Map;
 * 
 * - on-click updates lat and lng every where in the application
 *    - it not only updates inside "URL" but also everywhere in the app.. where this data is read!
 * 
 * $ IMPORTANT:
 * - everything fetched from the URL is of type: "string"
 * 
 * ! 11. Programmatic Navigation with useNavigate Hook
 * 
 * >>> programmatic navigation means to move to a new URL without clicking on any link 
 * - use-case:
 *    - after submitting a form, when users submits a form.. user moves to a new page automatically in an app
 * 
 * - as per practice project:
 *    - whenever a user clicks on the area where map renders
 *    - then user shall automatically move to URL: /app/form
 * ex:
 * ---
function Map() {
  return (
    <div className={styles.mapContainer} onClick={() => { } }>
    ---
 * 
 * - so as per above example, we are listening for click event on the total map
 * 
 * - we include a useNavigate Hook inside this Map- component and navigate to "/app/form"  
 * 
 * * useNavigate()
 * 
 * $ Definition (actual)  
 * - Returns a function that lets you navigate programmatically in the browser in response to user interactions or effects.
 * ex:
 * ---
const navigate = useNavigate()
 * 
 * - so using inside onClick()
 * ex:
 * ---
function Map() {
  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate("form");
      }}
    >
  ---
 * 
 * - this is an imperative approach and using <NavLink /> and using "to" prop is a declarative approach
 * 
 * >>> another use case:
 * - moving back inside an application, where this hook is helpful
 * 
 * - the function that was returned from useNavigate() hook.. is used to move one step backward
 *    - that is we can specify inside as it's 
 * ex:
 * ---
const navigate = useNavigate()
onClick(() => navigate(-1))
 *   
 * - negative numbers indicate moving backwards
 * - where positive numbers works vice-versa
 * 
 * ! 12. Programmatic Navigation with <Navigate />
 * 
 * - we now know how to navigate with useNavigate hook
 * - but there is a declarative way of doing similar using "Navigate" component
 * 
 * $ PROBLEM:
 * - we have a problem that whenever user navigates to /app 
 *    -  but it is not navigating automatically to "/app/cities".. but only navigates to "/app/cities" on-clicking "cities" btn inside "sidebar" of app-layout 
 * 
 * >>> solution:
 * - in order to fix this we have to use "Navigate" component to immediately and automatically navigate to URL: "/app/cities"
 * ex:
 * ---
// automatic re-direction to "/app/cities" on navigating to "/app"
<Route index element={<Navigate replace to="cities" />} />
 * 
 * >>> replace:
 * - but whenever we wanted to navigate back it will not navigate us to before page 
 *    - so we have to use "replace" keyword that will take us back to previous page
 * 
 * 
 * $ REMEMBER:
 * - we should not call "navigate" function from the top level code
 *    - never
 * ? why ?
 * - it creates an effect
 * - so whenever there is an effect, use "useEffect()" - Hook
 * 
 * 
 */
