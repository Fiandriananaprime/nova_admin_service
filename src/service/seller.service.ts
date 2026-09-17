import { UserAlreadyApplied } from "../errorHandler/ApplicationError.js";
import type { SellerRepository } from "../repository/seller.repository.js";
import type { createSellerApplication, GetApplicationQuery } from "../types/seller.js";

export class SellerService {
    constructor (
        private readonly sellerRepository : SellerRepository
    ){}

    async getApplication({ page, limit, status }: GetApplicationQuery) {
        const skip = (page - 1) * limit;
        const where = status ;

        const [data, total, counts] = await Promise.all([
          this.sellerRepository.findMany(
            where,
            skip,
            limit,
          ),

          this.sellerRepository.count(),

          this.sellerRepository.countByStatus(),
        ]);

        return {
            data,
            meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            },
            counts,
        };
    }

    async createApplication(application:createSellerApplication){
        const existingUserApplication = await this.sellerRepository.findByUserId(application.userId);

        if(existingUserApplication) throw new UserAlreadyApplied();

        return this.sellerRepository.create(application);

    }
}