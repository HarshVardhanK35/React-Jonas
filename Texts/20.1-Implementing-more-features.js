// ! Implementing More Features: "Authentication", "Dark-Mode", "Dashboard" etc.,
// ------------------------------------------------------------------------------
// ! PART - 1 !
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
 *  * PLEASE REFER GITHUB FOR CODE AND IT'S DETAILS !
 * 
 * ! 14. Checking Out a Booking (+ Fixing a Small Bug)
 * ---------------------------------------------------
 *  * PLEASE REFER GITHUB FOR CODE AND IT'S DETAILS !
 * 
 * ! 15. Deleting a Booking
 * ------------------------
 *  * PLEASE REFER GITHUB FOR CODE AND IT'S DETAILS !
 * 
 * ! 16. Authentication: User Login With Supabase
 * ----------------------------------------------
 * [inside browser]
 * - inside supabase => navigate to "Authentication" => click on "Users" => click on "green btn - Add user" => click on "Create new user"
 *    - set an "email-address" and "password" 
 * (so that these credentials only have to be provided to login to access application)!
 * 
 * [inside VS-code]
 * [code]
 * ------
// >>> apiAuth.js
---
export async function login(loginDetails) {
  const { email, password } = loginDetails;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
----------------------------------- CONNECTED -----------------------------------
// >>> useLogin.js [CUSTOM-HOOK]
---
export function useLogin() {
  const navigate = useNavigate();

  const { mutate: loginFn, isLoading: isLoggingIn } = useMutation({
    mutationFn: function ({ email, password }) {
      return loginApi({ email, password });
    },
    onSuccess: function () {
      navigate("/dashboard",  { replace: true });   //- replace set to true: "erase the earlier route that we were in!"
    },
    onError: function (err) {
      console.log("Login ERROR", err);
      toast.error("Provided login credentials are incorrect!");
    },
  });
  return { loginFn, isLoggingIn };
}
----------------------------------- CONNECTED -----------------------------------
// >>> LoginForm.jsx
---
function LoginForm() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test4321");

  const { loginFn, isLoggingIn } = useLogin();    // - importing "login-function" and isLoading as "isLoggingIn" from custom-hook [useLogin-fn]

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    loginFn({ email, password });       // - instead of writing code that authenticates users, we include that in a separate file [useLogin-fn] 
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          disabled={isLoggingIn}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isLoggingIn}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isLoggingIn}>
          {isLoggingIn ? <SpinnerMini /> : "Login in"}
        </Button>
      </FormRowVertical>
    </Form>
  );
}
export default LoginForm;
 * 
 * - even when application is authenticated: other users can access every route of an application
 * - so we need authorization... [in next lecture]!
 * 
 * ! 17. Authorization: Protecting Routes
 * --------------------------------------
 * * authorization
 *    - where only logged in users can access every route of an application
 *  
 * >>> implementation
 *    - wrap every part of application using protected route component 
 * (we implemented this before inside [WORLD-WISE App] but that was not exactly what we do in real-world)
 * 
 * - real-world way of implementing authorization 
 * [code]
 * ------
