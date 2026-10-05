import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthProvider";
import { NotificationsProvider } from "./context/NotificationsProvider";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Necesita al usuario de AuthProvider, por eso va adentro */}
        <NotificationsProvider>
          <AppRouter />
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;