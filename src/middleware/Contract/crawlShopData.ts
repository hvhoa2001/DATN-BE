import * as ethers from "ethers";
import shopABI from "../../ABI/NFTShop.json";
import BigNumber from "bignumber.js";

export type Size = {
  nftContract: string;
  tokenId: BigNumber;
  paymentToken: string;
  price: BigNumber;
  active: boolean;
};
export class ShopContractService {
  private nftContract: ethers.Contract;
  constructor() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://ethereum-sepolia.core.chainstack.com/7741f34bb352e2b229509b25301fdf70"
    );

    this.nftContract = new ethers.Contract(
      "0x16B79CB03D976767477383c5062835e89d65c55b",
      shopABI.abi,
      provider
    );
  }
  private async getListingData(tokenId: number): Promise<{ listing: Size }> {
    try {
      const [listing] = await Promise.all([this.nftContract.listings(tokenId)]);
      return { listing };
    } catch (error: any) {
      console.error(
        `Error fetching details for tokenId ${tokenId}:`,
        error.message || error
      );
      throw error;
    }
  }

  public async getAllListing(): Promise<any[]> {
    try {
      const listId = await this.nftContract.listingCounter();
      const countListing = listId.toNumber();

      const indexArray = Array.from(
        { length: countListing },
        (_, tokenId) => tokenId
      );

      const listings = await Promise.all(
        indexArray.map(async (tokenId) => {
          const listing = await this.getListingData(tokenId);
          if (listing.listing.active) {
            return {
              nftContract: listing.listing.nftContract,
              tokenId: listing.listing.tokenId.toNumber(),
              paymentToken: listing.listing.paymentToken,
              price: listing.listing.price.div(1e6).toNumber(),
              active: listing.listing.active,
            };
          }
        })
      );

      return listings;
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      throw new Error("Failed to fetch listings from contract.");
    }
  }
}
