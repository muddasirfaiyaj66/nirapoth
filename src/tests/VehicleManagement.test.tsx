import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { VehicleManagement } from "../components/vehicles/VehicleManagement";
import authSlice from "../lib/store/slices/authSlice";

// Mock the API
jest.mock("../lib/api/vehicles", () => ({
  vehicleApi: {
    getMyVehicles: jest.fn(),
    addVehicle: jest.fn(),
    updateVehicle: jest.fn(),
    deleteVehicle: jest.fn(),
  },
}));

jest.mock("../lib/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "CITIZEN",
    },
  }),
}));

import { vehicleApi } from "../lib/api/vehicles";

const mockVehicleApi = vehicleApi as jest.Mocked<typeof vehicleApi>;

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: {
          id: "1",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          role: "CITIZEN",
          isActive: true,
          isEmailVerified: true,
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
        },
        tokens: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
        loading: false,
        error: null,
      },
      ...initialState,
    },
  });
};

const mockVehicles = [
  {
    id: "1",
    plateNo: "DHA-1234",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    type: "CAR",
    color: "White",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    plateNo: "DHA-5678",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    type: "CAR",
    color: "Black",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

describe("VehicleManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVehicleApi.getMyVehicles.mockResolvedValue({
      success: true,
      data: mockVehicles,
    });
  });

  it("renders vehicle management component", async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <VehicleManagement />
      </Provider>
    );

    expect(screen.getByText("Vehicle Management")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your registered vehicles")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("DHA-1234")).toBeInTheDocument();
      expect(screen.getByText("DHA-5678")).toBeInTheDocument();
    });
  });

  it("opens add vehicle dialog when add button is clicked", async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <VehicleManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Vehicle")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add Vehicle"));

    expect(screen.getByText("Add New Vehicle")).toBeInTheDocument();
    expect(screen.getByLabelText("Plate Number *")).toBeInTheDocument();
    expect(screen.getByLabelText("Brand *")).toBeInTheDocument();
    expect(screen.getByLabelText("Model *")).toBeInTheDocument();
  });

  it("adds a new vehicle successfully", async () => {
    const store = createMockStore();
    mockVehicleApi.addVehicle.mockResolvedValue({
      success: true,
      data: {
        id: "3",
        plateNo: "DHA-9999",
        brand: "Nissan",
        model: "Altima",
        year: 2022,
        type: "CAR",
        color: "Blue",
        isActive: true,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    });

    render(
      <Provider store={store}>
        <VehicleManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Vehicle")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add Vehicle"));

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Plate Number *"), {
      target: { value: "DHA-9999" },
    });
    fireEvent.change(screen.getByLabelText("Brand *"), {
      target: { value: "Nissan" },
    });
    fireEvent.change(screen.getByLabelText("Model *"), {
      target: { value: "Altima" },
    });
    fireEvent.change(screen.getByLabelText("Year *"), {
      target: { value: "2022" },
    });
    fireEvent.change(screen.getByLabelText("Engine Number *"), {
      target: { value: "ENG123456" },
    });
    fireEvent.change(screen.getByLabelText("Chassis Number *"), {
      target: { value: "CHS123456" },
    });

    fireEvent.click(screen.getByText("Add Vehicle"));

    await waitFor(() => {
      expect(mockVehicleApi.addVehicle).toHaveBeenCalledWith({
        plateNo: "DHA-9999",
        brand: "Nissan",
        model: "Altima",
        year: 2022,
        engineNo: "ENG123456",
        chassisNo: "CHS123456",
        registrationNo: "",
        color: "",
        type: "CAR",
        expiresAt: "",
      });
    });
  });

  it("searches vehicles correctly", async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <VehicleManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("DHA-1234")).toBeInTheDocument();
      expect(screen.getByText("DHA-5678")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search vehicles...");
    fireEvent.change(searchInput, { target: { value: "DHA-1234" } });

    expect(screen.getByText("DHA-1234")).toBeInTheDocument();
    expect(screen.queryByText("DHA-5678")).not.toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    const store = createMockStore();
    mockVehicleApi.getMyVehicles.mockImplementation(
      () => new Promise(() => {})
    ); // Never resolves

    render(
      <Provider store={store}>
        <VehicleManagement />
      </Provider>
    );

    expect(screen.getByText("Loading vehicles...")).toBeInTheDocument();
  });

  it("shows empty state when no vehicles", async () => {
    const store = createMockStore();
    mockVehicleApi.getMyVehicles.mockResolvedValue({
      success: true,
      data: [],
    });

    render(
      <Provider store={store}>
        <VehicleManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("No vehicles found")).toBeInTheDocument();
      expect(
        screen.getByText("You haven't registered any vehicles yet.")
      ).toBeInTheDocument();
    });
  });
});
