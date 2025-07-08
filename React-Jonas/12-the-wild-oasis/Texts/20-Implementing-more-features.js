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
 * 
 * $ SUMMARY:
 * 
 * 
 * 
 * 
 * ! 3. Client-Side Sorting: Sorting Cabins
 * ----------------------------------------
 * 
 * 
 * 
 * 
 * 
 * 
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