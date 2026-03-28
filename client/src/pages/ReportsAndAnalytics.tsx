import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, TrendingUp, Users, Clock, AlertCircle, BarChart3 } from "lucide-react";

export default function ReportsAndAnalytics() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [reportType, setReportType] = useState<"attendance" | "payroll" | "performance">(
    "attendance"
  );

  const branchesQuery = trpc.branches.list.useQuery();

  const mockReportData = {
    attendance: {
      totalEmployees: 50,
      presentDays: 1150,
      absentDays: 50,
      lateDays: 75,
      earlyLeaveDays: 25,
      averageAttendanceRate: 92,
      averageWorkHours: 8.4,
      totalWorkHours: 4200,
    },
    payroll: {
      totalSalaries: 250000,
      totalBonuses: 15000,
      totalDeductions: 8000,
      netPayroll: 257000,
      averageSalary: 5000,
      highestSalary: 8000,
      lowestSalary: 2500,
    },
    performance: {
      topPerformers: [
        { name: "أحمد محمد", attendanceRate: 98, workHours: 176 },
        { name: "فاطمة علي", attendanceRate: 96, workHours: 174 },
        { name: "محمود حسن", attendanceRate: 95, workHours: 172 },
      ],
      needsImprovement: [
        { name: "سارة خالد", attendanceRate: 78, workHours: 145 },
        { name: "علي عبدالله", attendanceRate: 82, workHours: 155 },
      ],
    },
  };

  const handleExportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">التقارير والإحصائيات</h2>
          <p className="text-muted-foreground">
            عرض شامل للتقارير والإحصائيات والتحليلات
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">من التاريخ</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">إلى التاريخ</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الفرع</label>
              <select className="input-base">
                <option value="">جميع الفروع</option>
                {branchesQuery.data?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">نوع التقرير</label>
              <select
                value={reportType}
                onChange={(e) =>
                  setReportType(e.target.value as "attendance" | "payroll" | "performance")
                }
                className="input-base"
              >
                <option value="attendance">الحضور والانصراف</option>
                <option value="payroll">الرواتب</option>
                <option value="performance">الأداء</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">بحث</Button>
            </div>
          </div>
        </Card>

        {/* Report Type: Attendance */}
        {reportType === "attendance" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-blue-400" size={20} />
                  <span className="text-sm text-muted-foreground">إجمالي الموظفين</span>
                </div>
                <p className="text-3xl font-bold">{mockReportData.attendance.totalEmployees}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-green-400" size={20} />
                  <span className="text-sm text-muted-foreground">معدل الحضور</span>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  {mockReportData.attendance.averageAttendanceRate}%
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-purple-400" size={20} />
                  <span className="text-sm text-muted-foreground">متوسط ساعات العمل</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  {mockReportData.attendance.averageWorkHours}h
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="text-orange-400" size={20} />
                  <span className="text-sm text-muted-foreground">أيام الغياب</span>
                </div>
                <p className="text-3xl font-bold text-orange-400">
                  {mockReportData.attendance.absentDays}
                </p>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">الإحصائيات التفصيلية</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">أيام الحضور</span>
                  <span className="font-semibold">{mockReportData.attendance.presentDays}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">أيام التأخير</span>
                  <span className="font-semibold text-yellow-400">
                    {mockReportData.attendance.lateDays}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">الانصراف المبكر</span>
                  <span className="font-semibold text-blue-400">
                    {mockReportData.attendance.earlyLeaveDays}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">إجمالي ساعات العمل</span>
                  <span className="font-semibold">{mockReportData.attendance.totalWorkHours}h</span>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Report Type: Payroll */}
        {reportType === "payroll" && (
          <>
            {/* Payroll Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="text-green-400" size={20} />
                  <span className="text-sm text-muted-foreground">إجمالي الرواتب</span>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  {mockReportData.payroll.totalSalaries.toLocaleString()} ر.س
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-blue-400" size={20} />
                  <span className="text-sm text-muted-foreground">البدلات والحوافز</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">
                  {mockReportData.payroll.totalBonuses.toLocaleString()} ر.س
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="text-red-400" size={20} />
                  <span className="text-sm text-muted-foreground">الخصومات</span>
                </div>
                <p className="text-3xl font-bold text-red-400">
                  {mockReportData.payroll.totalDeductions.toLocaleString()} ر.س
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-purple-400" size={20} />
                  <span className="text-sm text-muted-foreground">الراتب الصافي</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  {mockReportData.payroll.netPayroll.toLocaleString()} ر.س
                </p>
              </Card>
            </div>

            {/* Payroll Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">تفاصيل الرواتب</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">متوسط الراتب</span>
                  <span className="font-semibold">{mockReportData.payroll.averageSalary} ر.س</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">أعلى راتب</span>
                  <span className="font-semibold text-green-400">
                    {mockReportData.payroll.highestSalary} ر.س
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">أقل راتب</span>
                  <span className="font-semibold text-orange-400">
                    {mockReportData.payroll.lowestSalary} ر.س
                  </span>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Report Type: Performance */}
        {reportType === "performance" && (
          <>
            {/* Top Performers */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">أفضل الموظفين أداءً</h3>
              <div className="space-y-2">
                {mockReportData.performance.topPerformers.map((emp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/50"
                  >
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        معدل الحضور: {emp.attendanceRate}% | ساعات العمل: {emp.workHours}h
                      </p>
                    </div>
                    <span className="text-green-400 font-bold">{emp.attendanceRate}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Needs Improvement */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">يحتاجون إلى تحسين</h3>
              <div className="space-y-2">
                {mockReportData.performance.needsImprovement.map((emp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/50"
                  >
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        معدل الحضور: {emp.attendanceRate}% | ساعات العمل: {emp.workHours}h
                      </p>
                    </div>
                    <span className="text-red-400 font-bold">{emp.attendanceRate}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Export Options */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">تصدير التقرير</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => handleExportReport("pdf")}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              تصدير PDF
            </Button>
            <Button
              onClick={() => handleExportReport("excel")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              تصدير Excel
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
