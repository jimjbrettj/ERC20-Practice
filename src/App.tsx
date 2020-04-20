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
export async function deployContract<T>(contractName: string, abi: any, code: any, ...args: any[]): Promise<T> {
  const Contract = new web3.eth.Contract(abi);
  console.log("Contract1: ");
  console.log(Contract);
  const accounts = await web3.eth.getAccounts();
  console.log(accounts)
  console.log("deploying contract now")

  const contractResult = await Contract.deploy({ data: code }).send({
    from: accounts[0]
  })
  return contractResult as any;
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
      //TODO Ethereum enable may still be necessary
      // await ethereum.enable()
      web3Provider =  (window as any).web3.currentProvider;
      // NOTE you might need this
      //await ethereum.send('eth_requestAccounts')

      web3 = new Web3(web3Provider);

      const accounts = await web3.eth.getAccounts()
      console.log(accounts)

    contract = await deployTutorialToken();

    this.setState({contract})
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


