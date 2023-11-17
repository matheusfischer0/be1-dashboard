"use client";

import { usePathname } from "next/navigation";

import { LinkButton } from "@/app/components/buttons.component";

import { MdNavigateNext } from "react-icons/md";

const PathNavigation = () => {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter((segment) => segment !== "");

  const mapPaths = (segment: string) => {
    switch (segment) {
      case "configuracoes":
        return "Configurações";
      case "servicos":
        return "Serviços";
      default:
        return segment;
    }
  };

  if (pathSegments && pathSegments.length <= 1) return <></>;

  return (
    <div className="flex text-black pb-4">
      {pathSegments?.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

        if (path === "/admin") return null;
        return (
          <div key={index} className="flex items-center">
            {index !== 0 && index > 1 && (
              <span className="">
                <MdNavigateNext size={22} className="text-zinc-500" />
              </span>
            )}
            <LinkButton
              href={path}
              className={`capitalize py-1 h-auto rounded-md hover:text-gray-400 transition-all ease-in-out duration-300
              ${path === pathname ? "text-blue-800" : ""}`}
            >
              {mapPaths(segment)}
            </LinkButton>
          </div>
        );
      })}
    </div>
  );
};

export { PathNavigation };
