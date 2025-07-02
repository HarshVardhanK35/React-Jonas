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
 * ! 2. Application Planning
 * -------------------------
 * 
 * ! 2. Application Planning
 * -------------------------
 * 
 * ! 2. Application Planning
 * -------------------------
 * 
 * ! 2. Application Planning
 * -------------------------
 * 
 * ! 2. Application Planning
 * -------------------------
 * 
 * ! 2. Application Planning
 * -------------------------
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