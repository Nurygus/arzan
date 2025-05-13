module.exports = {
  apps: [
    {
      name: "arzan-api",
      script: "dist/src/index.js",
      exec_mode: "cluster",
      instances: "max",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 8081,
        STATIC_HOST: "http://95.85.126.113:8080/",
      },
      merge_logs: true,
      log_date_format: "YYYY-MM-DDTHH:mm:ss.sssZ",
    },
  ],
};
