export interface PositionalMetric {
  metricName: string;
  squadAverage: number;
  percentile90: number;
  unit: string;
}

export interface LeaderboardEntry {
  rank: number;
  athleteId: string;
  athleteName: string;
  value: number;
}

export interface PositionalBenchmark {
  position: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  metrics: PositionalMetric[];
  leaderboards: {
    metricName: string;
    entries: LeaderboardEntry[];
  }[];
}

export const mockBenchmarks: PositionalBenchmark[] = [
  {
    position: 'Forward',
    metrics: [
      {
        metricName: 'Total Distance per Session',
        squadAverage: 6800,
        percentile90: 8200,
        unit: 'meters'
      },
      {
        metricName: 'High-Speed Running Distance (>5.5 m/s)',
        squadAverage: 950,
        percentile90: 1400,
        unit: 'meters'
      },
      {
        metricName: 'Max Sprint Speed',
        squadAverage: 8.3,
        percentile90: 9.0,
        unit: 'm/s'
      },
      {
        metricName: 'Sprints per Session',
        squadAverage: 12,
        percentile90: 18,
        unit: 'sprints'
      }
    ],
    leaderboards: [
      {
        metricName: 'Max Sprint Speed',
        entries: [
          { rank: 1, athleteId: '8', athleteName: 'Son Heung-min', value: 8.6 },
          { rank: 2, athleteId: '1', athleteName: 'Marcus Vane', value: 8.5 },
          { rank: 3, athleteId: '4', athleteName: 'Christian Benteke', value: 5.2 }
        ]
      },
      {
        metricName: 'Sprints per Session',
        entries: [
          { rank: 1, athleteId: '8', athleteName: 'Son Heung-min', value: 18 },
          { rank: 2, athleteId: '1', athleteName: 'Marcus Vane', value: 14 },
          { rank: 3, athleteId: '4', athleteName: 'Christian Benteke', value: 2 }
        ]
      }
    ]
  },
  {
    position: 'Midfielder',
    metrics: [
      {
        metricName: 'Total Distance per Session',
        squadAverage: 9200,
        percentile90: 11000,
        unit: 'meters'
      },
      {
        metricName: 'High-Speed Running Distance (>5.5 m/s)',
        squadAverage: 1100,
        percentile90: 1500,
        unit: 'meters'
      },
      {
        metricName: 'Max Sprint Speed',
        squadAverage: 7.6,
        percentile90: 8.2,
        unit: 'm/s'
      },
      {
        metricName: 'Workload Index',
        squadAverage: 85,
        percentile90: 98,
        unit: 'index'
      }
    ],
    leaderboards: [
      {
        metricName: 'Total Distance per Session',
        entries: [
          { rank: 1, athleteId: '5', athleteName: 'Declan Rice', value: 9100 },
          { rank: 2, athleteId: '2', athleteName: 'Lucas Sterling', value: 8200 }
        ]
      },
      {
        metricName: 'Workload Index',
        entries: [
          { rank: 1, athleteId: '2', athleteName: 'Lucas Sterling', value: 96 },
          { rank: 2, athleteId: '5', athleteName: 'Declan Rice', value: 88 }
        ]
      }
    ]
  },
  {
    position: 'Defender',
    metrics: [
      {
        metricName: 'Total Distance per Session',
        squadAverage: 6200,
        percentile90: 7500,
        unit: 'meters'
      },
      {
        metricName: 'High-Speed Running Distance (>5.5 m/s)',
        squadAverage: 650,
        percentile90: 950,
        unit: 'meters'
      },
      {
        metricName: 'Max Sprint Speed',
        squadAverage: 8.0,
        percentile90: 8.7,
        unit: 'm/s'
      },
      {
        metricName: 'Sprints per Session',
        squadAverage: 8,
        percentile90: 12,
        unit: 'sprints'
      }
    ],
    leaderboards: [
      {
        metricName: 'Max Sprint Speed',
        entries: [
          { rank: 1, athleteId: '6', athleteName: 'Virgil van Dijk', value: 8.3 },
          { rank: 2, athleteId: '3', athleteName: 'Trent Alexander', value: 8.1 }
        ]
      },
      {
        metricName: 'Sprints per Session',
        entries: [
          { rank: 1, athleteId: '3', athleteName: 'Trent Alexander', value: 11 },
          { rank: 2, athleteId: '6', athleteName: 'Virgil van Dijk', value: 9 }
        ]
      }
    ]
  },
  {
    position: 'Goalkeeper',
    metrics: [
      {
        metricName: 'Total Distance per Session',
        squadAverage: 2300,
        percentile90: 3100,
        unit: 'meters'
      },
      {
        metricName: 'High-Speed Running Distance (>5.5 m/s)',
        squadAverage: 120,
        percentile90: 250,
        unit: 'meters'
      },
      {
        metricName: 'Max Sprint Speed',
        squadAverage: 5.8,
        percentile90: 6.5,
        unit: 'm/s'
      },
      {
        metricName: 'Workload Index',
        squadAverage: 30,
        percentile90: 45,
        unit: 'index'
      }
    ],
    leaderboards: [
      {
        metricName: 'Total Distance per Session',
        entries: [
          { rank: 1, athleteId: '7', athleteName: 'Alisson Becker', value: 2100 }
        ]
      },
      {
        metricName: 'Max Sprint Speed',
        entries: [
          { rank: 1, athleteId: '7', athleteName: 'Alisson Becker', value: 6.1 }
        ]
      }
    ]
  }
];

