export const createSellerApplicationSchema = {
  body: {
    type: "object",
    required: [ "store","userId"],
    properties: {
      userId: {
        type: "string",
        format:"uuid"
      },
      comments: {
        type: "string",
      },

      store: {
        type: "object",
        required: ["location", "businessType", "documents"],
        properties: {
          location: {
            type: "string",
          },
          storeName: {
            type: "string"
          },
          businessType: {
            type: "string",
            enum: ["individual", "company"],
          },

          taxId: {
            type: "string",
          },

          registrationNumber: {
            type: "string",
          },

          documents: {
            type: "array",
            items: {
              type: "object",
              required: ["type", "fileUrl"],
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "identity",
                    "business_registration",
                    "tax_document",
                    "bank_account",
                  ],
                },

                fileUrl: {
                  type: "string",
                  format: "uri",
                },
              },
            },
          },
        },
      },
    },
  },
} as const;