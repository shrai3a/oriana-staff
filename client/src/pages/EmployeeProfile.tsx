import { useState } from "react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Calendar, DollarSign, BarChart3, Download } from "lucide-react";

export default function EmployeeProfile() {
  const { user } = useAuth();

  const attendanceStats = {
    totalDays: 22,
    presentDays: 20,
    absentDays: 1,
    lateDays: 1,
    workHours: 176.5,
    averageHours: 8.8,
  };

  const salaryInfo = {
    baseSalary: 5000,
    allowances: 500,
    deductions: 200,
    netSalary: 5300,
    currency: "ر.س",
  };

  const recentAttendance = [
    {
      date: "2026-03-27",
      checkIn: "08:00",
      checkOut: "17:30",
      hours: 9.5,
      status: "حاضر",
    },
    {
      date: "2026-03-26",
      checkIn: "08:15",
      checkOut: "17:00",
      hours: 8.75,
      status: "متأخر",
    },
    {
      date: "2026-03-25",
      checkIn: "08:00",
      checkOut: "17:30",
      hours: 9.5,
      status: "حاضر",
    },
    {
      date: "2026-03-24",
      checkIn: "08:00",
      checkOut: "17:30",
      hours: 9.5,
      status: "حاضر",
    },
    {
      date: "2026-03-23",
      checkIn: "-",
      checkOut: "-",
      hours: 0,
      status: "غائب",
    },
  ];

  const leaves = {
    annual: { used: 5, remaining: 15 },
    sick: { used: 1, remaining: 9 },
    unpaid: { used: 0, remaining: 5 },
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      حاضر: { bg: "bg-green-500/20", text: "text-green-400" },
      متأخر: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      غائب: { bg: "bg-red-500/20", text: "text-red-400" },
    };

    const config = statusConfig[status] || statusConfig.حاضر;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">ملفي الشخصي</h2>
          <p className="text-muted-foreground">عرض بيانات الحساب والإحصائيات</p>
        </div>

        {/* Personal Info */}
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>الموظف ID: #EMP-{user?.id?.toString().padStart(4, "0")}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Attendance Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                إحصائيات الحضور
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">أيام الحضور</p>
                  <p className="text-2xl font-bold text-green-400">{attendanceStats.presentDays}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">الأيام الغائبة</p>
                  <p className="text-2xl font-bold text-red-400">{attendanceStats.absentDays}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">الأيام المتأخرة</p>
                  <p className="text-2xl font-bold text-yellow-400">{attendanceStats.lateDays}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">إجمالي الساعات</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {attendanceStats.workHours.toFixed(1)}h
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">متوسط الساعات</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {attendanceStats.averageHours.toFixed(1)}h
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">نسبة الحضور</p>
                  <p className="text-2xl font-bold text-indigo-400">
                    {((attendanceStats.presentDays / attendanceStats.totalDays) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Attendance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} />
                آخر تسجيلات الحضور
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                      <th className="text-right py-3 px-4 font-semibold">وقت الدخول</th>
                      <th className="text-right py-3 px-4 font-semibold">وقت الخروج</th>
                      <th className="text-right py-3 px-4 font-semibold">الساعات</th>
                      <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttendance.map((record, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4">{record.date}</td>
                        <td className="py-3 px-4">{record.checkIn}</td>
                        <td className="py-3 px-4">{record.checkOut}</td>
                        <td className="py-3 px-4">{record.hours > 0 ? `${record.hours}h` : "-"}</td>
                        <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                الراتب الشهري
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الراتب الأساسي</span>
                  <span className="font-semibold">
                    {salaryInfo.baseSalary.toLocaleString()} {salaryInfo.currency}
                  </span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span className="text-muted-foreground">البدلات</span>
                  <span className="font-semibold">
                    +{salaryInfo.allowances.toLocaleString()} {salaryInfo.currency}
                  </span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span className="text-muted-foreground">الخصومات</span>
                  <span className="font-semibold">
                    -{salaryInfo.deductions.toLocaleString()} {salaryInfo.currency}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-muted-foreground font-semibold">الراتب الصافي</span>
                  <span className="text-xl font-bold text-primary">
                    {salaryInfo.netSalary.toLocaleString()} {salaryInfo.currency}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-4 flex items-center justify-center gap-2">
                <Download size={16} />
                تحميل كشف الراتب
              </Button>
            </Card>

            {/* Leave Balance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} />
                رصيد الإجازات
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">إجازة سنوية</span>
                    <span className="font-semibold">{leaves.annual.remaining} متبقي</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(leaves.annual.remaining / (leaves.annual.used + leaves.annual.remaining)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">إجازة مرضية</span>
                    <span className="font-semibold">{leaves.sick.remaining} متبقي</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(leaves.sick.remaining / (leaves.sick.used + leaves.sick.remaining)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">إجازة بدون راتب</span>
                    <span className="font-semibold">{leaves.unpaid.remaining} متبقي</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(leaves.unpaid.remaining / (leaves.unpaid.used + leaves.unpaid.remaining)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
