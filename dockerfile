# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy Prisma schema and application code
# COPY prisma ./prisma/

COPY . .


# Generate Prisma client
# RUN npx prisma generate

# Build the application
RUN npm run build

# Now create a production image
FROM node:18-alpine AS production

WORKDIR /app

# Copy production dependencies and the built application
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/.env /app/.env
COPY --from=builder /app/public /app/public
# COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/package*.json /app/

# Expose the necessary port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
