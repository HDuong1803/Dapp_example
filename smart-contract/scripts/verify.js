const exec = require("child_process").exec;
const fs = require("fs");

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, function (error, stdout, stderr) {
      console.log("stdout: " + stdout);
      resolve(stdout);
      if (stderr) {
        console.log("stderr: " + stderr);
        reject(stderr);
      }
      if (error !== null) {
        console.log("exec error: " + error);
        reject(error);
      }
    });
  });
};

async function main() {
  const pathConfig = process.argv[2];
  const config = require(`../${pathConfig}`);
  for (let i = 0; i < Object.values(config).length; i++) {
    const contract = Object.values(config)[i];
    const inputStr = contract?.input ? contract.input.join(" ") : "";
    console.log(
      "Start verifying contract: " + contract.contractName,
      contract.address
    );
    await runCommand(
      `hardhat verify --contract contracts/${contract.path}/${contract.contractName}.sol:${contract.contractName}  --network mumbai ${contract.address} ${inputStr}`.replace(
        `//`,
        `/`
      )
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