// >>> App.jsx
---
<Route element={<AppLayout />}>
  <Route index element={<Navigate replace to="dashboard" />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="bookings" element={<Bookings />} />
  <Route path="bookings/:bookingId" element={<Booking />} />
  <Route path="checkin/:bookingId" element={<Checkin />} />
  <Route path="cabins" element={<Cabins />} />
  <Route path="users" element={<NewUsers />} />
  <Route path="settings" element={<Settings />} />
  <Route path="account" element={<Account />} />
</Route>
 * 
 * - here every route is under <AppLayout> then protecting "AppLayout" protects every route under it as child
 * [code]
 * ------
// >>> App.jsx
---
<Route
  element={
    <ProtectedRoute>    // - Parent element
    <AppLayout />         // - direct children of "ProtectedRoute"
    </ProtectedRoute>
  }
  >
  <Route index element={<Navigate replace to="dashboard" />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="bookings" element={<Bookings />} />
  <Route path="bookings/:bookingId" element={<Booking />} />          // - grandchildren of "protected-route"
  <Route path="checkin/:bookingId" element={<Checkin />} />
  <Route path="cabins" element={<Cabins />} />
  <Route path="users" element={<NewUsers />} />
  <Route path="settings" element={<Settings />} />
  <Route path="account" element={<Account />} />
<Route /> 
----------------------------------------- connected -----------------------------------------
// >>> ProtectedRoute.js
---
function ProtectedRoute({ children }) {
  // 1. Load authenticated user
  // 2. While loading.. show a spinner
  // 3. if no authenticated-user, redirect user to "/login" page
  // 4. if there is authenticated-user, render application

  return children;
}
export default ProtectedRoute;
 * 
 * >>> steps involved in basic protection of routes or authorization..
 * - 1. Load authenticated user
 * - 2. While loading.. show a spinner
 * - 3. if no authenticated-user, redirect user to "/login" page
 * - 4. if there is authenticated-user, render application
 * 
 * - before 1st step.. we have to create a function that checks for active session inside local-storage [this has to be done inside "apiAuth.js"]
 *    - if there is any then fetches user from supabase
 * [code]
 * ------
// >>> apiAuth.js
---
export async function getLoggedUser() {       // - local-storage gets session of user.. when user logs in
  const { data: sessionData } = await supabase.auth.getSession();           // - check if there is any active session inside "LOCAL-STORAGE"

  if (!sessionData.session) return null;          // - checking of active-session, if "NO" returns a "null"
  // - else.. 
  const { data, error } = await supabase.auth.getUser();        // - re-download / fetch 'user' from 'supabase' [instead we can get from above-sessionData but that will not be a secure-way]
  
  if (error) {
    throw new Error(error.message);
  }
  return data?.user;
}
------------------------------------------------------- CONNECTED -------------------------------------------------------
// ? react-query to manage state that was fetched from "getLoggedUser [from apiAuth.js]"
// >>> useLoggedInUser.js:
---
function useLoggedInUser() {                    // - get user and download user-details and store into CACHE [instead of re-downloading when it is needed!]
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],                                             // - storing user-data inside cache with key "user"
    queryFn: getLoggedUser,                   // >>> getting data using fn: "getLoggedUser" [important]
  });
  
  return { user, isLoading, isAuthenticated: user?.role === "authenticated" };    // - checking "user.role" is authenticated or not! [type: "boolean"]
}
export default useLoggedInUser;
------------------------------------------------------- CONNECTED -------------------------------------------------------
// ? updating ProtectedRoute [finally]
// >>> ProtectedRoute.jsx:
---
function ProtectedRoute({ children }) {       // - allowed to call inside callback or in a "useEffect" [but not at top level of component]
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useLoggedInUser();           // - 1. Load authenticated user

  useEffect(          // - 2. if no authenticated-user, redirect user to "/login" page
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login"); // when "loading" user is also not 'authenticated'
    },
    [isAuthenticated, isLoading, navigate]
  );
  if (isLoading)
    return (          // - 3. While loading.. show a spinner
      <FullPage>
        <Spinner />     
      </FullPage>
    );
  if (isAuthenticated) return children;       // - 4. if there is authenticated-user, render application
}
export default ProtectedRoute;
 * 
 * - [next lecture]
 * => logging out user
 * 
 * 
 * ! 18. User Logout
 * -----------------
 * (logic written inside "apiAuth" and "useLogout" files)
 * [code]
 * ------
// >>> apiAuth.js
---
export async function logout() {
  const { error } = await supabase.auth.signOut();      // - [imp]
  if (error) {
    throw new Error(error.message);
  }
}
--------------------------------------------- CONNECTED ---------------------------------------------
// >>> useLogout.js
---
function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logoutFn, isLoading: isLoggingOut } = useMutation({
    mutationFn: logoutApi,                       
    onSuccess: function () {
      queryClient.removeQueries();              // - removing cached queries.. user data and app data that was fetched while user is logged in have to removed from cache
      navigate("/login", { replace: true });          // - replace set to be 'true' >>> "erase the earlier route that we were in!"
    },
  });
  return { logoutFn, isLoggingOut };
}
export default useLogout;
--------------------------------------------- CONNECTED ---------------------------------------------
// >>> Logout.jsx
---
function Logout() {
  const { logoutFn, isLoggingOut } = useLogout();
  return (
    <ButtonIcon disabled={isLoggingOut} onClick={logoutFn}>
      {isLoggingOut ? <SpinnerMini /> : <HiArrowRightOnRectangle />}
    </ButtonIcon>
  );
}
export default Logout;
 * 
 * - without using "supabase" to add new users for our application 
 *    - we create a sign-up form to create a user!
 * 
 * ! 19. Fixing an Important Bug
 * -----------------------------
 * * explanation of bug
 * (we require 'apiAuth', 'useLogin', 'useLoggedInUser', 'ProtectedRoute' files to explain this)!
 * [code]
 * ------
