// Get string error from operation stack trace. Matches last line but removes last "message index" part
export function getErrorFromStackTrace(stackTrace: Error): string {
  const stringStackTrace = stackTrace.message || stackTrace.stack || stackTrace.toString() || "";
  const match = stringStackTrace.match(/.*\s*$/g)?.[0];
  const error = match?.substring(0, match.lastIndexOf(";"));

  return error || stringStackTrace;
}
