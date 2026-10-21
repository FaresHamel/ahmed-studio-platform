interface AccountIdentityProps {
  account: {
    id: string;
    email: string;
    status: "active" | "inactive";
    profiles?: {
      display_name: string | null;
    } | null;
  };
}

const AVATAR_COLORS = [
  "bg-blue-500/15 text-blue-600",
  "bg-violet-500/15 text-violet-600",
  "bg-emerald-500/15 text-emerald-600",
  "bg-orange-500/15 text-orange-600",
  "bg-pink-500/15 text-pink-600"
];

function avatarColor(id: string) {
  let hash = 0;

  for (const character of id) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function AccountIdentity({ account }: AccountIdentityProps) {
  const name = account.profiles?.display_name?.trim() || account.email;

  const active = account.status === "active";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className={`
          flex size-11 shrink-0 items-center justify-center
          rounded-full text-sm font-semibold
          ${avatarColor(account.id)}
        `}
      >
        {name.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium" title={name}>
          {name}
        </p>

        <p
          className="mt-0.5 truncate text-xs text-dashboard-muted"
          title={account.email}
        >
          {account.email}
        </p>

        <span
          className={`
            mt-2 inline-flex items-center gap-1.5
            rounded-full px-2 py-0.5 text-xs font-medium
            ${
              active
                ? "bg-emerald-500/15 text-emerald-600"
                : "bg-rose-500/15 text-rose-600"
            }
          `}
        >
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-current"
          />
          {active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}
