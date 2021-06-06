module.exports = {
    apps : [{
      name: 'ao-bot-dev',
      script: 'src/index.js',
      args: '-d',
  
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      autorestart: true,
      watch: true,
      ignore_watch : ["node_modules", "data", "logs", ".git"],
      max_memory_restart: '500M'
    }]
  };