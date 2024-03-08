"use client";

import StatusBoxes from "@/app/components/statusBoxes.component";
import { IAssistanceCounter } from "@/dtos/IAssistanceCounter";
import { useAssistanceCounters } from "@/hooks/useAssistanceCounters";
import { statusColors } from "@/utils/statusToStatusColor";

export default function Admin() {
  const { assistanceCounters } = useAssistanceCounters();

  return (
    <div className="">
      <p className="text-black">Home page</p>
      <p className="text-black">{JSON.stringify(assistanceCounters)}</p>
      {assistanceCounters && (
        <StatusBoxes assistanceCounters={assistanceCounters}></StatusBoxes>
      )}
    </div>
  );
}
