export interface Player {
  id: string;
  name: string;
  position: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  squadNumber: number;
  status: 'Ready' | 'Recovery' | 'High Load';
  distance: number; // meters
  currentSpeed: number; // m/s
  maxSpeed: number; // m/s
  sprintCount: number; // sprints above 5.5 m/s
  workload: number; // workload index
  availabilityStatus: 'Optimal' | 'Adaptive' | 'Restricted';
  acwr: number; // Acute:Chronic Workload Ratio
  lastSession: string; // date YYYY-MM-DD
  targetProgress: number; // percentage
}

export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Marcus Vane',
    position: 'Forward',
    squadNumber: 9,
    status: 'Ready',
    distance: 6800,
    currentSpeed: 5.8,
    maxSpeed: 8.5,
    sprintCount: 14,
    workload: 85,
    availabilityStatus: 'Optimal',
    acwr: 1.15,
    lastSession: '2026-05-25',
    targetProgress: 78,
  },
  {
    id: '2',
    name: 'Lucas Sterling',
    position: 'Midfielder',
    squadNumber: 8,
    status: 'High Load',
    distance: 8200,
    currentSpeed: 4.2,
    maxSpeed: 7.9,
    sprintCount: 8,
    workload: 96,
    availabilityStatus: 'Restricted',
    acwr: 1.62,
    lastSession: '2026-05-25',
    targetProgress: 92,
  },
  {
    id: '3',
    name: 'Trent Alexander',
    position: 'Defender',
    squadNumber: 65,
    status: 'Ready',
    distance: 5900,
    currentSpeed: 5.1,
    maxSpeed: 8.1,
    sprintCount: 11,
    workload: 70,
    availabilityStatus: 'Optimal',
    acwr: 0.98,
    lastSession: '2026-05-25',
    targetProgress: 65,
  },
  {
    id: '4',
    name: 'Christian Benteke',
    position: 'Forward',
    squadNumber: 11,
    status: 'Recovery',
    distance: 3100,
    currentSpeed: 2.5,
    maxSpeed: 5.2,
    sprintCount: 2,
    workload: 40,
    availabilityStatus: 'Restricted',
    acwr: 0.65,
    lastSession: '2026-05-24',
    targetProgress: 35,
  },
  {
    id: '5',
    name: 'Declan Rice',
    position: 'Midfielder',
    squadNumber: 41,
    status: 'Ready',
    distance: 9100,
    currentSpeed: 4.8,
    maxSpeed: 7.8,
    sprintCount: 15,
    workload: 88,
    availabilityStatus: 'Optimal',
    acwr: 1.20,
    lastSession: '2026-05-25',
    targetProgress: 85,
  },
  {
    id: '6',
    name: 'Virgil van Dijk',
    position: 'Defender',
    squadNumber: 4,
    status: 'Ready',
    distance: 5400,
    currentSpeed: 5.0,
    maxSpeed: 8.3,
    sprintCount: 9,
    workload: 68,
    availabilityStatus: 'Adaptive',
    acwr: 1.05,
    lastSession: '2026-05-25',
    targetProgress: 60,
  },
  {
    id: '7',
    name: 'Alisson Becker',
    position: 'Goalkeeper',
    squadNumber: 1,
    status: 'Ready',
    distance: 2100,
    currentSpeed: 1.2,
    maxSpeed: 6.1,
    sprintCount: 1,
    workload: 30,
    availabilityStatus: 'Optimal',
    acwr: 0.85,
    lastSession: '2026-05-25',
    targetProgress: 50,
  },
  {
    id: '8',
    name: 'Son Heung-min',
    position: 'Forward',
    squadNumber: 7,
    status: 'High Load',
    distance: 7500,
    currentSpeed: 5.5,
    maxSpeed: 8.6,
    sprintCount: 18,
    workload: 95,
    availabilityStatus: 'Restricted',
    acwr: 1.58,
    lastSession: '2026-05-25',
    targetProgress: 90,
  }
];

