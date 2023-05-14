# # Install dependencies only when needed
# FROM node:18-alpine AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /foodful
# # Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# # Install dependencies using npm ci
# RUN npm ci

# # Rebuild the source code only when needed
# FROM node:16-alpine AS builder

# WORKDIR /foodful

# COPY --from=deps /foodful/node_modules ./node_modules

# COPY . .

# RUN npx prisma generate

# RUN npm run build

# # Production image, copy all the files and run next
# FROM node:16-alpine AS runner
# WORKDIR /foodful

# ENV NODE_ENV production

# RUN addgroup --system --gid 1001 bloggroup
# RUN adduser --system --uid 1001 bloguser

# COPY --from=builder /foodful/public ./public
# COPY --from=builder /foodful/package.json ./package.json

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=bloguser:bloggroup /foodful/.next ./
# COPY --from=builder --chown=bloguser:bloggroup /foodful/.next/static ./.next/static

# USER bloguser

# EXPOSE 3000

# ENV PORT 3000

# CMD ["npm","start"]

FROM node:16-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]