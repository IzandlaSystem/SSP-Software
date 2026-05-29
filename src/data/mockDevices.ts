export interface TrackerDevice {
  id: string;
  deviceName: string;
  serialNumber: string;
  batteryPercent: number;
  gpsSignalStrength: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'No Signal';
  connectionStatus: 'Connected' | 'Disconnected' | 'Pairing';
  firmwareVersion: string;
  hardwareVersion: string;
  assignedAthleteId: string | null;
  assignedAthleteName: string | null;
}

export const mockDevices: TrackerDevice[] = [
  {
    id: 'd-401',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-9081',
    batteryPercent: 94,
    gpsSignalStrength: 'Excellent',
    connectionStatus: 'Connected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: '1',
    assignedAthleteName: 'Marcus Vane'
  },
  {
    id: 'd-402',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-1082',
    batteryPercent: 88,
    gpsSignalStrength: 'Good',
    connectionStatus: 'Connected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: '2',
    assignedAthleteName: 'Lucas Sterling'
  },
  {
    id: 'd-403',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-4731',
    batteryPercent: 76,
    gpsSignalStrength: 'Excellent',
    connectionStatus: 'Connected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: '3',
    assignedAthleteName: 'Trent Alexander'
  },
  {
    id: 'd-404',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-2894',
    batteryPercent: 12,
    gpsSignalStrength: 'Poor',
    connectionStatus: 'Disconnected',
    firmwareVersion: 'v1.4.0',
    hardwareVersion: 'Rev.A',
    assignedAthleteId: '4',
    assignedAthleteName: 'Christian Benteke'
  },
  {
    id: 'd-405',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-5829',
    batteryPercent: 99,
    gpsSignalStrength: 'Excellent',
    connectionStatus: 'Connected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: '5',
    assignedAthleteName: 'Declan Rice'
  },
  {
    id: 'd-406',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-3048',
    batteryPercent: 82,
    gpsSignalStrength: 'Good',
    connectionStatus: 'Connected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: '6',
    assignedAthleteName: 'Virgil van Dijk'
  },
  {
    id: 'd-407',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-0012',
    batteryPercent: 85,
    gpsSignalStrength: 'Excellent',
    connectionStatus: 'Connected',
    firmwareVersion: 'v1.4.1',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: '7',
    assignedAthleteName: 'Alisson Becker'
  },
  {
    id: 'd-408',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-8822',
    batteryPercent: 91,
    gpsSignalStrength: 'Good',
    connectionStatus: 'Connected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: '8',
    assignedAthleteName: 'Son Heung-min'
  },
  {
    id: 'd-451',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-9901',
    batteryPercent: 100,
    gpsSignalStrength: 'No Signal',
    connectionStatus: 'Disconnected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: null,
    assignedAthleteName: null
  },
  {
    id: 'd-452',
    deviceName: 'SSP Tracker V2',
    serialNumber: 'SSP-V2-9902',
    batteryPercent: 45,
    gpsSignalStrength: 'No Signal',
    connectionStatus: 'Disconnected',
    firmwareVersion: 'v1.4.2',
    hardwareVersion: 'Rev.B',
    assignedAthleteId: null,
    assignedAthleteName: null
  }
];

