import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface EmailLog {
  timestamp: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  details?: string | object;
}

const EmailStatusMonitor = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [emailConfig, setEmailConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDevelopment = import.meta.env.DEV;

  // Capture console logs for emails
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const logCapture = (type: 'success' | 'error' | 'warning', ...args: any[]) => {
      const message = args.join(' ');
      
      // Check if this is an email-related log
      if (message.includes('EMAIL') || message.includes('email') || message.includes('mail')) {
        const logEntry: EmailLog = {
          timestamp: new Date().toISOString(),
          type,
          message,
          details: args.find(arg => typeof arg === 'object')
        };
        
        setLogs(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 logs
      }

      // Call original console method
      if (type === 'success') originalConsoleLog(...args);
      else if (type === 'error') originalConsoleError(...args);
      else if (type === 'warning') originalConsoleWarn(...args);
    };

    // Override console methods
    console.log = (...args) => logCapture('success', ...args);
    console.error = (...args) => logCapture('error', ...args);
    console.warn = (...args) => logCapture('warning', ...args);

    // Cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  const testEmailConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setEmailConfig(data);
    } catch (error) {
      setEmailConfig({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Status Monitor
          </CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={clearLogs}>
              Clear
            </Button>
            {isDevelopment && (
              <Button size="sm" onClick={testEmailConfig} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 space-y-3 max-h-80 overflow-y-auto">
        {/* Email Configuration Status */}
        {emailConfig && (
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-sm font-medium text-blue-800">Email Config Status:</div>
            <div className="text-xs text-blue-600 mt-1">
              {emailConfig.success ? (
                <span className="text-green-600">✅ Configured</span>
              ) : (
                <span className="text-red-600">❌ Issues Found</span>
              )}
            </div>
            {emailConfig.config && (
              <div className="mt-2 text-xs">
                {Object.entries(emailConfig.config).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Email Logs */}
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No email logs yet. Place an order to see email activity.
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded border text-xs ${getStatusColor(log.type)}`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{getStatusIcon(log.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium truncate">{log.message}</div>
                    <div className="text-gray-500 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    {log.details && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-blue-600">Details</summary>
                        <pre className="text-xs mt-1 whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default EmailStatusMonitor;
