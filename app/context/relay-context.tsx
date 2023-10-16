"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { RELAYS } from "@/lib/constants";
import { relayInit } from "nostr-tools";
import type { Relay } from "nostr-tools";
import { ToastContext } from "@/context/toast-context";

interface IRelayContext {
  allRelays: string[];
  setAllRelays: React.Dispatch<React.SetStateAction<string[]>>;
  activeRelay: Relay | undefined;
  setActiveRelay: React.Dispatch<React.SetStateAction<any>>;
  relayUrl: string;
  setRelayUrl: React.Dispatch<React.SetStateAction<string>>;
  connect: (newRelayUrl: string) => Promise<any>;
  connectedRelays: Set<Relay>;
  setConnectedRelays: React.Dispatch<React.SetStateAction<Set<Relay>>>;
  // publish: (
  //   relays: string[],
  //   event: any,
  //   onOk: () => void,
  //   onSeen: (url: string) => void,
  //   onFailed: (url: string) => void
  // ) => void;
  subscribe: (
    relays: string[],
    filter: any,
    onEvent: (event: any) => void,
    onEOSE: () => void
  ) => void;
}

export const RelayContext = createContext<IRelayContext>({
  allRelays: [],
  setAllRelays: () => {},
  activeRelay: undefined,
  setActiveRelay: () => {},
  relayUrl: "",
  setRelayUrl: () => {},
  connect: () => Promise.resolve(),
  connectedRelays: new Set<Relay>(),
  setConnectedRelays: () => {},
  // publish: () => {},
  subscribe: () => {},
});

const RelayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allRelays, setAllRelays] = useState<string[]>(RELAYS);
  const [relayUrl, setRelayUrl] = useState<string>(RELAYS[0]);
  const [activeRelay, setActiveRelay] = useState<Relay>();
  const [connectedRelays, setConnectedRelays] = useState<Set<Relay>>(new Set());
  const { createToast } = useContext(ToastContext);

  useEffect(() => {
    connect(relayUrl);
    // eslint-disable-next-line
  }, [relayUrl]);

  useEffect(() => {
    console.log("NEW ACTIVE RELAY IS:", activeRelay);
  }, [activeRelay]);

  useEffect(() => {
    console.log("CONNECTED RELAYS URE:", connectedRelays);
  }, [connectedRelays]);

  const connect = async (newRelayUrl: string) => {
    console.log("connecting to relay:", newRelayUrl);
    if (!newRelayUrl) return;

    let relay: Relay;
    let existingRelay: Relay | undefined;
    if (connectedRelays.size > 0) {
      existingRelay = Array.from(connectedRelays).find(
        (r) => r.url === newRelayUrl
      );
    }

    if (existingRelay) {
      console.log("info", `✅ nostr (${newRelayUrl}): Already connected!`);
      relay = existingRelay;
      if (relayUrl === relay.url) {
        setActiveRelay(relay);
      }
    } else {
      console.log("NEWING UP A RELAY");
      relay = relayInit(newRelayUrl);

      await relay.connect();

      relay.on("connect", () => {
        console.log("info", `✅ nostr (${newRelayUrl}): Connected!`);
        if (relayUrl === relay.url) {
          setActiveRelay(relay);
          const isRelayInSet = Array.from(connectedRelays).some(
            (r) => r.url === relay.url
          );

          if (!isRelayInSet) {
            setConnectedRelays(new Set([...connectedRelays, relay]));
          }
        }
      });

      relay.on("disconnect", () => {
        console.log("warn", `🚪 nostr (${newRelayUrl}): Connection closed.`);
        setConnectedRelays(
          new Set([...connectedRelays].filter((r) => r.url !== relay.url))
        );
      });

      relay.on("error", () => {
        console.log("error", `❌ nostr (${newRelayUrl}): Connection error!`);
        createToast({
          message: `Unable to connect to ${relayUrl}`,
          type: "error",
        });
      });
    }

    return relay;
  };

  // Not implemented for now
  // const publish = async (
  //   relays: string[],
  //   event: any,
  //   // onOk: () => void,
  //   onSeen: (url: string) => void,
  //   onFailed: (url: string) => void
  // ) => {
  //   console.log("publishing to relays:", relays);
  //   for (const url of relays) {
  //     const relay = await connect(url);

  //     if (!relay) return;

  //     let pub = relay.publish(event);

  //     // TODO: Not available with nostr-tools 1.17
  //     pub.on("ok", () => {
  //       console.log(`${url} has accepted our event`);
  //       onSeen(url);
  //       // onOk();
  //     });

  //     // TODO: Not available with nostr-tools 1.17
  //     pub.on("failed", (reason: any) => {
  //       console.log(`failed to publish to ${url}: ${reason}`);
  //       onFailed(url);
  //       // relay.close();
  //     });
  //   }
  // };

  const subscribe = async (
    relays: string[],
    filter: any,
    onEvent: (event: any) => void,
    onEOSE: () => void
  ) => {
    for (const url of relays) {
      const relay = await connect(url);

      if (!relay) return;

      let sub = relay.sub([filter]);

      sub.on("event", (event: any) => {
        console.log("we got the event we wanted:", event);
        onEvent(event);
      });

      sub.on("eose", () => {
        console.log("we've reached the end:");
        sub.unsub();
        onEOSE();
        // relay.close();
      });
    }
  };

  return (
    <RelayContext.Provider
      value={{
        allRelays,
        setAllRelays,
        activeRelay,
        setActiveRelay,
        relayUrl,
        setRelayUrl,
        connect,
        connectedRelays,
        setConnectedRelays,
        // publish,
        subscribe,
      }}
    >
      {children}
    </RelayContext.Provider>
  );
};

export default RelayProvider;
