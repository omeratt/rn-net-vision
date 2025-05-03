import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NetVisionLog {
  type: 'network-log';
  method: string;
  url: string;
  duration: number;
  status: number;
  responseHeaders: Record<string, string[]>;
  requestHeaders: Record<string, string[]>;
  requestBody?: any;
  responseBody?: any;
  cookies?: Record<string, string>;
}

interface Props {
  logs: NetVisionLog[];
}

const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300)
    return 'text-green-500 dark:text-green-400';
  if (status >= 400 && status < 500)
    return 'text-orange-500 dark:text-orange-400';
  if (status >= 500) return 'text-red-500 dark:text-red-400';
  return 'text-gray-500 dark:text-gray-400';
};

const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'text-blue-500 dark:text-blue-400';
    case 'POST':
      return 'text-green-500 dark:text-green-400';
    case 'PUT':
      return 'text-yellow-500 dark:text-yellow-400';
    case 'DELETE':
      return 'text-red-500 dark:text-red-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
};

const LogField = ({
  label,
  data,
  icon,
}: {
  label: string;
  data: any;
  icon: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const stringifiedData =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  return (
    <motion.div
      layout="position"
      className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg" role="img" aria-label={label}>
            {icon}
          </span>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </h3>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <pre className="p-4 text-xs font-mono tracking-wide leading-relaxed text-left overflow-auto bg-gray-50/50 dark:bg-gray-900/50">
              {stringifiedData}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NetworkLogItem = ({ log }: { log: NetVisionLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span
              className={`px-2.5 py-1.5 rounded-md font-mono text-sm font-medium ${getMethodColor(log.method)} bg-gray-100 dark:bg-gray-900`}
            >
              {log.method}
            </span>
            <span className="text-sm font-mono truncate max-w-[40ch] text-gray-600 dark:text-gray-300">
              {log.url}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {log.duration}ms
            </span>
            <span
              className={`px-2 py-1 rounded font-mono text-sm font-medium ${getStatusColor(log.status)}`}
            >
              {log.status}
            </span>
            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-3">
              {log.requestHeaders && (
                <LogField
                  label="Request Headers"
                  data={log.requestHeaders}
                  icon="📨"
                />
              )}
              {log.responseHeaders && (
                <LogField
                  label="Response Headers"
                  data={log.responseHeaders}
                  icon="📩"
                />
              )}
              {log.requestBody && (
                <LogField
                  label="Request Body"
                  data={log.requestBody}
                  icon="📦"
                />
              )}
              {log.responseBody && (
                <LogField
                  label="Response Body"
                  data={log.responseBody}
                  icon="📬"
                />
              )}
              {log.cookies && (
                <LogField label="Cookies" data={log.cookies} icon="🍪" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const NetworkLogList = ({ logs }: Props) => {
  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <NetworkLogItem key={index} log={log} />
      ))}
    </div>
  );
};
