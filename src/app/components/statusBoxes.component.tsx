import { IAssistanceCounter } from "@/dtos/IAssistanceCounter";
import { statusColors } from "@/utils/statusToStatusColor";

// components/StatusBoxes.jsx
export default function StatusBoxes({
  assistanceCounters,
}: {
  assistanceCounters: IAssistanceCounter;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {Object.entries(assistanceCounters).map(
        ([statusKey, { label, count }]) => {
          return (
            <StatusBox
              key={statusKey}
              label={label}
              count={count}
              color={statusColors[statusKey]}
            />
          );
        }
      )}
    </div>
  );
}

function StatusBox({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div
      key={color}
      className={`p-4 rounded-lg text-black w-40 border ${color}`}
    >
      <h3 className="font-bold">{label}</h3>
      <p>Contagem: {count}</p>
    </div>
  );
}
