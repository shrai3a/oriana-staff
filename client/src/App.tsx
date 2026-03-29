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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/employees" component={EmployeesManagement} />
            <Route path="/admin/branches" component={BranchesManagement} />
            <Route path="/admin/attendance" component={AttendanceManagement} />
            <Route path="/admin/gps" component={GPSTracking} />
            <Route path="/admin/reports" component={ReportsAndAnalytics} />
            <Route path="/admin/payroll" component={PayrollManagement} />
            <Route path="/employee/checkin" component={EmployeeCheckIn} />
            <Route path="/employee/profile" component={EmployeeProfile} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
