import AdminWallManager from "@/components/AdminWallManager";
import { listMessages } from "@/lib/wall";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "留言管理 · YZ Control",
};

export default async function PortalWallAdminPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const result = await listMessages({
    sort: "new",
    offset: 0,
    limit: 50,
    includePending: isAdmin,
  });

  return <AdminWallManager initialMessages={result.data} canDelete={isAdmin} />;
}
