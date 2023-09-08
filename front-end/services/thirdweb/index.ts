import { DeployEvent, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ContractInterface } from "ethers";
import Web3 from "web3";

const deployContract = async (
  sdk: ThirdwebSDK,
  abi: ContractInterface,
  bytecode: string,
  contractParams: any[] = []
): Promise<
  DeployEvent & {
    deployed: () => Promise<DeployEvent>;
  }
> => {
  return new Promise(async (resolve, reject) => {
    try {
      const callBackDeploy = (event: DeployEvent) => {
        resolve({
          ...event,
          deployed: () =>
            new Promise((resolveDeployed, _rejectDeployed) => {
              const callBackDeployed = (eventDeployed: DeployEvent) => {
                if (eventDeployed.status == "completed") {
                  sdk.deployer.removeAllDeployListeners();
                  resolveDeployed(eventDeployed);
                }
              };
              sdk.deployer.addDeployListener(callBackDeployed);
            }),
        });
      };
      sdk.deployer.addDeployListener(callBackDeploy);
      await sdk.deployer.deployContractWithAbi(abi, bytecode, contractParams);
    } catch (error) {
      reject(error);
    }
  });
};

const web3 = new Web3();

export { deployContract, web3 };
