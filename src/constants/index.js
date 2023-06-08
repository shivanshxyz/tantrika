import { formatDate } from "../util";

export const APP_NAME = 'Tantrika'
export const APP_DESC = 'An Open-Source Distributed AI Infrastructure on FEVM'

const hostname = window.location.hostname
export const IS_LOCAL = hostname.indexOf("localhost") !== -1

export const COVALENT_KEY = process.env.REACT_APP_COVALENT_KEY; // covalent api key

export const EXAMPLE_FORM = {
    'title': '',
    'description': '',
    'dataUrl': '',
    'keywords': '',
    'createdAt': formatDate(),
    'priceEVM': 0.01,
    'files': []
}

export const updateForm = (f) => EXAMPLE_FORM = {...EXAMPLE_FORM, ...f}
export const getExampleResponse = () => ({
  ...EXAMPLE_FORM,
  purchases: 0,
})


export const WEB3_PROJECT_ID = process.env.REACT_APP_WC_ID || 'ec17b7971a950170d6c5710eb878ba9b';

export const CHAIN_OPTIONS = {
    314159: {
      name: "Filecoin - Calibration testnet",
      symbol: "tFIL",
      url: "https://calibration.filscan.io",
      blockExplorers: ["https://calibration.filfox.info/en/address/"],
      id: 314159,
      rpcUrls: ['https://filecoin-calibration.chainup.net/rpc/v1']
    }
  };
  
  export const ACTIVE_CHAIN = CHAIN_OPTIONS[process.env.REACT_APP_ACTIVE_CHAIN_ID || "314159"];
  
  export const IPFS_BASE_URL = "https://ipfs.io/ipfs"