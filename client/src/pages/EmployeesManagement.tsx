import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function EmployeesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationalId: "",
    branchId: 1,
    departmentId: 1,
    shiftId: 1,
    baseSalary: "",
    hourlyRate: "",
  });

  const employeesQuery = trpc.employees.list.useQuery({});
  const createEmployeeMutation = trpc.employees.create.useMutation();
  const updateEmployeeMutation = trpc.employees.update.useMutation();

  const handleOpenDialog = (employee?: any) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email || "",
        phone: employee.phone || "",
        nationalId: employee.nationalId || "",
        branchId: employee.branchId,
        departmentId: employee.departmentId,
        shiftId: employee.shiftId,
        baseSalary: employee.baseSalary,
        hourlyRate: employee.hourlyRate || "",
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationalId: "",
        branchId: 1,
        departmentId: 1,
        shiftId: 1,
        baseSalary: "",
        hourlyRate: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingEmployee) {
        await updateEmployeeMutation.mutateAsync({
          id: editingEmployee.id,
          ...formData,
        });
        toast.success("تم تحديث الموظف بنجاح");
      } else {
        await createEmployeeMutation.mutateAsync(formData);
        toast.success("تم إضافة الموظف بنجاح");
      }
      setIsDialogOpen(false);
      employeesQuery.refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الموظف");
    }
  };

  const filteredEmployees = employeesQuery.data?.filter(
    (emp) =>
      emp.firstName.includes(searchTerm) ||
      emp.lastName.includes(searchTerm) ||
      emp.email?.includes(searchTerm)
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">إدارة الموظفين</h2>
          <Button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            إضافة موظف جديد
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="flex items-center gap-2 bg-input rounded-lg px-4 py-2">
            <Search size={20} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن موظف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </Card>

        {/* Employees Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-right py-4 px-6 font-semibold">الاسم</th>
                  <th className="text-right py-4 px-6 font-semibold">البريد الإلكتروني</th>
                  <th className="text-right py-4 px-6 font-semibold">الهاتف</th>
                  <th className="text-right py-4 px-6 font-semibold">الراتب الأساسي</th>
                  <th className="text-right py-4 px-6 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                          <p className="text-xs text-muted-foreground">{employee.nationalId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">{employee.email}</td>
                      <td className="py-4 px-6">{employee.phone}</td>
                      <td className="py-4 px-6">{employee.baseSalary} ر.س</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDialog(employee)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      لا توجد موظفين
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "تعديل الموظف" : "إضافة موظف جديد"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم الأول</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="الاسم الأول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم الأخير</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="الاسم الأخير"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الهاتف</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="الهاتف"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهوية</label>
                  <Input
                    value={formData.nationalId}
                    onChange={(e) =>
                      setFormData({ ...formData, nationalId: e.target.value })
                    }
                    placeholder="رقم الهوية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الراتب الأساسي</label>
                  <Input
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, baseSalary: e.target.value })
                    }
                    placeholder="الراتب الأساسي"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الفرع</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) =>
                      setFormData({ ...formData, branchId: parseInt(e.target.value) })
                    }
                    className="input-base"
                  >
                    <option value={1}>الفرع الرئيسي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">القسم</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: parseInt(e.target.value) })
                    }
                    className="input-base"
                  >
                    <option value={1}>القسم العام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الوردية</label>
                  <select
                    value={formData.shiftId}
                    onChange={(e) =>
                      setFormData({ ...formData, shiftId: parseInt(e.target.value) })
                    }
                    className="input-base"
                  >
                    <option value={1}>الوردية الصباحية</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={handleSave}>
                  {editingEmployee ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
