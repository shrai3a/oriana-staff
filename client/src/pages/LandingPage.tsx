import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, BarChart3, Shield, Clock, MapPin, DollarSign } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee/checkin");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <span className="text-2xl font-bold text-white">Oriana Staff</span>
          </div>
          <div className="text-sm text-slate-400">نظام إدارة الموظفين والحضور</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Oriana Staff
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            نظام متكامل لإدارة الموظفين والحضور والرواتب
          </p>
          <p className="text-slate-400">
            اختر دورك للدخول إلى النظام
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Admin Card */}
          <Card className="p-8 bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">لوحة الإدارة</h2>
                <p className="text-slate-400">
                  الوصول إلى لوحة التحكم الإدارية الكاملة
                </p>
              </div>
              <div className="w-full space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2 justify-center">
                  <Users size={16} className="text-blue-400" />
                  <span>إدارة الموظفين والفروع</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <BarChart3 size={16} className="text-blue-400" />
                  <span>التقارير والإحصائيات</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <DollarSign size={16} className="text-blue-400" />
                  <span>إدارة الرواتب</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MapPin size={16} className="text-blue-400" />
                  <span>تتبع GPS المباشر</span>
                </div>
              </div>
              <a
                href={`${window.location.origin}/api/oauth/login?returnPath=/admin`}
                className="w-full"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  دخول الإدارة
                </Button>
              </a>
            </div>
          </Card>

          {/* Employee Card */}
          <Card className="p-8 bg-slate-800/50 border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">تطبيق الموظفين</h2>
                <p className="text-slate-400">
                  تسجيل الحضور والانصراف وعرض الإحصائيات
                </p>
              </div>
              <div className="w-full space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2 justify-center">
                  <Clock size={16} className="text-green-400" />
                  <span>تسجيل الحضور والانصراف</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MapPin size={16} className="text-green-400" />
                  <span>تسجيل الموقع والصورة</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <BarChart3 size={16} className="text-green-400" />
                  <span>عرض الإحصائيات</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <DollarSign size={16} className="text-green-400" />
                  <span>عرض الراتب والإجازات</span>
                </div>
              </div>
              <a
                href={`${window.location.origin}/api/oauth/login?returnPath=/employee/checkin`}
                className="w-full"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  دخول الموظفين
                </Button>
              </a>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            المميزات الرئيسية
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <Clock className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">تتبع الحضور</h4>
              <p className="text-slate-400">
                تسجيل دقيق للحضور والانصراف مع التقاط الصور والموقع
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <MapPin className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">تتبع GPS</h4>
              <p className="text-slate-400">
                تتبع مواقع الموظفين في الوقت الفعلي على خريطة تفاعلية
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <DollarSign className="w-8 h-8 text-yellow-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">حساب الرواتب</h4>
              <p className="text-slate-400">
                حساب تلقائي للرواتب والبدلات والخصومات
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <BarChart3 className="w-8 h-8 text-purple-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">التقارير</h4>
              <p className="text-slate-400">
                تقارير شاملة وإحصائيات متقدمة للحضور والأداء
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <Shield className="w-8 h-8 text-red-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">الأمان</h4>
              <p className="text-slate-400">
                نظام مصادقة آمن ومنع التلاعب بالبيانات
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <Users className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">إدارة الموظفين</h4>
              <p className="text-slate-400">
                إدارة شاملة للموظفين والفروع والأقسام
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>© 2026 Oriana Staff. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
