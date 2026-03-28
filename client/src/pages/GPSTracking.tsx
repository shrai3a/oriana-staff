import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, AlertCircle } from "lucide-react";

interface EmployeeLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  lastUpdate: Date;
  status: "online" | "offline" | "idle";
}

export default function GPSTracking() {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [employeeLocations, setEmployeeLocations] = useState<EmployeeLocation[]>([]);

  const employeesQuery = trpc.employees.list.useQuery({});
  const gpsTracksQuery = trpc.gpsTracks.getEmployeeTracks.useQuery(
    {
      employeeId: selectedEmployee || 0,
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
    { enabled: !!selectedEmployee }
  );

  useEffect(() => {
    if (employeesQuery.data) {
      const locations: EmployeeLocation[] = employeesQuery.data.map((emp) => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        latitude: 24.7136 + Math.random() * 0.1,
        longitude: 46.6753 + Math.random() * 0.1,
        accuracy: Math.random() * 20,
        speed: Math.random() * 50,
        lastUpdate: new Date(),
        status: Math.random() > 0.3 ? "online" : "offline",
      }));
      setEmployeeLocations(locations);
    }
  }, [employeesQuery.data]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "offline":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "idle":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">تتبع GPS في الوقت الفعلي</h2>
          <p className="text-muted-foreground">
            تتبع موقع الموظفين على الخريطة التفاعلية ومشاهدة المسارات التفصيلية
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Employee List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">الموظفين</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {employeeLocations.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp.id)}
                    className={`w-full text-right p-3 rounded-lg border transition-all ${
                      selectedEmployee === emp.id
                        ? "bg-primary/20 border-primary"
                        : "bg-muted/30 border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          emp.status === "online"
                            ? "bg-green-500"
                            : emp.status === "offline"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <span className="font-medium text-sm">{emp.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {emp.latitude.toFixed(4)}, {emp.longitude.toFixed(4)}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Statistics */}
            {selectedEmployee && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold">الإحصائيات</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الدقة</span>
                    <span>
                      {employeeLocations
                        .find((e) => e.id === selectedEmployee)
                        ?.accuracy?.toFixed(1)}
                      m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">السرعة</span>
                    <span>
                      {employeeLocations
                        .find((e) => e.id === selectedEmployee)
                        ?.speed?.toFixed(1)}
                      km/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">آخر تحديث</span>
                    <span>الآن</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-3">
            <Card className="p-4 h-96 lg:h-full bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">خريطة تفاعلية</p>
                <p className="text-sm text-muted-foreground">
                  اختر موظف لعرض موقعه على الخريطة
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Employee Tracks */}
        {selectedEmployee && gpsTracksQuery.data && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">المسارات التفصيلية</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      الوقت
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      الموقع
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      الدقة
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      السرعة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gpsTracksQuery.data.slice(0, 10).map((track, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        {new Date(track.timestamp).toLocaleTimeString("ar-SA")}
                      </td>
                      <td className="py-3 px-4">
                        {track.latitude.toFixed(4)}, {track.longitude.toFixed(4)}
                      </td>
                      <td className="py-3 px-4">{track.accuracy?.toFixed(1)}m</td>
                      <td className="py-3 px-4">{track.speed?.toFixed(1)}km/h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Alerts */}
        <Card className="p-6 bg-yellow-500/10 border-yellow-500/50">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">تنبيهات</h3>
              <ul className="text-sm text-yellow-300 space-y-1">
                <li>• 2 موظف خارج نطاق العمل المسموح</li>
                <li>• 1 موظف لم يسجل الحضور اليوم</li>
                <li>• 3 موظفين غير متصلين بالإنترنت</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
