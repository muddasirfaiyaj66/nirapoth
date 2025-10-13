"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Camera,
  BarChart3,
  Settings,
  Car,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  UserCheck,
  Activity,
  TrendingUp,
  Building2,
  Phone,
  Mail,
} from "lucide-react";

interface SidebarItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  roles: string[];
  children?: SidebarItem[];
}

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getSidebarItems = (): SidebarItem[] => {
    const baseItems: SidebarItem[] = [
      {
        id: "dashboard",
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN", "POLICE", "DRIVER", "FIRE_SERVICE", "CITIZEN"],
      },
    ];

    // Role-specific items
    switch (user?.role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        baseItems.push(
          {
            id: "users",
            title: "User Management",
            href: "/admin/users",
            icon: Users,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "all-users",
                title: "All Users",
                href: "/admin/users",
                icon: Users,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "user-verification",
                title: "Verification",
                href: "/admin/verification",
                icon: UserCheck,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "analytics",
            title: "Analytics",
            href: "/admin/analytics",
            icon: BarChart3,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "system-stats",
                title: "System Statistics",
                href: "/admin/analytics/system",
                icon: TrendingUp,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "revenue",
                title: "Revenue Reports",
                href: "/admin/analytics/revenue",
                icon: CreditCard,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "system",
            title: "System Management",
            href: "/admin/system",
            icon: Settings,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "stations",
                title: "Police Stations",
                href: "/admin/stations",
                icon: Building2,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "cameras",
                title: "Camera Network",
                href: "/admin/cameras",
                icon: Camera,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
            ],
          }
        );
        break;

      case "POLICE":
        baseItems.push(
          {
            id: "violations",
            title: "Traffic Violations",
            href: "/police/violations",
            icon: Shield,
            badge: "12",
            roles: ["POLICE"],
            children: [
              {
                id: "pending-violations",
                title: "Pending Review",
                href: "/police/violations/pending",
                icon: AlertTriangle,
                badge: "8",
                roles: ["POLICE"],
              },
              {
                id: "confirmed-violations",
                title: "Confirmed",
                href: "/police/violations/confirmed",
                icon: Shield,
                roles: ["POLICE"],
              },
            ],
          },
          {
            id: "incidents",
            title: "Incident Reports",
            href: "/police/incidents",
            icon: AlertTriangle,
            badge: "5",
            roles: ["POLICE"],
          },
          {
            id: "complaints",
            title: "Complaints",
            href: "/police/complaints",
            icon: FileText,
            badge: "3",
            roles: ["POLICE"],
          },
          {
            id: "cameras",
            title: "Camera Monitoring",
            href: "/police/cameras",
            icon: Camera,
            roles: ["POLICE"],
          },
          {
            id: "fines",
            title: "Fine Management",
            href: "/police/fines",
            icon: CreditCard,
            roles: ["POLICE"],
          }
        );
        break;

      case "DRIVER":
        baseItems.push(
          {
            id: "my-violations",
            title: "My Violations",
            href: "/driver/violations",
            icon: Shield,
            badge: "2",
            roles: ["DRIVER"],
          },
          {
            id: "my-vehicles",
            title: "My Vehicles",
            href: "/driver/vehicles",
            icon: Car,
            roles: ["DRIVER"],
          },
          {
            id: "driver-gems",
            title: "Driver Gems",
            href: "/driver/gems",
            icon: Activity,
            roles: ["DRIVER"],
          },
          {
            id: "payments",
            title: "Payments",
            href: "/driver/payments",
            icon: CreditCard,
            roles: ["DRIVER"],
          },
          {
            id: "complaints",
            title: "File Complaint",
            href: "/driver/complaints",
            icon: FileText,
            roles: ["DRIVER"],
          }
        );
        break;

      case "FIRE_SERVICE":
        baseItems.push(
          {
            id: "emergency-incidents",
            title: "Emergency Incidents",
            href: "/fire/incidents",
            icon: AlertTriangle,
            badge: "3",
            roles: ["FIRE_SERVICE"],
          },
          {
            id: "fire-cameras",
            title: "Fire Monitoring",
            href: "/fire/cameras",
            icon: Camera,
            roles: ["FIRE_SERVICE"],
          },
          {
            id: "response-team",
            title: "Response Team",
            href: "/fire/team",
            icon: Users,
            roles: ["FIRE_SERVICE"],
          }
        );
        break;

      case "CITIZEN":
        baseItems.push(
          {
            id: "file-complaint",
            title: "File Complaint",
            href: "/citizen/complaints/new",
            icon: FileText,
            roles: ["CITIZEN"],
          },
          {
            id: "my-complaints",
            title: "My Complaints",
            href: "/citizen/complaints",
            icon: FileText,
            roles: ["CITIZEN"],
          },
          {
            id: "traffic-maps",
            title: "Traffic Maps",
            href: "/citizen/maps",
            icon: MapPin,
            roles: ["CITIZEN"],
          },
          {
            id: "emergency-contacts",
            title: "Emergency Contacts",
            href: "/citizen/emergency",
            icon: Phone,
            roles: ["CITIZEN"],
          }
        );
        break;
    }

    // Common items for all roles
    baseItems.push(
      {
        id: "notifications",
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: "5",
        roles: ["ADMIN", "POLICE", "DRIVER", "FIRE_SERVICE", "CITIZEN"],
      },
      {
        id: "profile",
        title: "Profile Settings",
        href: "/profile",
        icon: Settings,
        roles: ["ADMIN", "POLICE", "DRIVER", "FIRE_SERVICE", "CITIZEN"],
      }
    );

    return baseItems;
  };

  const sidebarItems = getSidebarItems();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <Link href="/">
          
          <div className="flex items-center gap-2">
            <div className=" rounded-lg flex items-center justify-center">
              
                <img src="/logo.png" alt="Logo" className="w-10 h-10" />
           
            </div>
            <span className="font-semibold">Nirapoth</span>
          </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Profile */}
      {!isCollapsed && user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImage || ""} alt={user.firstName} />
              <AvatarFallback>
                {user.firstName?.charAt(0)?.toUpperCase()}
                {user.lastName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {user.role.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <Link href={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isCollapsed && "px-2"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>

              {/* Sub-items */}
              {item.children && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link key={child.id} href={child.href}>
                      <Button
                        variant={isActive(child.href) ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3 h-9 text-sm"
                      >
                        <child.icon className="h-3 w-3 flex-shrink-0" />
                        <span className="flex-1 text-left">{child.title}</span>
                        {child.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {child.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50",
            isCollapsed && "px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
