import { inspect } from "util";
import { BlockchainProvider, IBlockchainProvider } from "@ts-turborepo-boilerplate/sample-lib";
import { Logger } from "@ts-turborepo-boilerplate/shared";

import { environment } from "./config/env.js";
import { BalancesController } from "./stats/index.js";

Logger.setLevel("debug");
Logger.setTransports([{ stream: process.stdout }]);
const logger = Logger.getInstance().child({
    service: "sample-app",
});

const main = async (): Promise<void> => {
    const dataProvider: IBlockchainProvider = new BlockchainProvider(environment.RPC_URL);

    const balanceController = new BalancesController(dataProvider);

    const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    const balance = await balanceController.addBalances(vitalikAddress, zeroAddress);

    logger.info({ message: `Vitalik's and Zero summed balance is: ${balance}` });
};

process.on("unhandledRejection", (reason, p) => {
    logger.error({
        message: `Unhandled Rejection at: \n${inspect(p, undefined, 100)}, \nreason: ${reason}`,
    });
});

process.on("uncaughtException", (error: Error) => {
    logger.error({
        message: `An uncaught exception occurred: ${error}`,
        exception_trace: error.stack,
    });
});

main().catch((err) => {
    logger.error({
        message: `Caught error in main handler`,
        exception_trace: err,
    });
});
