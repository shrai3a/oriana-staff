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
      <Route path={"/"} component={LandingPage} />
      
      {/* Admin Routes */}
      {user?.role === "admin" && (
        <>
          <Route path={"/admin"} component={AdminDashboard} />
          <Route path={"/admin/employees"} component={EmployeesManagement} />
          <Route path={"/admin/branches"} component={BranchesManagement} />
          <Route path={"/admin/attendance"} component={AttendanceManagement} />
          <Route path={"/admin/gps"} component={GPSTracking} />
          <Route path={"/admin/reports"} component={ReportsAndAnalytics} />
          <Route path={"/admin/payroll"} component={PayrollManagement} />
          <Route path={"/admin/settings"} component={() => <div>Settings Page</div>} />
        </>
      )}

      {/* Employee Routes */}
      {user?.role === "user" && (
        <>
          <Route path={"/employee/checkin"} component={EmployeeCheckIn} />
          <Route path={"/employee/profile"} component={EmployeeProfile} />
        </>
      )}

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
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
