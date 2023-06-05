module.exports = {
  'apps' : [{
    'name': 'server',
    'script': 'server.js',
    'watch': '.',
    'env': {
      'NODE_ENV':'development'
    },
    'env_production': {
      'NODE_ENV':'production'
    }
  }],

  'deploy' : {
    'production' : {
      'user' : 'deployuser',
      'host' : 'myartventures.com',
      'ref'  : 'origin/master2',
      'repo' : 'git@github.com:Maxicl14/Lucy-Website.git',
      'ssh_options': ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      'path' : '/home/deployuser/www/project',
      'pre-deploy-local': `echo 'Deploying code to servers'`,
      'post-deploy' : 'mkdir -p logs && touch logs/all-logs.log && npm install --only=prod && cd client && npm run build && cd .. && pm2 startOrRestart ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
