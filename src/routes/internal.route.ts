import type { FastifyInstance } from "fastify";
import { SellerController } from "../controller/sellers.controller.js";
import { createSellerApplicationSchema } from "../schema/seller.schema.js";

export const InternalRoute = (
    app : FastifyInstance,
    sellerController: SellerController,
    option: {prefix:string}
) => {
    app.register((router) => {
        router.post("/seller-applications",{schema:createSellerApplicationSchema},sellerController.createApplication.bind(sellerController))
    },option)
}