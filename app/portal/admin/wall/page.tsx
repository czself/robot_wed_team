import AdminWallManager from "@/components/AdminWallManager";
import { listMessages } from "@/lib/wall";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "留言管理 · YZ Control",
};

export default async function PortalWallAdminPage() {
  await requireUser();
  const result = await listMessages({
    sort: "new",
    offset: 0,
    limit: 50,
    includePending: true,
  });

  return <AdminWallManager initialMessages={result.data} canDelete />;
}
