import { useSelector } from "react-redux";
import CreateUser from "../features/user/CreateUser";
import LinkButton from "./LinkButton";
import { getUser } from "../features/user/userSlice";

function Home() {
  const userDetails = useSelector(getUser);

  return (
    <div className=" text-center">
      <div className="my-10 px-4 text-center sm:my-16">
        <h1 className="mb-4 text-xl font-semibold text-center md:text-3xl">
          The best pizza.
          <br />
          <span className="text-yellow-500">
            Straight out of the oven, straight to you.
          </span>
        </h1>
      </div>
      <div>
        {userDetails.username === "" ? (
          <CreateUser />
        ) : (
          <div className="">
            <p>We provide a wide-variety of dishes</p>{" "}
            <div className="py-2 sm:py-4">
              <LinkButton to="/menu">Dive into our menu➡️</LinkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
