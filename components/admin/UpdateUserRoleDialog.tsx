"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAppDispatch } from "@/lib/store";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  updateUserRole,
  fetchUsers,
  type User,
} from "@/lib/store/slices/adminUsersSlice";
import { toast } from "sonner";
import {
  getAssignableRoles,
  canManageUser,
  type UserRole,
} from "@/lib/utils/roleHierarchy";

const updateRoleSchema = z.object({
  newRole: z.enum([
    "CITIZEN",
    "POLICE",
    "FIRE_SERVICE",
    "ADMIN",
    "SUPER_ADMIN",
  ]),
});

type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;

interface UpdateUserRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UpdateUserRoleDialog({
  isOpen,
  onClose,
  user,
}: UpdateUserRoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();

  const { handleSubmit, setValue, watch, reset } = useForm<UpdateRoleFormData>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      newRole: (user?.role as any) || "CITIZEN",
    },
  });

  // Get roles that current user can assign
  const assignableRoles = getAssignableRoles(currentUser?.role as UserRole);

  // Check if current user can manage the target user
  const canManageTargetUser =
    user && currentUser
      ? canManageUser(currentUser.role as UserRole, user.role as UserRole)
      : false;

  const onSubmit = async (data: UpdateRoleFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await dispatch(
        updateUserRole({
          userId: user.id,
          newRole: data.newRole,
        })
      ).unwrap();

      toast.success("User role updated successfully");

      // Refresh the users list
      dispatch(
        fetchUsers({
          page: 1,
          limit: 10,
          search: "",
          role: "all",
          status: "all",
        })
      );

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!user) return null;

  if (!canManageTargetUser) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Access Denied
            </DialogTitle>
            <DialogDescription>
              You don't have permission to manage this user's role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You can only manage users with roles at your level or below.
                {user.role === "SUPER_ADMIN" &&
                  " Only SUPER_ADMINs can manage other SUPER_ADMINs."}
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogDescription>
            Change the role for {user.firstName} {user.lastName} ({user.email})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Current Role
                </Label>
                <p className="text-lg font-semibold">
                  {user.role.replace("_", " ")}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  New Role
                </Label>
                <Select
                  value={watch("newRole")}
                  onValueChange={(value) => setValue("newRole", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new role" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {watch("newRole") !== user.role && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Changing a user's role will
                  immediately affect their access permissions. This action
                  cannot be undone automatically.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || watch("newRole") === user.role}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
