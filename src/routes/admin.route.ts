import type { FastifyInstance } from "fastify";
import type { SellerController } from "../controller/sellers.controller.js";

export const AdminRoute = (
    app: FastifyInstance,
    sellersController : SellerController,
    option:{prefix:string}
) => {
    app.register((router) => {
        router.get("/admin/sellers/applications",sellersController.getAllApplication.bind(sellersController))
    },option)
}