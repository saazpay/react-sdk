"use client";

import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

type Config = {
  environment: "sandbox" | "production";
  clientToken: string;
  baseUrl: string;
  successUrl?: string;
};

interface SaazpayContextType {
  paddle: Paddle | undefined;
  config: Config;
}

const SaazpayContext = createContext<SaazpayContextType | undefined>(undefined);

export const useSaazpay = () => {
  const context = useContext(SaazpayContext);
  if (!context) {
    throw new Error("useSaazpay must be used within a SaazpayProvider");
  }
  return context;
};

interface SaazpayProviderProps {
  children: ReactNode;
  config: Config;
}

export const SaazpayProvider = ({ children, config }: SaazpayProviderProps) => {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    initializePaddle({
      environment: config.environment,
      token: config.clientToken,
      eventCallback: function (data) {
        if (data.name == "checkout.completed") {
          if (config.successUrl) {
            window.location.href = config.successUrl;
          } else {
            window.location.reload();
          }
        }
      },
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, [config]);

  return (
    <SaazpayContext.Provider value={{ paddle, config }}>
      {children}
    </SaazpayContext.Provider>
  );
};

interface SaazpayEmbedProps {
  access_token: string;
  darkMode?: boolean;
  align?: "left" | "right" | "center";
}

export const SaazpayEmbed = ({
  access_token,
  darkMode,
  align,
}: SaazpayEmbedProps) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const paddleRef = useRef<Paddle | undefined>(undefined);
  const baseUrl = useRef("");

  try {
    const { paddle: contextPaddle, config } = useSaazpay();
    paddleRef.current = contextPaddle;
    baseUrl.current = config.baseUrl;
  } catch (e) {
    throw new Error("SaazpayEmbed must be used within SaazpayProvider");
  }

  const handleResize = (event: MessageEvent) => {
    if (event.data?.type === "iframe-resize" && frameRef.current) {
      frameRef.current.style.height = `${event.data.height}px`;
    }
    if (event.data?.type === "is-dark-mode") {
      darkMode = event.data.value;
    }
  };

  const handleCheckout = (event: MessageEvent) => {
    if (event.data?.type === "checkout_data") {
      if (event.data.payload) {
        paddleRef.current?.Checkout.open({
          ...event.data.payload,
          settings: { theme: darkMode ? "dark" : "light" },
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleResize);
    window.addEventListener("message", handleCheckout);
    return () => {
      window.removeEventListener("message", handleResize);
      window.removeEventListener("message", handleCheckout);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "20vh",
        overflow: "hidden",
        transition: "height 0.25s ease",
      }}
      ref={frameRef}
    >
      <iframe
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: "none",
        }}
        src={`${baseUrl.current}/embed/client/${access_token}?dark=${darkMode}&align=${align}`}
      />
    </div>
  );
};

interface SaazpayManagementProps {
  access_token: string;
  darkMode?: boolean;
}

export const SaazpayManagement = ({
  access_token,
  darkMode,
}: SaazpayManagementProps) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const paddleRef = useRef<Paddle | undefined>(undefined);
  const baseUrl = useRef("");

  try {
    const { paddle: contextPaddle, config } = useSaazpay();
    paddleRef.current = contextPaddle;
    baseUrl.current = config.baseUrl;
  } catch (e) {
    throw new Error("SaazpayEmbed must be used within SaazpayProvider");
  }

  const handleResize = (event: MessageEvent) => {
    if (event.data?.type === "iframe-resize" && frameRef.current) {
      frameRef.current.style.height = `${event.data.height}px`;
    }
    if (event.data?.type === "is-dark-mode") {
      darkMode = event.data.value;
    }
  };

  const handleCheckout = (event: MessageEvent) => {
    if (event.data?.type === "checkout_data") {
      if (event.data.payload) {
        paddleRef.current?.Checkout.open({
          ...event.data.payload,
          settings: { theme: darkMode ? "dark" : "light" },
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleResize);
    window.addEventListener("message", handleCheckout);
    return () => {
      window.removeEventListener("message", handleResize);
      window.removeEventListener("message", handleCheckout);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "20vh",
        overflow: "hidden",
        transition: "height 0.25s ease",
      }}
      ref={frameRef}
    >
      <iframe
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: "none",
        }}
        src={`${baseUrl.current}/embed/manage/${access_token}?dark=${darkMode}`}
      />
    </div>
  );
};
