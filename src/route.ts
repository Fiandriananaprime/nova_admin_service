import type { FastifyInstance } from "fastify";

import { SellerRepository } from "./repository/seller.repository.js";

import { SellerService } from "./service/seller.service.js";

import { SellerController } from "./controller/sellers.controller.js";

import { AdminRoute } from "./routes/admin.route.js";
import { InternalRoute } from "./routes/internal.route.js";

export const routes = (app: FastifyInstance) => {

    //Dependencies
    const sellerRepository = new SellerRepository();

    //Services
    const sellerService = new SellerService(sellerRepository);

    //Controller
    const sellerController = new SellerController(sellerService);

    AdminRoute(app,sellerController,{ prefix: "/api" })
    InternalRoute(app,sellerController,{prefix: "/internal"})
};