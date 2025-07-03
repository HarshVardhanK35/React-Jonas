import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;

  ${(props) =>
    props.as === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}

  ${(props) =>
    props.as === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;
export default Row;
