import * as ethers from "ethers";
import nftABI from "../../ABI/NFT.json";

export type NFT = {
  owner: string;
  name: string;
  description: string;
  image: string;
  size: number;
  tokenId: number;
};

export class NFTContractService {
  private nftContract: ethers.Contract;
  constructor() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://ethereum-sepolia.core.chainstack.com/7741f34bb352e2b229509b25301fdf70"
    );

    this.nftContract = new ethers.Contract(
      "0xA5416449768E6f1D2dA8dcE97f66c5FcAEF49B67",
      nftABI.abi,
      provider
    );
  }

  private async getNftDetails(tokenId: number): Promise<NFT> {
    try {
      const [owner, tokenURI] = await Promise.all([
        this.nftContract.ownerOf(tokenId),
        this.nftContract.tokenURI(tokenId),
      ]);

      const parsedTokenURI = JSON.parse(
        tokenURI.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      );

      const nftDetails: NFT = {
        owner,
        name: parsedTokenURI.name,
        description: parsedTokenURI.description,
        image: parsedTokenURI.image,
        size: parsedTokenURI.size,
        tokenId,
      };

      return nftDetails;
    } catch (error: any) {
      console.error(
        `Error fetching details for tokenId ${tokenId}:`,
        error.message || error
      );
      throw error;
    }
  }

  public async getAllNFTs(): Promise<any> {
    try {
      const listId = await this.nftContract.getTokenIdCounter();
      const countNFT = listId.toNumber();

      const indexArray = Array.from(
        { length: countNFT },
        (_, tokenId) => tokenId
      );

      const nfts = await Promise.all(
        indexArray.map(async (tokenId) => {
          try {
            const nft = await this.getNftDetails(tokenId);

            return {
              tokenId: nft.tokenId,
              owner: nft.owner,
              name: nft.name,
              description: nft.description,
              image: nft.image,
              size: nft.size,
            };
          } catch (error) {
            console.error(
              `Error fetching details for tokenId ${tokenId}:`,
              error
            );
            return null;
          }
        })
      );

      return nfts.filter((nft) => nft !== null);
    } catch (error: any) {
      console.error("Error fetching all NFTs:", error);
      throw new Error("Failed to fetch NFTs");
    }
  }
}
