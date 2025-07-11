// ! Setting-Up Our Biggest Project + Styled Components
// -----------------------------------------------------
/**
 * ! 1. Section Overview
 * ---------------------
 * 
 * ! 2. Application Planning
 * -------------------------
 * * Project: The Wild Oasis
 * (a small boutique hotel with 8 luxurious wooden cabins)
 * 
 * - need a custom-complete-application to manage everything about hotel: bookings, cabins and guests
 * - internal app used inside hotel to check in guests as they arrive
 * - business also needs an API
 * - they probably want a customer-facing website, where customers will be able to book stays, using same API 
 * 
 * ? How to plan an app ?
 * - gather app "requirements" and "features"
 * - divide application into "pages"
 * - divide application into "feature-categories"
 * - decide which "libraries" are needed (tech decisions)
 * 
 * # STEP-1: Project Requirements 
 * >>> AUTHENTICATION
 * - Users of the app are hotel employees. They need to be logged into the application to perform tasks
 * - New users can only be signed up inside the applications (to guarantee that only actual hotel employees can get accounts)
 * - Users should be able to upload an avatar, and change their name and password
 * 
 * >>> CABINS
 * - App needs a table view with all cabins, showing the cabin photo, name, capacity, price, and current discount
 * - Users should be able to update or delete a cabin, and to create new cabins (including uploading a photo)
 * 
 * >>> BOOKINGS
 * - App needs a table view with all bookings, showing arrival and departure dates, status, and paid amount, as well as cabin and guest data
 * - The booking status can be "unconfirmed" (booked but not yet checked in), "checked in", or "checked out". The table should be filterable by this important status
 * - Other booking data includes: number of guests, number of nights, guest observations, whether they booked breakfast, breakfast price
 * 
 * >>> CHECK-INs / CHECK-OUTs
 * - Users should be able to delete, check in, or check out a booking as the guest arrives (no editing necessary for now)
 * - Bookings may not have been paid yet on guest arrival. Therefore, on check in, users need to accept payment (outside the app), and then confirm that payment has been received (inside the app)
 * - On check in, the guest should have the ability to add breakfast for the entire stay, if they hadn't already
 * 
 * >>> GUESTS
 * - Guest data should contain: full name, email, national ID, nationality, and a country flag for easy identification
 * 
 * >>> DASHBOARD
 * - The initial app screen should be a dashboard, to display important information for the last 7, 30, or 90 days:
 *      - A list of guests checking in and out on the current day. Users should be able to perform these tasks from here
 *      - Statistics on recent bookings, sales, check ins, and occupancy rate
 *      - A chart showing all daily hotel sales, showing both "total" sales and "extras" sales (only breakfast at the moment)
 *      - A chart showing statistics on stay durations, as this is an important metric for the hotel
 * 
 * >>> SETTINGS
 * - Users should be able to define a few application-wide settings: breakfast price, min and max nights/booking, max guests/booking
 * - App needs a dark mode
 * 
 * # STEP-2 + 3: FEATURES + PAGES
 * >>> FEATURE_CATEGORIES                       NECESSARY_PAGES
 * -                                            Dashboard           {" /dashboard "}
 *      -1 Bookings                 --->---     Bookings            {" /bookings "}
 *      -2 Cabins                   --->---     Cabins              {" /cabins "}
 *      -3 Guests
 *      -4 Dashboard        
 *      -5 Check_In & Check_Out     --->---     Booking check in    {" /checkin/:bookingID "}
 *      -6 App Settings             --->---     Settings            {" /settings "}
 * -                               +--->---   user sign_up {" /users "}
 *                              /   
 *          -7 Authentication       --->---    account-settings {" /account "}
 *                              \
 * -                               +--->---   users login  {" /login "}
 * 
 * ? STATE ?
 * - Global and remote state
 * 
 * * client_side_rendering (OR) server_side_rendering
 * ? diffs:
 * >>> CSR:
 *      - build SINGLE_page apps
 *      - all HTML rendered on "client"
 *      - all JS needs to be downloaded before app start running: "bad-performance"
 *      - "perfect_use_cases": apps that are used "internally" as tools inside companies, that are entirely hidden behind a login
 *      (apps which does not need search_engine_optimizations) 
 * ex: REACT 
 *      (plain_react / vanilla_react)
 * 
 * >>> SSR:
 *      - build MULTI_page apps
 *      - HTML (some of it) is rendered on "server"
 *      - "more performant" as less JS needs to be downloaded
 *      - "react_team" advising to use more "SSR"
 * ex: NEXT.JS and REMIX 
 * 
 * # STEP-4: TECHNOLOGY_DECISIONS
 * - Routing:               React_Router 
 * (standard for react-SPA)
 * 
 * - Styling:               Styled_Components
 * (very_popular - writing comp scoped CSS - inside JS)
 * 
 * - state-management:      Remote State-Management:  REACT-QUERY (most-popular)
 * (all the state in this app.. will be remote_state)
 * (has features like: caching, automatic re-fetching, pre-fetching, offline_support etc.,)
 * 
 * - UI State-Management:   Context-API
 * (no UI state needed in this application, so simple context with "useState" is enough)
 * 
 * - Form Management:       React-Hook-Form
 * (handling large forms and multiple forms - manual state creation - error handling)
 * 
 * # OTHERs
 * - react icons / react hot toasts / recharts / date-fns / SupaBase (store-remote_state)
 * 
 * 
 * ! 3. Setting Up the Project: "The Wild Oasis"
 * ---------------------------------------------
 * (single_page_app - use Vite)
 * => npm create vite@4
 * >>> created "12-the-wild-oasis"
 * 
 * ? Project_Structure
12-the-wild-oasis
|
├─── node_modules
├─── public
├─── src
│   ├─── data
│   │   ├─── cabins/images
│   │   ├─── img/images
│   │   ├─── data-bookings.jsx
│   │   ├─── data-cabins.jsx
│   │   ├─── data-guests.jsx
│   |   └─── Uploader.js
│   ├─── hooks
│   │   ├─── useLocalStorageState.js
│   │   └─── useMoveBack.js
│   ├─── pages
│   │   ├─── Account.jsx
│   │   ├─── Bookings.jsx
│   │   ├─── Cabins.jsx
│   │   ├─── Dashboard.jsx
│   │   ├─── Login.jsx
│   │   ├─── PageNotFound.jsx
│   │   ├─── Settings.jsx
│   │   └─── Users.jsx
│   ├─── services
│   │   ├─── apiBookings.js
│   │   └─── apiSettings.js
│   ├─── ui
│   │   ├─── Button.jsx
│   │   ├─── ButtonGroup.jsx
│   │   ├─── ButtonIcon.jsx
│   │   ├─── ButtonText.jsx
│   │   ├─── Checkbox.jsx
│   │   ├─── ConfirmDelete.jsx
│   │   ├─── DataItem.jsx
│   │   ├─── Empty.jsx
│   │   ├─── ErrorFallback.jsx
│   │   ├─── FileInput.jsx
│   │   ├─── Filter.jsx
│   │   ├─── Flag.jsx
│   │   ├─── Form.jsx
│   │   ├─── Logo.jsx
│   │   ├─── MainNav.jsx
│   │   ├─── Menus.jsx
│   │   ├─── Modal.jsx
│   │   ├─── Pagination.jsx
│   │   ├─── Select.jsx
│   │   ├─── Spinner.jsx
│   │   ├─── SpinnerMini.jsx
│   │   ├─── Table.jsx
│   │   ├─── TableOperations.jsx
│   │   ├─── Tag.jsx
│   │   └─── Textarea.jsx
│   ├─── utils
│   │   └─── helpers.js
│   ├─── features
│   │   ├─── authentication
│   │   │   ├─── LoginForm.jsx
│   │   |   ├─── SignupForm.jsx
│   │   |   ├─── UpdatePasswordForm.jsx
│   │   |   ├─── UpdateUserDateForm.jsx
│   │   |   └─── UserAvatar.jsx
│   │   ├─── bookings
│   │   │   ├─── BookingDataBox.jsx
│   │   │   ├─── BookingDetail.jsx
│   │   │   ├─── BookingRow.jsx
│   │   │   ├─── BookingTable.jsx
│   │   |   └─── BookingTableOperations.jsx
│   │   ├─── cabins
│   │   │   ├─── CabinRow.jsx
│   │   |   ├─── CabinTable.jsx
│   │   |   └─── CreateCabinForm.jsx
│   │   ├─── check-in-out
│   │   │   ├─── CheckinBooking.jsx
│   │   │   ├─── CheckoutBooking.jsx
│   │   │   ├─── TodayActivity.jsx
│   │   │   └─── TodayItem.jsx
│   │   ├─── dashboard
│   │   │   ├─── DashboardBox.jsx
│   │   │   ├─── DashboardFilter.jsx
│   │   │   ├─── DashboardLayout.jsx
│   │   │   ├─── DashboardChart.jsx
│   │   │   ├─── SalesChart.jsx
│   │   │   └─── stat.jsx
│   │   ├─── settings
│   │   │   └─── UpdateSettingsForm.jsx
│   │   ├─── check-in-out
│   │   │   ├─── CheckinBooking.jsx
│   │   │   ├─── CheckinBooking.jsx
│   │   │   └─── TodayItem.jsx
│   ├─── styles
│   │   └─── index.css
│   └─── App.jsx
│   └─── main.jsx
├─── .eslintrc.cjs
├─── .gitignore
├─── index.html
├─── package-lock.json
├─── package.json
├─── README.md
└─── vite.config.js
 * 
 * ? overview of project created:
 * - UI:        files which do not belong to features.. we may re-use these in many features
 * - pages:     one component-file for every route.. these pages do not create side-effects
 * - services:  contains files with code to interact with APIs
 * - styles:    for styling
 * - features:  for all the features that we had discussed in the previous lecture
 *          - every file in this folder.. are needed to implement project_requirements
 * 
 * 
 * ! 3. Introduction to Styled Components
 * --------------------------------------
 * (STYLED_COMPONENTS: styling this app)
 * * Styled-Components
 * - allows us to write CSS inside JS comp files
 * 
 * >>> working 
 * - takes an HTML element + use styled function = creates new react component (with CSS styles applied to it)
 * (so that we can use and reuse that new component, instead of using regular HTML element)
 * 
 * >>> installation
 * => npm i styled-components
 * 
 * >>> importing 
 * => [ import styled from "styled-components" ]
 * 
 * >>> syntax
 * [CODE]
 * ------
import styled from "styled-components";

const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
`;
function App() {
  return (
    <div>
      <H1>Hello Styled-Components</H1>
    </div>
  );
}
export default App;
 * 
 * >>> explanation
 * - if we need a component {"h1"} with styles, we just have to attach {h1} to "styled" property that we imported from "styled-components"
 * 
 * >>> behind the scenes 
 * - styled-components creates a random & unique named class and then assigns to <h1></h1> tagged components
 * 
 * ? random & unique - named classes:
 * - every component gets a unique-name / value for it's class 
 *      - this CSS is only scoped to element: "H1" 
 * (eliminated problem of global CSS: "name-collisions b/w classnames")
 * 
 * >>> extensions needed
 * => "vscode-styled-components"
 * - with this styled-components we write looks like exactly like "normal-CSS"  
 * 
 * >>> reusing created components
const Button = styled.button`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: aquamarine;
  cursor: pointer;
  margin: 20px;
`
function App() {
  return (
    <div>
      <H1>Hello Styled-Components</H1>
      <Button>Check-In</Button>
      <Button>Check-Out</Button>        // - here both "buttons" gets a unique identifier
    </div>
  );
}
 * 
 * ? then, how can we style "App" comp ?
 * - as "function App() {}" returns a "div".. so create "div" and replace the div which was returned with the div-created using "styled-comp" 
 * [CODE]
 * ------
const StyledApp = styled.div`
  background-color: bisque;
  padding: 10px;
`;
function App() {
  return (
    <StyledApp>
      <H1>The Wild Oasis</H1>
      <Button>Check-In</Button>
      <Button>Check-Out</Button>
    </StyledApp>
  );
}
 * 
 * - convention in naming the styled-component only makes it "unique"
 * 
 * 
 * ! 4. Global Styles With Styled Components
 * -----------------------------------------
 * - use "index.css" to get some styles that are already present in that file! 
 * - create "GlobalStyles.js" file 
 * >>> [ import { createGlobalStyle } from "styled-components" ]
 * [CODE]
 * ------
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    [copy-pasted-CSS-from-"index.css"]
    ----- this file consists of design-tokens -----
`;
export default GlobalStyles;
 * 
 * - in-order to include in app and apply to a component.. follow this..
 * [CODE]
 * ------
function App() {
  return (
    <>
      <GlobalStyles/>
      <StyledApp>
        <H1>The Wild Oasis</H1>
        <Button>Check-In</Button>
        <Button>Check-Out</Button>
      </StyledApp>
    </>
  );
}
 * 
 * - as "GlobalStyles" does not accept "children" || so wrap that inside "react-fragment"
 * 
 * >>> inside index.css 
 * - there are some links copy-paste them inside "index.html"
 * [CODE]
 * ------
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Sono:wght@400;500;600&display=swap" rel="stylesheet" />
        <title>Vite + React</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
    </body>
</html>
 * 
 * >>> injecting design-tokens
 * - to inject, we can use: "var()" 
 * [CODE]
 * ------
const Button = styled.button`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(---border-radius-sm);
  background-color: var(--color-grey-500);
  color: white;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
`;
const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm); 
  padding: 0.2rem 0.2rem;
`; 
 *
 * - if we want to reuse the above code.. create a new file for that respective component and export that code into those files 
 * [CODE]
 * ------
create Input.jsx:
---
import styled from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.2rem 0.2rem;
`;
export default Input
 *  
 * 
 * 
 * ! 5.Styled Component Props and the "css" Function
 * -------------------------------------------------
 * - if we want to reuse a styled-component for diff types 
 * ex: [heading with h1, h2, h3 etc.,]
 * 
 * - similar to react, we can use props inside styled-components
 * * as (a prop):
 * [return in App()]
 * ---
return (
<>
    <GlobalStyles />
    <StyledApp>
        <Heading as="h1">The Wild Oasis</Heading>       //>>> PROP: "as" 

        <Heading as="h2">Check in and check out</Heading>
        <Button>Check-In</Button>
        <Button>Check-Out</Button>

        <Heading as="h3">Form</Heading>
        <Input type="text" placeholder="Number of guests" />
        <Input type="text" placeholder="Number of guests" />
    </StyledApp>
</>
 * 
 * - corresponding Heading.jsx
 * [CODE]
 * ------
import styled, { css } from "styled-components";

const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500  ;
    `}
`;
export default Heading;
 * 
 * 
 * 
 * ! 6. Building More Reusable Styled Components
 * ---------------------------------------------
 * 
 * 
 * ! 7. Setting Up Pages and Routes
 * --------------------------------
 * (installation of React-Router)
 * => install: npm install react-router-dom@6
 * 
 * Note:
 * (remove everything inside App.jsx and restart everything from new!)
 * 
 * $ IMPORTANT:
 * - we will use DECLARATIVE way of defining routes >>> same method used inside "World-Wise App" 
 *      - not like IMPERATIVE-way of setting up routes that were used inside "FAST-PIZZA App" 
 * [CODE]
 * ------
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import NewUsers from "./pages/Users";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import PageNotFound from "./pages/PageNotFound";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="cabins" element={<Cabins />} />
          <Route path="users" element={<NewUsers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Account />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
 * 
 * - wrap every-comp inside App() with "GlobalStyles"
 * 
 * $ SUMMARY:
 * - used "replace" inside <Navigate replace to="dashboard" />
 *      - which will replace URL from the "history-stack"
 * ex:
<Route index element={<Navigate replace to="dashboard" />} />
 * 
 * - here "index = {"/"}" is REPLACED with "dashboard" inside "history-stack"
 * 
 * 
 * 
 * ! 8. Building the App Layout
 * ----------------------------
 * - create a file "AppLayout" and create a route inside App.jsx
 *      >>> the AppLayout will not have any "path"
 * 
 * - every other Route will be the children for "AppLayout-Route"
 *      >>> to render children we use "Outlet" inside "AppLayout"
 * ex:
inside App.jsx
---
<Route element={<AppLayout />}>
    <Route index element={<Navigate replace to="dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="bookings" element={<Bookings />} />
    <Route path="cabins" element={<Cabins />} />
    <Route path="users" element={<NewUsers />} />
    <Route path="settings" element={<Settings />} />
    <Route path="account" element={<Account />} />
</Route>
---------------------------------CONNECTION---------------------------------
inside AppLayout.jsx
---
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <Outlet />    //>>> children-routes inside "AppLayout-route" rendered with "Outlet"  
    </>
  );
}
export default AppLayout;
 * 
 * - after applying styles using "Styled-Components"
 * [CODE]
 * ------
inside AppLayout.jsx:
---
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
`;
const Main = styled.main`
  background-color: var(--color-grey-200);
  padding: 4rem 4.8rem 6.4rem;
`;
function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </StyledAppLayout>
  );
}
export default AppLayout;
---------------------------------CONNECTION---------------------------------
inside Header.jsx:
---
import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: var(--color-grey-100);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;
function Header() {
  return <StyledHeader>HEADER</StyledHeader>;
}
export default Header;
---------------------------------CONNECTION---------------------------------
inside Sidebar.jsx:
---
import styled from "styled-components";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1/-1;
`;
function Sidebar() {
  return <StyledSidebar>SIDEBAR</StyledSidebar>;
}
export default Sidebar;
 * 
 * 
 * 
 * ! 9. Building the Sidebar and Main Navigation
 * ---------------------------------------------
 * (building AppLayout, Sidebar [Logo & MainNav], Header and styling them here...)
 * - while building this application we inserted necessary links using a "Navbar"
 * 
 * ? Problem ?
 * - if we used normal declarative way of defining links using "href" then it would hard-reload the pages
 *  
 * >>> solution: "Link"
 * - so we use "NavLink" from "react-router" while building Single-Page-Apps(SPA)
 * 
 * >>> styling "3rd party" comp
 * - till now we styled HTML comp., with styled-components library
 * 
 * ? but, how would we style 3rd party comp?
 * >>> styling a normal-HTML-comp
 * - styled.[tag-name]
 * 
 * >>> styling a 3rd party comp?
 * - styled.([3rdParty-tag-name])
 * 
 * * Icons: 
 * - React-icons library 
 *      => npm i react-icons
 * 
 * - open "chrome" => search for react icons (OR) browse [LINK]: https://react-icons.github.io/react-icons/
 * - open "HeroIcons-2"  (OR) open [LINK]: "https://react-icons.github.io/react-icons/icons/hi2/"
 * 
 * >>> using Hero-Icons
 * - import: [ import { IconName } from "react-icons/hi2"; ]
 * - insert: [ <HiOutlineHome /> ]
 * (insert direct component: "<HiOutlineHome />" wherever it is needed)
 * 
 * >>> using "Home"
 * - import { HiOutlineHome } from "react-icons/hi2"
 * (import into file)
 * - <HiOutlineHome />
 * (use this component wherever it is needed!)
 * 
 * [CODE]
 * ------
//>>> in [ MainNav.jsx ]- 
---
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCalendarDays,        |
  HiOutlineCog6Tooth,           |   //>>> icon imports here!
  HiOutlineHome,                |
  HiOutlineHomeModern,
  HiOutlineUsers,
} from "react-icons/hi2";

const NavList = styled.ul`          //>>> styling an HTML-element
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;
const StyledNavLink = styled(NavLink)`          //>>> styling a 3rd-party element: [not an HTML-element]
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-500);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }
//- This works because react-router places the active class on the active NavLink 
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }
  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;
function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiOutlineHome />               //>>> icons as react-components here!
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/bookings">
            <HiOutlineCalendarDays />       //>>> icons as react-components here!
            <span>Bookings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/cabins">
            <HiOutlineHomeModern />         //>>> icons as react-components here!
            <span>Cabins</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/users">
            <HiOutlineUsers/>           //>>> icons as react-components here!
            <span>Users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <HiOutlineCog6Tooth/>       //>>> icons as react-components here!
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}
export default MainNav;
---------------------------------CONNECTION---------------------------------
//>>> in [ Logo.jsx ]
---
import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
`;
const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;
function Logo() {
  return (
    <StyledLogo>
      <Img src="/logo-light.png" alt="Logo" />
    </StyledLogo>
  );
}
export default Logo;
---------------------------------CONNECTION---------------------------------
//>>> in [ Sidebar.jsx ]
---
import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1/-1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;
function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
    </StyledSidebar>
  );
}
export default Sidebar;
---------------------------------CONNECTION---------------------------------
//>>> updated [ AppLayout.jsx ]
---
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
`;
const Main = styled.main`
  background-color: var(--color-grey-200);
  padding: 4rem 4.8rem 6.4rem;
`;
function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </StyledAppLayout>
  );
}
export default AppLayout;
 * 
 * 
 * 
 * ! NEXT SECTION: SupaBase !!!
 *  => for further we need API
 * (to store and process data using API)
 * 
 */