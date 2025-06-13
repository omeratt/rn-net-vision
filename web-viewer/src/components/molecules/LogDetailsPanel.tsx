/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { DetailField } from '../atoms/DetailField';
import { CopyButton } from '../atoms/CopyButton';
import { useToast } from '../../context/ToastContext';
import { formatData } from '../../utils/networkUtils';

interface LogDetailsPanelProps {
  log: NetVisionLog | null;
}

export const LogDetailsPanel = ({ log }: LogDetailsPanelProps): VNode => {
  const { showToast } = useToast();

  const formatHeaders = (headers: Record<string, string[]>): string => {
    if (!headers) return 'No headers';

    return Object.entries(headers)
      .map(([key, values]) => {
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

  const getRequestSectionContent = (): string => {
    const headers = formatHeaders(log?.requestHeaders || {});
    const body = log?.requestBody ? formatData(log.requestBody) : '';
    return `Headers:\n${headers}${body ? `\n\nBody:\n${body}` : ''}`;
  };

  const getResponseSectionContent = (): string => {
    const headers = formatHeaders(log?.responseHeaders || {});
    const body = log?.responseBody ? formatData(log.responseBody) : '';
    return `Headers:\n${headers}${body ? `\n\nBody:\n${body}` : ''}`;
  };

  const getCookiesSectionContent = (): string => {
    const requestCookies = log?.cookies?.request
      ? formatCookies(log.cookies.request)
      : '';
    const responseCookies = log?.cookies?.response
      ? formatCookies(log.cookies.response)
      : '';

    let content = '';
    if (requestCookies) content += `Request Cookies:\n${requestCookies}`;
    if (responseCookies) {
      if (content) content += '\n\n';
      content += `Response Cookies:\n${responseCookies}`;
    }
    return content || 'No cookies';
  };

  const handleSectionCopy = (sectionName: string, _content: string) => {
    showToast(`${sectionName} section copied to clipboard!`, 'success', 2500);
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
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

      <div className="@container">
        <div className="flex flex-col @lg:flex-row w-full gap-4 responsive-flex-container mobile-flex-wrap">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-md font-medium text-indigo-600 dark:text-indigo-400">
                Request
              </h3>
              <CopyButton
                text={getRequestSectionContent()}
                onCopy={() =>
                  handleSectionCopy('Request', getRequestSectionContent())
                }
                size="md"
                variant="section"
              />
            </div>
            <DetailField
              label="Headers"
              value={formatHeaders(log.requestHeaders)}
              isCode
            />

            {log.requestBody && (
              <DetailField
                label="Body"
                value={formatData(log.requestBody)}
                isCode
              />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-md font-medium text-indigo-600 dark:text-indigo-400">
                Response
              </h3>
              <CopyButton
                text={getResponseSectionContent()}
                onCopy={() =>
                  handleSectionCopy('Response', getResponseSectionContent())
                }
                size="md"
                variant="section"
              />
            </div>
            <DetailField
              label="Headers"
              value={formatHeaders(log.responseHeaders)}
              isCode
            />

            {log.responseBody && (
              <DetailField
                label="Body"
                value={formatData(log.responseBody)}
                isCode
              />
            )}
          </div>
        </div>
      </div>

      {log.cookies && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-md font-medium text-indigo-600 dark:text-indigo-400">
              Cookies
            </h3>
            <CopyButton
              text={getCookiesSectionContent()}
              onCopy={() =>
                handleSectionCopy('Cookies', getCookiesSectionContent())
              }
              size="md"
              variant="section"
            />
          </div>
          <div className="@container">
            <div className="flex flex-col @lg:flex-row gap-4">
              {log.cookies.request && (
                <DetailField
                  label="Request Cookies"
                  value={formatCookies(log.cookies.request)}
                  isCode
                  className="flex-1 min-w-0"
                />
              )}
              {log.cookies.response && (
                <DetailField
                  label="Response Cookies"
                  value={formatCookies(log.cookies.response)}
                  isCode
                  className="flex-1 min-w-0"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
