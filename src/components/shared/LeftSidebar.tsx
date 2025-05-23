import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const {user} = useUserContext();
  const navigate = useNavigate();
  const {mutate: signOut, isSuccess} = useSignOutAccount();
  
  useEffect( () => {
      if(isSuccess) navigate(0);
  }, [isSuccess])
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo6.png"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        <Link
          to={`/profile/${user.id}`}
          className="flex gap-3 items-center"
        >
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="body-bold"> {user.name}</p>
            <p className="small-regular text-light-2">
              @{user.username} 
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-cyan-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white 
                      ${isActive ? "invert-white" : "invert hue-rotate-[120deg] saturate-[300%]"}
                      transition`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost hue-rotate-[300deg] saturate-200"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;