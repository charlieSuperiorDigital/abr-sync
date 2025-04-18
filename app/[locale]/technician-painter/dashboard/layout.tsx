import React from 'react'
import type { NextLayoutProps } from 'next'

export default function TechnicianPainterDashboardLayout({
  children,
}: NextLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
