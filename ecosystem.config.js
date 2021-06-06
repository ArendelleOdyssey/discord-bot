module.exports = {
    apps : [{
      name: 'ao-bot',
      script: 'src/index.js',
  
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      autorestart: true,
      watch: true,
      ignore_watch : ["node_modules", "data", "logs", ".git"],
      max_memory_restart: '500M'
    }]
  };