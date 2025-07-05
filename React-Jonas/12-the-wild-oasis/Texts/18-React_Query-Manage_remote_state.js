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
 *  - powerful library to manage "remote (server)-state"
 *  - many features and can use "lot less code" also makes "UX (user experience) looks better"
 *          
 *    ? How react query works ?
 *      - data / remote-state (API) is "CACHED"
 *        ex: if comp-A needs "cabins" data then RQ fetches and stores in cache 
 *            if comp-B needs "cabins-data" then RQ retrieves same data from cache and will not be fetched again
 *      - automatic "re-fetching" data to keep state-in-sync
 *        ex: if some other user of same app changes remote state (updating cabin-data) 
 *            then app running on other computers will have newly updated data in sync
 *      - provides pre-fetching data
 *        ex: fetches data before it is needed (only when it is necessary)
 *            PAGINATION: we can fetch data for cur-page and also for next-page
 *      - provides "automatic" loading and error states
 *      - easy remote state mutation (updating)
 *      - offline support
 *  
 * $ AT-LAST:
 * - Remote-Query is required cause remote-state is "fundamentally" diff from regular (UI) state
 * 
 * * Remote State
 * - data / state that was stored on a server and need to be loaded into an app
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
 * case- Context-API / Redux:
 * - we created a place for data and then we provide to entire app
 * 
 * case- ReactQuery: 
 * #1
 * - we set a place for "CACHE" and the query-client using "QueryClient- imported from @tanstack/react-query"
 * [CODE]
 * ------
// >>> inside App.jsx:
---
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // >>> amount of time - data in cache - stays fresh (stay valid until it refreshed again) [more later!]
    },
  },
});
 * 
 * - passing default-options can over-ride default-options that were set aggressively by "react-query"
 * - this small snippet sets up a CACHE behind the scenes (which will be provided to the app)
 * 
 * #2
 * - now we need to provide query-data to entire application-tree
 *      - follows the similar way that we followed with Context-API's - Context-Provider
 * [CODE]
 * ------
// >>> inside App.jsx:
---
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // - amount of time- data in cache- stays "fresh" (after this time data in cache turns "stale")
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient} >      // >>> Query-Client-Provider >>> props: "queryClient"
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
      <ReactQueryDevtools initialIsOpen={false} />      // >>> also provide "React-Dev-Tools" to entire application
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
 *      - this provides an extra logo inside running-application for query-dev-tools while development only
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
 * (Learn: fetch and store data inside "cache" using "useQuery" hook)
 * (RQ: use it to fetch and manage cabin-data from SupaBase)
 * 
 * - instead of using "useEffect" to fetch data from SB
 * [Pre-Code]
 * ----------
// >>> inside Cabins.jsx
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
 * >>> code inside CabinTable.jsx... 
 * 
 * * useQuery:
 * - most imp custom-hook we used: "useQuery" >> [ requires an object ]
 *    - an object with 2 keys: "queryKey" and "queryFn"
 * #1
 * queryKey: ["key"]
 *      - uniquely identifies data that we query inside DB - this takes an array of a string
 *            [if we want cabins data.. we need a key called "cabin"] 
 *      - this "key" identifies data.. we use exactly this same "key" to read data from CACHE 
 * #2
 * queryFn: 
 *      - fn to query (OR) fetch data from an API
 *      - this fn must return a "promise" [so we use fn that was already created inside: "apiCabin.js"]
 *          - this fn will be used here.. which fetches data from API and returned 'data' will be stored inside "CACHE" 
 * 
 * in previous section, we discussed "SupaBase" which has function which fetches data from DB
 * [CODE]
 * ------
import supabase from "./supabase";
export async function getCabins() {                                     | // >>> getCabins() fn returns a promise
  const { data, error } = await supabase.from("cabins").select("*");    | // >>> this fn has to be provided inside "useQuery" custom-hook
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;        // >>> this will be stored inside cache. when used as a value of key: "queryFn" inside "useQuery" hook
}
 * 
 * [CODE]
 * ------
function CabinTable() {
  const {isLoading, data: cabins, error} = useQuery({     // >>> useQuery used here!
    queryKey: ["cabins"], 
    queryFn: getCabins,     // >>> fn from "apiCabin": which fetches "cabin-data" from supabase
  });
  return <div>Table</div>;
}
export default CabinTable;
 * 
 * - this returns so many necessary objects and states like "status", "isLoading", "isError", "isPaused" etc.,  
 * - but here we require only "isLoading", "error", "data" [data: that was fetched from an API] 
 * 
 * >>> from now on we display actual-data that was fetches!
 * [CODE]
 * ------
