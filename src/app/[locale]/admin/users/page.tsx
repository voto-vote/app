"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Plus, MoreHorizontal, Edit, Trash2, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  DataTable,
  StatusBadge,
  RoleGuard,
  type Column,
} from "@/components/admin";
import type { AdminUser, AdminRole } from "@/types/admin";

// Mock user data
const mockUsers: AdminUser[] = [
  {
    id: "1",
    email: "admin@voto.vote",
    name: "Super Admin",
    role: "superadmin",
    provider: "google",
    hasAcceptedTerms: true,
    termsAcceptedAt: "2024-01-01T00:00:00Z",
    termsVersion: "1.0",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2024-06-01T10:00:00Z",
    permissions: {
      canManageElections: true,
      canManageUsers: true,
      canManageAllElections: true,
      electionIds: [],
      partyIds: [],
      candidateIds: [],
    },
  },
  {
    id: "2",
    email: "election.admin@voto.vote",
    name: "Election Admin",
    role: "electionadmin",
    provider: "microsoft",
    hasAcceptedTerms: true,
    termsAcceptedAt: "2024-02-15T00:00:00Z",
    termsVersion: "1.0",
    createdAt: "2024-02-15T00:00:00Z",
    lastLoginAt: "2024-06-02T14:30:00Z",
    permissions: {
      canManageElections: true,
      canManageUsers: false,
      canManageAllElections: false,
      electionIds: [1, 2],
      partyIds: [],
      candidateIds: [],
    },
  },
  {
    id: "3",
    email: "party@example.com",
    name: "Party Administrator",
    role: "partyadmin",
    provider: "email-magic-link",
    hasAcceptedTerms: true,
    termsAcceptedAt: "2024-03-10T00:00:00Z",
    termsVersion: "1.0",
    createdAt: "2024-03-10T00:00:00Z",
    lastLoginAt: "2024-06-01T08:00:00Z",
    partyIds: [1],
    permissions: {
      canManageElections: false,
      canManageUsers: false,
      canManageAllElections: false,
      electionIds: [],
      partyIds: [1],
      candidateIds: [],
    },
  },
  {
    id: "4",
    email: "candidate@example.com",
    name: "John Candidate",
    role: "candidate",
    provider: "apple",
    hasAcceptedTerms: false,
    createdAt: "2024-04-20T00:00:00Z",
    candidateIds: [1],
    permissions: {
      canManageElections: false,
      canManageUsers: false,
      canManageAllElections: false,
      electionIds: [],
      partyIds: [],
      candidateIds: [1],
    },
  },
];

export default function UsersPage() {
  const router = useRouter();
  const locale = useLocale();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "electionadmin" as AdminRole,
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDialog = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "electionadmin",
      });
    }
    setDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)),
      );
    } else {
      const newUser: AdminUser = {
        id: Date.now().toString(),
        ...formData,
        provider: "email-magic-link",
        hasAcceptedTerms: false,
        createdAt: new Date().toISOString(),
        permissions: {
          canManageElections:
            formData.role !== "candidate" && formData.role !== "partyadmin",
          canManageUsers: formData.role === "superadmin",
          canManageAllElections: formData.role === "superadmin",
          electionIds: [],
          partyIds: [],
          candidateIds: [],
        },
      };
      setUsers([...users, newUser]);
    }
    setDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const getRoleBadgeVariant = (role: AdminRole) => {
    switch (role) {
      case "superadmin":
        return "destructive";
      case "electionadmin":
        return "info";
      case "partyadmin":
        return "purple";
      case "candidate":
        return "default";
      default:
        return "default";
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user) => (
        <StatusBadge variant={getRoleBadgeVariant(user.role)}>
          {user.role.replace("admin", " Admin")}
        </StatusBadge>
      ),
    },
    {
      key: "provider",
      header: "Auth Provider",
      sortable: true,
      render: (user) => (
        <span className="capitalize">{user.provider.replace("-", " ")}</span>
      ),
    },
    {
      key: "hasAcceptedTerms",
      header: "Terms",
      render: (user) => (
        <StatusBadge variant={user.hasAcceptedTerms ? "success" : "warning"}>
          {user.hasAcceptedTerms ? "Accepted" : "Pending"}
        </StatusBadge>
      ),
    },
    {
      key: "lastLoginAt",
      header: "Last Login",
      sortable: true,
      render: (user) =>
        user.lastLoginAt
          ? new Date(user.lastLoginAt).toLocaleDateString()
          : "Never",
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenDialog(user)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Invite
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Permissions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeleteUser(user.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["superadmin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb items={[{ label: "User Management" }]} />
            <h1 className="mt-2 text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage admin accounts and permissions
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Super Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "superadmin").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Election Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "electionadmin").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter((u) => !u.hasAcceptedTerms).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Click on a user to view their details and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={users}
              columns={columns}
              keyField="id"
              searchable
              searchPlaceholder="Search users..."
              searchFields={["name", "email"]}
              emptyMessage="No users found."
            />
          </CardContent>
        </Card>

        {/* User Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update user details and role"
                  : "Create a new admin account"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as AdminRole })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="electionadmin">
                      Election Admin
                    </SelectItem>
                    <SelectItem value="partyadmin">Party Admin</SelectItem>
                    <SelectItem value="candidate">Candidate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>
                  {editingUser ? "Save Changes" : "Create User"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
