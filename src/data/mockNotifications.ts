export interface Notification {
  id: string;
  recipientRole: 'Coach' | 'Athlete';
  recipientId: string | null; // Athlete player ID, or null for Coach
  type: 'Warning' | 'Info' | 'Success' | 'ActionRequired';
  title: string;
  message: string;
  timestamp: string; // ISO 8601 string
  read: boolean;
}

export const mockNotifications: Notification[] = [
  // Coach Notifications
  {
    id: 'n-301',
    recipientRole: 'Coach',
    recipientId: null,
    type: 'Warning',
    title: 'High Workload Threshold Exceeded',
    message: 'Lucas Sterling (Squad #8) has surpassed the optimal workload threshold with an ACWR of 1.62. Suggest restricted training loading for tomorrow.',
    timestamp: '2026-05-25T17:30:00Z',
    read: false
  },
  {
    id: 'n-302',
    recipientRole: 'Coach',
    recipientId: null,
    type: 'Warning',
    title: 'High Workload Threshold Exceeded',
    message: 'Son Heung-min (Squad #7) has entered high-load strain zone (ACWR: 1.58). workload strain threshold exceeded.',
    timestamp: '2026-05-25T17:35:00Z',
    read: false
  },
  {
    id: 'n-303',
    recipientRole: 'Coach',
    recipientId: null,
    type: 'Success',
    title: 'Goal Achieved: Sprint Target',
    message: 'The squad has achieved 100% of the Weekly Sprint Accumulation target ahead of schedule!',
    timestamp: '2026-05-25T17:00:00Z',
    read: true
  },
  {
    id: 'n-304',
    recipientRole: 'Coach',
    recipientId: null,
    type: 'Info',
    title: 'Device Station Check',
    message: 'field-side Base Station has completed auto-calibration for all 8 active vests. Signal metrics are nominal.',
    timestamp: '2026-05-25T09:00:00Z',
    read: true
  },
  {
    id: 'n-305',
    recipientRole: 'Coach',
    recipientId: null,
    type: 'ActionRequired',
    title: 'session preparation Outstanding',
    message: 'Christian Benteke and Virgil van Dijk have not submitted morning availability logs. Remote prompt dispatched.',
    timestamp: '2026-05-26T08:15:00Z',
    read: false
  },
  // Athlete Notifications
  // Marcus Vane (id: '1')
  {
    id: 'n-306',
    recipientRole: 'Athlete',
    recipientId: '1',
    type: 'Success',
    title: 'Session Upload Completed',
    message: 'Your sessional tracking data from today has been synced. 6,800m total distance and 14 high-intensity sprints registered.',
    timestamp: '2026-05-25T17:45:00Z',
    read: true
  },
  // Lucas Sterling (id: '2')
  {
    id: 'n-307',
    recipientRole: 'Athlete',
    recipientId: '2',
    type: 'Warning',
    title: 'High Workload Guidance Alert',
    message: 'Your Workload Index has reached 96 (ACWR: 1.62). High workload detected. Please report to the performance trainer for workload recovery session.',
    timestamp: '2026-05-25T17:40:00Z',
    read: false
  },
  // Son Heung-min (id: '8')
  {
    id: 'n-308',
    recipientRole: 'Athlete',
    recipientId: '8',
    type: 'Warning',
    title: 'High Workload Guidance Alert',
    message: 'High cumulative workload loading detected (ACWR: 1.58). Expect structured loading caps in tomorrow\'s training block.',
    timestamp: '2026-05-25T17:42:00Z',
    read: false
  },
  // Christian Benteke (id: '4')
  {
    id: 'n-309',
    recipientRole: 'Athlete',
    recipientId: '4',
    type: 'Info',
    title: 'Active Recovery Protocol Assigned',
    message: 'Your current availability is Restricted. The coach has assigned a low-intensity active recovery plan. Sprint cap set to 3 max.',
    timestamp: '2026-05-25T08:30:00Z',
    read: true
  },
  // Virgil van Dijk (id: '6')
  {
    id: 'n-310',
    recipientRole: 'Athlete',
    recipientId: '6',
    type: 'ActionRequired',
    title: 'Morning availability Log Required',
    message: 'Please complete your subjective workload status and training load balance indicator prior to pre-training activation.',
    timestamp: '2026-05-26T07:30:00Z',
    read: false
  }
];

