import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AttendanceManagement() {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const branchesQuery = trpc.branches.list.useQuery();
  const attendanceQuery = trpc.attendance.getHistory.useQuery(
    {
      employeeId: 0,
      startDate: new Date(dateFilter),
      endDate: new Date(dateFilter),
    },
    { enabled: false }
  );

  const mockAttendanceData = [
    {
      id: 1,
      employee: "أحمد محمد",
      checkInTime: "08:00 AM",
      checkOutTime: "05:30 PM",
      status: "present",
      workHours: 9.5,
      checkInImage: "✓",
      checkOutImage: "✓",
    },
    {
      id: 2,
      employee: "فاطمة علي",
      checkInTime: "08:15 AM",
      checkOutTime: "05:00 PM",
      status: "late",
      workHours: 8.75,
      checkInImage: "✓",
      checkOutImage: "✓",
    },
    {
      id: 3,
      employee: "محمود حسن",
      checkInTime: "-",
      checkOutTime: "-",
      status: "absent",
      workHours: 0,
      checkInImage: "-",
      checkOutImage: "-",
    },
    {
      id: 4,
      employee: "سارة خالد",
      checkInTime: "08:05 AM",
      checkOutTime: "02:00 PM",
      status: "early_leave",
      workHours: 5.92,
      checkInImage: "✓",
      checkOutImage: "✓",
    },
    {
      id: 5,
      employee: "علي عبدالله",
      checkInTime: "08:00 AM",
      checkOutTime: "05:00 PM",
      status: "present",
      workHours: 9,
      checkInImage: "✓",
      checkOutImage: "✓",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      present: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        icon: <CheckCircle size={16} />,
      },
      late: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        icon: <AlertCircle size={16} />,
      },
      absent: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        icon: <XCircle size={16} />,
      },
      early_leave: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        icon: <Clock size={16} />,
      },
    };

    const config = statusConfig[status] || statusConfig.present;
    const statusLabels: Record<string, string> = {
      present: "حاضر",
      late: "متأخر",
      absent: "غائب",
      early_leave: "انصراف مبكر",
    };

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {statusLabels[status]}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">إدارة الحضور والانصراف</h2>
          <p className="text-muted-foreground">
            عرض وإدارة سجلات الحضور والانصراف للموظفين
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">التاريخ</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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
            <div className="flex items-end">
              <Button className="w-full">بحث</Button>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">الحاضرين</p>
            <p className="text-3xl font-bold text-green-400">4</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">الغائبين</p>
            <p className="text-3xl font-bold text-red-400">1</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">المتأخرين</p>
            <p className="text-3xl font-bold text-yellow-400">1</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">الانصراف المبكر</p>
            <p className="text-3xl font-bold text-orange-400">1</p>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-right py-4 px-6 font-semibold">الموظف</th>
                  <th className="text-right py-4 px-6 font-semibold">وقت الدخول</th>
                  <th className="text-right py-4 px-6 font-semibold">وقت الخروج</th>
                  <th className="text-right py-4 px-6 font-semibold">ساعات العمل</th>
                  <th className="text-right py-4 px-6 font-semibold">الصور</th>
                  <th className="text-right py-4 px-6 font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendanceData.map((record) => (
                  <tr key={record.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-6 font-medium">{record.employee}</td>
                    <td className="py-4 px-6">{record.checkInTime}</td>
                    <td className="py-4 px-6">{record.checkOutTime}</td>
                    <td className="py-4 px-6">{record.workHours}h</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded ${
                            record.checkInImage === "✓"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          دخول: {record.checkInImage}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            record.checkOutImage === "✓"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          خروج: {record.checkOutImage}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(record.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">ملخص اليوم</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">متوسط ساعات العمل</p>
              <p className="text-2xl font-bold">8.8h</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">إجمالي الموظفين</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">معدل الحضور</p>
              <p className="text-2xl font-bold text-green-400">80%</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
