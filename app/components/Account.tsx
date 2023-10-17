import { FC, useContext, useEffect, useState, useRef } from "react";
import { Event } from "nostr-tools";
import { UserContext } from "@/context/user-context";
import { RelayContext } from "@/context/relay-context";
// import { FollowingContext } from "@/context/following-context"; // Not implemented
import Avatar from "./Avatar";

interface AccountProps {
  pubkey: string;
}

const Account: FC<AccountProps> = ({ pubkey }) => {
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");
  const { user, setUser, logoutUser } = useContext(UserContext);
  const { relayUrl, activeRelay, subscribe } = useContext(RelayContext);
  const [isOpen, setIsOpen] = useState(false);
  // const { following, setFollowing, followingReload, setFollowingReload } =
  //   useContext(FollowingContext); // Not implemented

  const ref = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !(ref.current as any).contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const getEvents = async () => {
    let kinds = [0, 3];

    let userKey = `user_${relayUrl}`;
    if (user[userKey]) {
      kinds = kinds.filter((kind) => kind !== 3);
      // console.log("Cached events from context");
      const content = user[userKey].content;
      if (content) {
        const contentObj = JSON.parse(content);
        if (contentObj.picture) {
          setPicture(contentObj.picture);
        }
        if (contentObj.display_name || contentObj.name) {
          setName(contentObj.display_name ?? contentObj.name);
        }
      }
    }

    // Not implemented
    // let followingKey = `following_${relayUrl}_${pubkey}`;

    // if (following[followingKey]) {
    //   kinds = kinds.filter((kind) => kind !== 0);
    // }

    if (kinds.length === 0) {
      return;
    }

    let relayName = relayUrl.replace("wss://", "");

    const filter = {
      kinds,
      authors: [pubkey],
      limit: 5,
    };

    let events: Event[] = [];

    const onEvent = (event: any) => {
      event.relayUrl = relayUrl;
      events.push(event);
      if (event.kind === 0) {
        const profileMetadata = event;
        user[userKey] = profileMetadata;
        setUser(user);
        const content = event.content;
        if (content) {
          const contentObj = JSON.parse(content);
          if (contentObj.picture) {
            setPicture(contentObj.picture);
          }
        }
      }
    };

    const onEOSE = () => {
      // Not implemented
      if (events.length !== 0) {
        // filter through events for kind 3
        // const followingEvents = events.filter((event) => event.kind === 3);
        // let followingKey = `following_${relayName}_${pubkey}`;
        // const contacts = followingEvents[0].tags;
        // const contactPublicKeys = contacts.map((contact: any) => {
        //   return contact[1];
        // });
        // following[followingKey] = contactPublicKeys;
        // setFollowing(following);
        // addProfiles(contactPublicKeys.slice(0, 5));
        // setFollowingReload(!followingReload);
      }
    };

    subscribe([relayUrl], filter, onEvent, onEOSE);
  };

  useEffect(() => {
    if (user) getEvents();
    else console.warn("No user set!");
    // eslint-disable-next-line
  }, [relayUrl, activeRelay]);

  const logoutHandler = () => {
    localStorage.removeItem("shouldReconnect");
    logoutUser();
    window.location.reload();
  };

  return (
    <>
      <div className="relative">
        <div
          tabIndex={0}
          className="flex flex-row gap-2 items-center"
          onClick={() => setIsOpen(true)}
        >
          <Avatar
            src={picture}
            className="w-8 h-8 text-stone-600 border border-stone-200"
          />
          <div className="max-w-[250px] whitespace-nowrap overflow-ellipsis overflow-hidden">
            {!!name ? name : pubkey}
          </div>
        </div>
        {isOpen && (
          <div
            ref={ref}
            className="absolute right-0 top-10 bg-white p-4 shadow rounded-lg flex flex-col items-start justify-start text-black gap-1 w-52"
          >
            <button className="w-full text-left" onClick={logoutHandler}>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
