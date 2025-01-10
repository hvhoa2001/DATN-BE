import * as ethers from "ethers";
import auctionABI from "../../ABI/NFTAuction.json";

export class AuctionContractService {
  private auctionContract: ethers.Contract;
  constructor() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://ethereum-sepolia.core.chainstack.com/7741f34bb352e2b229509b25301fdf70"
    );
    this.auctionContract = new ethers.Contract(
      "0xad650614Ee4967324e3A95E4223d40ce52BD2B6C",
      auctionABI.abi,
      provider
    );
  }
  private async getAuctionDetails(auctionId: number): Promise<any> {
    try {
      const [auction] = await Promise.all([
        this.auctionContract.auctions(auctionId),
      ]);
      return { auction };
    } catch (error: any) {
      console.error(
        `Error fetching details for tokenId ${auctionId}:`,
        error.message || error
      );
      throw error;
    }
  }

  public async getAllAuction(): Promise<any[]> {
    try {
      const auctionId = await this.auctionContract.auctionCount();
      const countAuction = auctionId.toNumber();

      const indexArray = Array.from(
        { length: countAuction },
        (_, index) => index
      );

      const auctions = await Promise.all(
        indexArray.map(async (index) => {
          const auction = await this.getAuctionDetails(index);
          return {
            auctionId: index,
            seller: auction.auction.seller,
            minPrice: auction.auction.minPrice.div(1e6).toNumber(),
            maxPrice: auction.auction.maxPrice.div(1e6).toNumber(),
            startTime: auction.auction.startTime.toNumber(),
            endTime: auction.auction.endTime.toNumber(),
            tokenId: auction.auction.tokenId.toNumber(),
            nftContract: auction.auction.nftAddress,
            highBidder: auction.auction.highBidder,
            highestBid: auction.auction.highestBid.div(1e6).toNumber(),
            claimed: auction.auction.claimed,
            paymentToken: auction.auction.paymentToken,
          };
        })
      );

      return auctions;
    } catch (error: any) {
      console.error("Error fetching auctions:", error);
      throw new Error("Failed to fetch auctions from contract.");
    }
  }
}
