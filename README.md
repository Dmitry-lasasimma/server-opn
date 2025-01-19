# how to start the project 
 ## step 1 - install packages
    pnpm i 

 ## step 2 - create env file
    .env.development & .env.production file

 ## step 3 - config script for run 
    NODE_ENV=DEVELOPMENT ts-node-dev -r dotenv/config src/index.ts dotenv_config_path=.env.development
 
    