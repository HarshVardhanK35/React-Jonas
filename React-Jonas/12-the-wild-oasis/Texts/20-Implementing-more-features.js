// ! Implementing More Features: "Authentication", "Dark-Mode", "Dashboard" etc.,
// ------------------------------------------------------------------------------
/**
 * * building this application as per the requirements listed inside 16-txt file!
 * * in this file >>> I will only paste the respective code snippet 
 *      - [and also write some comments how files are connected when multiple files are used] !
 * 
 * 
 * ! 1. Section Overview
 * ---------------------
 * - implementing more features in The Wild Oasis application
 *      - filter, sort, pagination 
 *      - dark mode
 *      - dashboard with charts
 *      - authentication and authorization
 * 
 * ! 2. Client-Side Filtering: Filtering Cabins
 * --------------------------------------------
 * (using buttons so users can filter cabins whether they require "discount/not")
 * - we can use "URL" to filter out options [if we use URL then we can access URL from anywhere inside a react-element-tree]
 * 
 * - three files modified here: ["Filter" | "CabinTableOperations" | CSS only file: "TableOperations"]
 * [code]
 * ------
// >>> Filter:
---
// - STYLING
const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;
${(props) =>
props.active &&
    css`
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
    `
}
// - CODE ... 
function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // - for active prop
  const currentFilter = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    searchParams.set(filterField, value);
    setSearchParams(searchParams);
  }
  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          onClick={() => handleClick(option.value)}
          key={option.label}
          active={option.value === currentFilter}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}
export default Filter;
--------------------------------- Connected ---------------------------------- 
// >>> CabinTableOperations
function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />
    </TableOperations>
  );
}
export default CabinTableOperations;
--------------------------------- Connected ---------------------------------- 
// >>> CabinTable
---
function CabinTable() {
  const { cabins, isLoading } = useFetchCabins();
  
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("discount") || "all";
  
  let filteredCabins;
  if (filterValue === "all") {
    filteredCabins = cabins;
  }
  if (filterValue === "no-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  }
  if (filterValue === "with-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  }
  
  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          // after filter!
          data={filteredCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}
export default CabinTable;
 * 
 * $ SUMMARY:
 * 
 * 
 * 
 * 
 * ! 3. Client-Side Sorting: Sorting Cabins
 * ----------------------------------------
 * [code]
 * ------
// >>> CabinTableOperations.jsx
---
function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by price (low-high)" },
          { value: "regularPrice-desc", label: "Sort by price (high-low)" },
          { value: "maxCapacity-asc", label: "Sort by capacity (low-high)" },
          { value: "maxCapacity-desc", label: "Sort by capacity (high-low)" }
        ]}
      />
    </TableOperations>
  );
}
export default CabinTableOperations;
---------------------------------- CONNECTED ----------------------------------
// >>> SortBy.jsx
---
import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currSortBy = searchParams.get("sortBy") || "";

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }
  return (
    <Select
      options={options}
      type="white"
      value={currSortBy}      // - designed controlled-elements here with "value" and "onChange" | these sent for "Select-comp" as props
      onChange={handleChange}
    />
  );
}
export default SortBy;
---------------------------------- CONNECTED ----------------------------------
// >>> Select.jsx
---
function Select({ options, value, onChange, ...props }) {       // - every other "props" will be collected >>> "rest operator"
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>       // - collected props will be spread here!
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}
export default Select;
---------------------------------- CONNECTED ----------------------------------
// >>> CabinTable.jsx
---
function CabinTable() {
  const [searchParams] = useSearchParams();
  const { cabins, isLoading } = useFetchCabins();

  // - 1. FILTER
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;
  if (filterValue === "all") filteredCabins = cabins;

  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
    
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  // - 2. SORTING
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");

  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins.sort(               // - filtered-data will be sorted [in this way.. filtered and sorted data were connected]
    (a, b) => (a[field] - b[field]) * modifier  // - "sorting-logic"
  );

  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          // - before filter-sort
          // data={cabins}

          // - after filter-sort!
          data={sortedCabins}       // - sorted data
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}
export default CabinTable;
 * 
 * $ SUMMARY ?:
 * 
 * 
 * 
 * ! 4. Building the Bookings Table
 * --------------------------------
 * [code]
 * ------
function BookingTable() {
  const { bookings, isLoading } = useFetchBookings();
  
  if (isLoading) return <Spinner />;
  if (bookings.length === 0) return <Empty resourceName="Bookings" />;
  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
      </Table>
    </Menus>
  );
}
--------------------------------------------- ---------------------------------------------
function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };
  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>

        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>
    </Table.Row>
  );
}
--------------------------------------------- ---------------------------------------------
function useFetchBookings() {
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
  return { bookings, isLoading, error };
}
--------------------------------------------- ---------------------------------------------
export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)"
    );
  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return data;
}
 * 
 * 
 * 
 * ! 5. Uploading Sample Data
 * --------------------------
 * 
 *  
 * ! 6. API-Side Filtering: Filtering Bookings
 * -------------------------------------------
 * (filtering cabins was done on client-side but to filter or sort on API-side then..)
 * 
 * - filter and sort options that we have are:
 * [code]
 * ------
function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter             // - options on "Filter-data"
        filterField="status"                            // - to read values from URL >>> we have to use "status"
        options={[
          { value: "all", label: "All" },
          { value: "checked-out", label: "Checked out" },
          { value: "checked-in", label: "Checked in" },
          { value: "unconfirmed", label: "Unconfirmed" },
        ]}
      />
      <SortBy       // - options on "SortBy"
        options={[
          { value: "startDate-desc", label: "Sort by date (recent first)" },
          { value: "startDate-asc", label: "Sort by date (earlier first)" },
          {
            value: "totalPrice-desc",
            label: "Sort by amount (high first)",
          },
          { value: "totalPrice-asc", label: "Sort by amount (low first)" },
        ]}
      />
    </TableOperations>
  );
}
 * 
 * - to apply filters on server side.. we hard-coded some filters on "apiBookings"
 * [code]
 * ------
export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)"
    )
    .eq("status", "unconfirmed")    // - we have to use "eq"
    .gte("totalPrice", 5000);     // - we can also use "gte: greater-than-equal" and "lte: less-than-equal"

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return data;
}  
 * 
 * - so while clicking on filters and sort-options URL is changing but to read URL values we have to use "useSearchParams-Hook"
 *    - but we cannot use "useSearchParams-Hook" inside "apiBookings" instead we can use inside "useFetchBookings" file
 * (inside following file >>> we can read filtered-values from URL)
 * [code]
 * ------
function useFetchBookings() {       // - read here!
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,       // - pass to "apiBookings" from here!
  });
  return { bookings, isLoading, error };
}
 * 
 * - modified code:
 * [useFetchBookings]
 * ------------------
function useFetchBookings() {
  const [searchParams] = useSearchParams();

  // FILTER
  const filteredValue = searchParams.get("status");   // - read values from URL

  const filter =
    !filteredValue || filteredValue === "all"
      ? null
      : // : { field: "totalPrice", value: 5000, method: "gte" };   // - making a "filter" object
        { field: "status", value: filteredValue, method: "eq" };

  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter],     // #1 EXPLANATION BELOW
    queryFn: () => getBookings({ filter }),   // >>> sending "filter-obj" to "apiBookings-file"
  });
  return { bookings, isLoading, error };
}
export default useFetchBookings;
 * 
 * #1 EXPLANATION
 * - when only "filter" applied inside line for queryKey: ["bookings", filter].. then only re-fetch happens automatically with "useQuery"
 * this array here acts as a // => dependency-array [works similar to "useEffect"]
 * 
 * - whenever "filter" changes "react-query" re-fetches data with auto-application of filters
 * 
 * (getting filter-data into "getBookings" function..)
 * [code]
 * ------
export async function getBookings({ filter, sortBy }) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)"
    );
  // .eq("status", "unconfirmed")     // - equals: in the model of (field, value)
  // .gte("totalPrice", 5000);

  // >>> 1. FILTER
  if (filter !== null)
    query = query[filter.method || "eq"](filter.field, filter.value);   // #2 

  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return data;
}
 * 
 * #2 there we are getting one object of filters
 * - instead we can pass one or more and apply more filters by.. 
 * 
 * $ NOTE:
 * - whenever we are passing filters from "useFetchBookings" we can pass an array of objects 
 *    - then while applying inside "apiBookings" we have to loop over the array of filters we are getting into!
 * 
 * SORTING CONTINUES...
 * 
 * 
 * ! 7. API-Side Sorting: Sorting Bookings
 * ---------------------------------------
 * sortBy options are:
options={[
  { value: "startDate-desc", label: "Sort by date (recent first)" },
  { value: "startDate-asc", label: "Sort by date (earlier first)" },
  ...
]}
 * 
 * - useFetchBookings
 * [code]
 * ------
function useFetchBookings() {
  const [searchParams] = useSearchParams();

  // - FILTER
  const filteredValue = searchParams.get("status");

  const filter =
    !filteredValue || filteredValue === "all"
      ? null
      : { field: "status", value: filteredValue, method: "eq" };
  // : { field: "totalPrice", value: 5000, method: "gte" };

  // - SORTBY
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");

  const sortBy = { field, direction };

  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy],
    queryFn: () => getBookings({ filter, sortBy }),     // - sending sortBy to below ("apiBookings") file 
  });
  return { bookings, isLoading, error };
}
 * 
 * - apiBookings
 * [code]
 * ------
export async function getBookings({ filter, sortBy }) {       // - getting "filter" and "sortBy"
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)"
    );
  // .eq("status", "unconfirmed")
  // .gte("totalPrice", 5000);

  // - 1. FILTER
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // - 2. SORT
  if (sortBy)                               // - use query.order() function to apply sort options!
    query = query.order(sortBy.field, {     
      ascending: sortBy.direction === "asc",    // - extra options
    });
  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return data;
}
 * 
 * 
 * 
 * ! 8. Building a Reusable Pagination Component
 * ---------------------------------------------
 * (render buttons which will allow to set current page to URL)
 * [code]
 * 
// >>> Pagination.jsx
---
const PAGE_SIZE = 10;

function Pagination({ count }) {
  // - calculating "prev" or "next" always depends on "curr-page" [that has to get from curr-page-URL]
  const [searchParams, setSearchParams] = useSearchParams();

  // - current-page ?
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    // - check curr-pg is equal to pg-count [that is we are on last-page!]
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    searchParams.set("page", next);
    setSearchParams(searchParams);
  }
  function prevPage() {
    const prev = current === 1 ? currentPage : currentPage - 1;

    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  if(pageCount <= 1) return null
  return (
    <StyledPagination>
      <P>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> -{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        <span>of</span> <span>{count}</span> results
      </P>
      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          <HiChevronLeft />
          <span>Previous</span>
        </PaginationButton>

        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}
export default Pagination;
------------------------------------ CONNECTED ------------------------------------
// >>> BookingTable.jsx
---
function BookingTable() {
  const { bookings, isLoading } = useFetchBookings();     // - we can calculate "count" here from bookings but... 

  if (isLoading) return <Spinner />;
  if (bookings.length === 0) return <Empty resourceName="Bookings" />;
  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={45} />   // - hard coded: results-count 
        </Table.Footer>
      </Table>
    </Menus>
  );
}
 *  
 * 
 * - count that we passed above has to calculated inside API and has to be sent
 * (so in next lecture...)
 * 
 * ! 9. API-Side Pagination: Paginating Bookings
 * ---------------------------------------------
 * - possible way to calculate count 
 * [code]
 * ------
function BookingTable() {
  const { bookings, isLoading } = useFetchBookings();   // - calculate number of bookings and can pass into "count" [but there is another way of calculation]

  if (isLoading) return <Spinner />;
  if (bookings.length === 0) return <Empty resourceName="Bookings" />;
  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header> ... </Table.Header>
        <Table.Body ... />
        <Table.Footer>
          <Pagination count={45} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
 * 
 * - as this operation is on API-side we have to work on "apiBookings"
 * [code]
 * ------
// >>> useFetchBookings: 
---
function useFetchBookings() {
  const [searchParams] = useSearchParams();

  // FILTER
  const filteredValue = searchParams.get("status");

  const filter =
    !filteredValue || filteredValue === "all"
      ? null
      : { field: "status", value: filteredValue, method: "eq" };
  // : { field: "totalPrice", value: 5000, method: "gte" };

  // SORTBY
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");

  const sortBy = { field, direction };

  // - PAGINATIOn
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));    // - when clicked "searchParams: page" will be updated!

  const {
    isLoading,
    data = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],           
    queryFn: () => getBookings({ filter, sortBy, page }),       // - "page" value will be sent to "apiBookings" here... 
  });
  const { data: bookings, count } = data;

  return { bookings, isLoading, error, count };
}
--------------------------------------------------
// >>> apiBookings.js
---
export async function getBookings({ filter, sortBy, page }) {       // - sent "page" value is caught here... 
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" }    // - imp: we can count-"exact" results [selected only]
    );
  // .eq("status", "unconfirmed")
  // .gte("totalPrice", 5000);

  // 1. FILTER
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // 2. SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  // - PAGINATION
  if (page) { 
    const from = (page - 1) * PAGE_SIZE;      // - value: "page" from "useFetchBookings" used here for calculation of results!
    const to = from + PAGE_SIZE - 1;    
    query = query.range(from, to);        // - results on every page are calculated here: "from" and "to" has to be used here..
  }
  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return { data, count };
}
 * 
 * >>> concentrate on [react-query-dev-tools]
 * 
 * [previous-page-data-workings]
 * - when application is 1st loaded some results will be fetched and stored inside browser-cache
 *    - and whenever we visit again to 1st page.. already stored results of 1st page are used and rendered [without re-fetching on visit]!
 * ex:
 * when we are on page-2.. page-1 results are already stored inside cache 
 *    [when we click on page-1 that is when we go to prev-page.. already stored data will be rendered]
 * 
 * [next-page-data-workings]
 * - when we are on a page and click on "next" button.. next page results will be fetched [that is after clicking only]!
 *    - this fetching onClicking "next" does not create best UX (user-experience) 
 * => this is where "PRE-FETCHING" concept works
 * 
 * [next lecture: PRE-FETCHING]
 * 
 * ! 10. Prefetching With React Query
 * ----------------------------------
 * (LEARN: what is pre-fetching and how can we implement using react-query)
 * (in-order to make User-Experience better)
 * 
 * * pre-fetching
 *    - fetching data that might become necessary before we need that data to render on UI 
 * (PAGINATION: we need next page data before it is displayed)
 * 
 * CASE:
 * when we are on page-2 we need to fetch page-3 results before we click on "next" to fetch page-3 and store page-3 data inside "cache"  
 * [code]
 * ------
function useFetchBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filteredValue = searchParams.get("status");

  const filter =
    !filteredValue || filteredValue === "all"
      ? null
      : { field: "status", value: filteredValue, method: "eq" };
  // : { field: "totalPrice", value: 5000, method: "gte" };

  // SORTBY
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");

  const sortBy = { field, direction };

  // - PAGINATIOn
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // - QUERY
  const {
    isLoading,
    data = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });
  const { data: bookings, count } = data;

  // - PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount)     
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],       // - front "next" page fetching
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],   // - back "previous" page fetching
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { bookings, isLoading, error, count };
}
 * 
 * >>> PRE-FETCHING: alternatives
 * - pre-fetching also be used for infinite-queries 
 * ex: infinite-scroll using react-query 
 *    - for this read documentation!
 * 
 * 
 * ! 11. Building the Single Booking Page
 * --------------------------------------
 * simply fetch-data from API and reading it and presenting it on Booking-page
 * so no new things learnt here!
 * 
 * 
 * 
 * ! 12. Checking In a Booking
 * ---------------------------
 * (check-in guests into hotel when they arrive)
 * (as there is no online payment platform integration here in this application)!
 * 
 * case (offline payment)
 * - guests can book online and pay offline after they arrive hotel
 * - so hotel-staff has to confirm certain guest has paid or not [then only guests can check-in]
 * (also on check-in, guests should have ability to add breakfast for an entire stay)
 * 
 * >>> this whole functionality has to be done inside individual booking detail page 
 * 
 * * PLEASE REFER GITHUB FOR CODE AND IT'S DETAILS !
 * 
 * ! 13. Adding Optional Breakfast
 * -------------------------------
 * 
 * 
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
 * --------------------------------------------------
 * 
 * ! 1. Checking Out a Booking (+ Fixing a Small Bug)
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
 */
