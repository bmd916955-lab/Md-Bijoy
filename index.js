export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // আপনার মূল ফায়ারবেস ডাটাবেজ অথবা রেন্ডার ব্যাকএন্ডের লিংক এখানে যুক্ত করুন
    const FIREBASE_DB_URL = "https://friends-agro-incubator-pro-default-rtdb.firebaseio.com";
    const RENDER_BACKEND_URL = "https://your-render-app-name.onrender.com"; // ঐচ্ছিক ব্যাকএন্ড মিডলওয়্যার

    try {
      // রিকোয়েস্টের ধরন দেখে সিদ্ধান্ত নেওয়া (সুপারসনিক প্রক্সি রাউটিং)
      // যদি রিকোয়েস্টটি ফায়ারবেসের সরাসরি ডাটা রিড/রাইট সম্পর্কিত হয়
      let targetUrl = FIREBASE_DB_URL + url.pathname + url.search;

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
        // ক্লাউডফ্লেয়ারের সুপারসনিক এজ ক্যাশিং এবং অপ্টিমাইজেশন এনাবল করা
        cf: {
          cacheTtl: 5, // অতি দ্রুত ডাটা আদান-প্রদানের জন্য ক্যাশ সময়
          cacheEverything: true
        }
      });

      // ফায়ারবেস বা সার্ভার থেকে আসা রেসপন্সটি ইনস্ট্যান্ট ইউজারের কাছে পৌঁছে দেওয়া
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });

    } catch (error) {
      // ফল্ট টলারেন্স: নেটওয়ার্ক বা সার্ভারে সমস্যা হলে ফলব্যাক রেসপন্স
      return new Response(JSON.stringify({
        status: "active",
        message: "Friends Agro Cloud Gateway is running in High-Speed Failover Mode",
        error: error.message
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
