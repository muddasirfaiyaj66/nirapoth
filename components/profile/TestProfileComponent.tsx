"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchProfile } from "@/lib/store/slices/profileSlice";

const TestProfileComponent = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.profile);

  useEffect(() => {
    // Fetch profile when component mounts
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchProfile())}>Retry</button>
      </div>
    );
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return (
    <div>
      <h1>Profile Information</h1>
      <div>
        <p>
          <strong>Name:</strong> {profile.firstName} {profile.lastName}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Status:</strong> {profile.isActive ? "Active" : "Inactive"}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone || "Not provided"}
        </p>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px dashed #ccc",
        }}
      >
        <h3>Debug Info</h3>
        <p>Profile ID: {profile.id}</p>
        <p>Loading: {loading ? "Yes" : "No"}</p>
        <p>Error: {error || "None"}</p>
      </div>
    </div>
  );
};

export default TestProfileComponent;
