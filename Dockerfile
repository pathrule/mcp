FROM node:24-alpine

WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=8787
ENV PATHRULE_MCP_PUBLIC_INTROSPECTION=1

COPY package.json ./
COPY dist ./dist
COPY README.md SECURITY.md LICENSE glama.json server.json ./

EXPOSE 8787
CMD ["node", "dist/server.js"]
