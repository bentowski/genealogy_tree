# Use of a multistage build for the API.
# The development build is used for development reasons.
# The production build runs in procution mode which means this is the code running in the client machine.

# https://www.tomray.dev/nestjs-docker-production
# https://www.tomray.dev/nestjs-docker-compose-postgres

# Build for local development
FROM node:alpine As development
# ... put your development instructions here.
ENV TZ="Europe/Paris"

RUN npm install -g npm@latest

WORKDIR /home/node/app

COPY --chown=node:node ./nest/package*.json ./

RUN npm install

COPY --chown=node:node ./nest ./

COPY --chown=node:node ./default.jpg ./uploads/profileimages/

#USER node

# End of development instructions.

# Build for production
FROM node:alpine As build
# ... put your build instructions here.

WORKDIR /home/node/app

COPY --chown=node:node ./nest/package*.json ./

# In order to run 'npm run build' we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran 'npm ci' which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=development /home/node/app/node_modules ./node_modules

COPY --chown=node:node ./nest ./

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running 'nmp ci' removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --only=production && npm cache clean --force

USER node

# End of build instructions.

# Build for production
FROM node:alpine As production
# ... put your prodution instructions here.

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/app/dist ./dist

# Start the server using the production build
CMD ["node", "dist/main.js"]

# End of production instructions.