// >>> CabinTable
---
function CabinTable() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  if (isLoading) return <Spinner />;

  return (
    <Table role="table">
      <TableHeader role="row">
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </TableHeader>
      {cabins.map((cabin) => (<CabinRow cabin={cabin} key={cabin.id} />))}
    </Table>
  );
}
export default CabinTable;
-------------------------------------CONNECTION-------------------------------------
// >>> CabinRow 
---
function CabinRow({ cabin }) {
  const { name, maxCapacity, regularPrice, discount, image } = cabin;

  return (
    <TableRow role="row">
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity}</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      <Discount>{formatCurrency(discount)}</Discount>
      <button>Delete</button>
    </TableRow>
  );
}
export default CabinRow;
 * 
 * [SUMMARY]
 * ---------
 * - <Table role="table"> <TableHeader role="row"> here "roles" are provided cause we didn't use actual HTML elements
 *    - so we specify here the roles >>> so that browsers would identify them!
 * 
 * - different types of tags used here are cause of "styled.components"
 *    - that are: "<Price>" "<Discount>" etc.,
 * 
 * >>> React-Query-DevTools:
 * - when we observe that after one minute.. app-query will change from "fresh" to "stale" 
 *    - cause of react-query data that was fetched will be stored inside "cache" 
 *      - when application is at "stale" the data will be re-fetched automatically
 *      - when application is in "fresh" state data will not be re-fetched
 * 
 * - even we unmount from that page and navigate to other
 *    - data persists inside "CACHE".. so no need of fetching again as we used to have with "useEffect"
 * 
 * - when application is at "stale" and we moved to other tabs then re-fetching happens 
 *    - so data re-fetches then app will be in "fetching-state" and then app changes to "fresh-state"
 *    
 * - to change application from "fresh" to "stale" takes one minute
 *    - which was specified inside "App.jsx"..
 *    - amount of time - data in cache - stays fresh (stay valid until it refreshed again)
 * [CODE]
 * ------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,     // >>> change it to 0 * 1000 
    },
  },
}); 
 * 
 * $ IMPORTANT:
 * - inside App.jsx: leave the "stale-time" to: [ 0 mins ] 
 *    - this will keep app in "stale"-condition and app-condition does not change to "fresh" 
 *  
 * 
 * ! 6. Mutations: Deleting a Cabin
 * --------------------------------
 * - apiCabins.js: similar to "getCabins" we need to have "deleteCabins"
 *    - we can only use this function to delete-cabin using react-query custom-hooks
 * [CODE]
 * ---
 * >>> apiCabins.js
export async function deleteCabins(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
}
 * 
 * - even we call this function nothing would happen!
 * 
 * >>> Row-Level-Security
 * - as we activated policy in RLS to read data >>> now we also have to..
 * - we temporarily allow "all-users" to delete then after we change it to "authenticated-users" only)
 * 
 * process:
 * [so we need to create a new policy to allow all users to "delete" data]
 * [steps]
 * - navigate inside "authentication" => then "policies" => "cabins" => "create policy" 
 * - "Policy Name: Enable delete access for all users" => select "DELETE" => then edit as "true"...
 * create policy "Enable delete access for all users" 
 * on "public"."cabins"
 * as PERMISSIVE
 * for DELETE
 * to public
 * using (true);        // >>> editable: change here to true
 * 
 * >>> react-query-mutations
 * (mutations are done with "useMutations()" custom hook)
 * * useMutation()
 * - similar to useQuery() this also takes an object => this object takes a fn that we created inside "apiCabins.jsx" file to delete cabins 
 * (deleteFunction takes in that present cabin which this "delete" btn was attached on to)
 *
 * - useMutation: returns 'isLoading' a flag and "mutate" a function 
 *      - "mutate" => a callback used with "onClick" event-handler on "delete-btn" [which requires present cabin-id]
 * 
 * - attaching this mutate function which was returned will not automatically reload the data (OR) re-render page after deleting a row [after deleting: app needs manual reloading]
 *    - we have to invalidate "cache" after mutation has done: by specifying a "onSuccess" cb 
 *      - onSuccess-cb: here we have to instruct react what to do after a "successful-mutation" 
 *                    - so we have to specify to react that it has to re-fetch after mutation >>> this process: // => Invalidating "CACHE"
 * 
 * - after "invalidating" data turns to "stale-state" and "re-fetched" again [-- with same key that we specified before --]
 *    - invalidating has to be called on "queryClient" >>> we get access to "queryClient" with special hook called // => "useQueryClient"
 *  
 * (then, we can call queryClient.invalidateQueries()) more inside... 
 * [CODE]
 * ------
const queryClient = useQueryClient();     // >>> 'queryClient' to invalidate-state

