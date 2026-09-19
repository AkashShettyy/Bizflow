import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.js";
import AppLayout from "./layouts/AppLayout.js";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Customers from "./pages/Customers.js";
import Projects from "./pages/Projects.js";
import Tasks from "./pages/Tasks.js";
import CustomerDetails from "./pages/CustomerDetails.js";
import ProjectDetails from "./pages/ProjectDetails.js";
import TaskDetails from "./pages/TaskDetails.js";
import Invoices from "./pages/Invoices.js";
import InvoiceForm from "./pages/InvoiceForm.js";
import InvoiceDetails from "./pages/InvoiceDetails.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<InvoiceForm />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
