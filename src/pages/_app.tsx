import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider";
import { SessionProvider } from "next-auth/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Theme } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider>
        <ColorModeProvider forcedTheme="white">
          <Theme>
            <Component {...pageProps} />
          </Theme>
        </ColorModeProvider>
      </Provider>
    </SessionProvider>
  );
}
