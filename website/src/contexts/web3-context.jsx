import {
    useState,
    useEffect,
    createContext,
    useContext,
    useCallback,
} from "react";
import { Notification } from "@arco-design/web-react";
import { ethers } from "ethers";
import TokenArtifact from "../abis/Token.json";
import contractAddress from "../abis/contract-address.json";

const initialState = {
    provider: null,
    account: null,
    tokenContract: null,
};

const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);

    const loadProvider = async () => {
        const provider = await new ethers.providers.Web3Provider(window.ethereum);
        console.log('provider', provider);
        setProvider(provider);
    };

    const loadContracts = async (provider) => {
        const { chainId } = await provider.getNetwork();
        console.log('chainId, contractAddress', chainId, contractAddress);
        // const networkData = TokenArtifact.networks[chainId];
        const tokenContract = await new ethers.Contract(
            contractAddress.Token,
            TokenArtifact.abi,
            provider.getSigner(0)
        );
        console.log("tokenContract", tokenContract);
        setTokenContract(tokenContract);
    };

    const connectMetaMask = async () => {
        let accounts = [];
        try {
            accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
        } catch (error) {
            Notification.error({ content: error.message });
        }
        console.log('accounts', accounts);
        setAccount(accounts[0]);
        // const balance = await tokenContract.balanceOf(accounts[0]);
        // console.log('balance', balance);
    };

    useEffect(() => {
        loadProvider();
    }, []);

    const handleAccountsChanged = useCallback(
        async (accounts) => {
            console.log("handleAccountsChanged", accounts);
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                setAccount(null);
                await connectMetaMask();
            } else if (accounts[0] !== account) {
                setAccount(accounts[0]);
            }
        },
        [provider]
    );

    const handleChainChanged = useCallback(
        (_chainId) => {
            window.location.reload();
        },
        [provider]
    );

    useEffect(() => {
        if (provider) {
            loadContracts(provider);
            connectMetaMask();
            window.ethereum.on("accountsChanged", handleAccountsChanged);
            window.ethereum.on("chainChanged", handleChainChanged);
        }

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleAccountsChanged);
        };
    }, [provider]);

    return (
        <Web3Context.Provider value={{ provider, account, tokenContract }}>
            {children}
        </Web3Context.Provider>
    );
};

const useWeb3 = () => {
    const context = useContext(Web3Context);

    if (context === undefined) {
        throw new Error("useWeb3 must be used within a Web3Provider");
    }
    return context;
};

export default useWeb3;