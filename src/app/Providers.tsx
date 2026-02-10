"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { RecipeProvider } from "@/context/RecipeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RecipeProvider>
        {children}
      </RecipeProvider>
    </Provider>
  );
}
