// PortOne v2 Browser SDK를 window.PortOne으로 로드
declare global {
  interface Window {
    PortOne?: {
      requestPayment: (params: any) => Promise<any>;
    };
  }
}

let loading: Promise<void> | null = null;

export function loadPortOne(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("client only"));
  if (window.PortOne?.requestPayment) return Promise.resolve();

  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      // PortOne v2 결제창 호출은 PortOne.requestPayment() 기반으로 안내됨 :contentReference[oaicite:4]{index=4}
      s.src = "https://cdn.portone.io/v2/browser-sdk.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("failed to load PortOne SDK"));
      document.head.appendChild(s);
    });
  }
  return loading;
}