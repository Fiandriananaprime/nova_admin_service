import { prisma } from "../database/prisma.js";
import type { createSellerApplication } from "../types/seller.js";

type SellerStatus = "pending" | "approved" | "rejected";

export class SellerRepository {

  
  async findMany(
    status: SellerStatus | undefined,
    skip: number,
    take: number
  ) {
    return prisma.sellerApplication.findMany({
      where: status ? { status } : {},
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count() { return prisma.sellerApplication.count();}

  async countByStatus() {
    const result = await prisma.sellerApplication.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    const counts = {
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    for (const item of result) {
      counts[item.status] = item._count._all;
      counts.all += item._count._all;
    }

    return counts;
  }

  async findByUserId(applicantUserId: string){
    return prisma.sellerApplication.findUnique({where:{applicantUserId}})
  }

  async getApprovedBusinessDetails(applicantUserId: string) {
    return prisma.sellerApplication.findFirst({
      where: {
        applicantUserId,
        status: "approved",
      },
      select: {
        businessType: true,
        taxId: true,
        registrationNumber: true,
      },
    });
  }

  async create(application:createSellerApplication){
    const { userId,comments,store } = application;
    
    return prisma.$transaction(async (tx) =>{
        const sellerApplication = await tx.sellerApplication.create({
            data:{
                applicantUserId:userId,
                businessType:store.businessType,
                comments: comments,
                location:store.location,
                taxId:store.taxId?? null,
                registrationNumber:store.registrationNumber?? null,
                storeName:store.storeName,
            }
        })

        if(store.documents.length > 0){
            await tx.sellerApplicationDocument.createMany({
                data: store.documents.map((doc) => ({
                    applicationId: sellerApplication.id,
                    type: doc.type,
                    fileUrl: doc.fileUrl
                }))
            })
        }

        return sellerApplication;
    })
  }
}