// >>> apiAuth.js
---
export async function getLoggedUser() {
  const { data: sessionData } = await supabase.auth.getSession(); 
  if (!sessionData.session) return null;              // #1

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }
  return data?.user;
}
--------------------------------- CONNECTED --------------------------------- 
// >>> useLogin.js
---
export function useLogin() {
  const navigate = useNavigate();

  const { mutate: loginFn, isLoading: isLoggingIn } = useMutation({
    mutationFn: function ({ email, password }) {
      return loginApi({ email, password });
    },
    onSuccess: function () {
      navigate("/dashboard", { replace: true });      // #3
    },
    onError: function (err) {
      console.log("Login ERROR", err);
      toast.error("Provided login credentials are incorrect!");
    },
  });
  return { loginFn, isLoggingIn };
}
--------------------------------- CONNECTED --------------------------------- 
// >>> useLoggedInUser.js
---
function useLoggedInUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"], 
    queryFn: getLoggedUser,
  });
  return { user, isLoading, isAuthenticated: user?.role === "authenticated" };    // #2
}
export default useLoggedInUser;
--------------------------------- CONNECTED --------------------------------- 
// >>> ProtectedRoute.jsx:
---
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useLoggedInUser();
  
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");     // #4
    },
    [isAuthenticated, isLoading, navigate]
  );
  if (isLoading){
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }
  if (isAuthenticated) return children;
}
export default ProtectedRoute;
 * 
 * 
 * #1
 *    - whenever user tries to access "/dashboard" without logging in.. application automatically asks user to login into his account [by redirecting user to "/login" page]
 *    - as there is no user's session inside "LOCAL-STORAGE"
 *        - as per mark "#1" {if (!sessionData.session) return null} >>> react-query sets query-cache of "user" to "null" [that is user is false now!]
const { data: user, isLoading } = useQuery({
  queryKey: ["user"], 
  queryFn: getLoggedUser,
});
 * 
 * - as per above code.. to "queryKey: ["user"]" inside cache: user-key gets null
 * 
 * [now user attempts to log in to his account]
 * #2 
 *    - as inside query-cache user is set to "null" 
 *    - even though user was logged in.. that means user gets a session-data [that is an access_token inside local-storage]
 *    - user will not be redirected to "/dashboard" but he stays inside "/login" page itself
 * [cause as user gets "null" previously that is user: false before]
 * [code]
 * ------
return { user, isLoading, isAuthenticated: user?.role === "authenticated" };    //#2
navigate("/dashboard", { replace: true });    // #3
if (!isAuthenticated && !isLoading) navigate("/login");   // #4
 * 
 * (as per above #2, #3, #4)
 *    - user.role is checked with "authenticated" but initially user is set to "false"
 *    - so unequal and even user successfully logged-in >>> user stays inside "/login" [will not be redirected to "/dashboard"] 
 * 
 * [code]
 * ------
// >>> useLogin.js
---
export function useLogin() {
  const navigate = useNavigate();

  const { mutate: loginFn, isLoading: isLoggingIn } = useMutation({
    mutationFn: function ({ email, password }) {
      return loginApi({ email, password });
    },
    onSuccess: function (user) {
      console.log(user);              // - consoles the below output!
      navigate("/dashboard", { replace: true });
    },
    onError: function (err) {
      console.log("Login ERROR", err);
      toast.error("Provided login credentials are incorrect!");
    },
  });
  return { loginFn, isLoggingIn };
}
----------------------------------- ! OUTPUT ! / CONSOLE.LOG -----------------------------------
{session: {...}, user: {...}} ----+ 
.                                ⬇️
.                                ⬇️
1. session: {access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImUyS21IU1BzVVdxaXQ0cl…HNlfQ.iYRn2eyVj5Kpq7deAzZnHszVOY03184Xz72dlTCUUAI', token_type: 'bearer', expires_in: 3600, expires_at: 1752219811, refresh_token: 'l7rxlov6lxh6', …}

2. user: {id: '79ac1759-7f1d-41ef-83de-17fe868a69c5', aud: 'authenticated', role: 'authenticated', email: 'test@example.com', email_confirmed_at: '2025-07-10T14:07:23.692883Z', …}
[[Prototype]]: Object
 * 
 * 
 * >>> solution:
 * - setQueryData["queryKey / user", "to: user-data"]
 * [code]
 * ------
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginFn, isLoading: isLoggingIn } = useMutation({
    mutationFn: function ({ email, password }) {
      return loginApi({ email, password });
    },
    onSuccess: function (user) {          // - {session: {...}, user: {...}}
      queryClient.setQueryData(["user"], user.user);          // - set react-query: "user" to [user.user]
      navigate("/dashboard", { replace: true });
    },
    onError: function (err) {
      console.log("Login ERROR", err);
      toast.error("Provided login credentials are incorrect!");
    },
  });
  return { loginFn, isLoggingIn };
}
 * 
 * - by this way initially set null inside "user" will again replaced with [user.user]
 * 
 * 
 * ! 20. Building the Sign Up Form
 * -------------------------------
 * - not everyone can create an account in this app
 *    - only employees of hotel are the users of this application
 * 
 * - these users can only be created inside application >>> new users are immediately verified by existing hotel staff!
 * [and only existing hotel-staff can create new users]
 * 
 * - but inside other application.. we can have a new signup page of new users
 *    - new users are created inside application with in "/users" route 
 * [code]
 * ------
