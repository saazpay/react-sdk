import React, { ReactNode } from 'react';
import { Paddle } from '@paddle/paddle-js';

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
declare const useSaazpay: () => SaazpayContextType;
interface SaazpayProviderProps {
    children: ReactNode;
    config: Config;
}
declare const SaazpayProvider: ({ children, config }: SaazpayProviderProps) => React.JSX.Element;
interface SaazpayEmbedProps {
    access_token: string;
    darkMode?: boolean;
    align?: "left" | "right" | "center";
}
declare const SaazpayEmbed: ({ access_token, darkMode, align, }: SaazpayEmbedProps) => React.JSX.Element;
interface SaazpayManagementProps {
    access_token: string;
    darkMode?: boolean;
}
declare const SaazpayManagement: ({ access_token, darkMode, }: SaazpayManagementProps) => React.JSX.Element;

export { SaazpayEmbed, SaazpayManagement, SaazpayProvider, useSaazpay };
