import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { MapPin, Users, TrendingUp, Clock, Shield, Smartphone } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-2xl font-bold">Oriana Staff</span>
          </div>
          <a href={getLoginUrl()} className="btn-primary">
            تسجيل الدخول
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              نظام إدارة الحضور والانصراف الذكي
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              تتبع موقع الموظفين في الوقت الفعلي، حساب الرواتب تلقائياً، ومنع التلاعب في تسجيل الحضور
            </p>
            <div className="flex gap-4">
              <a href={getLoginUrl()} className="btn-primary text-lg px-8 py-3">
                ابدأ الآن
              </a>
              <button className="btn-secondary text-lg px-8 py-3">
                اعرف المزيد
              </button>
            </div>
          </div>
          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="space-y-4">
              {[
                { icon: MapPin, text: "تتبع GPS في الوقت الفعلي" },
                { icon: Users, text: "إدارة متعددة الفروع والأقسام" },
                { icon: Clock, text: "تسجيل حضور وانصراف ذكي" },
                { icon: TrendingUp, text: "تقارير وإحصائيات شاملة" },
                { icon: Shield, text: "منع التلاعب بالحضور" },
                { icon: Smartphone, text: "تطبيق موبايل متقدم" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">المميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "تتبع GPS المباشر",
                description: "تتبع موقع الموظفين على الخريطة التفاعلية في الوقت الفعلي",
              },
              {
                title: "التقاط الصور",
                description: "التقاط صورة تلقائية عند تسجيل الحضور والانصراف",
              },
              {
                title: "منع التلاعب",
                description: "التحقق من صحة الموقع والوقت على الجهاز",
              },
              {
                title: "حساب الرواتب",
                description: "حساب الرواتب تلقائياً بناءً على ساعات العمل",
              },
              {
                title: "التقارير الشاملة",
                description: "تقارير مفصلة عن الحضور والأداء والرواتب",
              },
              {
                title: "العمل دون إنترنت",
                description: "مزامنة البيانات تلقائياً عند الاتصال",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-background rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">هل أنت مستعد للبدء؟</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          انضم إلى مئات الشركات التي تستخدم Oriana Staff لإدارة حضور موظفيها بكفاءة
        </p>
        <a href={getLoginUrl()} className="btn-primary text-lg px-8 py-3 inline-block">
          تسجيل الدخول الآن
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 Oriana Staff. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
