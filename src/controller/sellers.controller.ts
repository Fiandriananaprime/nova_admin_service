import type { FastifyReply, FastifyRequest } from "fastify";
import type { SellerService } from "../service/seller.service.js";
import type { GetApplicationQuery } from "../types/seller.js";
import type { createSellerApplication } from "../types/seller.js";
export class SellerController {
    constructor(
        private readonly sellerService:SellerService
    ){}

    async createApplication(request:FastifyRequest<{Body:createSellerApplication}>, reply:FastifyReply){
        const applicationBody = request.body
        const application = await this.sellerService.createApplication(applicationBody);

        return reply.status(201).send(application);

    }
    async getAllApplication (request:FastifyRequest<{Querystring:GetApplicationQuery}>, reply:FastifyReply){

        const {page = 1,limit = 20,status} = request.query;

        const applications = await this.sellerService.getApplication({page,limit,...(status !== undefined && { status }),})

        return reply.status(200).send(applications);
    }
}