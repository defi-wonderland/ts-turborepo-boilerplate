import pino from "pino";

/**
 * Shape of a log payload.
 */
export interface ILog extends Record<string, unknown> {
    message: string;
    service: string;
    trace_id: string;
}

/**
 * Public log levels for the app.
 */
export type LogLevel = "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";

/**
 * Minimal logger interface used across the codebase.
 * It mirrors the methods we actually call.
 */
export interface ILogger {
    debug(data: Partial<ILog>): void;
    info(data: Partial<ILog>): void;
    warning(data: Partial<ILog>): void;
    error(data: Partial<ILog>): void;
    fatal(data: Partial<ILog>): void;
    child(context: Record<string, unknown>): ILogger;
}

/**
 * Output target for logs. Usually stdout, but can be any writable stream.
 */
export interface ITransport {
    stream: NodeJS.WritableStream;
}

/**
 * Tiny wrapper around pino with a singleton lifecycle and pluggable transports.
 * Default output is stdout at "info" level, with ISO timestamps.
 */
export class Logger implements ILogger {
    private static instance: Logger;
    private baseLogger: pino.Logger;
    private transports: ITransport[];
    private level: LogLevel;

    /**
     * Use `Logger.getInstance()` instead. Constructor is private on purpose.
     */
    private constructor() {
        this.transports = [{ stream: process.stdout }];
        this.level = "info";
        this.baseLogger = this.getUpdatedLogger();
    }

    /**
     * (Re)create the underlying pino logger with the current transports.
     */
    private getUpdatedLogger(): pino.Logger {
        const destinations = this.transports.map((t) => ({ stream: t.stream, level: this.level }));
        return pino(
            {
                level: this.level,
                timestamp: pino.stdTimeFunctions.isoTime,
            },
            pino.multistream(destinations),
        );
    }

    /**
     * Get the shared logger instance. Created on first use.
     */
    public static getInstance(): ILogger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Read current transports. Useful for diagnostics.
     */
    public static getTransports(): ITransport[] {
        return (Logger.getInstance() as Logger).transports;
    }

    /**
     * Replace transports and refresh the underlying pino logger.
     * @param transports Writable streams to receive log output
     */
    public static setTransports(transports: ITransport[]): void {
        const instance = Logger.getInstance() as Logger;
        // If an empty array is provided, default back to stdout.
        instance.transports = transports.length > 0 ? transports : [{ stream: process.stdout }];
        instance.baseLogger = instance.getUpdatedLogger();
    }

    /**
     * Set the default log level for all output (e.g. "info", "debug").
     * Works like `setTransports`: updates the singleton and recreates pino.
     * @param level LogLevel string such as "debug", "info", "warn", etc.
     */
    public static setLevel(level: LogLevel): void {
        const instance = Logger.getInstance() as Logger;
        instance.level = level;
        instance.baseLogger = instance.getUpdatedLogger();
    }

    /**
     * Read the current default log level.
     */
    public static getLevel(): LogLevel {
        const instance = Logger.getInstance() as Logger;
        return instance.level;
    }

    /** Log a debug message (below the default "info" level). */
    public debug(data: Partial<ILog>): void {
        this.baseLogger.debug(data);
    }
    /** Log an informational message. */
    public info(data: Partial<ILog>): void {
        this.baseLogger.info(data);
    }
    /** Log a warning (mapped to pino's `warn`). */
    public warning(data: Partial<ILog>): void {
        this.baseLogger.warn(data);
    }
    /** Log an error. */
    public error(data: Partial<ILog>): void {
        this.baseLogger.error(data);
    }
    /** Log a fatal error. */
    public fatal(data: Partial<ILog>): void {
        this.baseLogger.fatal(data);
    }

    /**
     * Create a child logger with extra context added to every log line.
     */
    public child(context: Record<string, unknown>): ILogger {
        return this.baseLogger.child(context);
    }
}
