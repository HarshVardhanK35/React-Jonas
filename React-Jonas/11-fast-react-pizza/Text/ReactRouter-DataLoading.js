// ! React-Router with Data-Loading
//----------------------------------
/**
 * ! 1. Setting Up a New Project: "Fast React Pizza Co."
 * -----------------------------------------------------
 * - used vite to create react-app "Fast React Pizza Co."
 * - we build from scratch.. no use of starter files from "Jonas-Git-Repo"
 * 
 * >>> Skipped
 * 
 * 
 * 
 * ! 2. Application Planning
 * ------------------------- 
 * ? How to PLAN and BUILD a react-app
 * ---
 * >>> PLAN #1
 * #1 break desired UI into "components"
 * #2 build a "static" version (without state: 1st)
 * #3 start: state-management and data-flow
 *      - this only works for small applications with one page has few-features
 * 
 * (to build a large and real world applications)
 * >>> Plan #2
 * #1 gather application requirements and features
 *      - based on these requirements..
 * 
 * #2 divide application into "pages" 
 *      - think about over-all and page-level UI
 *      - break desired UI into "components"
 *      - design and build "static" version
 * 
 * #3 divide app into "feature-categories"
 *      - think about "state-management" and "data-flow"
 * 
 * #4 deciding which "libraries" to use (tech-stack decisions)
 * ---
 * 
 * ? Present project requirements 
 * ---
 * >>> step #1
 * - a simple app, where user can order "one or more pizzas" from a given menu
 * ---
 * - no user-login, hence "no login" or auth    ||      user just enter their names before using app
 * - pizza menu may change                      ||      it has to be loaded from an "API"
 * - each order will get a "unique-ID"          ||      so user can search their orders based on ID 
 * - users can mark their order as "priority"   ||      for additional 20% off
 * - payments will be made on "delivery"        ||      hence no "payment-processing" needed
 * ---
 * - users can add multiple pizzas to their "cart" before ordering
 * - ordering requires user's "name", "number" and "address"
 * - orders are made by "sending-POST-req" with order data: (user-data + selected-pizzas) to an API
 * - users can mark their order as "priority" even after it has been placed
 * - [if possible] "GPS- location" has to be provided, to make delivery easy 
 * 
 * ? derive: application's main features from the above list of requirements
 * ---
 * >>> step #2 + #3
 * >>> ~ Feature Categories         ~ Necessary Pages
 *              #1 User   --->---   HomePage {"/"}
 *              #2 Menu   --->---   PizzaMenu {"/menu"}
 *              #3 Cart   --->---   Cart {"/cart"}
 * #                     +--->---   Place a new order {"/order/new"}
 *                      /   
 *              #4 order
 *                      \
 * #                     +--->---   looking up for a order {"/order/:id"}
 * 
 * ? State-Management and Technology Decisions
 * ---
 * >>> State Slices (State-Management)
 * #1 User      -- Global UI State 
 *      - don't need accounts - data simply stay in app - have to accessible from many components
 * 
 * #2 Menu      -- Global Remote State
 *      - menu is fetched from an API - 
 * 
 * #3 Cart      -- Global UI state
 *      - simply stored in the application - no need of an API
 * 
 * #4 order     -- Global Remote State
 *      - fetched and submitted to an API
 * 
 * >>> Tech-Decisions
 * #1 Routing:                   React-Router (standard react-SPA)
 * #2 Styling:                   Tailwind-CSS
 * #3 state-management: remote and UI state)
 * - Remote State-Management:   React-Router
 * (new way of fetching data using react-router) "render-as-you-fetch" instead of "fetch-on-render"
 * - UI State-Management:       Redux
 * (state is complex and redux has many adv for UI state)
 * 
 * 
 * 
 * ! 3. Setting Up a Professional File Structure
 * ---------------------------------------------
 * (we gonna use: Feature-Based Structure)
 * 
 * - there will be a folder dedicated for each "feature"
 * #1 user
 * #2 menu
 * #3 cart 
 * #4 order
 * - these contains components, custom-hooks, and other JS files if needed!
 * 
 * - UI-fol
 * - some components which are re-usable in every feature
 *      - for that we use UI folder 
 * (contains mostly re-usable components [presentational-components]
 *      ex: buttons, inputs etc.,)
 * 
 * - services-fol
 * - reusable code for interacting with API (Pizza-API)
 * 
 * - utils-fol
 * - [stateless] helper fns (do not create side-effects), we can reuse in multiple places of an application
 * 
 * 
11-fast-react-pizza
|
├─── node_modules
├─── public
├─── src
│   ├─── features
│   │   ├─── cart
│   │   │   ├─── Cart.jsx
│   │   |   ├─── CartItem.jsx
│   │   |   ├─── CartOverview.jsx
│   │   |   └─── EmptyCart.jsx
│   │   ├─── menu
│   │   │   ├─── Menu.jsx
│   │   |   └─── MenuItem.jsx
│   │   ├─── order
│   │   │   ├─── CreateOrder.jsx
│   │   |   ├─── Order.jsx
│   │   |   └─── OrderItem.jsx
│   │   ├─── user
│   │   │   ├─── CreateUser.jsx
│   │   |   └─── userSlice.js
│   ├─── services
│   │   ├─── apiGeocoding.jsx
│   |   └─── apiRestaurant.js
│   ├─── ui
│   │   ├─── Error.jsx
│   |   └─── Home.js
│   ├─── utils
│   │   └─── helpers.jsx
│   └─── App.jsx
│   └─── index.css
│   └─── main.jsx
├─── .gitignore
├─── eslint.config.js
├─── index.html
├─── package-lock.json
├─── package.json
├─── README.md
└─── vite.config.js
 * 
 * 
 * 
 * ! 4. A New Way Of Implementing Routes
 * ------------------------------------- 
 * (a new way of implementing routes)
 * - react version-6.4 introduced a whole new way of defining routes and working with react-router
 * 
 * >>> powerful mechanisms:
 * - react-router for fetching data into pages and submitting data using forms 
 * 
 * installation:
 * => npm i react-router-dom@6
 * 
 * >>> work with data-fetching in react-router
 * => createBrowserRouter
 * 
 * * Declarative Approach:
 * <Route path="login" element={<Login />} />
 * 
 * * Imperative Approach:
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home";

const router = createBrowserRouter([        //>>> using Imperative-Approach
  { path: "/", element: <Home />,},
  .. other routes ..
]);
function App() {
  return <RouterProvider router={router} />;        //>>> using "RouterProvider"
}
 * 
 * - this type of approach is necessary in React-Router-6.4 to enable data-fetching or data-loading 
 * (declarative-approach is not useful to load-data)
 * 
 * - fetching data into pages and submitting data using forms are only possible with "createBrowserRouter"
 * 
 * $ RECAP:
 * - since version-6.4 
 *      - if we want to use powerful API like: data-loaders, data-actions or some other data-fetchers 
 *          - then we need to follow //=> Imperative-Approach
 * 
 * $ NOTE:
 * >>> Handling Errors: 
 * - in dec. app. we can handle error pages in this way!
 * <Route path="*" element={<PageNotFound />} />
 * 
 * - imperative approach has another way to handle error pages 
 * 
 * 
 * 
 * ! 5. Building the App Layout
 * ---------------------------- 
 * (learn: to implement global app layout using react-router)
 * >>> create layout - work with both big and small screens
 * 
 * >>> declarative-approach of declaring children routes:
 * ---
<Route path="app" element={ <AppLayout /> }>
    <Route index element={<Navigate replace to="cities" />} />
</Route>
 * 
 * >>> imperative-approach of child routes:
 * ---
  {
    element: <AppLayout />,                                     PARENT-COMPONENT
    children: [                                                             |
      { path: "/", element: <Home /> },                             |       |
      { path: "/menu", element: <Menu /> },                         |  CHILDREN / NESTED
      { path: "/cart", element: <Cart /> },                         |-----------+
      { path: "/order/new", element: <CreateOrder /> },             |           |
      { path: "/order/:orderId", element: <Order /> },              |           |
    ],                                                                          |
  },                                                                            |
]);                                                                             |
 *                                                                              |
 * - to render the content inside children-elements, we use "Outlet"            |
AppLayout.jsx:                                                                  |
import { Outlet } from "react-router-dom";                                      |
import CartOverview from "../features/cart/CartOverview";                       |
import Header from "./Header";                                                  |
-                                                                               |
function AppLayout() {                                                          |
  return (                                                                      |
    <div>                                                                       |
      <Header />                                                                |
      <Outlet />        //>>> "Outlet": to render the content inside children-elements 
      <CartOverview />
    </div>
  );
}
export default AppLayout;
 * 
 * - as per the sketch, "AppLayout" works as the Parent-Route for every Children-Route.. declared inside it!
 * - parent never changes throughout the application
 * 
 * * AppLayout does not have a "path"
 * - so it technically called "layout-route" in react-router
 * 
 * 
 * 
 * ! 6. Fetching Data With React Router "Loaders": Pizza Menu
 * ----------------------------------------------------------
 * (learn: powerful data-loading feature >>> "LOADERS")
 * >>> idea behind - LOADERS
 * - when somewhere in our code. we create a fn which fetches data from am API
 *      - then we provide that loader-fn to one of our route
 *          - then that route will fetch that data as soon as application goes to that route
 *              - then in the end, once data has arrived >>> will be provided to that page: using custom-hook
 * - three steps
 * #1 create a "loader"
 * #2 provide that "loader"
 * #3 provide data to a page
 * 
 * - convention of placing "loader": place the loader of data of a certain page inside the file of that page 
 *      - if we want to load "menu-data" then we need to place "loader" inside <Menu />
 * code:
 * ---
--- Menu.jsx ---
import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";

function Menu() {
  const menu = useLoaderData();     //>>> 3) provide loader's-data to where it was created
  return <h1>Menu</h1>;
}
export async function loader() {        //>>> 1) create-loader
  const menu = await getMenu();
  return menu;
}
export default Menu;

--- App.jsx ---
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },                             (where data-fetching happens!)
      { path: "/menu", element: <Menu />, loader: menuLoader },     //>>> 2) providing-loader
      { path: "/cart", element: <Cart /> },
      { path: "/order/new", element: <CreateOrder /> },
      { path: "/order/:orderId", element: <Order /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}
 * 
 * * data-loading-waterfalls
 * - problem: data-loading-waterfalls is removed using this method
 * - we implemented "render-as-you-fetch" strategy 
 *      - react-router will start fetching data same time it renders that correct-specific-route
 * (fetching data and rendering that specific route: happen at same time)
 * 
 * $ NOTE:
 * - even if we had data-fetching logic inside Menu-component
 * - but data-fetching-logic is centralized inside "route-definition"
 * >>> so, data-fetching is fired-off from router itself (but not the component)
 * 
 * $ NOTE:
 * - while using "useEffect" is fetch-on-render
 *      - we render comp 1st and then we will start fetching data 
 * * this creates problem: "data-loading-waterfalls"
 * 
 * 
 * 
 * ! 7. Displaying a Loading Indicator
 * -----------------------------------
 * (while opening the Menu-page, data-loading takes some time (for fetching))
 * - meanwhile, we can show a loading-spinner / -indicator
 * 
 * - so, in-order to display a loading-indicator
 * (we need to know whether data is being loaded or not)
 *      - there was "isLoading" state anywhere (so we need to get that into application)
 * 
 * * useNavigation Hook:
 * - we can use this, to know whether application is idle OR it is loading OR submitting
 * (this navigation is for entire application not to a specific page)
 *      - if one of the pages are loading then "navigation-state" will become "loading"
 * 
 * (as it is common to all the pages inside "AppLayout")
 * - we have to use "useNavigation" inside "AppLayout" component
 * code:
 * ---
function AppLayout() {
  const navigation = useNavigation();                 //>>> useNavigation Here!
  const isLoading = navigation.state === "loading"; 
  return (
    <div className="layout">
      {isLoading && <Loader />}
      <Header />
      <menu>
        <Outlet />
      </menu>
      <CartOverview />
    </div>
  );
}
 * 
 * - when we visit "Menu" page.. while fetching data.. it will show "loading" after it shows "idle"
 * (to know more >>> console log.. "navigation")
 * 
 * 
 * 
 * ! 8. Handling Errors With Error Elements
 * ----------------------------------------
 * - whenever there is an error inside children-elements.. 
 *      - as they bubble up to parent-element.. so we can render an error-element inside parent-element! 
 * 
 * - we can also define errorElements on each of the routes 
 *      - errors bubble up to parent-route unless it is actually handled in the route itself
 * 
 * - we can handle error using "useRouteError" hook inside error-element
Error.jsx
---
function Error() {
  const navigate = useNavigate();
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message}</p>
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

AppLayout.jsx
---
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,        //>>> error-element def here
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,        //>>> error-element def here
      },
      { path: "/cart", element: <Cart /> },
      { path: "/order/new", element: <CreateOrder /> },
      { path: "/order/:orderId", element: <Order /> },
    ],
  },
]);
 * 
 * 
 * 
 * ! 9.  Fetching Orders
 * ---------------------
 * (feature: where user can look up their order based on the order-ID)
 * - we can use dummy IDs to look for orders that had been placed before
 * 
 * - we have to work on "/order/:orderId" 
 *      - and to make this dynamic
 * - that is reading order-id from URL and display data about that order on page
 * 
 * - in order to search for order-id, we need a search-component to enter the order-id
 * (search-field in the header)
 * 
SearchOrder.jsx
---
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Search order ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value);}     //>>> controlled element
      />
    </form>
  );
}
export default SearchOrder;

inside App.jsx
---
{
  path: "/order/:orderId",
  element: <Order />,
  loader: orderLoader,
  errorElement: <Error />,
},

Order.jsx:
---
function Order() {
  // Everyone can search for all orders, so for privacy reasons we have to ..
  // .. exclude names or address, these are only for the restaurant staff
  const orderDetails = useLoaderData();                     //>>> to get data from loader
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = orderDetails;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);
  return (
    <div>
      <div>
        <h2>Status</h2>
        <div>
          {priority && <span>Priority</span>}
          <span>{status} order</span>
        </div>
      </div>
      <div>
        <p>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>
      <div>
        <p>Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p>To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  );
}
export async function loader({ params }) {      //>>> using loader inside same component
  const order = await getOrder(params.orderId);
  return order;
}
export default Order;
 * 
 * - to get search-params from URL we can use "useParams" hook 
 *      - but that works inside components but not in regular-functions
 * 
 * - so, react-router passes data into loader-function 
 *      - one of that is "params" and we can destructure it!
 * 
 * that is.. 
 * const order = await getOrder(params.orderId);
 *      - "orderId" has to be same to the name of the param given in.. path: "/order/:orderId"
 * 
 * 
 * 
 * ! 10. Writing Data With React Router "Actions"
 * ----------------------------------------------
 * (learn: to write and mutate data on server!)
 * 
 * - till now, we learnt that "loaders" are used to read-data
 *      - but "actions" are used to WRITE and MUTATE data on the server
 * 
 * * Actions:
 * - these allows us manage remote server state using action-functions and forms 
 * 
 * >>> project-requirements:
 * - as per project-requirements, that orders are made by sending a POST-req with order-data to API
 * - so these actions and forms are used to create new orders 
 * - we have create "form" send "actions" inside "CreateOrder"
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
