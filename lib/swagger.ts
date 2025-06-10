import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    if (typeof window !== "undefined") {
        throw new Error("getApiDocs should not run on the client");
    }

    return createSwaggerSpec({
        apiFolder: "app/api", // Ensure this is correct
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Next.js API",
                version: "1.0.0",
                description: "API documentation for Next.js",
            },
            servers: [
                {
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
                    description: "Development server",
                },
            ],
        },
    });
};