// >>> User.jsx
---
function NewUsers() {
  return (
    <>
      <Heading as="h1">Create a new user</Heading>
      <SignupForm />            
    </>           \
  );          // - below "SignupForm" will be rendered here!
}
export default NewUsers;
------------------------------- CONNECTED -------------------------------
// >>> SignupForm
---

function SignupForm() {
  const { register, formState, getValues, handleSubmit } = useForm(); 
  const { errors } = formState;
  function onHandleSubmit(data) {
    console.log(data);
  }
  return (
    <Form onSubmit={handleSubmit(onHandleSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>     // - if any errors ? error.<id>.message will be displayed along with the field!
        <Input
          type="text"
          id="fullName"
          {...register("fullName", {                        // - calling "register" fn creates new props and we spread them into every field!
            required: "This field is required",
          })}                               \
        />                            // - error message
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,          // - checking email format / pattern with "REGEX"
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: {                              // - register fn with options: "minLength"
              value: 8,                   
              message: "Password needs to be minimum 8 characters in length",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: function (value) {
              return (
                value === getValues().password || "Passwords need to match"     // - getValues fn will get values from other fields into a field where getValues() is invoked!
              );                                    \
            },        // - if password from other does not match >>> this "message" will be rendered
          })}
        />
      </FormRow>
      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button>Create new user</Button>
      </FormRow>
    </Form>
  );
}
export default SignupForm;
 * 
 * - for this we handle errors using "React-Hook-Form" library 
 * 
 * 
 * ! 21. User Sign Up [logic]
 * --------------------------
 * [code]
 * ------
// >>> apiAuth.js
---
export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        fullName: fullName,
        avatar: "",
      },
    },
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
--------------------------------------- CONNECTED ---------------------------------------
// >>> useSignup [custom-hook]
---
export function useSignup() {
  const { mutate: signupFn, isLoading: isSigningUp } = useMutation({
    mutationFn: signupApi,
    onSuccess: function (user) {
      // receive data of newly created user
      toast.success(
        "Account successfully created! Please verify user's email address"
      );
    },
  });

  return { signupFn, isSigningUp };
}
--------------------------------------- CONNECTED ---------------------------------------
 * 
 * - changing row level security policies to only allow access for pages to users that are authenticated!
 * [as application routes has been protected but not the resources in it]!
 * 
 * 
 * ! 21. Authorization on Supabase: Protecting Database (RLS)
 * ----------------------------------------------------------
 * - as every one can fetch and mutate data from API even if they are not logged into Application
 * [fix that: implementing authorization also on supabase by updating row level security policies on every row]!
 * 
 * - fix that inside supabase-web-app => inside "Authentication" => click on "Policies" 
 *    - and update RLS for every resource => click on "edit policy" => change "TARGET-ROLES" to "Authenticated" 
 * [change this for every resource: (bookings, cabins, guests, setting)]
 * 
 * ! AUTHENTICATION & AUTHORIZATION has been completed!
 * 
 * ! CONTINUES IN... (part-2) !
 * 
 */
