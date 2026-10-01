"use client"

import { createContext, useContext } from "react"

import type { AdminRole } from "@/lib/admin-types"

export const AdminRoleContext = createContext<AdminRole>("owner")

export function useAdminRole(): AdminRole {
  return useContext(AdminRoleContext)
}
