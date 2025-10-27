export type Driver = {
  id: string;
  name: string;
  vehicleModel: string;
  licensePlate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  rating: number;
  rides: number;
};

export type Taxi = {
  id: string;
  driverName: string;
  vehicleModel: string;
  licensePlate: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  rating: number;
  ridesToday: number;
};
