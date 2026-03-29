import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeesManagement from "./pages/EmployeesManagement";
import BranchesManagement from "./pages/BranchesManagement";
import GPSTracking from "./pages/GPSTracking";
import AttendanceManagement from "./pages/AttendanceManagement";
import ReportsAndAnalytics from "./pages/ReportsAndAnalytics";
import PayrollManagement from "./pages/PayrollManagement";
import EmployeeCheckIn from "./pages/EmployeeCheckIn";
import EmployeeProfile from "./pages/EmployeeProfile";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/admin" component={user?.role === "admin" ? AdminDashboard : LandingPage} />
      <Route path="/admin/employees" component={user?.role === "admin" ? EmployeesManagement : LandingPage} />
      <Route path="/admin/branches" component={user?.role === "admin" ? BranchesManagement : LandingPage} />
      <Route path="/admin/attendance" component={user?.role === "admin" ? AttendanceManagement : LandingPage} />
      <Route path="/admin/gps" component={user?.role === "admin" ? GPSTracking : LandingPage} />
      <Route path="/admin/reports" component={user?.role === "admin" ? ReportsAndAnalytics : LandingPage} />
      <Route path="/admin/payroll" component={user?.role === "admin" ? PayrollManagement : LandingPage} />
      <Route path="/employee/checkin" component={user?.role === "user" ? EmployeeCheckIn : LandingPage} />
      <Route path="/employee/profile" component={user?.role === "user" ? EmployeeProfile : LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
