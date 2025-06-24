/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { DetailField } from '../atoms/DetailField';
import { LogSection } from './LogSection';
import { CookiesSection } from './CookiesSection';
import { formatData } from '../../utils/networkUtils';

interface LogDetailsPanelProps {
  log: NetVisionLog | null;
}

export const LogDetailsPanel = ({ log }: LogDetailsPanelProps): VNode => {
  if (!log) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-all">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 text-gray-300 dark:text-gray-600"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <p className="text-lg">Select a request to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-4 space-y-4 mobile-no-scroll-x force-wrap">
      {/* Summary Section */}
      <div className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30 transition-all duration-300 ease-out animate-fade-in">
        <div className="flex flex-wrap gap-4 mb-2 mobile-flex-wrap">
          <DetailField label="URL" value={log.url} />
          {log.error && <DetailField label="Local Error" value={log.error} />}
          <DetailField label="Method" value={log.method} />
          <DetailField label="Status" value={String(log.status)} />
          <DetailField label="Duration" value={`${log.duration}ms`} />
          <DetailField
            label="Timestamp"
            value={new Date(log.timestamp).toLocaleString()}
          />
        </div>
      </div>

      {/* Request and Response Sections */}
      <div className="@container">
        <div className="flex flex-col @lg:flex-row w-full gap-4 responsive-flex-container mobile-flex-wrap items-stretch @lg:items-start">
          <LogSection
            title="Request"
            headers={log.requestHeaders || {}}
            body={log.requestBody ? formatData(log.requestBody) : undefined}
            className="flex-1 min-w-0 w-full"
          />

          <LogSection
            title="Response"
            headers={log.responseHeaders || {}}
            body={log.responseBody ? formatData(log.responseBody) : undefined}
            className="flex-1 min-w-0 w-full"
          />
        </div>
      </div>

      {/* Cookies Section */}
      {log.cookies && (
        <CookiesSection
          requestCookies={log.cookies.request}
          responseCookies={log.cookies.response}
        />
      )}
    </div>
  );
};
