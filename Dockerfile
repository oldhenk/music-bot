FROM node:18
RUN apt-get update && apt-get install -y ffmpeg
RUN apt-get install -y supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package.json pnpm-lock.yaml /app/

COPY . /app/

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies using frozen lockfile
RUN pnpm install --frozen-lockfile

# Expose ports for bot and web application
EXPOSE 3000 5000

# Start the Next.js web application
CMD ["/usr/bin/supervisord"]