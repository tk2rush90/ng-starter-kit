module.exports = {
  apps: [
    {
      name: 'ng-starter-kit',
      script: 'node ~/Desktop/builds/ng-starter-kit/ng-starter-kit/server/server.mjs',
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
