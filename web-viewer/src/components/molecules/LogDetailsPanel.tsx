/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { DetailField } from '../atoms/DetailField';
import { formatData } from '../../utils/networkUtils';

interface LogDetailsPanelProps {
  log: NetVisionLog | null;
}

export const LogDetailsPanel = ({ log }: LogDetailsPanelProps): VNode => {
  if (!log) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a request to view details
      </div>
    );
  }

  const formatHeaders = (headers: Record<string, string[]>): string => {
    if (!headers) return 'No headers';

    return Object.entries(headers)
      .map(([key, values]) => {
        console.log(key, values);
        return `${key}: ${values?.join?.(', ')}`;
      })
      ?.join('\n');
  };

  const formatCookies = (cookies?: Record<string, string>): string => {
    if (!cookies) return 'No cookies';
    return Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      ?.join('\n');
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-white dark:bg-gray-800">
      <DetailField label="URL" value={log.url} />
      <DetailField label="Method" value={log.method} />
      <DetailField label="Status" value={String(log.status)} />
      <DetailField label="Duration" value={`${log.duration}ms`} />

      <DetailField
        label="Request Headers"
        value={formatHeaders(log.requestHeaders)}
        isCode
      />

      {log.requestBody && (
        <DetailField
          label="Request Body"
          value={formatData(log.requestBody)}
          isCode
        />
      )}

      <DetailField
        label="Response Headers"
        value={formatHeaders(log.responseHeaders)}
        isCode
      />

      {log.responseBody && (
        <DetailField
          label="Response Body"
          value={formatData(log.responseBody)}
          isCode
        />
      )}

      {log.cookies && (
        <>
          {log.cookies.request && (
            <DetailField
              label="Request Cookies"
              value={formatCookies(log.cookies.request)}
              isCode
            />
          )}
          {log.cookies.response && (
            <DetailField
              label="Response Cookies"
              value={formatCookies(log.cookies.response)}
              isCode
            />
          )}
        </>
      )}
    </div>
  );
};
