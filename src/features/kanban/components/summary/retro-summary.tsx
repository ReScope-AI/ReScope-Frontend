'use client';

import SummaryOverview from './summary-overview';

export default function RetroSummary() {
  return (
    <div className='h-screen overflow-y-auto p-6'>
      <div className='mb-32 space-y-8'>
        <SummaryOverview />
      </div>
    </div>
  );
}
