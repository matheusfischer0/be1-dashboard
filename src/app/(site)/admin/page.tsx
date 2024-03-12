"use client";

import MonthlyAssistanceChart from "@/app/components/charts/MonthlyAssistanceChart";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAssistanceCounters } from "@/hooks/useAssistanceCounters";
import { textStatusColors } from "@/utils/chartUtilsFunctions";
import { count } from "console";

export default function Admin() {
  const { assistanceCounters } = useAssistanceCounters();

  return (
    <div className="">
      <div>
        <h3 className="text-black">Assistências por status</h3>
      </div>
      <div className="flex-col">
        <div className="flex flex-row gap-4 py-4 flex-wrap">
          {assistanceCounters &&
            Object.entries(assistanceCounters)
              .filter(
                ([statusKey, _]) =>
                  statusKey !== "ANALYSING" && statusKey !== "CREATED"
              )
              .map(([statusKey, { label, count }]) => {
                return (
                  <Card
                    key={statusKey}
                    className={`flex-1  border rounded-xl min-w-[160px] max-w-[380px]`}
                  >
                    <CardTitle className="p-4 pb-0">
                      <h2
                        className={`text-lg font-bold ${textStatusColors[statusKey]}`}
                      >
                        {label}
                      </h2>
                    </CardTitle>
                    <CardContent className="flex-1 p-4 pt-0">
                      <p className="text-black">{count} Chamados</p>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        <div className="hidden md:block">
          <Card>
            <MonthlyAssistanceChart />
          </Card>
        </div>
      </div>
    </div>
  );
}
