import ReactDOM from "react-dom/client";
import { GameClientProvider } from "./app/providers/GameClientProvider.js";
import { AppRouter } from "./app/router/AppRouter.js";
import { LanguageSwitcher } from "./shared-ui/LanguageSwitcher.js";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GameClientProvider>
    <LanguageSwitcher />
    <AppRouter />
  </GameClientProvider>
);

