module.exports = {
  apps: [
    {
      name: 'ng-starter-kit',
      script: 'node dist/ng-starter-kit/server/server.mjs',
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
