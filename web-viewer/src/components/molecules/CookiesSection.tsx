/** @jsxImportSource preact */
import { VNode } from 'preact';
import { CollapsibleSection } from './CollapsibleSection';
import { DetailField } from '../atoms/DetailField';

interface CookiesSectionProps {
  requestCookies?: string[];
  responseCookies?: string[];
  className?: string;
}

export const CookiesSection = ({
  requestCookies,
  responseCookies,
  className = '',
}: CookiesSectionProps): VNode => {
  const formatRequestCookies = (cookies?: string[]): string => {
    if (!cookies || cookies.length === 0) return 'No cookies';

    // Request cookies (Cookie header) are typically sent as "name1=value1; name2=value2"
    // If we receive an array, join them with '; '
    return cookies.join('; ');
  };

  const formatResponseCookies = (cookies?: string[]): string => {
    if (!cookies || cookies.length === 0) return 'No cookies';

    // Response cookies (Set-Cookie header) need special handling
    // We want: cookieName=fullCookieString (including all attributes)
    // NOT: cookieName=value; Path=...; Domain=...; etc.
    return cookies
      .map((cookieString) => {
        // Extract the cookie name (everything before the first '=')
        const firstEqualIndex = cookieString.indexOf('=');
        if (firstEqualIndex === -1) {
          // Malformed cookie, return as-is
          return cookieString.trim();
        }

        const cookieName = cookieString.substring(0, firstEqualIndex).trim();
        const fullCookieValue = cookieString
          .substring(firstEqualIndex + 1)
          .trim();

        // Return in key=value format where value includes ALL attributes
        return `${cookieName}=${fullCookieValue}`;
      })
      .join('\n');
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
              value={formatRequestCookies(requestCookies)}
              isCode
              collapsible
              initialExpanded
              className="flex-1 min-w-0"
            />
          )}
          {responseCookies && (
            <DetailField
              label="Response Cookies"
              value={formatResponseCookies(responseCookies)}
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
