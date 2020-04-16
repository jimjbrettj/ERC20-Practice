import { BigNumber } from "bignumber.js";
import { TutorialToken } from "./contract-types/TutorialToken"; // import is correct
import React from 'react';
import TutorialTokenContractData from './contract-data/TutorialToken.json';
import BN from "bn.js";

import Web3 from "web3";
export let web3: Web3;

export const GAS_LIMIT_STANDARD = 6000000;
export let accounts: string[];
let web3Provider;
let contract: any;
const ERC20_NETWORK = "https://services.jade.builders/core-geth/kotti/1.11.2"
export async function deployContract<T>(contractName: string, abi:any, code:any, ...args: any[]): Promise<T> {
  //const networkId = await web3.eth.net.getId();
  //const deployedAddress = abi.networks[networkId].address;
  const Contract = new web3.eth.Contract(abi);
  console.log("Contract1: ");
  console.log(Contract);
  const accounts = await web3.eth.getAccounts();
  console.log(accounts)
  console.log("deploying contract now")
  const contractProm = new Promise((resolve, reject) => {
    Contract.deploy({ data: code }).send({
      from: accounts[0],
    }).on("transactionHash", async (receipt)=>{
      console.log("Getting txHash")
      web3.eth.getTransactionReceipt(receipt, (err, txh)=>{
      debugger
      console.log(txh.contractAddress)
      resolve(new web3.eth.Contract(abi, txh.contractAddress))
      })
    })
    .on("receipt", (reciept) => {
      console.log("Getting address:")
      console.log(reciept.contractAddress)
      resolve(new web3.eth.Contract(abi, reciept.contractAddress))
    
    }).on("error", (err) => {
      console.error("Terrible disaster", err.message)
    })
  });
   
  return contractProm as any;

}

export async function deployTutorialToken(): Promise<TutorialToken> {
    console.log("Deploying Contract from innner deploy tutorial token method: ");
    var contract = await deployContract<TutorialToken>("TutorialToken", TutorialTokenContractData.abi, TutorialTokenContractData.bytecode, 0);
    console.log("Contract from innner deploy tutorial token method: " + contract);
    return contract;
}

type MyProps = {};
type MyState = {
  numErcBeingTraded: number
  contract: TutorialToken 
};
class App extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      numErcBeingTraded: 0,
      contract: {} as TutorialToken
    };

    //this.handleErcInputChange = this.handleErcInputChange.bind(this);
  }

  handleErcInputChange(event: any) {
    this.setState({ 
      numErcBeingTraded: event.target.value,
    });
    console.log("Num of ERC wanted to trade: " + this.state.numErcBeingTraded);
    var rate = this.state.contract.methods.rate().call();
    var numErc = new BN(this.state.numErcBeingTraded);
    //var numTokens = rate.mul(numErc);
    //console.log("Num of Tutorial Tokens you can receive: " + numTokens.toString());
  }

  async componentDidMount() {
    // TODO: Do all this stuff once onComponentDidMount
    // Same with all my async shit
      const ethereum = (window as any).ethereum
      web3Provider = ethereum || web3.currentProvider;
      // will crash if you do not have metamask 
      await ethereum.send('eth_requestAccounts')
      web3 = new Web3(ethereum);
      web3.eth.getAccounts()
        .then(console.log);
         
    contract = await deployTutorialToken();

    this.setState({contract})
    //console.log("Contract deploy address: " + contract._parent.options.address);
    //console.log("Contract called from method: " + contract);
    //console.log("Contract calling methods.rate().call(): " + contract.methods.rate().call());
    //console.log("Contract calling .methods: " + contract.rate().call());
    //console.log("Contract calling _parent methods: " + (await contract._parent.methods.rate().call()));
  }

  render() {  

    return (
    	<div>
        <h1><b><i>Send ETC for Tutorial Token</i></b></h1>
	  		<p>Amount ETC <input value={this.state.numErcBeingTraded} onChange={e => this.handleErcInputChange(e) }/></p>
	  		<button>Purchase</button>
	  	</div>
    );
  }
}
export default App;


