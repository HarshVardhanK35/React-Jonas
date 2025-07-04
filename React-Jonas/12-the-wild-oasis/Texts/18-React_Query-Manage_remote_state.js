//! React-Query: Managing Remote State
//------------------------------------
/**
 * ! 1. Section Overview
 * ---------------------
 * * React Query
 * - React Library - to manage the remote state that we had stored inside "SUPABASE"
 * 
 *      - Remote state management
 *      - React-Query to data fetching and storage
 * 
 * ! 2. What is React Query?
 * -------------------------
 * * React Query
 *      - powerful library to manage "remote (server)-state"
 *      - many features and can use "lot less code" also makes "UX (user experience) looks better"
 *          
 *          ? How react query works ?
 *          - data / remote-state is "CACHED"
 *              ex: if comp-A needs "cabins" data then RQ fetches and stores in cache 
 *                  if comp-B needs "cabins-data" then RQ retrieves same data from cache and will not be fetched again
 *          - automatic "re-fetching" data to keep state-in-sync
 *              ex: if some other user of same app changes remote state (updating cabin-data) 
 *                  then app running on other computers will have newly updated data in sync
 *          - provides pre-fetching data
 *              ex: fetches data before it is needed (only when it is necessary)
 *                  PAGINATION: we can fetch data for cur-page and also for next-page
 *          - provides "automatic" loading and error states
 *          - easy remote state mutation (updating)
 *          - offline support
 *  
 * $ AT-LAST:
 * - Remote-Query is required cause remote-state is "fundamentally" diff from regular (UI) state
 * 
 * * Remote State
 * - data / state that was stored on a server and need to load into an app
 * 
 * 
 * ! 3. Setting Up React Query
 * ---------------------------
 * installation
 * => npm i @tanstack/react-query@4
 * 
 * Actual library name:
 * * Tanstack Query
 * - as this library works not only in React but also in other frameworks: "Svelte" "Vue"
 * 
 * >>> integrating react query into react-application:
 * - similar to the set-up we followed with Context-API or with Redux
 * 
 * as inside Context-API / Redux:
 * - we created a place for data and then we provide to app
 * 
 * case- ReactQuery: 
 * #1
 * - we set a place for "CACHE" and the query-client using "QueryClient- imported from @tanstack/react-query"
 * [CODE]
 * ------
//>>> inside App.jsx:
---
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, //>>> amount of time - data in cache - stays fresh (stay valid until it refreshed again) [more later!]
    },
  },
});
 * 
 * - passing default-options can over-ride default-options that were set aggressively by "react-query"
 * - this small snippet sets up a CACHE behind the scenes (which will be provided to the app)
 * 
 * #2
 * - now we need to provide query-data to entire application-tree
 *      - follows the similar way that we followed with Context-API's: Context-Provider
 * [CODE]
 * ------
//>>> inside App.jsx:
---
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // amount of time - data in cache - stays fresh (stay valid until it refreshed again)
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>      //>>> Query-Client-Provider >>> props: "queryClient"
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="cabins" element={<Cabins />} />
            <Route path="users" element={<NewUsers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
 * 
 * - [Optional]: install react-query-dev-tools
 * => npm i @tanstack/react-query-devtools@4 
 * (follows same version as react-query)
 * 
 * - similarly connect a Provider to the entire-application that will be inside "App.jsx"
 * [CODE]
 * ------
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // amount of time - data in cache - stays fresh (stay valid until it refreshed again)
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="cabins" element={<Cabins />} />
            <Route path="users" element={<NewUsers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
 * 
 * - wrapping entire application with "<ReactQueryDevtools initialIsOpen={false} />" 
 *      - this provides an extra logo for query-dev-tools while development only
 * 
 * 
 * ! 4. Make Sure to Use React Query v4!
 * -------------------------------------
 * 👉 React Query just released version 5, introducing only a few small changes.
 * To follow this project, please make sure to install version 4 as I showed you in the previous video:
 * 
 * => npm i @tanstack/react-query@4
 * 
 * 👉 If you want to use React Query v5, there are only two small things to change in the project:
 * >>> "isLoading" is now called "isPending"
 * >>> The "cacheTime" option is now called "gcTime"
 * 
 * 
 * ! 5. Fetching Cabin Data
 * ------------------------
 * (RQ: use it to fetch and manage cabin-data from SupaBase)
 * - instead of using "useEffect" to fetch data from SB
 * [Pre-Code]
 * ----------
//>>> inside Cabins.jsx
--- 
function Cabins() {
  useEffect(function () {
    getCabins().then((data) => console.log(data));
  }, []);

  return (
    <Row type="horizontal">
      <Heading as="h1">All cabins</Heading>
      <p>TEST</p>
    </Row>
  );
}
export default Cabins;
 * 
 * - we want a table to show cabins, so we use "CabinTable.jsx"
 * >>> inside CabinTable.jsx
 * 
 * >>> useQuery:
 * - most imp custom-hook we used: "useQuery" >> [ takes in an object ]
 * - object with 2 things: "queryKey" and "queryFn"
 * #1
 * queryKey["key"]:
 *      - uniquely identifies data that we query inside it - this takes an array of a string 
 *      - this "key" identifies data.. we use exactly this "key" to read data from CACHE 
 *      - 
 * #2
 * queryFn: 
 *      - function to query / fetching data from an API
 *      - this fn should have to return a "promise" [so we use fn that was already created from: "apiCabin.js"]
 *      - this fn will be used here.. which fetches data from API and stores inside "CACHE" 
 * 
 * in previous section, we discussed "SupaBase" which has function which fetches data from DB
 * [CODE]
 * ------
import supabase from "./supabase";
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    return "Cabins could not be loaded";
  }
  return data;
}
 * 
 * [CODE]
 * ------
function CabinTable() {
  const {isLoading, data: cabins, error} = useQuery({
    queryKey: ["cabin"], 
    queryFn: getCabins,
  });
  return <div>Table</div>;
}
export default CabinTable;
 * 
 * - this returns so many necessary objects and states like "status", "isLoading", "isError", "isPaused" etc.,  
 * - but here we require only "isLoading", "error", "data" [data: that was fetched!] 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *  
 * 
 * ! 6. Introducing Another Library: React Hook Form
 * -------------------------------------------------
 * 
 * ! 7. Introducing Another Library: React Hook Form
 * -------------------------------------------------
 * 
 * ! 8. Introducing Another Library: React Hook Form
 * -------------------------------------------------
 * 
 * ! 9. Introducing Another Library: React Hook Form
 * -------------------------------------------------
 * 
 * ! 10. Introducing Another Library: React Hook Form
 * --------------------------------------------------
 * 
 * ! 11. Introducing Another Library: React Hook Form
 * --------------------------------------------------
 * 
 * ! 12. Introducing Another Library: React Hook Form
 * --------------------------------------------------
 * 
 * ! 13. Introducing Another Library: React Hook Form
 * --------------------------------------------------
 *
 * ! 14. Introducing Another Library: React Hook Form
 * --------------------------------------------------
 * 
 * ! 15. Introducing Another Library: React Hook Form
 * --------------------------------------------------
 * 
 * ! 16. Introducing Another Library: React Hook Form
 * --------------------------------------------------
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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