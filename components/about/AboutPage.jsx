import React from "react";
import {
  FaRocket,
  FaHandPointRight,
  FaChartLine,
  FaMobileAlt,
  FaQrcode,
  FaListAlt,
  FaChartBar,
} from "react-icons/fa"; // أيقونات للدلالة

function AboutPage() {
  const features = [
    {
      title: "رقمنة القائمة وتجربة العميل",
      description:
        "قدّم لعملائك قوائم رقمية حديثة يتم تحديثها فورياً بمجرد مسح رمز QR، دون الحاجة لتحميل تطبيق.",
      icon: <FaMobileAlt className="w-8 h-8 text-blue-400" />,
    },
    {
      title: "تحكم شامل في الأقسام",
      description:
        "إدارة متكاملة لفئات الطعام، الأصناف، الإضافات، والأسعار من مكان واحد فقط.",
      icon: <FaListAlt className="w-8 h-8 text-green-400" />,
    },
    {
      title: "لوحات متخصصة للمطبخ والكاشير",
      description:
        "كل قسم في مطعمك يحصل على لوحة تحكم خاصة به (عبر QR) لتلقي الطلبات وتجهيزها وإنهاء الفواتير بكفاءة.",
      icon: <FaChartLine className="w-8 h-8 text-red-400" />,
    },
    {
      title: "تحليل الأداء والإيرادات",
      description:
        "راقب إيرادات كل مطعم، وتابع الطلبات المسجلة والأرباح بشكل فوري لاتخاذ قرارات عمل أفضل.",
      icon: <FaChartBar className="w-8 h-8 text-yellow-400" />,
    },
  ];

  return (
    // الخلفية الداكنة المتناسقة
    <div className="min-h-screen bg-gray-900 py-16 text-white">
      <div className="p-8 max-w-6xl mx-auto shadow-2xl rounded-lg bg-gray-800">
        {/* --- القسم الأول: الرؤية والرسالة --- */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-white">
            مستقبل إدارة المطاعم يبدأ هنا
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            نظام متكامل لإدارة المطاعم، صُمم ليحول هاتف عميلك إلى نقطة طلب ودفع،
            ويحول جهازك إلى لوحة تحكم ذكية وشاملة.
          </p>
        </header>

        <hr className="border-gray-700 mb-16" />

        {/* --- القسم الثاني: القيمة والحلول (المميزات) --- */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-400">
            لماذا يختار أصحاب المطاعم نظامنا؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-700/50 rounded-xl border border-gray-700 hover:bg-gray-700 transition duration-300"
              >
                <div className="flex items-center space-x-4 space-x-reverse mb-3">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- القسم الثالث: دعوة للبدء (CTA) --- */}
        <section className="text-center mt-20 p-10 bg-blue-600 rounded-xl shadow-2xl shadow-blue-600/50">
          <h2 className="text-3xl font-bold mb-4 text-white">
            هل أنت مستعد لرقمنة مطعمك؟
          </h2>
          <p className="text-lg mb-6 text-white/90">
            ابدأ الآن وشاهد نظامك يعمل بكفاءة غير مسبوقة مع لوحات التحكم الذكية.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
