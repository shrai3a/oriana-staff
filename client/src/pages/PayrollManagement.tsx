import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Edit, Trash2, DollarSign } from "lucide-react";

export default function PayrollManagement() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().split("T")[0].slice(0, 7)
  );
  const [showAddPayroll, setShowAddPayroll] = useState(false);

  const mockPayrollData = [
    {
      id: 1,
      employee: "أحمد محمد",
      baseSalary: 5000,
      allowances: 500,
      deductions: 200,
      netSalary: 5300,
      status: "processed",
    },
    {
      id: 2,
      employee: "فاطمة علي",
      baseSalary: 4500,
      allowances: 300,
      deductions: 150,
      netSalary: 4650,
      status: "processed",
    },
    {
      id: 3,
      employee: "محمود حسن",
      baseSalary: 6000,
      allowances: 600,
      deductions: 250,
      netSalary: 6350,
      status: "pending",
    },
    {
      id: 4,
      employee: "سارة خالد",
      baseSalary: 4000,
      allowances: 200,
      deductions: 100,
      netSalary: 4100,
      status: "processed",
    },
    {
      id: 5,
      employee: "علي عبدالله",
      baseSalary: 5500,
      allowances: 400,
      deductions: 180,
      netSalary: 5720,
      status: "draft",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      processed: { bg: "bg-green-500/20", text: "text-green-400" },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      draft: { bg: "bg-blue-500/20", text: "text-blue-400" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const statusLabels: Record<string, string> = {
      processed: "معالج",
      pending: "قيد الانتظار",
      draft: "مسودة",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const totalPayroll = mockPayrollData.reduce((sum, item) => sum + item.netSalary, 0);
  const totalAllowances = mockPayrollData.reduce((sum, item) => sum + item.allowances, 0);
  const totalDeductions = mockPayrollData.reduce((sum, item) => sum + item.deductions, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">إدارة الرواتب</h2>
            <p className="text-muted-foreground">إدارة وحساب رواتب الموظفين</p>
          </div>
          <Button onClick={() => setShowAddPayroll(!showAddPayroll)} className="flex items-center gap-2">
            <Plus size={20} />
            إضافة راتب
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الرواتب</p>
            <p className="text-3xl font-bold text-green-400">{totalPayroll.toLocaleString()} ر.س</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">البدلات</p>
            <p className="text-3xl font-bold text-blue-400">{totalAllowances.toLocaleString()} ر.س</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">الخصومات</p>
            <p className="text-3xl font-bold text-red-400">{totalDeductions.toLocaleString()} ر.س</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">عدد الموظفين</p>
            <p className="text-3xl font-bold text-purple-400">{mockPayrollData.length}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الشهر</label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الحالة</label>
              <select className="input-base">
                <option value="">جميع الحالات</option>
                <option value="processed">معالج</option>
                <option value="pending">قيد الانتظار</option>
                <option value="draft">مسودة</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">بحث</Button>
            </div>
          </div>
        </Card>

        {/* Payroll Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-right py-4 px-6 font-semibold">الموظف</th>
                  <th className="text-right py-4 px-6 font-semibold">الراتب الأساسي</th>
                  <th className="text-right py-4 px-6 font-semibold">البدلات</th>
                  <th className="text-right py-4 px-6 font-semibold">الخصومات</th>
                  <th className="text-right py-4 px-6 font-semibold">الراتب الصافي</th>
                  <th className="text-right py-4 px-6 font-semibold">الحالة</th>
                  <th className="text-right py-4 px-6 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {mockPayrollData.map((record) => (
                  <tr key={record.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-6 font-medium">{record.employee}</td>
                    <td className="py-4 px-6">{record.baseSalary.toLocaleString()} ر.س</td>
                    <td className="py-4 px-6 text-green-400">{record.allowances.toLocaleString()} ر.س</td>
                    <td className="py-4 px-6 text-red-400">{record.deductions.toLocaleString()} ر.س</td>
                    <td className="py-4 px-6 font-bold text-primary">
                      {record.netSalary.toLocaleString()} ر.س
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(record.status)}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition">
                          <Edit size={16} className="text-blue-400" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition">
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="flex items-center gap-2">
            <Download size={16} />
            تصدير الرواتب
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <DollarSign size={16} />
            معالجة الرواتب
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
