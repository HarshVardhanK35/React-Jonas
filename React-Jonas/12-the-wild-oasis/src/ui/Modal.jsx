import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXCircle } from "react-icons/hi2";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick";

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

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

// 1. create-context in name of Modal
const ModalContext = createContext();

// 2. create a parent-component
function  Modal({ children }) {
  const [openName, setOpenName] = useState(""); // start with no empty window

  // handler functions
  // closing modal-window
  function close() {
    setOpenName(""); // setting to "" to close window: the-initial-state
  }
  const open = setOpenName; // setting simply to "setOpenName-state-fun"

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

// 3. create child component to help implementing common task
// A. Open [child-1]
function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  // open: "setter fn" and on-an-event: "onClick changes the name here"
  return cloneElement(children, { onClick: () => open(opensWindowName) }); // as state: "open" isn't available inside 'AddCabin' so we used "cloneElement-fn"
}

// B. Window [child-2]
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);

  const { ref } = useOutsideClick(close);

  if (name === openName) {
    return createPortal(
      <Overlay>
        <StyledModal ref={ref}>
          {/* here 'onClick': triggers "close-fun" and sets 'openName' to {empty string: ""} */}
          <Button onClick={close}>
            <HiXCircle />
          </Button>

          {/* used "cloneElement" here too! */}
          <div>{cloneElement(children, { onCloseModal: close })}</div>
        </StyledModal>
      </Overlay>,
      document.body
    );
  } else {
    null;
  }
}

// 4. Add child components as properties to parent-component
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
