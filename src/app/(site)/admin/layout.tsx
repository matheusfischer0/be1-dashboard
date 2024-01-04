"use client";

import { ReactNode } from "react";

import Header from "@/app/components/header.component";
import Loading from "@/app/components/loading.component";
import Sidebar from "@/app/components/sidebar.component";
import { useSession } from "next-auth/react";

export default function Layout({ children }: { children: ReactNode }) {
  const session = useSession();

  if (session.status === "unauthenticated" || session.status === "loading")
    return <Loading />;

  return (
    <div className={`flex bg-white`}>
      <div>
        <Sidebar />
      </div>
      <div id="main" className="grow w-full px-4 overflow-visible">
        <Header />
        <div className="grow overflow-visible">{children}</div>
      </div>
    </div>
  );
}
