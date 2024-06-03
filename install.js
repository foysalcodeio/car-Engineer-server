/**
 * /**
 * 1. npm init -y
 * 2. npm i express cors mongodb dotenv
 * 3. now create index.js
 * 4. go to package.json > scripts > edit - "start": "node index.js"
 * 
 * 
 * 
 * 1. install dotenv using npm
 *          - npm install dotenv --save
 */


/**
 * how to store token in the client side
 * 1. memory --> ok
 * 2. LS --> ok type(XSS)
 * 3. cookies: http only
 * 
 */

/***
 * 1. set cookies with http only. for development secure
 * 2. cors
  app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))
 * 
 * 
 * 3. client side axios setting
 */