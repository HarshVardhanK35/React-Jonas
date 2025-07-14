// ! 19-Adv-React-Patterns-P2 !
//-----------------------------
/**
 * ! Continuation !
 * ! 7. Building a Modal Window Using a React Portal
 * -------------------------------------------------
 * (Build: Simple modal window comp using react's portal feature)
 *      we just create a re-usable window and convert that Modal into compound-component later!
 * 
 * >>> Feature:
 *      - whenever we click on "Add new cabin" inside "/cabins" route of "Wild_Oasis" project
 *          - we need a "Modal- window" to appear on top the page but not as form to render inside page
 * 
 * inside main folder of our project: "Wild-Oasis" we have "Modal" file already inside "ui/Modal.jsx"
 * [code]
 * ------
// >>> inside "Modal.jsx"
---
// - Styles Used Here are:
---
const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;
function Modal({ children, onClose }) {
  return (
    <Overlay>
      <StyledModal>
        <Button onClick={onClose}>
          <HiXCircle />
        </Button>
        <div>{children}</div>
      </StyledModal>
    </Overlay>
  );
}
 * 
 * - used Styled-Components to make this modal appearance of "CabinForm"
 * 
 * - we have also used close-btn to close this modal
 * [code]
function AddCabin() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  function handleToggle() {
    setIsOpenModal((isOpenModal) => !isOpenModal);
  }
  return (
    <>
      <Button onClick={handleToggle}>Add new cabin</Button>
      {isOpenModal ? (
        <Modal onClose={handleToggle}>
          <CreateCabinForm onCloseModal={handleToggle} />
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}
------------------------- CONNECTED -------------------------
// >>> inside CreateCabinForm.jsx
---
function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  function onHandleSubmit(data) {
    const image = typeof data?.image === "string" ? data.image : data.image[0];
      if (isEditSession) {
        editCabin(
          { newCabin: { ...data, image }, id: editId },
          {
            onSuccess: () => {
              reset();
              onCloseModal?.();
            },
          }
        );
      } else {
        createCabin(
          { ...data, image: image },
          {
            onSuccess: () => {
              reset();
              onCloseModal?.();         // >>> used optional-chaining here 
            },
          }
        );
    }
  }
}
 * 
 * ? Why optional chaining ?
 * - when this form may re-used in another place but not inside modal [place where it is not contained inside "Modal"] 
 *      - if it is used inside "Modal" then only it receives "onCloseModal" prop
 *      - if not, then it will be "undefined" >>> so we used "optional-chaining"!    
 * 
 * (improve some more..)
 * * React Portal
 *      - is a feature allows us to render an element outside of the parent component's DOM structure [while still keeping the element inside it's original position!]
 * - actually with "PORTAL" we can render a component in any place that we want inside DOM tree [but can leave that component inside react-element-tree!]
 * (HELPS TO RENDER ANY ELEMENT ON TOP OF OTHER ELEMENT like: [Modals, tool tips, menus etc.,] )
 * 
 * >>> createPortal - [from react-dom]
 * - it takes 2 args: JSX and DOM [2nd argv => where to place 1st argv]
 * [ 2nd arg will act as parent-element of 1st arg: JSX [so JSX will become direct child element of 2nd arg] ] 
 * 
 * - but it stays exactly at same position where it was declared inside react-element tree! 
 * [so that we can easily pass props to it!]
 *  
 * ? why did we use this portal, even though modal works fine with styling ? 
 * - portals are needed to avoid conflicts with CSS property- "overflow": which is set to hidden 
 * (this portal are needed when other devs will reuse it somewhere else, so in that place modal may get cut off by a overflow: hidden set on the parent)
 * [code]
 * ------
function Modal({ children, onClose }) {
  return createPortal(                      // >>> used "createPortal" here
    <Overlay>
      <StyledModal>
        <Button onClick={onClose}>          // >>> 1st arg: JSX
          <HiXCircle />
        </Button>
        <div>{children}</div>
      </StyledModal>
    </Overlay>,
    document.body   // >>> 2nd argv: positioning of modal inside DOM [position on DOM, but not on react-element-tree]
  );
}
export default Modal;
 * 
 * 
 * ? "BUT" there are some problems ?
 *      - importantly, the way in which we open the Modal
 * [so, we in next lecture..] //=> convert it into "COMPOUND-COMPONENT"
 * 
 * ! 8. Converting the Modal to a Compound Component
 * -------------------------------------------------
 * 
 * ? PROBLEMS: in using modal [this way of building] ?
 * - cause the way we built is not ideal when it comes to "state-management" and also the way we "render-modal"
 * 
 * [the-way-we-render]
 * [code]
 * ------
function AddCabin() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  function handleToggle() {
    setIsOpenModal((isOpenModal) => !isOpenModal);
  }
  return (
    <>
      <Button onClick={handleToggle}>Add new cabin</Button>
      {isOpenModal ? (                                          // >>> rendering modal: based on "isOpenModal"
        <Modal onClose={handleToggle}>
          <CreateCabinForm onCloseModal={handleToggle} />
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}
export default AddCabin;
 * 
 * >>> solution
 * - converting the above code using "COMPOUND-COMPONENT-PATTERN"!
 * 
 * ? PROBLEM ?
 * in above code...
 * - do not want the component (AddCabin) which uses this modal to be responsible to create a piece of state (isOpenModal, setIsOpenModal) 
 *      - and also to keep track whether modal is open or not 
 * [THIS IS NOT THE TASK OF AddCabin-component to track the display-status of Modal]
 * 
 * - we want Modal comp shall track itself [whether it is open or not] and it shall keep that state internally in itself [encapsulated in itself]
 * [so we should have a button and content to display on that modal.. two components together shall form a complete Modal-Component]
 *      >>> then that would be "COMPOUND-COMPONENT-PATTERN"
 * 
 * - then the overview model of Modal-component will be like this:
 *      - modelling API as follows.. 
 * [code]
 * ------
function AddCabin() {
  return (
    <Modal>
      <Modal.Open>
        <Button>Add new cabin</Button>      // >>> Button to open under "Modal-Component"
      </Modal.Open>
      <Modal.Window>
        <CreateCabinForm />         // >>> content to render also under "Modal-Component"
      </Modal.Window>
    </Modal>
  );
}
 * 
 * - through this way.. there will be no need of state in here! [that state would go into "<Modal>"]
 * 
 * [FLEXIBILITY]
 *      - with this.. we can have multiple Modal-Windows inside one <Modal> 
 * [ex_code]
 * ---------
// >>> inside AddCabin.jsx
--- 
function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="cabin-form">  // - "props" for below Compound-Component sent here!
        <Button>Add new cabin</Button>      // - acts as "children" component
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm />
      </Modal.Window>

      // <Modal.Open opens="table">              // - can be reused above modal by changing "opens"
      //   <Button>Show table</Button>
      // </Modal.Open>
      // <Modal.Window name="table">      // - can be reused above modal by changing "name"
      //   <CreateCabinForm />
      // </Modal.Window> 
    </Modal>
  );
}
export default AddCabin;
-------------------------- CONNECTED --------------------------
// >>> inside Modal.jsx
---
// ? 1. create-context in name of Modal
const ModalContext = createContext();

// ? 2. create a parent-component
function Modal({ children }) {
  const [openName, setOpenName] = useState(""); // start with no empty window
  // - handler functions
  function close() {        // - closing modal-window
    setOpenName("");              // - by setting to "" to close window: setting it to 'initial-state'
  }
  const open = setOpenName;     // - setting simply to "setOpenName-state-fun", so that we can re-use 
  return (
    <ModalContext.Provider value={{ openName, open, close }}>   // - sending 'handler-fun' as value-props! to "children"
      {children}
    </ModalContext.Provider>
  );
}
// ? 3. create child component to help implementing common task
function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  // - open: "setter fn" and on-an-event: "onClick changes the opened-window-name here"
  return cloneElement(children, { onClick: () => open(opensWindowName) }); // - as state: "open" isn't available inside 'AddCabin' so we used "cloneElement-fn"
}
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  if (name == openName) {
    return createPortal(
      <Overlay>
        <StyledModal>
          <Button onClick={close}>    // - here 'onClick': triggers "close-fun" and sets 'openName' to "" 
            <HiXCircle />
          </Button>
          <div>{cloneElement(children, { onCloseModal: close })}</div>    // - used "cloneElement" here too! which triggers STYLING inside "CreateCabinForm.jsx"
        </StyledModal>
      </Overlay>,
      document.body
    );
  } else {
    null;
  }
}
// ? 4. Add child components as properties to parent-component
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
 * 
 * ? A brief about "cloneElement" ?
 * ---
 * * cloneElement()
 * >>> const clonedElement = cloneElement(element, props, ...children) [ignore 3rd arg for now!]
 *    - which clones an element passed into it as 1st args and applies {...props} which were passed to "cloneElement-fn" as 2nd arg 
 * [ex_code]
import { cloneElement } from 'react';

const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);
console.log(clonedElement); // - returns: <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
 * 
 * 
 * 
 * ! 9. Detecting a Click Outside the Modal
 * ----------------------------------------
 * (detecting a click on outside of Modal-window and close opened Modal-window)
 * - so to achieve that we are using "Global-Event handlers" [we will use primitive DOM-Manipulation]
 * - as we are interacting with DOM that is outside world / outside of react-element-tree [that causes a side-effects]
 *    - so use //=> useEffect hook
 * (using this useEffect - we have to close the opened window!)
 * [code]
 * ------
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);

  const ref = useRef();   // - to reference current "window"! #1
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {       
          close();
        }
      } // - this lies here to remove immediately
      document.addEventListener("click", handleClick);

      return function () {
        document.removeEventListener("click", handleClick);
      }; // - when comp "un-mounts" remove "handleClick" function
    },
    [close]
  );
  if (name == openName) {
    return createPortal(
      <Overlay>
        <StyledModal ref={ref}>   // - #1.. reference connected here.. as "StyledModal" is the ref.current.. 
          <Button onClick={close}>
            <HiXCircle />
          </Button>
          <div>{cloneElement(children, { onCloseModal: close })}</div>
        </StyledModal>
      </Overlay>,
      document.body
    );
  } else {
    null;
  }
}
 * 
 * ? PROBLEM ?
 * - there is a problem with this!
 *    - after window has been closed.. click again anywhere on DOM [click on button to show up modal >>> but modal does not appear again!] 
 * $ REASON $
 * - cause working of events in JS.. [particularly how events bubble up]
 *    - as modal-window will be attached to DOM [cause of "createPortal" modal is attached as direct-child of root-div]
 * 
 * - when click happened.. that event bubble up all the way through DOM until reaches to modal-window 
 *    - so even we click after modal-window was closed, useEffect fires again an event [for milliseconds modal-window opens again and detects click and closes again immediately!]
 * 
 * >>> SOLUTION
 * - we have to listen to events NOT in "Bubbling-Phase" [as events bubble up to DOM]
 * - but to listen in "Capturing-Phase" [event here moves down from top(root)-bottom] >>> simply add 3rd arg: "true" to event-listener!
 * [code]
 * ------
// >>> only useEffect provided here:
---
useEffect(
  function () {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        close();
      }
    } // this lies here to remove immediately
    document.addEventListener("click", handleClick, true);          // - set "true" here to HANDLE events in CAPTURING-phase

    return function () {
      document.removeEventListener("click", handleClick, true);     // - so EVENT moves DOWN the DOM tree 
    }; // when comp "un-mounts" remove "handleClick" function
  },
  [close]
)
 * 
 * >>> extract to a custom-hook!
 * - created "useOutsideClick.js" file and extracted code that is responsible for closing modal-window when we click outside of modal-window
 * [code]
 * ------
// >>> useOutsideClick.js
---
import { useEffect, useRef } from "react";

// - accepts 2 arguments when invoked: [closeHandler: fun-type, listenCapturing: boolean]
function useOutsideClick(closeHandler, listenCapturing = true) {    
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          closeHandler();
        }
      } 
      document.addEventListener("click", handleClick, listenCapturing);     // - whole acts as an API, so user can pass either true or false here based on that event will be in capture-phase(user shall pass: true) or it will be in bubbling-phase (by-default: false) 

      return function () {
        document.removeEventListener("click", handleClick, listenCapturing);
      };
    },
    [closeHandler, listenCapturing]
  );
  return { ref };   // - returning "ref" to connect "window"
}
export default useOutsideClick;
-------------------------------------------- CONNECTED --------------------------------------------
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const { ref } = useOutsideClick(close);               // - getting "ref" and passing "close-fn"

  if (name == openName) {
    return createPortal(
      <Overlay>
        <StyledModal ref={ref}>     // - connecting to "ref": so that "useOutsideClick" will know which element has to be closed currently
          <Button onClick={close}>
            <HiXCircle />
          </Button>
          <div>{cloneElement(children, { onCloseModal: close })}</div>
        </StyledModal>
      </Overlay>,
      document.body
    );
  } else {
    null;
  }
}
 * 
 * 
 * 
 * ! 10. Confirming Cabin Deletions
 * --------------------------------
 * (reusing: modal-windows that was created inside "Modal.jsx" and "useOutsideClick" two more times)
 * - reusing two more times: "to-edit" and "to-delete-on-confirm"
 * - files modified here are "CabinRow.jsx" and "ConfirmDelete.jsx" 

function CabinRow({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { isCreating, createCabin } = useCreateCabin();

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    description,
    image,
  } = cabin;
  
  function handleDuplicate() { 
    createCabin({ ... });
  }
  return (
    <>
      <TableRow role="row">     // - Table to represent data here! 
        <Img src={image} />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity}</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}

        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <button disabled={isCreating} onClick={handleDuplicate}>      // - duplicate functionality
            Duplicate
          </button>
          <Modal>   
            <Modal.Open opens="edit">       // - onClick to appear an "to-edit-form"
              <button disabled={isCreating}>Edit</button>
            </Modal.Open>
            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />   // - <CreateCabinForm>: a form will appear as a window
            </Modal.Window>

            <Modal.Open opens="delete">   // - onClick to appear a confirmation box "to-delete-row"
              <button>Delete</button>
            </Modal.Open>
            <Modal.Window opens="delete">
              <ConfirmDelete
                resourceName="cabins"
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}      // - confirm dialogue box will appear.. 'onConfirm' will delete complete cabin from DB's row
              />
            </Modal.Window>
          </Modal>
        </div>
      </TableRow>
    </>
  );
}
export default CabinRow;
----------------------------------- CONNECTED -----------------------------------
// >>> ConfirmDelete.jsx
---
function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {       // - as this comp acts as children to Modal.Window..this gets "onCloseModal" 
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>
      <div>
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button variation="danger" disabled={disabled} onClick={onConfirm}>   
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}
export default ConfirmDelete;
 * 
 * 
 * 
 * ! 11. Building a Reusable Table
 * -------------------------------
 * 
 * ! 12. Building a Modal Window Using a React Portal
 * --------------------------------------------------
 * (combination of 11 and 12 section)
 * 
 * - converting "Table" using compound-component-pattern 
 * [code]
 * ------
// >>> Table.jsx
---
// ? 1. creating context
const TableContext = createContext();

// ? 2. creating "parent" component
function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

// ? 3. creating "children" components
function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" columns={columns}>
      {children}
    </StyledHeader>
  );
}
function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
}
function Body({ data, render }) {   // - using render-props-pattern here!
  if (data.length === 0) <Empty>No data to show at this moment</Empty>;
  return <StyledBody>{data.map(render)}</StyledBody>;
}

// ? 4. Adding children components as properties to parent-component
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
-------------------------------------- CONNECTED-FILE-1: applied in this file -------------------------------------- 
// >>> CabinTable.jsx
---
return (
  <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">   // - compound-component-pattern: applied here
    <Table.Header>    // - compound-component-pattern: applied here
      <div></div>
      <div>Cabin</div>
      <div>Capacity</div>
      <div>Price</div>
      <div>Discount</div>
      <div></div>
    </Table.Header>

    <Table.Body   // - compound-component-pattern: applied here
      data={cabins}
      render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}   // - render-props-pattern applied here
    />
  </Table>
);
-------------------------------------- CONNECTED-FILE-2: applied in this file -------------------------------------- 
// >>> CabinRow.jsx
---
return (
  <Table.Row>                     // - compound-component-pattern: applied here
    <Img src={image} />
    <Cabin>{name}</Cabin>
    <div>Fits up to {maxCapacity}</div>
    <Price>{formatCurrency(regularPrice)}</Price>
    {discount ? (
      <Discount>{formatCurrency(discount)}</Discount>
    ) : (
      <span>&mdash;</span>
    )}
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      <button disabled={isCreating} onClick={handleDuplicate}>
        Duplicate
      </button>
      <Modal>
        <Modal.Open opens="edit">
          <button disabled={isCreating}>Edit</button>
        </Modal.Open>
        <Modal.Window name="edit">
          <CreateCabinForm cabinToEdit={cabin} />
        </Modal.Window>
        <Modal.Open opens="delete">
          <button>Delete</button>
        </Modal.Open>
        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="cabins"
            disabled={isDeleting}
            onConfirm={() => deleteCabin(cabinId)}
          />
        </Modal.Window>
      </Modal>
    </div>
  </Table.Row>
);
 * 
 * 
 * 
 * ! 13. Building a Modal Window Using a React Portal
 * --------------------------------------------------
 * (CCP ~ Use-Case: building a re-usable context-menu)
 * - providing each row a button => on-click context-menu appears => which contains three actions: [duplicate, edit, delete] options
 * (but only one option can be opened at a time)
 * 
// >>> Menus.jsx
---
const MenusContext = createContext();
function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);
  // handler functions
  function close() {
    setOpenId("");
  }
  const open = setOpenId;
  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}
function Toggle({ id }) {
  const { openId, open, close, setPosition } = useContext(MenusContext);
  function handleClick(e) {
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    // when (none of the menus opened && if currently-opened-menu is differ than clicked-menu-id) => then open with "id"
    openId === "" || openId !== id ? open(id) : close();
  }
  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);
  const { ref } = useOutsideClick(close);
  if (openId === id) {
    return createPortal(
      <StyledList position={position} ref={ref}>
        {children}
      </StyledList>,
      document.body
    );
  }
}
function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}
Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;

-------------------------------- connected --------------------------------
// >>> inside CabinRow.jsx
---
<div>
  <Modal>
    <Menus.Menu>
      <Menus.Toggle id={cabinId} />
      <Menus.List id={cabinId}>
        <Menus.Button
          icon={<HiSquare2Stack />}
          onClick={handleDuplicate}
        >
          Duplicate
        </Menus.Button>

        <Modal.Open opens="edit">
          <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
        </Modal.Open>

        <Modal.Open opens="delete">
          <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
        </Modal.Open>
      </Menus.List>

      <Modal.Window name="edit">
        <CreateCabinForm cabinToEdit={cabin} />
      </Modal.Window>

      <Modal.Window name="delete">
        <ConfirmDelete
          resourceName="cabins"
          disabled={isDeleting}
          onConfirm={() => deleteCabin(cabinId)}
        />
      </Modal.Window>
    </Menus.Menu>
  </Modal>
</div>
-------------------------------- connected --------------------------------
// >>> inside CabinTable.jsx:
---
function CabinTable() {
  const { cabins, isLoading } = useFetchCabins();

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
          data={cabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}
 * 
 * 
 * ! completed !
 * 
 */
