interface PovProjectStatusBadgeProps {
  finished: boolean;
  paused: boolean;
}

export default function PovProjectStatusBadge({
  finished,
  paused
}: PovProjectStatusBadgeProps) {
  const status = finished
    ? {
        label: "Finished",
        color: "bg-dashboard-green-soft text-dashboard-green"
      }
    : paused
    ? {
        label: "Paused",
        color: "bg-dashboard-amber-soft text-dashboard-amber"
      }
    : {
        label: "Running",
        color: "bg-dashboard-blue-soft text-dashboard-blue"
      };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 whitespace-nowrap
        rounded-full px-2.5 py-1 text-xs font-medium
        ${status.color}
      `}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />

      {status.label}
    </span>
  );
}
