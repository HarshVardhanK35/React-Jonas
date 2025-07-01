import { useSelector } from "react-redux";
import { getUser } from "./userSlice";

function UserName() {
  const userDetails = useSelector(getUser);
  // to read properties, we have to use... userDetails.username

  if (!userDetails.username) return null;

  return (
    <div className="hidden md:block text-sm font-semibold">
      {userDetails.username}
    </div>
  );
}

export default UserName;
