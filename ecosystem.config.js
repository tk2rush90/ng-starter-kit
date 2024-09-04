module.exports = {
  apps: [
    {
      name: 'velca-fe',
      script: 'node dist/velca/server/server.mjs',
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
