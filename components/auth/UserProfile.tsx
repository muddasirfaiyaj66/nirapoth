"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Edit,
  Save,
  X,
  Camera,
  Mail,
  Phone,
  CreditCard,
  FileText,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react"
import { useFileUpload } from "@/lib/cloudinary/upload"

interface UserProfileProps {
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
}

export function UserProfile({ onEdit, onSave, onCancel }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nidNo: "",
    birthCertificateNo: "",
    profileImage: "",
  })

  const { user, getCurrentUser, logout } = useAuth()
  const { uploadFile } = useFileUpload()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        nidNo: user.nidNo || "",
        birthCertificateNo: user.birthCertificateNo || "",
        profileImage: user.profileImage || "",
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
    onEdit?.()
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Here you would implement the profile update API call
      // const result = await updateProfile(profileData);
      // if (result.success) {
      setIsEditing(false)
      onSave?.()
      // }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        nidNo: user.nidNo || "",
        birthCertificateNo: user.birthCertificateNo || "",
        profileImage: user.profileImage || "",
      })
    }
    setIsEditing(false)
    onCancel?.()
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const result = await uploadFile(file, {
        folder: "profile-images",
        transformation: { width: 200, height: 200, crop: "fill" },
      })
      setProfileData((prev) => ({ ...prev, profileImage: result.url }))
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      router.push("/login")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardContent className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-border/50 shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#398A58] to-[#1A3335]" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12">
              {/* Avatar Section */}
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-primary/20">
                  <AvatarImage src={profileData.profileImage || "/placeholder.svg"} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#398A58] to-[#1A3335] text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => document.getElementById("profile-image-upload")?.click()}
                      disabled={isLoading}
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left space-y-2 sm:mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Badge
                    variant="secondary"
                    className="capitalize text-sm px-3 py-1 bg-[#398A58]/10 text-[#398A58] border-[#398A58]/20"
                  >
                    {user.role.toLowerCase().replace("_", " ")}
                  </Badge>
                  <Badge
                    variant={user.isEmailVerified ? "default" : "destructive"}
                    className="text-sm px-3 py-1 flex items-center gap-1"
                  >
                    {user.isEmailVerified ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:mb-2">
                {!isEditing ? (
                  <Button onClick={handleEdit} className="bg-[#398A58] hover:bg-[#2d6e45] text-white shadow-md">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-[#398A58] hover:bg-[#2d6e45] text-white shadow-md"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="shadow-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
              <CardDescription>How we can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input id="email" type="email" value={profileData.email} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Identity Documents */}
          <Card className="border-border/50 shadow-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Identity Documents</CardTitle>
              <CardDescription>Your official identification numbers</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nidNo" className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  NID Number
                </Label>
                <Input
                  id="nidNo"
                  value={profileData.nidNo}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, nidNo: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                  placeholder="Enter your NID number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthCertificateNo" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Birth Certificate Number
                </Label>
                <Input
                  id="birthCertificateNo"
                  value={profileData.birthCertificateNo}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      birthCertificateNo: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                  placeholder="Enter your birth certificate number"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <p className="text-sm text-muted-foreground">Manage your account session</p>
              </div>
              <Button onClick={handleLogout} variant="destructive" className="shadow-md">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
