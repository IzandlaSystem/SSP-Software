export interface Drill {
  drillName: string;
  durationMinutes: number;
  targetDistanceMeters: number;
  targetMaxSpeedMps: number;
}

export interface SessionAthleteMetric {
  athleteId: string;
  athleteName: string;
  distanceMeters: number;
  maxSpeedMps: number;
  sprintCount: number;
  workloadIndex: number; // workload index
  acwr: number; // Acute:Chronic Workload Ratio
}

export interface Session {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  totalDistanceMeters: number;
  intensityScore: number; // workload scale (0-100)
  type: 'training' | 'Conditioning' | 'Match Play' | 'Recovery';
  drills: Drill[];
  athleteMetrics: SessionAthleteMetric[];
}

export const mockSessions: Session[] = [
  {
    id: 's-101',
    title: 'Matchday Prep & Transition Rondo',
    date: '2026-05-25',
    durationMinutes: 75,
    totalDistanceMeters: 49000,
    intensityScore: 82,
    type: 'training',
    drills: [
      {
        drillName: 'Dynamic Warmup & Mobility',
        durationMinutes: 15,
        targetDistanceMeters: 800,
        targetMaxSpeedMps: 4.5
      },
      {
        drillName: '6v3 High-Speed Counter-Pressing Rondo',
        durationMinutes: 25,
        targetDistanceMeters: 2200,
        targetMaxSpeedMps: 6.8
      },
      {
        drillName: '11v11 Attacking Phase Build-up',
        durationMinutes: 35,
        targetDistanceMeters: 3500,
        targetMaxSpeedMps: 8.5
      }
    ],
    athleteMetrics: [
      {
        athleteId: '1',
        athleteName: 'Marcus Vane',
        distanceMeters: 6800,
        maxSpeedMps: 8.5,
        sprintCount: 14,
        workloadIndex: 85,
        acwr: 1.15
      },
      {
        athleteId: '2',
        athleteName: 'Lucas Sterling',
        distanceMeters: 8200,
        maxSpeedMps: 7.9,
        sprintCount: 8,
        workloadIndex: 96,
        acwr: 1.62
      },
      {
        athleteId: '3',
        athleteName: 'Trent Alexander',
        distanceMeters: 5900,
        maxSpeedMps: 8.1,
        sprintCount: 11,
        workloadIndex: 70,
        acwr: 0.98
      },
      {
        athleteId: '5',
        athleteName: 'Declan Rice',
        distanceMeters: 9100,
        maxSpeedMps: 7.8,
        sprintCount: 15,
        workloadIndex: 88,
        acwr: 1.20
      },
      {
        athleteId: '6',
        athleteName: 'Virgil van Dijk',
        distanceMeters: 5400,
        maxSpeedMps: 8.3,
        sprintCount: 9,
        workloadIndex: 68,
        acwr: 1.05
      },
      {
        athleteId: '7',
        athleteName: 'Alisson Becker',
        distanceMeters: 2100,
        maxSpeedMps: 6.1,
        sprintCount: 1,
        workloadIndex: 30,
        acwr: 0.85
      },
      {
        athleteId: '8',
        athleteName: 'Son Heung-min',
        distanceMeters: 7500,
        maxSpeedMps: 8.6,
        sprintCount: 18,
        workloadIndex: 95,
        acwr: 1.58
      }
    ]
  },
  {
    id: 's-102',
    title: 'High-Velocity Conditioning Block',
    date: '2026-05-24',
    durationMinutes: 90,
    totalDistanceMeters: 54500,
    intensityScore: 90,
    type: 'Conditioning',
    drills: [
      {
        drillName: 'Activated Plyometric Hurdles',
        durationMinutes: 20,
        targetDistanceMeters: 1000,
        targetMaxSpeedMps: 5.2
      },
      {
        drillName: 'Linear High-speed Repeats',
        durationMinutes: 30,
        targetDistanceMeters: 2500,
        targetMaxSpeedMps: 8.8
      },
      {
        drillName: 'Large-Sided Possessions (8v8)',
        durationMinutes: 40,
        targetDistanceMeters: 4200,
        targetMaxSpeedMps: 7.5
      }
    ],
    athleteMetrics: [
      {
        athleteId: '1',
        athleteName: 'Marcus Vane',
        distanceMeters: 7500,
        maxSpeedMps: 8.8,
        sprintCount: 19,
        workloadIndex: 92,
        acwr: 1.10
      },
      {
        athleteId: '2',
        athleteName: 'Lucas Sterling',
        distanceMeters: 8900,
        maxSpeedMps: 8.0,
        sprintCount: 12,
        workloadIndex: 99,
        acwr: 1.55
      },
      {
        athleteId: '3',
        athleteName: 'Trent Alexander',
        distanceMeters: 6400,
        maxSpeedMps: 8.2,
        sprintCount: 14,
        workloadIndex: 78,
        acwr: 0.95
      },
      {
        athleteId: '4',
        athleteName: 'Christian Benteke',
        distanceMeters: 3100,
        maxSpeedMps: 5.2,
        sprintCount: 2,
        workloadIndex: 40,
        acwr: 0.65
      },
      {
        athleteId: '5',
        athleteName: 'Declan Rice',
        distanceMeters: 9600,
        maxSpeedMps: 7.9,
        sprintCount: 17,
        workloadIndex: 90,
        acwr: 1.18
      },
      {
        athleteId: '6',
        athleteName: 'Virgil van Dijk',
        distanceMeters: 5850,
        maxSpeedMps: 8.4,
        sprintCount: 10,
        workloadIndex: 74,
        acwr: 1.02
      },
      {
        athleteId: '7',
        athleteName: 'Alisson Becker',
        distanceMeters: 2300,
        maxSpeedMps: 5.8,
        sprintCount: 0,
        workloadIndex: 28,
        acwr: 0.88
      },
      {
        athleteId: '8',
        athleteName: 'Son Heung-min',
        distanceMeters: 8150,
        maxSpeedMps: 8.9,
        sprintCount: 22,
        workloadIndex: 98,
        acwr: 1.50
      }
    ]
  },
  {
    id: 's-103',
    title: 'Low-Strain Recovery & training Positioning',
    date: '2026-05-22',
    durationMinutes: 60,
    totalDistanceMeters: 33000,
    intensityScore: 45,
    type: 'Recovery',
    drills: [
      {
        drillName: 'Low-Velocity Warmup Run',
        durationMinutes: 15,
        targetDistanceMeters: 1200,
        targetMaxSpeedMps: 3.8
      },
      {
        drillName: 'Shadow Play & training Walks',
        durationMinutes: 30,
        targetDistanceMeters: 2000,
        targetMaxSpeedMps: 4.2
      },
      {
        drillName: 'Aerobic Cool-down Protocol',
        durationMinutes: 15,
        targetDistanceMeters: 1000,
        targetMaxSpeedMps: 3.5
      }
    ],
    athleteMetrics: [
      {
        athleteId: '1',
        athleteName: 'Marcus Vane',
        distanceMeters: 4200,
        maxSpeedMps: 4.5,
        sprintCount: 0,
        workloadIndex: 42,
        acwr: 1.02
      },
      {
        athleteId: '2',
        athleteName: 'Lucas Sterling',
        distanceMeters: 4500,
        maxSpeedMps: 4.1,
        sprintCount: 0,
        workloadIndex: 48,
        acwr: 1.42
      },
      {
        athleteId: '3',
        athleteName: 'Trent Alexander',
        distanceMeters: 4100,
        maxSpeedMps: 4.6,
        sprintCount: 0,
        workloadIndex: 40,
        acwr: 0.90
      },
      {
        athleteId: '4',
        athleteName: 'Christian Benteke',
        distanceMeters: 3900,
        maxSpeedMps: 4.0,
        sprintCount: 0,
        workloadIndex: 38,
        acwr: 0.70
      },
      {
        athleteId: '5',
        athleteName: 'Declan Rice',
        distanceMeters: 4800,
        maxSpeedMps: 4.3,
        sprintCount: 0,
        workloadIndex: 50,
        acwr: 1.12
      },
      {
        athleteId: '6',
        athleteName: 'Virgil van Dijk',
        distanceMeters: 4000,
        maxSpeedMps: 4.2,
        sprintCount: 0,
        workloadIndex: 41,
        acwr: 0.98
      },
      {
        athleteId: '7',
        athleteName: 'Alisson Becker',
        distanceMeters: 1500,
        maxSpeedMps: 3.2,
        sprintCount: 0,
        workloadIndex: 20,
        acwr: 0.82
      },
      {
        athleteId: '8',
        athleteName: 'Son Heung-min',
        distanceMeters: 4300,
        maxSpeedMps: 4.8,
        sprintCount: 1,
        workloadIndex: 45,
        acwr: 1.39
      }
    ]
  },
  {
    id: 's-104',
    title: 'Full Squad training Simulation Match',
    date: '2026-05-20',
    durationMinutes: 100,
    totalDistanceMeters: 62000,
    intensityScore: 88,
    type: 'Match Play',
    drills: [
      {
        drillName: 'Pre-Match Activation Routines',
        durationMinutes: 20,
        targetDistanceMeters: 1200,
        targetMaxSpeedMps: 5.5
      },
      {
        drillName: 'training Practice Match (2 x 40 mins)',
        durationMinutes: 80,
        targetDistanceMeters: 7500,
        targetMaxSpeedMps: 9.0
      }
    ],
    athleteMetrics: [
      {
        athleteId: '1',
        athleteName: 'Marcus Vane',
        distanceMeters: 8800,
        maxSpeedMps: 8.9,
        sprintCount: 22,
        workloadIndex: 95,
        acwr: 1.05
      },
      {
        athleteId: '2',
        athleteName: 'Lucas Sterling',
        distanceMeters: 9800,
        maxSpeedMps: 8.2,
        sprintCount: 15,
        workloadIndex: 102,
        acwr: 1.35
      },
      {
        athleteId: '3',
        athleteName: 'Trent Alexander',
        distanceMeters: 8000,
        maxSpeedMps: 8.4,
        sprintCount: 18,
        workloadIndex: 85,
        acwr: 0.88
      },
      {
        athleteId: '4',
        athleteName: 'Christian Benteke',
        distanceMeters: 5500,
        maxSpeedMps: 7.2,
        sprintCount: 6,
        workloadIndex: 65,
        acwr: 0.75
      },
      {
        athleteId: '5',
        athleteName: 'Declan Rice',
        distanceMeters: 10800,
        maxSpeedMps: 8.1,
        sprintCount: 20,
        workloadIndex: 98,
        acwr: 1.10
      },
      {
        athleteId: '6',
        athleteName: 'Virgil van Dijk',
        distanceMeters: 7200,
        maxSpeedMps: 8.5,
        sprintCount: 12,
        workloadIndex: 80,
        acwr: 0.96
      },
      {
        athleteId: '7',
        athleteName: 'Alisson Becker',
        distanceMeters: 3200,
        maxSpeedMps: 6.2,
        sprintCount: 1,
        workloadIndex: 35,
        acwr: 0.80
      },
      {
        athleteId: '8',
        athleteName: 'Son Heung-min',
        distanceMeters: 8900,
        maxSpeedMps: 9.1,
        sprintCount: 25,
        workloadIndex: 97,
        acwr: 1.32
      }
    ]
  }
];

