/** @jsxImportSource preact */
import { VNode } from 'preact';
import { CollapsibleSection } from './CollapsibleSection';
import { DetailField } from '../atoms/DetailField';

interface CookiesSectionProps {
  requestCookies?: Record<string, string>;
  responseCookies?: Record<string, string>;
  className?: string;
}

export const CookiesSection = ({
  requestCookies,
  responseCookies,
  className = '',
}: CookiesSectionProps): VNode => {
  const formatCookies = (cookies?: Record<string, string>): string => {
    if (!cookies) return 'No cookies';
    return Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      ?.join('\n');
  };

  return (
    <CollapsibleSection
      title="Cookies"
      className={className}
      initialCollapsed={false}
    >
      <div className="@container">
        <div className="flex flex-col @lg:flex-row gap-4">
          {requestCookies && (
            <DetailField
              label="Request Cookies"
              value={formatCookies(requestCookies)}
              isCode
              collapsible
              initialExpanded
              className="flex-1 min-w-0"
            />
          )}
          {responseCookies && (
            <DetailField
              label="Response Cookies"
              value={formatCookies(responseCookies)}
              isCode
              collapsible
              initialExpanded
              className="flex-1 min-w-0"
            />
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};
