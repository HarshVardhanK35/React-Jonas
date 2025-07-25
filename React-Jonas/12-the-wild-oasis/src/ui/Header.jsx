import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/Authentication/UserAvatar";

const StyledHeader = styled.header`
  background-color: var(--color-grey-100);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  gap: 2.4 rem;
  align-items: center;
  justify-content: flex-end;
`;

function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
