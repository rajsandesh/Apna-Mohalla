import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Complaints from "./pages/Complaints";
import Events from "./pages/Events";
import AdminDashboard from "./pages/AdminDashboard";
import ManageAnnouncements from "./pages/ManageAnnouncements";
import ManageComplaints from "./pages/ManageComplaints";
import ManageEvents from "./pages/ManageEvents";

function ProtectedRoute({ component: Component, adminOnly = false }) {
  const { user, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) navigate("/login");
    else if (adminOnly && !isAdmin) navigate("/dashboard");
  }, [user, isAdmin, adminOnly, navigate]);

  if (!user) return null;
  if (adminOnly && !isAdmin) return null;

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/announcements">
        <ProtectedRoute component={Announcements} />
      </Route>
      <Route path="/complaints">
        <ProtectedRoute component={Complaints} />
      </Route>
      <Route path="/events">
        <ProtectedRoute component={Events} />
      </Route>

      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} adminOnly />
      </Route>
      <Route path="/admin/announcements">
        <ProtectedRoute component={ManageAnnouncements} adminOnly />
      </Route>
      <Route path="/admin/complaints">
        <ProtectedRoute component={ManageComplaints} adminOnly />
      </Route>
      <Route path="/admin/events">
        <ProtectedRoute component={ManageEvents} adminOnly />
      </Route>

      <Route>
        <Home />
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WouterRouter>
        <Router />
      </WouterRouter>
    </AuthProvider>
  );
}
