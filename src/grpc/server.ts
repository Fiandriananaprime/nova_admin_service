import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "node:url";
import { SellerRepository } from "../repository/seller.repository.js";
import { createSellerGrpcService } from "./seller.service.js";

export const startGrpcServer = async () => {
  const protoPath = fileURLToPath(new URL("./proto/seller.proto", import.meta.url));
  const packageDefinition = await protoLoader.load(protoPath);
  const grpcObject = grpc.loadPackageDefinition(packageDefinition);
  const sellerPackage = grpcObject["seller"] as any;
  const server = new grpc.Server();

  server.addService(
    sellerPackage.SellerBusinessService.service,
    createSellerGrpcService(new SellerRepository()),
  );

  const port = Number(process.env["GRPC_PORT"]) || 50052;
  await new Promise<void>((resolve, reject) => {
    server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (error) => {
        if (error) return reject(error);
        console.log(`Admin gRPC server running on port ${port}`);
        resolve();
      },
    );
  });
};
