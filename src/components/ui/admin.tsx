import type { ReactNode } from "react";

export interface AdminDashboardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AdminDashboard({ children, ...props }: AdminDashboardProps) {
  return (
    <div className="rounded-xl p-6 bg-white flex flex-col">{children}</div>
  );
}

export interface AdminHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AdminHeader({ children, ...props }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6" {...props}>
      {children}
    </div>
  );
}

export interface AdminTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function AdminTitle({ children, ...props }: AdminTitleProps) {
  return (
    <h1 className="text-5xl font-bold text-gray-900" {...props}>
      {children}
    </h1>
  );
}

export interface AdminContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AdminContent({ children, ...props }: AdminContentProps) {
  return (
    <div className="p-4" {...props}>
      {children}
    </div>
  );
}
