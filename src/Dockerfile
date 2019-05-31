FROM node:10-slim

LABEL "com.github.actions.name"="Jeopardy Scraper Twilio Action"
LABEL "com.github.actions.description"="Send message containing Jeopardy results"
LABEL "com.github.actions.icon"="upload"
LABEL "com.github.actions.color"="purple"

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ADD package.json /package.json
ADD yarn.lock /yarn.lock

ADD index.js /index.js

RUN yarn

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser ./node_modules

USER pptruser
EXPOSE 8084

ENTRYPOINT [ "node", "/index.js" ]