const { isLoading: isDeleting, mutate } = useMutation({         // >>> 'useMutation' Hook
  mutationFn: function (id) {     // >>> 'mutationFn': to mutate
    return deleteCabin(id);
  },
  onSuccess: function () {                  // >>> 'onSuccess' a callback
    alert("Cabin successfully deleted!");
    queryClient.invalidateQueries({     // >>> 'invalidateQueries'() on "queryClient"
      queryKey: ["cabins"],
    });        // >>> 'queryKey' is imp
  },
  onError: function (err) {
    alert(err);
  },
});
---------------------------------------
// >>> in CabinRow.jsx [total_code]:
------------------------------------
function CabinRow({ cabin }) {
  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
  } = cabin;
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: function (id) {
      return deleteCabin(id);
    },
    onError: function (err) {
      alert(err);
    },
    onSuccess: function () {
      alert("Cabin successfully deleted!");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
  });
  return (
    <TableRow role="row">
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity}</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      <Discount>{formatCurrency(discount)}</Discount>
      
      <button onClick={() => mutate(cabinId)} disabled={isDeleting}>
        Delete
      </button>
    </TableRow>
  );
}
export default CabinRow;
 * 
 * * useQueryClient()
 * (used inside "onSuccess" to invalidate-queries)
 * - this is used to invalidate which turns application-state from "fresh" to "stale" 
 *    - inside "stale" only re-fetching will be done! 
 *      [but not when app in "fresh" state]
 * 
 * 
 * ! 7. Displaying Toasts (Notifications)
 * --------------------------------------
 * (alerts are replaced with "Toasts" >>> which are notifications)
 * 
 * * Toasts:
 * [installation]
 * => npm i react-hot-toast
 * 
 * [set-up]
 * - inside App.jsx: 
 *    - similar to "GlobalStyles: from styled-components" and "ReactQueryDevtools: from react-query-devtools"
 * - this toast component is also a self-closing tag with options specified to it! 
 * [CODE]
 * ------
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyles />
      <BrowserRouter>
        <Routes> ... </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        gutter={12}           // >>> space between "window" and "toaster"
        containerStyle={{ margin: "8px" }}    
        toastOptions={{
          success: {
            duration: 3000,   // >>> error- toast / alert duration
          },
          error: {            
            duration: 5000,   // >>> error- toast / alert duration
          },
          style: {        // >>> defining "styles"
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",   
            color: "var(--color-grey-700)",
          },
        }}
      />    // >>> self-closing tag
    </QueryClientProvider>
  );
}
export default App;
 * 
 * - replace every "alert" with "toast" 
 * 
----------------------------------------- 
inside CabinRow.jsx: 
---
function CabinRow({ cabin }) {
  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: function (id) {
      return deleteCabin(id);
    },
    onError: function (err) {
      toast.error(err.message);     // >>> on error use: toast.error()
    },
    onSuccess: function () {
      toast.success("Cabin successfully deleted!");   // >>> on success use: toast.success()
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
  });
  return (...)
}
 *  
 * 
 * 
 * ! 8. Introducing Another Library: React Hook Form
 * -------------------------------------------------
 * to render form edit inside following file..
 * 
 * >>> inside "Cabins.jsx"
 * - set up a button to on-click shall toggle a form [on submitting it shall add a new cabin into DB]
 * [CODE]
