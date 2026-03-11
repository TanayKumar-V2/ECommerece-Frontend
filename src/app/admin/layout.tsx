import AdminLayout from '@/components/admin/AdminLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Viraasat Admin Dashboard',
    description: 'Admin management panel for Viraasat Store',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>
}
