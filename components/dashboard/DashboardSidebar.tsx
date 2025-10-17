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
  Ban,
  DollarSign,
  Zap,
  CheckCircle2,
  Gauge,
  Siren,
  Wallet,
  Construction,
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

interface DashboardSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  isMobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getSidebarItems = (): SidebarItem[] => {
    const dashboardHref = (() => {
      switch (user?.role) {
        case "ADMIN":
        case "SUPER_ADMIN":
          return "/dashboard/admin";
        case "POLICE":
          return "/dashboard/police";
        case "FIRE_SERVICE":
          return "/dashboard/fire-service";
        case "CITY_CORPORATION":
          return "/dashboard/city-corporation";
        case "CITIZEN":
        default:
          return "/dashboard/citizen";
      }
    })();
    const baseItems: SidebarItem[] = [
      {
        id: "dashboard",
        title: "Dashboard",
        href: dashboardHref,
        icon: LayoutDashboard,
        roles: [
          "ADMIN",
          "SUPER_ADMIN",
          "POLICE",
          "FIRE_SERVICE",
          "CITIZEN",
          "CITY_CORPORATION",
        ],
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
            href: "/dashboard/admin/users",
            icon: Users,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "all-users",
                title: "All Users",
                href: "/dashboard/admin/users",
                icon: Users,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "user-verification",
                title: "User Verification",
                href: "/dashboard/admin/users/verification",
                icon: UserCheck,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "user-roles",
                title: "Role Management",
                href: "/dashboard/admin/users/roles",
                icon: Shield,
                roles: ["SUPER_ADMIN"],
              },
              {
                id: "blocked-users",
                title: "Blocked Users",
                href: "/dashboard/admin/users/blocked",
                icon: Ban,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "violations",
            title: "Violations",
            href: "/dashboard/admin/violations",
            icon: Shield,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "all-violations",
                title: "All Violations",
                href: "/dashboard/admin/violations",
                icon: Shield,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "pending-violations",
                title: "Pending Review",
                href: "/dashboard/admin/violations/pending",
                icon: AlertTriangle,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "violation-types",
                title: "Violation Types",
                href: "/dashboard/admin/violations/types",
                icon: FileText,
                roles: ["SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "analytics",
            title: "Analytics",
            href: "/dashboard/admin/analytics",
            icon: BarChart3,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "system-stats",
                title: "System Statistics",
                href: "/dashboard/admin/analytics/system",
                icon: TrendingUp,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "revenue",
                title: "Revenue Reports",
                href: "/dashboard/admin/analytics/revenue",
                icon: CreditCard,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "traffic-analytics",
                title: "Traffic Analytics",
                href: "/dashboard/admin/analytics/traffic",
                icon: Activity,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "police-management-admin",
            title: "Police Management",
            href: "/dashboard/police",
            icon: Building2,
            roles: ["ADMIN", "SUPER_ADMIN"],
          },
          {
            id: "system",
            title: "System Management",
            href: "/dashboard/admin/system",
            icon: Settings,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "stations",
                title: "Police Stations",
                href: "/dashboard/admin/system/stations",
                icon: Building2,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "cameras",
                title: "Camera Network",
                href: "/dashboard/admin/system/cameras",
                icon: Camera,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "system-config",
                title: "Configuration",
                href: "/dashboard/admin/system/config",
                icon: Settings,
                roles: ["SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "complaints",
            title: "Complaints",
            href: "/dashboard/admin/complaints",
            icon: FileText,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "all-complaints",
                title: "All Complaints",
                href: "/dashboard/admin/complaints",
                icon: FileText,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "pending-complaints",
                title: "Pending",
                href: "/dashboard/admin/complaints/pending",
                icon: AlertTriangle,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "finances",
            title: "Financial Management",
            href: "/dashboard/admin/finances",
            icon: CreditCard,
            roles: ["ADMIN", "SUPER_ADMIN"],
            children: [
              {
                id: "fines",
                title: "Fine Management",
                href: "/dashboard/admin/finances/fines",
                icon: CreditCard,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "revenue-tracking",
                title: "Revenue Tracking",
                href: "/dashboard/admin/finances/revenue",
                icon: TrendingUp,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
              {
                id: "payment-disputes",
                title: "Payment Disputes",
                href: "/dashboard/admin/finances/disputes",
                icon: AlertTriangle,
                roles: ["ADMIN", "SUPER_ADMIN"],
              },
            ],
          },
          {
            id: "admin-notifications",
            title: "Send Notifications",
            href: "/dashboard/admin/notifications",
            icon: Bell,
            roles: ["ADMIN", "SUPER_ADMIN"],
          }
        );
        break;

      case "POLICE":
        baseItems.push(
          {
            id: "police-management",
            title: "Police Management",
            href: "/dashboard/police",
            icon: Building2,
            roles: ["POLICE"],
          },
          {
            id: "violations",
            title: "Traffic Violations",
            href: "/dashboard/police/violations",
            icon: Shield,
            roles: ["POLICE"],
            children: [
              {
                id: "pending-violations",
                title: "Pending Review",
                href: "/dashboard/police/violations/pending",
                icon: AlertTriangle,
                roles: ["POLICE"],
              },
              {
                id: "confirmed-violations",
                title: "Confirmed",
                href: "/dashboard/police/violations/confirmed",
                icon: Shield,
                roles: ["POLICE"],
              },
            ],
          },
          {
            id: "citizen-reports",
            title: "Citizen Reports",
            href: "/dashboard/police/review-reports",
            icon: FileText,
            roles: ["POLICE"],
          },
          {
            id: "appeals",
            title: "Review Appeals",
            href: "/dashboard/police/review-appeals",
            icon: CheckCircle2,
            roles: ["POLICE"],
          },
          {
            id: "manual-cases",
            title: "Manual Cases",
            href: "/dashboard/police/manual-cases",
            icon: Activity,
            roles: ["POLICE"],
          },
          {
            id: "accidents",
            title: "Accidents",
            href: "/dashboard/police/accidents",
            icon: Siren,
            roles: ["POLICE"],
          },
          {
            id: "speed-monitoring",
            title: "Speed Monitoring",
            href: "/dashboard/police/speed-monitoring",
            icon: Gauge,
            roles: ["POLICE"],
          },
          {
            id: "incidents",
            title: "Incident Reports",
            href: "/dashboard/police/incidents",
            icon: AlertTriangle,
            roles: ["POLICE"],
          },
          {
            id: "cameras",
            title: "Camera Monitoring",
            href: "/dashboard/police/cameras",
            icon: Camera,
            roles: ["POLICE"],
          },
          {
            id: "fines",
            title: "Fine Management",
            href: "/dashboard/police/fines",
            icon: CreditCard,
            roles: ["POLICE"],
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
            id: "report-violation",
            title: "Report Violation",
            href: "/dashboard/citizen/report-violation",
            icon: Camera,
            roles: ["CITIZEN"],
          },
          {
            id: "my-reports",
            title: "My Reports",
            href: "/dashboard/citizen/my-reports",
            icon: FileText,
            roles: ["CITIZEN"],
          },
          {
            id: "my-rewards",
            title: "My Rewards",
            href: "/dashboard/citizen/rewards",
            icon: Wallet,
            roles: ["CITIZEN"],
          },
          {
            id: "driving-license",
            title: "Driving License",
            href: "/dashboard/citizen/driving-license",
            icon: Shield,
            roles: ["CITIZEN"],
          },
          {
            id: "my-vehicles",
            title: "My Vehicles",
            href: "/dashboard/citizen/vehicles",
            icon: Car,
            roles: ["CITIZEN"],
          },
          {
            id: "my-violations",
            title: "My Violations",
            href: "/dashboard/citizen/violations",
            icon: Shield,
            roles: ["CITIZEN"],
          },
          {
            id: "submit-appeal",
            title: "Submit Appeal",
            href: "/dashboard/citizen/appeals",
            icon: CheckCircle2,
            roles: ["CITIZEN"],
          },
          {
            id: "citizen-gems",
            title: "My Gems",
            href: "/dashboard/citizen/gems",
            icon: Activity,
            roles: ["CITIZEN"],
          },
          {
            id: "report-infrastructure",
            title: "Report Infrastructure",
            href: "/dashboard/citizen/report-infrastructure",
            icon: Construction,
            roles: ["CITIZEN"],
          }
        );
        break;

      case "CITY_CORPORATION":
        baseItems.push({
          id: "infrastructure",
          title: "Infrastructure Management",
          href: "/dashboard/city-corporation/infrastructure",
          icon: Construction,
          roles: ["CITY_CORPORATION"],
        });
        break;
    }

    // Common items for all roles
    baseItems.push(
      {
        id: "notifications",
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: undefined, // Will be populated dynamically from NotificationDropdown
        roles: [
          "ADMIN",
          "SUPER_ADMIN",
          "POLICE",
          "FIRE_SERVICE",
          "CITIZEN",
          "CITY_CORPORATION",
        ],
      },
      {
        id: "profile",
        title: "Profile Settings",
        href: "/profile",
        icon: Settings,
        roles: [
          "ADMIN",
          "SUPER_ADMIN",
          "POLICE",
          "FIRE_SERVICE",
          "CITIZEN",
          "CITY_CORPORATION",
        ],
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

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-full flex-col border-r bg-background transition-all duration-300",
          "fixed lg:relative inset-y-0 left-0 z-50",
          isCollapsed ? "w-16" : "w-64",
          // Mobile responsive classes
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <Link href="/" onClick={handleLinkClick}>
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
            className="h-8 w-8 p-0 hidden lg:flex"
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
                <AvatarImage
                  src={user.profileImage || ""}
                  alt={user.firstName}
                />
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
        <nav className="flex-1 overflow-y-auto p-2 hide-scrollbar">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.id}>
                <Link href={item.href} onClick={handleLinkClick}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      isCollapsed && "px-2 lg:px-2"
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
                      <Link
                        key={child.id}
                        href={child.href}
                        onClick={handleLinkClick}
                      >
                        <Button
                          variant={isActive(child.href) ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3 h-9 text-sm"
                        >
                          <child.icon className="h-3 w-3 flex-shrink-0" />
                          <span className="flex-1 text-left">
                            {child.title}
                          </span>
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
              "w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
              isCollapsed && "px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
