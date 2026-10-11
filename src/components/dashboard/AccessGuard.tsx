"use client";

import { api } from "@/services/api";
import { canAccessPath, landingPathForRole } from "@/utils/role-access";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export default function AccessGuard({ children, locale }: { children: ReactNode; locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    api.auth.me().then((user) => {
      if (!active) return;
      const userRole = user?.tipoUsuario || user?.user?.tipoUsuario || user?.role || null;
      if (!userRole) {
        router.replace(`/${locale}/login`);
        return;
      }
      setRole(userRole);
      setReady(true);
    }).catch(() => {
      if (active) router.replace(`/${locale}/login`);
    });
    return () => { active = false; };
  }, [locale, router]);

  useEffect(() => {
    if (!ready || !role) return;
    if (!canAccessPath(role, pathname)) {
      const landingPath = landingPathForRole(role);
      router.replace(landingPath ? `/${locale}${landingPath}` : `/${locale}/login`);
    }
  }, [locale, pathname, ready, role, router]);

  if (!ready || !role || !canAccessPath(role, pathname)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        <span className="material-symbols-outlined mr-3 animate-spin text-blue-500">autorenew</span>
        Verificando permissões…
      </div>
    );
  }
  return children;
}
