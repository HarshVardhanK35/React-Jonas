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
<Modal>
  <Modal.Open opens="cabin-form">
    <Button>Add new cabin</Button>
  </Modal.Open>
  <Modal.Window name="cabin-form">
    <CreateCabinForm />
  </Modal.Window>

  <Modal.Open open="table">
    <Button>Add new cabin</Button>
  </Modal.Open>
  <Modal.Window name="table">
    <CreateCabinForm />
  </Modal.Window>
</Modal>
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * ! 9. Building a Modal Window Using a React Portal
 * -------------------------------------------------
 * 
 * ! 10. Building a Modal Window Using a React Portal
 * --------------------------------------------------
 * 
 * ! 11. Building a Modal Window Using a React Portal
 * --------------------------------------------------
 * 
 * ! 12. Building a Modal Window Using a React Portal
 * --------------------------------------------------
 * 
 * ! 13. Building a Modal Window Using a React Portal
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
 */
