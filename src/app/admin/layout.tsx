import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ORGANIZER")) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          Organizer Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage tournaments, events, and results imports.</p>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
