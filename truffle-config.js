module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    dashboard: {},
  },
  compilers: {
    solc: {
      version: "0.8.10",
    },
  },
  db: {
    enabled: false,
  },
};
