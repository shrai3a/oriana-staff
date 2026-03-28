import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Users, Clock, MapPin, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  averageWorkHours: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    averageWorkHours: 0,
  });
  const [loading, setLoading] = useState(true);

  const employeesQuery = trpc.employees.list.useQuery({});

  useEffect(() => {
    if (employeesQuery.data) {
      setStats({
        totalEmployees: employeesQuery.data.length,
        presentToday: Math.floor(employeesQuery.data.length * 0.85),
        onLeave: Math.floor(employeesQuery.data.length * 0.05),
        averageWorkHours: 8.5,
      });
      setLoading(false);
    }
  }, [employeesQuery.data]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <Card className="p-6 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {Icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم</h2>
          <p className="text-muted-foreground">
            إدارة شاملة لحضور وانصراف الموظفين وتتبع الأداء
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </>
          ) : (
            <>
              <StatCard
                icon={<Users className="text-blue-400" size={24} />}
                label="إجمالي الموظفين"
                value={stats.totalEmployees}
                color="bg-blue-500/10"
              />
              <StatCard
                icon={<Clock className="text-green-400" size={24} />}
                label="الحاضرين اليوم"
                value={stats.presentToday}
                color="bg-green-500/10"
              />
              <StatCard
                icon={<MapPin className="text-purple-400" size={24} />}
                label="في الإجازة"
                value={stats.onLeave}
                color="bg-purple-500/10"
              />
              <StatCard
                icon={<TrendingUp className="text-orange-400" size={24} />}
                label="متوسط ساعات العمل"
                value={`${stats.averageWorkHours}h`}
                color="bg-orange-500/10"
              />
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart Placeholder */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-semibold mb-4">سجل الحضور اليومي</h3>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">جاري تحميل البيانات...</p>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">الإجراءات السريعة</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                إضافة موظف جديد
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                عرض التقارير
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                إدارة الفروع
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                تتبع GPS
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">آخر تسجيلات الحضور</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    الموظف
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    وقت الدخول
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    وقت الخروج
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4">موظف {i + 1}</td>
                    <td className="py-3 px-4">08:00 AM</td>
                    <td className="py-3 px-4">05:00 PM</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-medium">
                        حاضر
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
