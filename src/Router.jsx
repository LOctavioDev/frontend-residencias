import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Stream, 
} from "./scenes";
import { Login } from "./components/Login";
import UserEdit from "./scenes/useredit";
import PrivateRouter from "./services/PrivateRouter";
import {Historial} from "./scenes/useredit/historial";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element = {<PrivateRouter />}>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Team />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/stream" element={<Stream />} />
            <Route path="/useredit/:control_number" element={<UserEdit />} />
            <Route path="/companyhistory/:control_number" element={<Historial />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
