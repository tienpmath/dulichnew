"use client";

import { UserRole } from "@prisma/client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";
import React from "react";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({
  children,
  allowedRole,
}: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <div className={'container my-10'}>
        {JSON.stringify(role)}
        <FormError message="Bạn không có quyền xem nội dung này!" />
      </div>
    )
  }

  return (
    <>
      {children}
    </>
  );
};
