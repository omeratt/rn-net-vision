/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { DetailField, ScrollFadeContainer } from '../atoms';
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
    <ScrollFadeContainer
      className="h-full overflow-y-auto p-4 space-y-4 mobile-no-scroll-x force-wrap"
      fadeHeight={80}
    >
      {/* Summary Section */}
      <div className="bg-white/20 dark:bg-gray-800/30 rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
        {/* URL gets its own full-width row */}
        <div className="mb-4 w-full">
          <DetailField label="URL" value={log.url} className="w-full" />
        </div>

        {/* Other fields in flexible layout */}
        <div className="flex flex-wrap gap-4 mb-2 mobile-flex-wrap">
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

          {(() => {
            const responseBody = log.responseBody
              ? formatData(log.responseBody)
              : undefined;
            const isImageUrl =
              /\.(?:png|jpe?g|gif|webp|bmp|avif|ico)(?:[?#].*)?$/i.test(
                log.url
              );
            // If it's an image request, show the URL instead of attempting to render/parse binary
            const bodyForDisplay = isImageUrl ? log.url : responseBody;
            return (
              <LogSection
                title="Response"
                headers={log.responseHeaders || {}}
                body={bodyForDisplay}
                className="flex-1 min-w-0 w-full"
              />
            );
          })()}
        </div>
      </div>

      {/* Cookies Section */}
      {((log.requestHeaders?.Cookie && log.requestHeaders.Cookie.length > 0) ||
        (log.responseHeaders?.['Set-Cookie'] &&
          log.responseHeaders['Set-Cookie'].length > 0)) && (
        <CookiesSection
          requestCookies={log.requestHeaders?.Cookie}
          responseCookies={log.responseHeaders?.['Set-Cookie']}
        />
      )}
    </ScrollFadeContainer>
  );
};
