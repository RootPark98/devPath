"use client";

import { useCallback, useEffect, useState } from "react";
import { getMe, type Me } from "@/lib/devpath/client/me";
import { DevPathClientError } from "@/lib/devpath/client/errors";

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [meError, setMeError] = useState<DevPathClientError | null>(null);

  const refresh = useCallback(async () => {
    setLoadingMe(true);
    setMeError(null);

    try {
      const data = await getMe();
      setMe(data);
    } catch (e: any) {
      if (e instanceof DevPathClientError) setMeError(e);
      else setMeError(new DevPathClientError("INTERNAL_ERROR", e?.message ?? "알 수 없는 오류"));
      setMe({ authenticated: false }); // 안전한 기본값
    } finally {
      setLoadingMe(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { me, loadingMe, meError, refresh };
}
