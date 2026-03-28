import React, { useState } from "react"; import { useAuth } from "@/_core/hooks/useAuth"; import { useLocation } from "wouter"; import { Button } from "@/components/ui/button"; import { Card } from "@/components/ui/card"; import { Input } from "@/components/ui/input"; import { Users, BarChart3, Shield, Clock, MapPin, DollarSign, Loader2 } from "lucide-react"; function LoginModal({ role, onClose, onSuccess }: { role: "admin" | "employee"; onClose: () => void; onSuccess: () => void }) { const [username, setUsername] = useState(role === "admin" ? "admin" : "employee"); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const handleLogin = async () => { setLoading(true); setError(""); try { const res = await fetch("/api/oauth/login", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ username, password }), }); const data = await res.json(); if (res.ok) { onSuccess(); } else { setError(data.error || "فشل تسجيل الدخول"); } } catch { setError("حدث خطأ، حاول مرة أخرى"); } finally { setLoading(false); } }; return ( <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"> <Card className="w-full max-w-sm p-6 bg-slate-800 border-slate-700"> <h2 className="text-xl font-bold text-white mb-6 text-center"> {role === "admin" ? "دخول الإدارة" : "دخول الموظفين"} </h2> <div className="space-y-4"> <div> <label className="text-sm text-slate-400 mb-1 block">اسم المستخدم</label> <Input value={username} onChange={e => setUsername(e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder={role === "admin" ? "admin" : "employee"} dir="ltr" /> </div> <div> <label className="text-sm text-slate-400 mb-1 block">كلمة المرور</label> <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder="••••••" dir="ltr" onKeyDown={e => e.key === "Enter" && handleLogin()} /> </div> {error && <p className="text-red-400 text-sm text-center">{error}</p>} <div className="text-xs text-slate-500 text-center"> {role === "admin" ? "admin / admin123" : "employee / emp123"} </div> <Button onClick={handleLogin} disabled={loading} className={`w-full ${role === "admin" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`} > {loading ? <Loader2 className="animate-spin" size={18} /> : "دخول"} </Button> <Button variant="ghost" onClick={onClose} className="w-full text-slate-400"> إلغاء </Button> </div> </Card> </div> ); } export default function LandingPage() { const { user, loading, refresh } = useAuth(); const [, navigate] = useLocation(); const [showLogin, setShowLogin] = useState<"admin" | "employee" | null>(null); React.useEffect(() => { if (!loading && user) { if (user.role === "admin") { navigate("/admin"); } else { navigate("/employee/checkin"); } } }, [user, loading, navigate]); if (loading) { return ( 
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
