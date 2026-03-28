import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function BranchesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    radius: "100",
  });

  const branchesQuery = trpc.branches.list.useQuery();
  const createBranchMutation = trpc.branches.create.useMutation();
  const updateBranchMutation = trpc.branches.update.useMutation();

  const handleOpenDialog = (branch?: any) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address || "",
        latitude: branch.latitude?.toString() || "",
        longitude: branch.longitude?.toString() || "",
        radius: branch.radius?.toString() || "100",
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        radius: "100",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        name: formData.name,
        address: formData.address || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        radius: parseInt(formData.radius),
      };

      if (editingBranch) {
        await updateBranchMutation.mutateAsync({
          id: editingBranch.id,
          ...data,
        });
        toast.success("تم تحديث الفرع بنجاح");
      } else {
        await createBranchMutation.mutateAsync(data);
        toast.success("تم إضافة الفرع بنجاح");
      }
      setIsDialogOpen(false);
      branchesQuery.refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الفرع");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">إدارة الفروع</h2>
          <Button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            إضافة فرع جديد
          </Button>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branchesQuery.data?.map((branch) => (
            <Card key={branch.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{branch.name}</h3>
                    <p className="text-sm text-muted-foreground">الفرع</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDialog(branch)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Edit2 size={16} className="text-blue-400" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {branch.address && (
                  <div>
                    <p className="text-muted-foreground">العنوان</p>
                    <p className="font-medium">{branch.address}</p>
                  </div>
                )}
                {branch.latitude && branch.longitude && (
                  <div>
                    <p className="text-muted-foreground">الموقع</p>
                    <p className="font-medium">
                      {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">نطاق العمل</p>
                  <p className="font-medium">{branch.radius} متر</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? "تعديل الفرع" : "إضافة فرع جديد"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم الفرع</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="اسم الفرع"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">العنوان</label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="العنوان الكامل"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">خط العرض (Latitude)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="خط العرض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">خط الطول (Longitude)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    placeholder="خط الطول"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نطاق العمل (بالمتر)</label>
                <Input
                  type="number"
                  value={formData.radius}
                  onChange={(e) =>
                    setFormData({ ...formData, radius: e.target.value })
                  }
                  placeholder="نطاق العمل"
                />
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={handleSave}>
                  {editingBranch ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
