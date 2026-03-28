import { useState, useRef, useEffect } from "react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Camera, MapPin, Clock, CheckCircle, AlertCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

export default function EmployeeCheckIn() {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "checking-in" | "checked-in">("idle");
  const [checkOutStatus, setCheckOutStatus] = useState<"idle" | "checking-out" | "checked-out">("idle");
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const checkInMutation = trpc.attendance.checkIn.useMutation();
  const checkOutMutation = trpc.attendance.checkOut.useMutation();
  const attendanceQuery = trpc.attendance.getTodayRecord.useQuery(
    { employeeId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          });
        },
        (error) => {
          toast.error("فشل الحصول على الموقع. تأكد من تفعيل GPS");
        }
      );
    }
  }, []);

  // Update attendance data
  useEffect(() => {
    if (attendanceQuery.data) {
      setTodayAttendance(attendanceQuery.data);
    }
  }, [attendanceQuery.data]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast.error("فشل فتح الكاميرا. تأكد من السماح بالوصول");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const handleCheckIn = async () => {
    if (!currentLocation) {
      toast.error("لم يتم الحصول على الموقع. حاول مرة أخرى");
      return;
    }

    if (!capturedImage) {
      toast.error("يرجى التقاط صورة أولاً");
      return;
    }

    setCheckInStatus("checking-in");
    try {
      await checkInMutation.mutateAsync({
        employeeId: user?.id || 0,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        checkInImage: capturedImage,
        deviceId: "web-" + (user?.id || 0),
        deviceTime: new Date(),
      });
      setCheckInStatus("checked-in");
      setCapturedImage(null);
      toast.success("تم تسجيل الدخول بنجاح");
      attendanceQuery.refetch();
    } catch (error) {
      setCheckInStatus("idle");
      toast.error("فشل تسجيل الدخول");
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance?.id) {
      toast.error("لم يتم تسجيل الدخول بعد. يجب تسجيل الدخول أولاً");
      return;
    }

    if (!currentLocation) {
      toast.error("لم يتم الحصول على الموقع. حاول مرة أخرى");
      return;
    }

    if (!capturedImage) {
      toast.error("يرجى التقاط صورة أولاً");
      return;
    }

    setCheckOutStatus("checking-out");
    try {
      await checkOutMutation.mutateAsync({
        attendanceRecordId: todayAttendance.id,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        checkOutImage: capturedImage,
      });
      setCheckOutStatus("checked-out");
      setCapturedImage(null);
      toast.success("تم تسجيل الخروج بنجاح");
      attendanceQuery.refetch();
    } catch (error) {
      setCheckOutStatus("idle");
      toast.error("فشل تسجيل الخروج");
    }
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">تسجيل الحضور والانصراف</h2>
          <p className="text-muted-foreground">التقط صورة وسجل موقعك</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Camera size={20} />
                الكاميرا
              </h3>

              {!cameraActive ? (
                <div className="bg-muted rounded-lg p-8 text-center">
                  {capturedImage ? (
                    <>
                      <img src={capturedImage} alt="Captured" className="w-full rounded-lg mb-4" />
                      <Button
                        onClick={() => {
                          setCapturedImage(null);
                          startCamera();
                        }}
                        variant="outline"
                      >
                        التقاط صورة أخرى
                      </Button>
                    </>
                  ) : (
                    <>
                      <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">لم يتم التقاط صورة بعد</p>
                      <Button onClick={startCamera}>فتح الكاميرا</Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg bg-black"
                  />
                  <div className="flex gap-2">
                    <Button onClick={capturePhoto} className="flex-1">
                      التقاط الصورة
                    </Button>
                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" width={640} height={480} />
            </Card>

            {/* Location Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                الموقع الحالي
              </h3>
              {currentLocation ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">خط العرض:</span>{" "}
                    <span className="font-mono">{currentLocation.latitude.toFixed(6)}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">خط الطول:</span>{" "}
                    <span className="font-mono">{currentLocation.longitude.toFixed(6)}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">الدقة:</span>{" "}
                    <span className="font-mono">{currentLocation.accuracy.toFixed(2)} متر</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">آخر تحديث:</span>{" "}
                    <span className="font-mono">{currentLocation.timestamp.toLocaleTimeString("ar-SA")}</span>
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">جاري الحصول على الموقع...</p>
              )}
            </Card>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            {/* Today's Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} />
                حالة اليوم
              </h3>
              {todayAttendance ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">وقت الدخول</p>
                      <p className="font-semibold">
                        {new Date(todayAttendance.checkInTime).toLocaleTimeString("ar-SA")}
                      </p>
                    </div>
                  </div>
                  {todayAttendance.checkOutTime && (
                    <div className="flex items-center gap-2">
                      <LogOut size={20} className="text-red-400" />
                      <div>
                        <p className="text-sm text-muted-foreground">وقت الخروج</p>
                        <p className="font-semibold">
                          {new Date(todayAttendance.checkOutTime).toLocaleTimeString("ar-SA")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">لم تسجل حضورك بعد اليوم</p>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleCheckIn}
                disabled={!capturedImage || !currentLocation || checkInStatus === "checking-in"}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {checkInStatus === "checking-in" ? "جاري التسجيل..." : "تسجيل الدخول"}
              </Button>
              <Button
                onClick={handleCheckOut}
                disabled={!capturedImage || !currentLocation || checkOutStatus === "checking-out"}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {checkOutStatus === "checking-out" ? "جاري التسجيل..." : "تسجيل الخروج"}
              </Button>
            </div>

            {/* Info Box */}
            <Card className="p-4 bg-blue-500/10 border-blue-500/20">
              <div className="flex gap-2">
                <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300">
                  تأكد من تفعيل GPS والسماح بالوصول إلى الكاميرا قبل التسجيل
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
