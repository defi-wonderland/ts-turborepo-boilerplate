import { Writable } from "node:stream";
import { beforeEach, describe, expect, it } from "vitest";

import { Logger } from "../../src/logger/logger.js";

type CaptureTransport = { transport: { stream: Writable }; chunks: string[] };

function makeCaptureTransport(): CaptureTransport {
    const chunks: string[] = [];
    const stream = new Writable({
        write(chunk: unknown, _enc: BufferEncoding, cb: (error?: Error | null) => void): void {
            chunks.push(String(chunk));
            cb();
        },
    });
    return { transport: { stream }, chunks };
}

describe("Logger", () => {
    beforeEach(() => {
        Logger.setTransports([{ stream: process.stdout }]);
        Logger.setLevel("info");
    });

    it("returns a singleton instance", () => {
        const a = Logger.getInstance();
        const b = Logger.getInstance();
        expect(a).toBe(b);
    });

    it("has stdout as default transport", () => {
        const transports = Logger.getTransports();
        expect(transports.length).toBeGreaterThan(0);
        expect(transports[0]!.stream).toBe(process.stdout);
    });

    it("replaces transports and logs to the new one", () => {
        const { transport: t1, chunks: c1 } = makeCaptureTransport();
        Logger.setTransports([t1]);
        const logger = Logger.getInstance();
        logger.info({ message: "to t1" });
        expect(c1.join("\n")).toContain("to t1");

        const { transport: t2, chunks: c2 } = makeCaptureTransport();
        Logger.setTransports([t2]);
        logger.info({ message: "to t2" });

        expect(c1.join("\n")).not.toContain("to t2");
        expect(c2.join("\n")).toContain("to t2");
    });

    it("logs at info/warn/error/fatal and calls debug without output", () => {
        const { transport, chunks } = makeCaptureTransport();
        Logger.setTransports([transport]);
        const logger = Logger.getInstance();

        logger.debug({ message: "debug msg" });

        logger.info({ message: "info msg" });
        logger.warning({ message: "warn msg" });
        logger.error({ message: "error msg" });
        logger.fatal({ message: "fatal msg" });

        const out = chunks.join("\n");
        expect(out).toContain("info msg");
        expect(out).toContain("warn msg");
        expect(out).toContain("error msg");
        expect(out).toContain("fatal msg");
        // level numbers: info=30, warn=40, error=50, fatal=60 (Pino defaults)
        expect(out).toContain('"level":30');
        expect(out).toContain('"level":40');
        expect(out).toContain('"level":50');
        expect(out).toContain('"level":60');
    });

    it("creates child logger that adds context", () => {
        const { transport, chunks } = makeCaptureTransport();
        Logger.setTransports([transport]);
        const logger = Logger.getInstance();
        const child = logger.child({ requestId: "abc-123" });
        child.info({ message: "from child" });
        const out = chunks.join("\n");
        expect(out).toContain("from child");
        expect(out).toContain('"requestId":"abc-123"');
    });

    it("falls back to stdout when setting empty transports", () => {
        const { transport, chunks } = makeCaptureTransport();
        Logger.setTransports([transport]);
        const logger = Logger.getInstance();
        logger.info({ message: "to custom" });
        expect(chunks.join("\n")).toContain("to custom");

        Logger.setTransports([]);
        const transports = Logger.getTransports();
        expect(transports.length).toBeGreaterThan(0);
        expect(transports[0]!.stream).toBe(process.stdout);

        logger.info({ message: "to stdout" });
        expect(chunks.join("\n")).not.toContain("to stdout");
    });

    it("allows changing level to debug and outputs debug", () => {
        const { transport, chunks } = makeCaptureTransport();
        Logger.setTransports([transport]);
        Logger.setLevel("debug");
        const logger = Logger.getInstance();
        logger.debug({ message: "debug msg" });
        const out = chunks.join("\n");
        expect(out).toContain("debug msg");
        expect(out).toContain('"level":20');
        expect(Logger.getLevel()).toBe("debug");
    });

    it("suppresses debug again when level returns to info", () => {
        const { transport, chunks } = makeCaptureTransport();
        Logger.setTransports([transport]);
        Logger.setLevel("debug");
        const logger = Logger.getInstance();
        logger.debug({ message: "visible once" });
        expect(chunks.join("\n")).toContain("visible once");

        Logger.setLevel("info");
        logger.debug({ message: "hidden now" });
        const out = chunks.join("\n");
        expect(out).not.toContain("hidden now");
        expect(Logger.getLevel()).toBe("info");
    });
});
