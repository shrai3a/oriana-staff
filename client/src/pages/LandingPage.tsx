
import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, BarChart3, Shield, Clock, MapPin, DollarSign, Loader2 } from "lucide-react";

function LoginModal({ role, onClose }: { role: "admin" | "employee"; onClose: () => void }) {
  const [username, setUsername] = useState(role === "admin" ? "admin" : "employee");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/oauth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        setError(data.error || "فشل تسجيل الدخول");
      }
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm p-6 bg-slate-800 border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {role === "admin" ? "دخول الإدارة" : "دخول الموظفين"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">اسم المستخدم</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-700 border-slate-600 text-white" dir="ltr" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">كلمة المرور</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <p className="text-xs text-slate-500 text-center">{role === "admin" ? "admin / admin123" : "employee / emp123"}</p>
          <Button onClick={handleLogin} disabled={loading} className={role === "admin" ? "w-full bg-blue-600 hover:bg-blue-700" : "w-full bg-green-600 hover:bg-green-700"}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "دخول"}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-slate-400">إلغاء</Button>
        </div>
      </Card>
    </div>
  );
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [showLogin, setShowLogin] = useState<"admin" | "employee" | null>(null);

  React.useEffect(() => {
    if (!loading && user) {
      navigate(user.role === "admin" ? "/admin" : "/employee/checkin");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {showLogin && <LoginModal role={showLogin} onClose={() => setShowLogin(null)} />}

      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <span className="text-2xl font-bold text-white">Oriana Staff</span>
          </div>
          <div className="text-sm text-slate-400">نظام إدارة الموظفين والحضور</div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Oriana Staff</h1>
          <p className="text-xl text-slate-300 mb-4">نظام متكامل لإدارة الموظفين والحضور والرواتب</p>
          <p className="text-slate-400">اختر دورك للدخول إلى النظام</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">لوحة الإدارة</h2>
                <p className="text-slate-400">الوصول إلى لوحة التحكم الإدارية الكاملة</p>
              </div>
              <div className="w-full space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2 justify-center"><Users size={16} className="text-blue-400" /><span>إدارة الموظفين والفروع</span></div>
                <div className="flex items-center gap-2 justify-center"><BarChart3 size={16} className="text-blue-400" /><span>التقارير والإحصائيات</span></div>
                <div className="flex items-center gap-2 justify-center"><DollarSign size={16} className="text-blue-400" /><span>إدارة الرواتب</span></div>
                <div className="flex items-center gap-2 justify-center"><MapPin size={16} className="text-blue-400" /><span>تتبع GPS المباشر</span></div>
              </div>
              <Button onClick={() => setShowLogin("admin")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">دخول الإدارة</Button>
            </div>
          </Card>

          <Card className="p-8 bg-slate-800/50 border-slate-700 hover:border-green-500 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">تطبيق الموظفين</h2>
                <p className="text-slate-400">تسجيل الحضور والانصراف وعرض الإحصائيات</p>
              </div>
              <div className="w-full space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2 justify-center"><Clock size={16} className="text-green-400" /><span>تسجيل الحضور والانصراف</span></div>
                <div className="flex items-center gap-2 justify-center"><MapPin size={16} className="text-green-400" /><span>تسجيل الموقع والصورة</span></div>
                <div className="flex items-center gap-2 justify-center"><BarChart3 size={16} className="text-green-400" /><span>عرض الإحصائيات</span></div>
                <div className="flex items-center gap-2 justify-center"><DollarSign size={16} className="text-green-400" /><span>عرض الراتب والإجازات</span></div>
              </div>
              <Button onClick={() => setShowLogin("employee")} className="w-full bg-green-600 hover:bg-green-700 text-white">دخول الموظفين</Button>
            </div>
          </Card>
        </div>
      </div>

      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400">
          <p>© 2026 Oriana Staff. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
