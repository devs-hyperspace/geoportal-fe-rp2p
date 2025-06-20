"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function RootProviders({ children }: { children: ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default RootProviders;
