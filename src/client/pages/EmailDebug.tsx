import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, XCircle, AlertCircle, RefreshCw, Bug } from "lucide-react";
import SEO from "@/components/SEO";

const EmailDebug = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [emailConfig, setEmailConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Capture all console output
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn
    };

    const captureLog = (type: string, ...args: any[]) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type,
        args: args,
        message: args.join(' ')
      };
      
      setLogs(prev => [logEntry, ...prev.slice(0, 49)]); // Keep last 50 logs
    };

    console.log = (...args) => captureLog('log', ...args);
    console.error = (...args) => captureLog('error', ...args);
    console.warn = (...args) => captureLog('warn', ...args);

    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
    };
  }, []);

  const testEmailConfig = async () => {
    setIsLoading(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setTestResult(data);
      setEmailConfig(data);
    } catch (error) {
      setTestResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;

  const clearLogs = () => {
    setLogs([]);
  };

  const filterEmailLogs = () => {
    return logs.filter(log => 
      log.message.toLowerCase().includes('email') ||
      log.message.toLowerCase().includes('mail') ||
      log.message.toLowerCase().includes('smtp') ||
      log.message.includes('📧') ||
      log.message.includes('✅') ||
      log.message.includes('❌') ||
      log.message.includes('⚠️')
    );
  };

  const emailLogs = filterEmailLogs();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <SEO 
        title="Email Debug - Achyutam Organics"
        description="Debug email configuration and logs"
      />
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Debug Dashboard</h1>
          <p className="text-gray-600">Monitor email configuration and real-time logs</p>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Email Configuration Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {isDevelopment && (
                <Button onClick={testEmailConfig} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                  Test Email Configuration
                </Button>
              )}
              <Button variant="outline" onClick={clearLogs}>
                Clear Logs
              </Button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className="mt-4 p-4 rounded border">
                <h3 className="font-medium mb-2">Test Result:</h3>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Email Config Status */}
            {emailConfig && (
              <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                <h3 className="font-medium mb-2">Email Configuration Status:</h3>
                <div className="space-y-1 text-sm">
                  {emailConfig.config && Object.entries(emailConfig.config).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className={value === '✅ Configured' ? 'text-green-600' : 'text-red-600'}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Logs ({emailLogs.length})
              </div>
              <Badge variant="outline">
                Live Monitoring
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emailLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No email logs yet.</p>
                <p className="text-sm">Place an order to see email activity.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {emailLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border text-sm ${
                      log.type === 'error' ? 'border-red-200 bg-red-50' :
                      log.type === 'warn' ? 'border-yellow-200 bg-yellow-50' :
                      log.message.includes('❌') ? 'border-red-200 bg-red-50' :
                      log.message.includes('✅') ? 'border-green-200 bg-green-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1">
                        {log.type === 'error' || log.message.includes('❌') ? 
                          <XCircle className="w-4 h-4 text-red-500" /> :
                          log.type === 'warn' || log.message.includes('⚠️') ?
                          <AlertCircle className="w-4 h-4 text-yellow-500" /> :
                          log.message.includes('✅') ?
                          <CheckCircle className="w-4 h-4 text-green-500" /> :
                          <Mail className="w-4 h-4 text-gray-500" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <div className="mt-1">
                          {log.args.map((arg: any, i: number) => (
                            <div key={i} className="text-gray-700">
                              {typeof arg === 'object' ? 
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                  {JSON.stringify(arg, null, 2)}
                                </pre> : 
                                <span>{String(arg)}</span>
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Debug Email Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Test Configuration</h3>
              <p className="text-sm text-gray-600">Click "Test Email Configuration" to check if SMTP settings are correct.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">2. Place Test Order</h3>
              <p className="text-sm text-gray-600">Place a COD or online order to trigger email sending.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">3. Monitor Logs</h3>
              <p className="text-sm text-gray-600">Watch the email logs for success/failure messages.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">4. Check Environment Variables</h3>
              <p className="text-sm text-gray-600">Ensure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS are set in production.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailDebug;
