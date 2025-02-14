import React from "react";
import AllRoutes from "./AllRoutes/AllRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const persisted = persistStore(store);
  const clientId = process.env.REACT_APP_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate persistor={persisted}>
          <ToastContainer />
          <AllRoutes />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
