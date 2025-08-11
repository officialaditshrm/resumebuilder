FROM node:22-slim

# Install system dependencies + fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros \
    fonts-kacst fonts-freefont-ttf ca-certificates curl gnupg \
    && rm -rf /var/lib/apt/lists/*

# Add Chrome repo & install Chrome
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google.gpg \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Create non-root Puppeteer user
RUN groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

USER pptruser
WORKDIR /home/pptruser

# Install your app
COPY --chown=pptruser:pptruser package*.json ./
RUN npm install

COPY --chown=pptruser:pptruser . .

# Start server
CMD ["node", "server.js"]
