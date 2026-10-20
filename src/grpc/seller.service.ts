import grpc from "@grpc/grpc-js";
import type { SellerRepository } from "../repository/seller.repository.js";

export const createSellerGrpcService = (sellerRepository: SellerRepository) => ({
  GetSellerBusinessDetails: async (call: any, callback: any) => {
    try {
      const sellerId = String(call.request.sellerId ?? "");
      if (!sellerId) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "seller_id is required",
        });
      }

      const details = await sellerRepository.getApprovedBusinessDetails(sellerId);
      if (!details) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Approved seller application not found",
        });
      }

      return callback(null, {
        businessType: details.businessType ?? "",
        taxId: details.taxId ?? "",
        registrationNumber: details.registrationNumber ?? "",
      });
    } catch (error) {
      return callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  },
});