return (
  <>
    <Row type="horizontal">
      <Heading as="h1">All cabins</Heading>
      <p>TEST</p>
    </Row>
    <Row type="vertical">
      <CabinTable />
      <Button onClick={handleShow}>Add new cabin</Button>
      {showForm ? <CreateCabinForm /> : ""}
    </Row>
  </>
);
 * 
 * -till now we've used "supabase" to add new cabins.. but we now use another new library: "REACT-HOOK-FORM")
 * 
 * * React-Hook-Form
 * - this library is only about handling form-submission and form-errors [doesn't provide any pre-built components]
 * (we already have a form for this application)
 * 
 * - [installation]
 * [use ver: 7 to follow with lecture]
 * => npm i react-hook-form@7
 * 
 * [PRE-CODE] in. "CreateCabinForm.jsx"
 * ----------
function CreateCabinForm() {
  return (
    <Form>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input type="text" id="name" />
      </FormRow>
      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input type="number" id="maxCapacity" />
      </FormRow>
      
      --- other form-fields ---

      <FormRow>
        // "type" is an HTML attribute! 
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button>Edit cabin</Button>
      </FormRow>
    </Form>
  );
}
export default CreateCabinForm;
 * 
 * $ NOTICE:
 * - in above form, we did not make any "input-field" a controlled-element.. but we will handle every field with "react-hook-form" library!
 * 
 * [CODE-after-react-hook-form]
 * ----------------------------
function CreateCabinForm() {
  const { register, handleSubmit } = useForm();   //#1

  function onHandleSubmit(data) {
    console.log(data);
  }
  return (
    <Form onSubmit={handleSubmit(onHandleSubmit)}>    //#2
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input type="text" id="name" {...register("name")} />   //#1.1
      </FormRow>
      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input type="number" id="maxCapacity" {...register("maxCapacity")} />   //#1.1
      </FormRow>
      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input type="number" id="regularPrice" {...register("regularPrice")} />   //#1.1
      </FormRow>
      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input type="number" id="discount" defaultValue={0}
          {...register("discount")}   //#1.1
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="description">Description for website</Label>
        <Textarea type="number" id="description" defaultValue=""
          {...register("description")}    //#1.1
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput id="image" accept="image/*" />
      </FormRow>
      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button>Edit cabin</Button>
      </FormRow>
    </Form>
  );
}
 * 
 * [steps-involved]
 * ----------------
 * #1
 * - calling "useForm" hook returns few functions and most fundamental functions are: "register" and "handleSubmit" fns
 * 
 * register:
 *    - where we "register" form-fields into this hook 
 *    - on calling "register" returns onChange BTS >>> means handle-form and turning them into controlled-input-fields
 * 
 * handleSubmit: 
 *    - used while submitting the form in which this is attached
 *    - gets every data from the form-fields into this function
 * 
 * #1.1
 * {...register("<id>")}
 *    - calling register with id given to the form-fields as "register-fn's" arguments
 * (BTS: on-spreading will attach new props: "onChange" and "onBlur" to form fields)
 * 
 * #2
 * handleSubmit
 * - HTML form has access to "onSubmit-Ev_Hndlr" which has to take "handleSubmit" which was returned from calling "useForm" hook
 * (handleSubmit takes in another function)
 *    - function inside "handleSubmit()" gets access to data from every form-field  
 * 
 * 
 * ! 9. Creating a New Cabin
 * -------------------------
 * (set-up code inside "apiCabin.js" to insert new cabin data from the form by interacting with supabase-db)
 * #1 
 * [setup a new fn to "create"]
 * ---
export async function createCabin(newCabin) {
  const { data, error } = await supabase
    .from("cabins")
    .insert([newCabin])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
  return data;
}
 * 
 * #2
 * [create a new policy] (follow below steps)
 * >>> Row-Level-Security
 *    - navigate inside "authentication" => then "policies" => "cabins" => "create policy" 
 *    - "Policy Name: Enable create access for all users" => select "INSERT" => then edit as "true"... 
 * alter policy "Enable create access for all users"
 * on "public"."cabins"
 * to public
 * with check (true);       // >>> editable: change here to true
 * 
 * - as we have to mutate existing data on DB that will be "mutation" >>> a react-query mutation
 * - follow the [CODE] below..
 * 
// >>> inside [CreateCabinForm]
---------------------------------
function CreateCabinForm() {
  const { register, handleSubmit, reset } = useForm();

  const queryClient = useQueryClient();     // #2.2

  const { mutate, isLoading: isCreating } = useMutation({       // #1
    mutationFn: function (newCabin) {
      return createCabin(newCabin);         // #1.1
    },
    onSuccess: function () {      
      toast.success("New cabin successfully created!");   // #2
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      reset();      // #4
    },
    onError: function (err) {
      toast.error(err.message); 
    },
  });

  function onHandleSubmit(data) {
    mutate(data);       // #3
  }
  return (
    <Form onSubmit={handleSubmit(onHandleSubmit)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input type="text" id="name" {...register("name")} />
      </FormRow>
      --- other form-fields ---
      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Edit cabin</Button>
      </FormRow>
    </Form>
  );
}
export default CreateCabinForm;
 * 
 * #1
 * [useMutation]
 * - used while adding new cabin data to "supabase"
 * #1.1
 * - createCabin({}) >>> new cabin object
 *    - adds that into DB
 * #2 #2.2
 * [onSuccess]
 * - on success uses queryClient to invalidate-query with queryKey: ["cabins"]
 * (every thing about mutation, queryClient etc.. was discussed earlier inside "delete" cabin)
 * #3
 * 'onHandleSubmit' gets data from form-fields
 * - "mutate" fn from "useMutate" gets that data
 * #4
 * [reset]
 * - reset every form field after submitting the form!
 * 
 * $ NOTE:
 * - form-validation in next lecture
 * 
 * 
 * ! 10. Handling Form Errors
 * --------------------------
 * (react-hook-form popular for form-error-validation)
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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
