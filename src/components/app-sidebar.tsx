
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CircuitBoard,
  HardDrive,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/components', label: 'Inventory', icon: HardDrive },
  { href: '/dashboard/logs', label: 'Logs', icon: History },
  {
    href: '/dashboard/notifications',
    label: 'Notifications',
    icon: Bell,
    badge: '3',
  },
];

const adminMenuItems = [
  { href: '/dashboard/users', label: 'User Management', icon: Users },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isAdmin = user?.role === 'Admin';

  const allMenuItems = isAdmin ? [...menuItems, ...adminMenuItems] : menuItems;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <CircuitBoard className="h-7 w-7 text-primary" />
          <span
            className="text-xl font-semibold text-primary"
            style={{ opacity: state === 'expanded' ? 1 : 0, transition: 'opacity 0.2s' }}
          >
            LabTrack
          </span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {allMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard/settings" className="w-full">
              <SidebarMenuButton isActive={pathname === '/dashboard/settings'} tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name || ''} data-ai-hint="profile picture" />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden" style={{ opacity: state === 'expanded' ? 1 : 0, width: state === 'expanded' ? 'auto' : 0, transition: 'opacity 0.2s, width 0.2s' }}>
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Log Out" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
